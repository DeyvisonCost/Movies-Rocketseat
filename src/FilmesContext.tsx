import {
  useContext,
  useState,
  ReactNode,
  useEffect,
  createContext,
} from "react";
import { api } from "./services/api";

interface GenreResponseProps {
  id: number;
  name: "action" | "comedy" | "documentary" | "drama" | "horror" | "family";
  title: string;
}

interface FilmesProviderProps {
  children: ReactNode;
  // children: ReactNode;
}

interface FilmesContextData {
  genres: GenreResponseProps[];
  selectedGenre: GenreResponseProps;
  selectedGenreId: number;
  movies: MovieProps[];
  handleClickButton: (id: number) => void;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

const FilmesContext = createContext<FilmesContextData>({} as FilmesContextData);

export function FilmesProvider({ children }: FilmesProviderProps) {
  const [selectedGenreId, setSelectedGenreId] = useState(1);

  const [genres, setGenres] = useState<GenreResponseProps[]>([]);

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>(
    {} as GenreResponseProps
  );

  useEffect(() => {
    api.get<GenreResponseProps[]>("genres").then((response) => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api
      .get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`)
      .then((response) => {
        setMovies(response.data);
      });

    api
      .get<GenreResponseProps>(`genres/${selectedGenreId}`)
      .then((response) => {
        setSelectedGenre(response.data);
      });
  }, [selectedGenreId]);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  return (
    <FilmesContext.Provider
      value={{
        genres,
        selectedGenre,
        selectedGenreId,
        movies,
        handleClickButton,
      }}
    >
      {children}
    </FilmesContext.Provider>
  );
}

export function useFilmes() {
  const context = useContext(FilmesContext);

  return context;
}
