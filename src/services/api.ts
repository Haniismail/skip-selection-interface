import { Skip } from '../types/skip';

const API_BASE_URL = 'https://app.wewantwaste.co.uk/api';

export interface SkipsApiParams {
  postcode: string;
  area: string;
}

export const fetchSkips = async ({ postcode, area }: SkipsApiParams): Promise<Skip[]> => {
  const url = new URL(`${API_BASE_URL}/skips/by-location`);
  url.searchParams.append('postcode', postcode);
  url.searchParams.append('area', area);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch skips: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  // Validate that we received an array
  if (!Array.isArray(data)) {
    throw new Error('Invalid response format: expected array of skips');
  }

  return data;
};