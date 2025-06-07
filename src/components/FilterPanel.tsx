import React, { useMemo, useState } from 'react';
import { Filter, Sliders, Clock, Weight, Truck, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Skip, FilterState } from '../types/skip';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableSkips: Skip[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFiltersChange, 
  availableSkips 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate available ranges from the data
  const ranges = useMemo(() => {
    if (availableSkips.length === 0) {
      return {
        sizeRange: [0, 50],
        hirePeriodRange: [0, 30]
      };
    }

    const sizes = availableSkips.map(skip => skip.size);
    const hirePeriods = availableSkips.map(skip => skip.hire_period_days);

    return {
      sizeRange: [Math.min(...sizes), Math.max(...sizes)],
      hirePeriodRange: [0, Math.max(...hirePeriods)] // Always start from 0 for hire period
    };
  }, [availableSkips]);

  const handleSizeRangeChange = (value: number, isMin: boolean) => {
    const newRange: [number, number] = isMin 
      ? [value, Math.max(value, filters.sizeRange[1])]
      : [Math.min(value, filters.sizeRange[0]), value];
    
    onFiltersChange({
      ...filters,
      sizeRange: newRange
    });
  };

  const handleHirePeriodRangeChange = (value: number, isMin: boolean) => {
    const newRange: [number, number] = isMin 
      ? [value, Math.max(value, filters.hirePeriodRange[1])]
      : [Math.min(value, filters.hirePeriodRange[0]), value];
    
    onFiltersChange({
      ...filters,
      hirePeriodRange: newRange
    });
  };

  const handleToggleFilter = (filterType: 'allowsHeavyWaste' | 'allowedOnRoad', value: boolean | null) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      sizeRange: ranges.sizeRange,
      hirePeriodRange: ranges.hirePeriodRange,
      allowsHeavyWaste: null,
      allowedOnRoad: null,
    });
  };

  const hasActiveFilters = 
    filters.sizeRange[0] !== ranges.sizeRange[0] ||
    filters.sizeRange[1] !== ranges.sizeRange[1] ||
    filters.hirePeriodRange[0] !== ranges.hirePeriodRange[0] ||
    filters.hirePeriodRange[1] !== ranges.hirePeriodRange[1] ||
    filters.allowsHeavyWaste !== null ||
    filters.allowedOnRoad !== null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header - Always visible */}
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Filter size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Filter Options</h3>
            <p className="text-sm text-gray-600">Narrow down your skip choices</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetFilters();
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          )}
          
          <div className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-emerald-600 transition-colors duration-200">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-6 pb-6 border-t border-gray-100 mt-2">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {/* Size Range Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-emerald-500" />
                <label className="text-sm font-medium text-gray-700">Skip Size (Yards)</label>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  {/* Track background */}
                  <div className="h-2 bg-gray-200 rounded-lg relative">
                    {/* Active track */}
                    <div 
                      className="absolute h-2 bg-emerald-500 rounded-lg"
                      style={{
                        left: `${((filters.sizeRange[0] - ranges.sizeRange[0]) / (ranges.sizeRange[1] - ranges.sizeRange[0])) * 100}%`,
                        width: `${((filters.sizeRange[1] - filters.sizeRange[0]) / (ranges.sizeRange[1] - ranges.sizeRange[0])) * 100}%`
                      }}
                    />
                  </div>
                  
                  {/* Min slider */}
                  <input
                    type="range"
                    min={ranges.sizeRange[0]}
                    max={ranges.sizeRange[1]}
                    value={filters.sizeRange[0]}
                    onChange={(e) => handleSizeRangeChange(Number(e.target.value), true)}
                    className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer dual-range-slider"
                    style={{ zIndex: 1 }}
                  />
                  
                  {/* Max slider */}
                  <input
                    type="range"
                    min={ranges.sizeRange[0]}
                    max={ranges.sizeRange[1]}
                    value={filters.sizeRange[1]}
                    onChange={(e) => handleSizeRangeChange(Number(e.target.value), false)}
                    className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer dual-range-slider"
                    style={{ zIndex: 2 }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{filters.sizeRange[0]}</span>
                  <span className="text-xs text-gray-500">-</span>
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{filters.sizeRange[1]}</span>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {filters.sizeRange[0]} - {filters.sizeRange[1]} yards
                </div>
              </div>
            </div>

            {/* Hire Period Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-emerald-500" />
                <label className="text-sm font-medium text-gray-700">Hire Period (Days)</label>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  {/* Track background */}
                  <div className="h-2 bg-gray-200 rounded-lg relative">
                    {/* Active track */}
                    <div 
                      className="absolute h-2 bg-emerald-500 rounded-lg"
                      style={{
                        left: `${((filters.hirePeriodRange[0] - ranges.hirePeriodRange[0]) / (ranges.hirePeriodRange[1] - ranges.hirePeriodRange[0])) * 100}%`,
                        width: `${((filters.hirePeriodRange[1] - filters.hirePeriodRange[0]) / (ranges.hirePeriodRange[1] - ranges.hirePeriodRange[0])) * 100}%`
                      }}
                    />
                  </div>
                  
                  {/* Min slider */}
                  <input
                    type="range"
                    min={ranges.hirePeriodRange[0]}
                    max={ranges.hirePeriodRange[1]}
                    value={filters.hirePeriodRange[0]}
                    onChange={(e) => handleHirePeriodRangeChange(Number(e.target.value), true)}
                    className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer dual-range-slider"
                    style={{ zIndex: 1 }}
                  />
                  
                  {/* Max slider */}
                  <input
                    type="range"
                    min={ranges.hirePeriodRange[0]}
                    max={ranges.hirePeriodRange[1]}
                    value={filters.hirePeriodRange[1]}
                    onChange={(e) => handleHirePeriodRangeChange(Number(e.target.value), false)}
                    className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer dual-range-slider"
                    style={{ zIndex: 2 }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{filters.hirePeriodRange[0]}</span>
                  <span className="text-xs text-gray-500">-</span>
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{filters.hirePeriodRange[1]}</span>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {filters.hirePeriodRange[0]} - {filters.hirePeriodRange[1]} days
                </div>
              </div>
            </div>

            {/* Heavy Waste Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Weight size={16} className="text-emerald-500" />
                <label className="text-sm font-medium text-gray-700">Heavy Waste</label>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'All Types', value: null },
                  { label: 'Heavy Waste OK', value: true },
                  { label: 'Light Waste Only', value: false }
                ].map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleToggleFilter('allowsHeavyWaste', option.value)}
                    className={`
                      w-full px-3 py-2 text-sm rounded-lg border transition-all duration-200
                      ${filters.allowsHeavyWaste === option.value
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Road Placement Filter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-emerald-500" />
                <label className="text-sm font-medium text-gray-700">Road Placement</label>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'All Options', value: null },
                  { label: 'Road Allowed', value: true },
                  { label: 'Permit Required', value: false }
                ].map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleToggleFilter('allowedOnRoad', option.value)}
                    className={`
                      w-full px-3 py-2 text-sm rounded-lg border transition-all duration-200
                      ${filters.allowedOnRoad === option.value
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
