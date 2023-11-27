<template>
  <div>
    <h1>Filmy wg gatunku</h1>
    <h5>
      Wyświetlanie obecnie {{ howManyLoaded }} / {{ moviesListCopy.length }}
    </h5>
    <table class="table-condensed table-hover">
      <thead>
        <tr>
          <th>Title</th>
          <th>Production Year</th>
          <th>Cast</th>
          <th>Genres</th>
        </tr>
      </thead>
      <!-- pętla dla każdego gatunku -->
      <tbody v-for="(genre, index1) in grouped" :key="index1">
        <!-- nagłówek gatunku -->
        <h1>{{ Object.keys(genre)[0] }}</h1>
        <!-- pętla dla każdego filmu w danym gatunku -->
        <tr
          v-for="(movie, index2) in genre[Object.keys(genre)[0]]"
          :key="index2"
        >
          <td>{{ movie.title }}</td>
          <td>{{ movie.year }}</td>
          <td>{{ movie.cast.join(", ") }}</td>
          <td>{{ movie.genres.join(", ") }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="howManyLoaded <= moviesListCopy.length">
      <button class="btn btn-info col-sm-12" v-on:click="loadMore">
        Load More
      </button>
    </div>
  </div>
</template>

<script>
import concat from "lodash/concat";
import compact from "lodash/compact";
import moviesData from "../assets/movies.json";
const moviesList = moviesData.slice(600, 700); 

export default {
  name: "GenreMoviesList",
  data() {
    return {
      grouped: [],           // pogrupowane filmy wg gatunku
      howManyLoaded: 0,       // ilość już załadowanych filmów
      moviesListCopy: [],     // kopia pełnej listy filmów
      moviesToDisplay: [],    // filmy do wyświetlenia w tabeli
    };
  },

  methods: {
    loadMore() {
      this.howManyLoaded += 10;                        
      this.moviesToDisplay = this.moviesListCopy.slice(0, this.howManyLoaded);  
      this.group();  // ponowne grupowanie filmów wg gatunku
    },
    // funkcja do grupowania filmów wg gatunku
    group() {
      this.allGenres = [];
      // zbieranie wszystkich gatunków z filmów do wyświetlenia
      this.moviesToDisplay.forEach((value) => {
        this.allGenres = concat(this.allGenres, value.genres);
      });
      this.allGenres = compact(Array.from(new Set(this.allGenres)));  // usunięcie duplikatów
      // grupowanie filmów wg gatunku
      this.grouped = this.allGenres.map((genre) => ({
        [genre]: this.moviesToDisplay.filter((movie) =>
          movie.genres.includes(genre)
        ),
      }));
    },
  },

  created() {
    this.$emitter.emit("update-data");  // wysłanie zdarzenia o aktualizacji danych
    this.moviesListCopy = [...moviesList];  
    this.moviesToDisplay = this.moviesListCopy.slice(0, this.howManyLoaded);  // ustawienie filmów do wyświetlenia
    if (this.howManyLoaded < 10) this.loadMore();  
    this.group();  // grupowanie wg gatunku
  },
};
</script>

<style></style>
