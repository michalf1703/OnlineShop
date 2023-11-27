<template>
  <div>
    <h1>Filmy wg obsady</h1>
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
      <!-- pętla dla każdego członka obsady -->
      <tbody v-for="(castMember, index1) in grouped" :key="index1">
        <!-- nagłówek członka obsady -->
        <h1>{{ Object.keys(castMember)[0] }}</h1>
        <!-- pętla dla każdego filmu z danym członkiem obsady -->
        <tr
          v-for="(movie, index2) in castMember[Object.keys(castMember)[0]]"
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
  name: "CastMoviesList",
  data() {
    return {
      grouped: [],           // pogrupowane filmy wg obsady
      howManyLoaded: 0,       // ilość już załadowanych filmów
      moviesListCopy: [],     // kopia pełnej listy filmów
      moviesToDisplay: [],    // filmy do wyświetlenia w tabeli
    };
  },

  methods: {
    loadMore() {
      this.howManyLoaded += 10;                   
      this.moviesToDisplay = this.moviesListCopy.slice(0, this.howManyLoaded);  
      this.group();  
    },
    // funkcja do grupowania filmów wg obsady
    group() {
      this.allCast = [];
      // zbieranie wszystkich członków obsady z filmów do wyświetlenia
      this.moviesToDisplay.forEach((value) => {
        this.allCast = concat(this.allCast, value.cast);
      });
      this.allCast = compact(Array.from(new Set(this.allCast)));  // usunięcie duplikatów
      // grupowanie filmów wg obsady
      this.grouped = this.allCast.map((castMember) => ({
        [castMember]: this.moviesToDisplay.filter((movie) =>
          movie.cast.includes(castMember)
        ),
      }));
    },
  },

  created() {
    this.$emitter.emit("update-data");  // wysłanie zdarzenia o aktualizacji danych
    this.moviesListCopy = [...moviesList]; 
    this.moviesToDisplay = this.moviesListCopy.slice(0, this.howManyLoaded);  // ustawienie filmów do wyświetlenia
    if (this.howManyLoaded < 10) this.loadMore();  
    this.group();  // grupowanie filmów wg obsady
  },
};
</script>

<style></style>
