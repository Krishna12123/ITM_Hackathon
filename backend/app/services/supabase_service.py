import json
import logging
import time
import urllib.request
import urllib.error
from typing import Dict, Any, Optional, List
from app.core.config import settings

logger = logging.getLogger("supabase_service")

class SupabaseService:
    def __init__(self):
        self.url = settings.SUPABASE_URL.rstrip('/')
        self.key = settings.SUPABASE_KEY
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        # In-memory backup queue if offline or table pending
        self.local_cache: List[Dict[str, Any]] = []

    def insert_record(self, table: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Inserts a single JSON record into Supabase table via REST API.
        """
        endpoint = f"{self.url}/rest/v1/{table}"
        data_bytes = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(endpoint, data=data_bytes, headers=self.headers, method="POST")

        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                res_body = response.read().decode("utf-8")
                parsed = json.loads(res_body) if res_body else {"status": "ok"}
                return {
                    "success": True,
                    "data": parsed,
                    "table": table,
                    "status_code": response.status
                }
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="ignore")
            logger.warning(f"Supabase HTTPError {e.code} inserting into {table}: {err_body}")
            return {
                "success": False,
                "error": err_body,
                "status_code": e.code,
                "table": table
            }
        except Exception as e:
            logger.error(f"Supabase connection error inserting into {table}: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "status_code": 500,
                "table": table
            }

    def fetch_records(self, table: str, limit: int = 20) -> Dict[str, Any]:
        """
        Fetches records from a Supabase table.
        """
        endpoint = f"{self.url}/rest/v1/{table}?select=*&limit={limit}&order=created_at.desc"
        req = urllib.request.Request(endpoint, headers=self.headers, method="GET")

        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                res_body = response.read().decode("utf-8")
                return {
                    "success": True,
                    "data": json.loads(res_body) if res_body else [],
                    "table": table
                }
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="ignore")
            return {"success": False, "error": err_body, "table": table}
        except Exception as e:
            return {"success": False, "error": str(e), "table": table}

    def sync_trip_inputs_loop(self, payload: Dict[str, Any], max_retries: int = 5, retry_delay: float = 1.5) -> Dict[str, Any]:
        """
        Runs in a loop until the inputs are successfully inserted to Supabase
        or max attempts are reached.
        """
        candidate_tables = ["trip_inputs", "trips", "itineraries"]
        last_error = None

        for attempt in range(1, max_retries + 1):
            for table in candidate_tables:
                result = self.insert_record(table, payload)
                if result.get("success"):
                    logger.info(f"Successfully synced trip inputs to Supabase table '{table}' on attempt {attempt}")
                    return {
                        "synced": True,
                        "table": table,
                        "attempt": attempt,
                        "data": result.get("data")
                    }
                else:
                    last_error = result.get("error")

            time.sleep(retry_delay)

        # Store in local backup cache
        self.local_cache.append(payload)
        return {
            "synced": False,
            "error": last_error,
            "attempts": max_retries,
            "cached_locally": True,
            "message": "Inputs validated and preserved locally. Awaiting Supabase table creation."
        }

supabase_service = SupabaseService()
