import React from 'react';
import { Check, Truck, Weight, Clock, AlertTriangle } from 'lucide-react';
import { Skip } from '../types/skip';

interface SkipCardProps {
  skip: Skip;
  isSelected: boolean;
  onSelect: () => void;
}

export const SkipCard: React.FC<SkipCardProps> = ({ skip, isSelected, onSelect }) => {
  const totalPrice = skip.price_before_vat * (1 + skip.vat / 100);
  
  return (
    <div 
      className={`
        relative group cursor-pointer transition-all duration-300 transform hover:scale-[1.02]
        ${isSelected 
          ? 'ring-4 ring-emerald-500 ring-opacity-50 shadow-2xl shadow-emerald-500/20' 
          : 'hover:shadow-xl hover:shadow-gray-500/10'
        }
      `}
      onClick={onSelect}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-20 w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
          <Check size={16} className="text-white" />
        </div>
      )}
      
      <div className={`
        bg-white rounded-2xl p-6 border-2 transition-all duration-300
        ${isSelected ? 'border-emerald-500' : 'border-gray-100 group-hover:border-emerald-200'}
      `}>
        {/* Skip size badge */}
        <div className="flex items-start justify-between mb-4">
          <div className={`
            px-4 py-2 rounded-full text-sm font-bold transition-colors duration-300
            ${isSelected
              ? 'bg-emerald-500 text-white'
              : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 group-hover:from-emerald-50 group-hover:to-emerald-100 group-hover:text-emerald-700'
            }
          `}>
            {skip.size} Yard Skip
          </div>

          {!skip.allowed_on_road && (
            <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs ml-3 mt-1">
              <AlertTriangle size={12} />
              <span>Permit Required</span>
            </div>
          )}
        </div>

        {/* Skip visualization */}
        <div className="relative mb-6 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`
              w-20 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg transform -rotate-12 transition-transform duration-300
              ${isSelected ? 'scale-110' : 'group-hover:scale-105'}
            `}>
              <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-lg m-1 flex items-center justify-center">
                <span className="text-yellow-800 font-bold text-xs">{skip.size}Y</span>
              </div>
            </div>
          </div>
          
          {/* Floating particles effect */}
          <div className="absolute top-2 left-4 w-1 h-1 bg-emerald-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-6 right-6 w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-pulse delay-300"></div>
          <div className="absolute bottom-4 left-8 w-1 h-1 bg-purple-400 rounded-full opacity-60 animate-pulse delay-700"></div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-600">
            <Clock size={16} className="text-emerald-500" />
            <span className="text-sm">{skip.hire_period_days} day hire period</span>
          </div>
          
          {skip.allows_heavy_waste && (
            <div className="flex items-center gap-3 text-gray-600">
              <Weight size={16} className="text-emerald-500" />
              <span className="text-sm">Heavy waste allowed</span>
            </div>
          )}
          
          {skip.allowed_on_road && (
            <div className="flex items-center gap-3 text-gray-600">
              <Truck size={16} className="text-emerald-500" />
              <span className="text-sm">Road placement allowed</span>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                £{totalPrice.toFixed(0)}
              </div>
              <div className="text-xs text-gray-500">
                Inc. VAT (£{skip.price_before_vat} + £{(totalPrice - skip.price_before_vat).toFixed(0)} VAT)
              </div>
            </div>
            
            <button className={`
              px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform
              ${isSelected 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md'
              }
            `}>
              {isSelected ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};