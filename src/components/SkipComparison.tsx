import React from 'react';
import { TrendingUp, Users, Home, Building } from 'lucide-react';

const useCases = [
  { icon: Home, label: 'Small Home Projects', sizes: [4, 6], color: 'emerald' },
  { icon: Users, label: 'Family Renovations', sizes: [8, 10], color: 'blue' },
  { icon: Building, label: 'Large Construction', sizes: [12, 14, 16], color: 'purple' },
  { icon: TrendingUp, label: 'Commercial Projects', sizes: [20, 40], color: 'orange' },
];

interface SkipComparisonProps {
  selectedSize?: number;
}

export const SkipComparison: React.FC<SkipComparisonProps> = ({ selectedSize }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Skip Size Guide</h3>
      
      <div className="space-y-4">
        {useCases.map((useCase, index) => {
          const Icon = useCase.icon;
          const isRelevant = selectedSize && useCase.sizes.includes(selectedSize);
          
          return (
            <div 
              key={index}
              className={`
                flex items-center gap-4 p-3 rounded-xl transition-all duration-300
                ${isRelevant 
                  ? `bg-${useCase.color}-50 border border-${useCase.color}-200` 
                  : 'hover:bg-gray-50'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${isRelevant 
                  ? `bg-${useCase.color}-500 text-white` 
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                <Icon size={20} />
              </div>
              
              <div className="flex-1">
                <div className={`font-medium ${isRelevant ? `text-${useCase.color}-900` : 'text-gray-900'}`}>
                  {useCase.label}
                </div>
                <div className="text-sm text-gray-600">
                  Recommended: {useCase.sizes.join(', ')} yard skips
                </div>
              </div>
              
              {isRelevant && (
                <div className={`text-xs font-medium px-2 py-1 rounded-full bg-${useCase.color}-500 text-white`}>
                  Perfect Match
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};