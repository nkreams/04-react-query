import axios from 'axios';
import type { Movie } from '../types/movie';

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

export const fetchMovies = async (query: string, page: number = 1): Promise<MoviesResponse> => {
  const apiToken = import.meta.env.VITE_TMDB_TOKEN;
  
  if (!apiToken) {
    throw new Error('TMDB API token is not configured. Please add VITE_TMDB_TOKEN to your .env file.');
  }

  const response = await axios.request<MoviesResponse>({
    method: 'GET',
    url: BASE_URL,
    params: {
      include_adult: false,
      language: 'en-US',
      page,
      query,
    },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiToken}`,
    },
  });
  return response.data;
};