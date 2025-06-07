import { useQuery } from '@tanstack/react-query';
import { fetchSkips, SkipsApiParams } from '../services/api';

export const useSkips = (params: SkipsApiParams) => {
  return useQuery({
    queryKey: ['skips', params.postcode, params.area],
    queryFn: () => fetchSkips(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};