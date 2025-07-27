import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import SearchBar from '../SearchBar/SearchBar';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import MovieModal from '../MovieModal/MovieModal';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import styles from './App.module.css';


function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {
    data: moviesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['movies', searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: !!searchQuery,
    staleTime: 5 * 60 * 1000, // 5 хвилин
    placeholderData: (previousData) => previousData,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); 
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleSelect = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  
  useEffect(() => {
    if (isError && error) {
      toast.error('Something went wrong.');
    }
  }, [isError, error]);

  // Показуємо повідомлення якщо фільми не знайдено
  useEffect(() => {
    if (moviesData && moviesData.results.length === 0 && searchQuery) {
      toast('No movies found for your request.');
    }
  }, [moviesData, searchQuery]);

  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage />
      ) : moviesData ? (
        <>
          <MovieGrid movies={moviesData.results} onSelect={handleSelect} />
          {moviesData.total_pages > 1 && (
            <ReactPaginate
              pageCount={moviesData.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      ) : null}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  );
}

export default App;
