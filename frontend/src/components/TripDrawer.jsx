import React, { useState } from 'react';
import {
  X,
  Trash2,
  Luggage,
  ArrowRight,
  Sparkles,
  Clock,
  Wallet,
  AlertTriangle,
  Info,
  Building,
  Utensils,
  Car,
  Ticket
} from 'lucide-react';

export default function TripDrawer({
  isOpen,
  onClose,
  tripItems,
  onRemoveItem,
  onClearTrip
}) {
  if (!isOpen) return null;

  // User Target Budget State
  const [userBudgetInput, setUserBudgetInput] = useState('5000');
  const [budgetError, setBudgetError] = useState('');

  // Handle Budget Input Change
  const handleBudgetChange = (val) => {
    setUserBudgetInput(val);
    const parsed = parseFloat(val);
    if (!val || isNaN(parsed) || parsed <= 0) {
      setBudgetError('Please enter a budget greater than ₹0');
    } else {
      setBudgetError('');
    }
  };

  const parsedBudget = parseFloat(userBudgetInput) || 0;

  // Dynamic & Sample Estimates
  const activitiesTotal = tripItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const accommodationEstimate = tripItems.length > 0 ? 1800 : 0; // Heritage homestay sample rate
  const foodEstimate = tripItems.length > 0 ? 950 : 0; // Regional dining sample rate
  const transportEstimate = tripItems.length > 0 ? 650 : 0; // Local transit sample rate

  const totalEstimatedExpenses =
    activitiesTotal + accommodationEstimate + foodEstimate + transportEstimate;

  const budgetDifference = parsedBudget - totalEstimatedExpenses;
  const isOverBudget = budgetDifference < 0;

  // Segment Percentages
  const getPct = (val) =>
    totalEstimatedExpenses > 0 ? Math.round((val / totalEstimatedExpenses) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-card shadow-level-3 border-l border-border-subtle flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-border-subtle bg-canvas flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Luggage className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">My Trip Plan</h3>
                <p className="text-xs text-slate-500">
                  {tripItems.length} {tripItems.length === 1 ? 'experience' : 'experiences'} queued for AI route
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-subtle text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {/* 1. Trip Items Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Queued Items ({tripItems.length})
                </span>
                {tripItems.length > 0 && (
                  <button
                    onClick={onClearTrip}
                    className="text-xs text-slate-400 hover:text-red-600 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {tripItems.length === 0 ? (
                <div className="py-8 text-center text-slate-500 bg-subtle rounded-lg border border-dashed border-border-subtle">
                  <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center text-slate-400 mx-auto mb-2 shadow-sm">
                    <Luggage className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-slate-800 text-xs mb-1">
                    Your trip is currently empty
                  </h4>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto mb-3">
                    Add destinations and community experiences to calculate your smart budget breakdown.
                  </p>
                  <button
                    onClick={onClose}
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    Browse Experiences
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {tripItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-canvas rounded-lg border border-border-subtle flex items-center justify-between gap-3 group hover:border-primary/40 transition-all text-xs"
                    >
                      <img
                        src={item.image || item.heroImage}
                        alt={item.title || item.name}
                        className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase font-bold text-primary tracking-wider block">
                          {item.category || "Destination"}
                        </span>
                        <h5 className="font-display font-bold text-slate-900 truncate">
                          {item.title || item.name}
                        </h5>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          {item.duration && (
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              {item.duration}
                            </span>
                          )}
                          {item.price ? (
                            <span className="font-semibold text-slate-800">₹{item.price}</span>
                          ) : (
                            <span className="text-tertiary font-medium">Free Visit</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        aria-label="Remove item"
                        className="w-7 h-7 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Feature Three: Smart Budget Breakdown Preview */}
            <div className="p-4 rounded-xl bg-card border border-border-subtle shadow-level-1 space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-secondary/10 text-secondary flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900">
                      Smart Budget Breakdown
                    </h4>
                    <span className="text-[10px] text-slate-500">Live allocation estimate</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
                  Preview
                </span>
              </div>

              {/* Budget Input Field */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Your Target Trip Budget (INR)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={userBudgetInput}
                    onChange={(e) => handleBudgetChange(e.target.value)}
                    placeholder="Enter your budget..."
                    className={`input-terra w-full pl-7 pr-3 py-2 text-sm font-bold ${
                      budgetError ? "border-red-500 ring-2 ring-red-200" : ""
                    }`}
                  />
                </div>
                {budgetError && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{budgetError}</p>
                )}
              </div>

              {/* Multi-Segment Visual Progress Bar */}
              {totalEstimatedExpenses > 0 && !budgetError && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Estimated Allocation</span>
                    <span className="font-bold text-slate-800">
                      ₹{totalEstimatedExpenses} Total
                    </span>
                  </div>

                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                    <div
                      style={{ width: `${getPct(activitiesTotal)}%` }}
                      className="bg-primary h-full transition-all duration-300"
                      title={`Activities: ₹${activitiesTotal} (${getPct(activitiesTotal)}%)`}
                    />
                    <div
                      style={{ width: `${getPct(accommodationEstimate)}%` }}
                      className="bg-tertiary h-full transition-all duration-300"
                      title={`Accommodation: ₹${accommodationEstimate} (${getPct(accommodationEstimate)}%)`}
                    />
                    <div
                      style={{ width: `${getPct(foodEstimate)}%` }}
                      className="bg-secondary h-full transition-all duration-300"
                      title={`Food: ₹${foodEstimate} (${getPct(foodEstimate)}%)`}
                    />
                    <div
                      style={{ width: `${getPct(transportEstimate)}%` }}
                      className="bg-slate-500 h-full transition-all duration-300"
                      title={`Transport: ₹${transportEstimate} (${getPct(transportEstimate)}%)`}
                    />
                  </div>
                </div>
              )}

              {/* Category Breakdown Rows */}
              <div className="space-y-2 text-xs pt-1">
                <div className="flex items-center justify-between p-2 rounded bg-canvas border border-border-subtle">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-3.5 h-3.5 text-primary" />
                    <span className="text-slate-700 font-medium">Activities & Experiences</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-slate-900">₹{activitiesTotal}</span>
                    <span className="text-[10px] text-slate-400">({getPct(activitiesTotal)}%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-canvas border border-border-subtle">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-tertiary" />
                    <span className="text-slate-700 font-medium">Heritage Homestay</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-slate-900">₹{accommodationEstimate}</span>
                    <span className="text-[10px] text-slate-400">({getPct(accommodationEstimate)}%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-canvas border border-border-subtle">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-slate-700 font-medium">Local Meals & Tea</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-slate-900">₹{foodEstimate}</span>
                    <span className="text-[10px] text-slate-400">({getPct(foodEstimate)}%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-canvas border border-border-subtle">
                  <div className="flex items-center gap-2">
                    <Car className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-700 font-medium">Local Transport</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-slate-900">₹{transportEstimate}</span>
                    <span className="text-[10px] text-slate-400">({getPct(transportEstimate)}%)</span>
                  </div>
                </div>
              </div>

              {/* Total Expenses & Remaining / Over-Budget Status */}
              {!budgetError && (
                <div
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-all ${
                    isOverBudget
                      ? "bg-red-50 text-red-900 border-red-200"
                      : "bg-emerald-50 text-emerald-900 border-emerald-200"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {isOverBudget ? (
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <span className="font-semibold">
                      {isOverBudget ? "Over Budget Alert" : "Within Planned Budget"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] uppercase font-bold opacity-80">
                      {isOverBudget ? "Exceeds By" : "Remaining"}
                    </span>
                    <span className="font-display font-extrabold text-sm">
                      ₹{Math.abs(budgetDifference)}
                    </span>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex items-start gap-1.5 text-[10px] text-slate-500 leading-tight pt-1">
                <Info className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  All amounts are illustrative demo estimates for planning and not confirmed vendor rates.
                </span>
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          {tripItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-border-subtle bg-slate-50 space-y-3">
              <button
                onClick={() => {
                  alert(
                    `🎉 Demo Trip Itinerary Generated!\nTarget Budget: ₹${parsedBudget}\nEstimated Expenses: ₹${totalEstimatedExpenses}\n${
                      isOverBudget
                        ? `⚠️ Budget exceeded by ₹${Math.abs(budgetDifference)}`
                        : `✅ ₹${budgetDifference} buffer remaining`
                    }`
                  );
                }}
                className="w-full btn-primary text-xs sm:text-sm py-3 flex items-center justify-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Smart Route with AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
