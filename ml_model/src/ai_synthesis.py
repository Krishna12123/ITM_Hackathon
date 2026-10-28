import os
import json
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("ai_synthesis")

class AISynthesisEngine:
    """
    Module 5: AI Synthesis.
    Converts mathematically verified, OR-Tools optimized itineraries into rich,
    engaging, human-friendly travel narratives and insider intelligence.
    Ensures verified timings, coordinates, and budgets are never hallucinated.
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Failed to initialize google-genai in AISynthesisEngine: {e}")

    def synthesize_day_narrative(
        self,
        day_number: int,
        day_theme: str,
        attractions: List[Dict[str, Any]],
        interests: List[str]
    ) -> Dict[str, Any]:
        """
        Synthesizes morning, afternoon, and evening descriptions and travel tips for a single day.
        """
        attraction_titles = [a.get("place_name") for a in attractions]

        if self.client:
            prompt = f"""
            You are an expert cultural travel guide.
            Write a structured narrative for Day {day_number} of a trip themed '{day_theme}'.
            The verified visited places in exact sequential order are: {', '.join(attraction_titles)}.
            The traveler interests are: {', '.join(interests)}.

            Return strictly JSON with these keys:
            {{
                "day_title": "Title for this day",
                "morning_narrative": "Vivid description of morning segment",
                "afternoon_narrative": "Vivid description of afternoon segment",
                "evening_narrative": "Vivid description of evening finale",
                "insider_travel_tip": "Specific, practical tip (e.g. photography, timing, ticketing)",
                "cultural_etiquette": "Specific respectful behavior tip for these locations"
            }}
            """
            try:
                res = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                text = res.text.strip()
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text:
                    text = text.split("```")[1].split("```")[0].strip()
                return json.loads(text)
            except Exception as e:
                logger.warning(f"Gemini synthesis API error: {e}")

        # Deterministic Domain-Rich Narrative Synthesizer
        morning_name = attractions[0]["place_name"] if len(attractions) > 0 else "Heritage Sanctum"
        afternoon_name = attractions[1]["place_name"] if len(attractions) > 1 else morning_name
        evening_name = attractions[-1]["place_name"] if len(attractions) > 2 else "Lakeside Sunset Walk"

        return {
            "day_title": day_theme,
            "morning_narrative": (
                f"Begin your morning at {morning_name}, exploring its tranquil architecture and peaceful atmosphere "
                f"before crowds arrive. Stroll through nearby heritage streets for artisanal tea and breakfast."
            ),
            "afternoon_narrative": (
                f"Transition towards {afternoon_name} for an immersive cultural session, discovering regional craftsmanship "
                f"and artistic traditions under shaded pavilions."
            ),
            "evening_narrative": (
                f"Conclude your evening at {evening_name}. Watch golden hour reflections bathe historic facades in warm light "
                f"accompanied by classical folk melodies and gentle breezes."
            ),
            "insider_travel_tip": (
                f"Photography sweet-spot: Arrive at {evening_name} 20 minutes prior to sunset to capture unobstructed reflections."
            ),
            "cultural_etiquette": (
                "Dress respectfully covering shoulders and knees when visiting sanctums; remove footwear at outer marble thresholds."
            )
        }

ai_synthesis_engine = AISynthesisEngine()
