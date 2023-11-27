<template>
  <div>
    <h5>Wyświetlanie obecnie {{ howManyLoaded }} / {{ movies.length }}</h5>
    <table class="table-condensed table-hover">
      <thead>
        <tr>
          <th>Title</th>
          <th>Production Year</th>
          <th>Cast</th>
          <th>Genres</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(movie, index) in moviesToDisplay" :key="index">
          <td>{{ movie.title }}</td>
          <td>{{ movie.year }}</td>
          <td>{{ movie.cast.join(", ") }}</td>
          <td>{{ movie.genres.join(", ") }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="howManyLoaded <= movies.length">
      <button class="btn btn-info col-sm-12" v-on:click="loadMore">
        Load More
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MoviesTable",
  data() {
    return {
      movies: [],             // wszystkie dostępne filmy
      howManyLoaded: 0,       // ilość już załadowanych filmów
      moviesToDisplay: [],    // filmy do wyświetlenia w tabeli
    };
  },

  methods: {
    // funkcja do ładowania kolejnych filmów
    loadMore() {
      this.howManyLoaded += 10;                     
      this.moviesToDisplay = this.movies.slice(0, this.howManyLoaded);  
    },
  },

  created() {
    this.$emitter.emit("update-data");  
    // nasłuchiwanie na zdarzenie zmiany parametrów wyszukiwania
    this.$emitter.on("search-change-params", (movies) => {
      this.movies = movies;  // aktualizacja listy filmów na podstawie wyników wyszukiwania
      this.moviesToDisplay = this.movies.slice(0, this.howManyLoaded);  
      if (this.howManyLoaded < 10) this.loadMore();  // jeśli załadowano mniej niż 10 filmów, załaduj więcej
    });
  },
};
</script>

<style></style>
