import  { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { ProgressBar } from './components/ProgressBar';
import { SkipCard } from './components/SkipCard';
import { SkipComparison } from './components/SkipComparison';
import { LoadingSpinner } from './components/LoadingSpinner';
import { FilterPanel } from './components/FilterPanel';
import { useSkips } from './hooks/useSkips';
import { Skip, FilterState } from './types/skip';

function App() {
  const { data: skips = [], isLoading, error, refetch, isFetching } = useSkips({
    postcode: 'NR32',
    area: 'Lowestoft'
  });

  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null);
  // Initialize filters with dynamic ranges based on available data
  const [filters, setFilters] = useState<FilterState>({
    sizeRange: [0, 50], // Will be updated when data loads
    hirePeriodRange: [0, 14],
    allowsHeavyWaste: null,
    allowedOnRoad: null,
  });

  // Update filter ranges when skip data changes
  useEffect(() => {
    if (skips.length > 0) {
      const sizes = skips.map(skip => skip.size);
      const hirePeriods = skips.map(skip => skip.hire_period_days);

      const minSize = Math.min(...sizes);
      const maxSize = Math.max(...sizes);
      const maxHirePeriod = Math.max(...hirePeriods);

      setFilters(prev => ({
        ...prev,
        sizeRange: [minSize, maxSize],
        hirePeriodRange: [0, maxHirePeriod]
      }));
    }
  }, [skips]);

  // Filter skips based on current filter state
  const filteredSkips = useMemo(() => {
    return skips.filter(skip => {
      // Size filter
      if (skip.size < filters.sizeRange[0] || skip.size > filters.sizeRange[1]) {
        return false;
      }

      // Hire period filter
      if (skip.hire_period_days < filters.hirePeriodRange[0] || skip.hire_period_days > filters.hirePeriodRange[1]) {
        return false;
      }

      // Heavy waste filter
      if (filters.allowsHeavyWaste !== null && skip.allows_heavy_waste !== filters.allowsHeavyWaste) {
        return false;
      }

      // Road placement filter
      if (filters.allowedOnRoad !== null && skip.allowed_on_road !== filters.allowedOnRoad) {
        return false;
      }

      return true;
    });
  }, [skips, filters]);

  const handleSkipSelect = (skip: Skip) => {
    setSelectedSkip(skip);
  };

  const handleContinue = () => {
    if (selectedSkip) {
      alert(`Selected ${selectedSkip.size} yard skip for £${(selectedSkip.price_before_vat * (1 + selectedSkip.vat / 100)).toFixed(0)}`);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Clear selection if current selection doesn't match new filters
    if (selectedSkip) {
      // Check if the selected skip matches the new filters
      const skipMatchesFilters = (
        selectedSkip.size >= newFilters.sizeRange[0] &&
        selectedSkip.size <= newFilters.sizeRange[1] &&
        selectedSkip.hire_period_days >= newFilters.hirePeriodRange[0] &&
        selectedSkip.hire_period_days <= newFilters.hirePeriodRange[1] &&
        (newFilters.allowsHeavyWaste === null || selectedSkip.allows_heavy_waste === newFilters.allowsHeavyWaste) &&
        (newFilters.allowedOnRoad === null || selectedSkip.allowed_on_road === newFilters.allowedOnRoad)
      );

      if (!skipMatchesFilters) {
        setSelectedSkip(null);
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-900 mb-4">Unable to Load Skip Options</h2>
          <p className="text-red-700 mb-6">
            {error instanceof Error ? error.message : 'Failed to fetch skip data from the server'}
          </p>
          <button
            onClick={handleRetry}
            disabled={isFetching}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw size={20} className={isFetching ? 'animate-spin' : ''} />
            {isFetching ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WeWantWaste</h1>
                <p className="text-sm text-gray-600">Professional Waste Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Postcode:</span> NR32 Lowestoft
              </div>
              {isFetching && (
                <div className="flex items-center gap-2 text-emerald-600">
                  <RefreshCw size={16} className="animate-spin" />
                  <span className="text-sm">Updating...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <ProgressBar />

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Skip Size
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the skip size that best suits your project needs. All prices include VAT and delivery.
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Filter Panel */}
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFilterChange}
              availableSkips={skips}
            />

            <div className="grid lg:grid-cols-4 gap-8 mt-8">
              {/* Skip Selection */}
              <div className="lg:col-span-3">
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredSkips.map((skip) => (
                    <SkipCard
                      key={skip.id}
                      skip={skip}
                      isSelected={selectedSkip?.id === skip.id}
                      onSelect={() => handleSkipSelect(skip)}
                    />
                  ))}
                </div>

                {filteredSkips.length === 0 && skips.length > 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Skips Match Your Filters</h3>
                    <p className="text-gray-600">Try adjusting your filter criteria to see more options.</p>
                  </div>
                )}

                {skips.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Skips Available</h3>
                    <p className="text-gray-600">No skip options found for this location.</p>
                  </div>
                )}
              </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <SkipComparison selectedSize={selectedSkip?.size} />
              
              {selectedSkip && (
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-3">Your Selection</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Skip Size:</span>
                      <span className="font-semibold">{selectedSkip.size} Yards</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hire Period:</span>
                      <span className="font-semibold">{selectedSkip.hire_period_days} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Price:</span>
                      <span className="font-bold text-xl">
                        £{(selectedSkip.price_before_vat * (1 + selectedSkip.vat / 100)).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          </>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
          <button className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors duration-200">
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>

          <button
            onClick={handleContinue}
            disabled={!selectedSkip}
            className={`
              flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform
              ${selectedSkip
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <span>Continue to Permit Check</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;