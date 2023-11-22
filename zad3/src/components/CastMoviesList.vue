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
      <tbody v-for="(castMember, index1) in grouped" :key="index1">
        <h1>{{ Object.keys(castMember)[0] }}</h1>
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

const moviesList = moviesData.slice(600, 700); // Zakładam, że masz dostęp do wszystkich danych z pliku

export default {
  name: "CastMoviesList",
  data() {
    return {
      grouped: [],
      howManyLoaded: 0,
      moviesListCopy: [],
      moviesToDisplay: [],
    };
  },
  methods: {
    loadMore() {
      this.howManyLoaded += 10;
      this.moviesToDisplay = this.moviesListCopy.slice(0, this.howManyLoaded);
      this.group();
    },
    group() {
      this.allCast = [];
      this.moviesToDisplay.forEach((value) => {
        this.allCast = concat(this.allCast, value.cast);
      });

      this.allCast = compact(Array.from(new Set(this.allCast)));

      this.grouped = this.allCast.map((castMember) => ({
        [castMember]: this.moviesToDisplay.filter((movie) =>
          movie.cast.includes(castMember)
        ),
      }));
    },
  },
  created() {
    this.$emitter.emit("update-data");
    this.moviesListCopy = [...moviesList];
    this.moviesToDisplay = this.moviesListCopy.slice(0, this.howManyLoaded);
    if (this.howManyLoaded < 10) this.loadMore();
    this.group();
  },
};
</script>

<style></style>
