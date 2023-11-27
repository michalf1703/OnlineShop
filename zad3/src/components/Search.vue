<template>
  <form v-on:submit.prevent="sendUpdate">
    <div class="form-group">
      <label for="inputTitle">Tytuł</label>
      <input
        type="text"
        id="inputTitle"
        class="form-control"
        placeholder="Podaj tytuł lub jego fragment"
        v-model="movieTitle"
      />
    </div>
    <div class="form-group row">
      <label class="col-sm-4 col-form-label" for="inputProductionFrom">
        Rok produkcji od:
      </label>
      <div class="col-sm-8">
        <input
          v-model="dateFrom"
          type="number"
          min="1900"
          max="2023"
          id="inputProductionFrom"
          class="form-control"
          placeholder="Liczba naturalna z przedziału 1900-2023"
        />
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-4 col-form-label" for="inputProductionTo">
        Rok produkcji do:
      </label>
      <div class="col-sm-8">
        <input
          v-model="dateTo"
          type="number"
          min="1900"
          max="2023"
          id="inputProductionTo"
          class="form-control"
          placeholder="Liczba naturalna z przedziału 1900-2023"
        />
      </div>
    </div>
    <div class="form-group">
      <label for="inputCast">Obsada</label>
      <input
        v-model="cast"
        type="text"
        id="inputCast"
        class="form-control"
        placeholder="Imię i nazwisko"
      />
    </div>
    <div class="form-group row">
      <input type="submit" class="btn btn-info col-sm-12" value="Szukaj" />
    </div>
  </form>
</template>

<script>
//załadowanie filmów z pliku
import moviesData from "../assets/movies.json";
const moviesList = moviesData.slice(0, 36273);

//imporotowanie funkcji filtrujących 
import filter from "lodash/filter";
import unset from "lodash/unset";
import mapKeys from "lodash/mapKeys";

//sprawdzenie czy tytuł pasuje do poszukiwań 
const doesTitleEqual = (params, object) => {
  //czy użytkownik podal tytul filmu
  const isMovieTitleProvided = params.movieTitle;
  if (!isMovieTitleProvided) return true;
  //porównanie tytułu filmu - ignorujemy wielkosc liter
  const isSearchedTitleSameAsCurrentObjects = object.title.toLowerCase().includes(
    params.movieTitle.toLowerCase()
  );
  return isSearchedTitleSameAsCurrentObjects;
};

//sprawdzenie czy rok filmu mieści się w filtrach
const isDateEligible = (params, object) => {
  const areDatesProvided = !!params.dateFrom || !!params.dateTo;
  if (!areDatesProvided) return true;
  //sprawdzenie film miesci sie w zakresie
  const isMovieDateBetweenSearchDates = !params.dateTo 
    ? object.year >= params.dateFrom
    : !params.dateFrom 
    ? object.year <= params.dateTo
    : object.year <= params.dateTo && object.year >= params.dateFrom; 
  return isMovieDateBetweenSearchDates;
};

//sprawdzenie, czy w obsadzie znajduje sie podany aktor
const isThereSomeoneFromTheCast = (params, object) => {
  const isCastProvided = params.cast;
  if (!isCastProvided) return true;
  const isProvidedCastInThisObject =
    object.cast.filter((movieCast) =>
      movieCast.toLowerCase().includes(params.cast.toLowerCase())
    ).length > 0;
  return isProvidedCastInThisObject;
};

// obiekt-komponent Vue
export default {
  name: "SearchMove",

  data() {
    return {
      // stan komponentu - dane wprowadzone przez użytkownika w formularzu
      movieTitle: "",
      dateFrom: "",
      dateTo: "",
      cast: "",
    };
  },

  methods: {
    // funkcja filtrująca dane filmów na podstawie parametrów zmienionych przez użytkownika
    filterData(changedParams) {
      // usunięcie kluczy bez wartości
      mapKeys(changedParams, (value, key) => {
        if (!value) unset(changedParams, key);
      });

      // filtrowanie listy filmów na podstawie różnych kryteriów
      return filter(
        moviesList,
        (o) =>
          doesTitleEqual(changedParams, o) &&
          isDateEligible(changedParams, o) &&
          isThereSomeoneFromTheCast(changedParams, o)
      );
    },

    // wysyłanie zaktualizowanych danych
    sendUpdate() {
      // wywołanie funkcji filtrującej i przekazanie wyników do zdarzenia
      this.$emitter.emit(
        "search-change-params",
        this.filterData({
          movieTitle: this.movieTitle,
          dateFrom: this.dateFrom,
          dateTo: this.dateTo,
          cast: this.cast,
        })
      );
    },
  },

  // po zamontowaniu komponentu
  mounted() {
    // nasłuchiwanie zdarzenia - komunikacja z innymi komponentami 
    this.$emitter.on("update-data", () => {
      this.sendUpdate();
    });
    this.sendUpdate();
  },
};
</script>

<style></style>
