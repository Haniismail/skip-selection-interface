import React from 'react';
import { MapPin, Trash2, Package, Shield, Calendar, CreditCard } from 'lucide-react';

const steps = [
  { icon: MapPin, label: 'Postcode', completed: true },
  { icon: Trash2, label: 'Waste Type', completed: true },
  { icon: Package, label: 'Select Skip', completed: false, current: true },
  { icon: Shield, label: 'Permit Check', completed: false },
  { icon: Calendar, label: 'Choose Date', completed: false },
  { icon: CreditCard, label: 'Payment', completed: false },
];

export const ProgressBar: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-200 to-gray-200"></div>
        <div className="absolute top-6 left-0 w-1/3 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-400"></div>
        
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex flex-col items-center relative z-10">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                ${step.completed 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                  : step.current 
                    ? 'bg-white border-4 border-emerald-500 text-emerald-600 shadow-lg' 
                    : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                }
              `}>
                <Icon size={20} />
              </div>
              <span className={`
                mt-3 text-sm font-medium transition-colors duration-300
                ${step.completed || step.current ? 'text-gray-900' : 'text-gray-400'}
              `}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};