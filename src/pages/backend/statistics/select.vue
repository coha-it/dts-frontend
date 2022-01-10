<template lang="pug">
.row
  .col-12
    h1 Statistics Select
  .col-12.col-md-6.q-pr-md
    q-list(bordered)
      q-toolbar.bg-primary.text-white.shadow-2
        .full-width
          q-input.full-width(
            dark,
            borderless,
            v-model="search",
            debounce="500",
            placeholder="Umfrage suchen anhand ID, Titel, Kurzbeschreibung oder Beschreibung"
          )
            template(v-slot:append="")
              q-icon(name="search")
      q-separator
      template(v-for="survey in surveys")
        q-item(:key="survey.id", :disable="!isntSelected(survey)")
          q-item-section(avatar)
            q-icon(name="analytics")
          q-item-section
            q-item-label(lines="2") {{ survey.title }}
            q-item-label(caption, lines="3") {{ survey.desc_long }}
            q-item-label(caption, lines="3") {{ survey.desc_short }}
          q-item-section(side)
            q-btn(
              v-if="isntSelected(survey)",
              label="auswählen",
              size="sm",
              unelevated,
              color="primary",
              @click="selectSurvey(survey)"
            )
          q-item-section(side, top)
            q-item-label(caption) # {{ survey.id }}
        q-separator
    br
  .col-12.col-md-6(v-if="selected.length")
    q-list
      span(v-if="selected") {{ 'Ausgewählte Umfragen: ' + selected.length }}
      span(v-else) Keine Umfrage ausgewählt
      q-item(v-for="(survey, key) in selected", :key="survey.id")
        q-item-section(avatar)
          q-icon(name="analytics")
        q-item-section
          q-item-label(lines="2") {{ survey.title }}
          q-item-label(caption, lines="3") {{ survey.desc_long }}
          q-item-label(caption, lines="3") {{ survey.desc_short }}
        q-item-section(side)
          q-btn(
            label="abwählen",
            size="sm",
            unelevated,
            color="grey",
            @click="deselectSurvey(survey, key)"
          )
        q-item-section(side, top)
          q-item-label(caption) # {{ survey.id }}
  .col-12
    q-btn(@click="this.showStatistics" depressed unelevated color="primary") Zeige Statistik
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      // From Above
      search: null,
      surveys: [],
      selected: [],
    };
  },

  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },

  watch: {
    search: {
      handler(after, before) {
        if (
          (after ? after.toLowerCase() : "") !==
          (before ? before.toLowerCase() : "")
        ) {
          this.loadFilteredSurveys(after);
        }
      },
    }
  },

  created: function () {
    this.$store.dispatch("surveys/fetchBackendSurveysAllowed");
    this.loadFilteredSurveys();
  },

  methods: {
    loadFilteredSurveys(val = "") {
      axios
        .post("/api/backend/surveys-filtered", {
          search: val.toLowerCase(),
        })
        .then((res) => {
          this.surveys = Object.values(res.data);
        });
    },

    selectSurvey(survey) {
      this.selected.push(survey);
    },

    deselectSurvey(survey, key) {
      this.selected.splice(key, 1);
    },

    isntSelected(survey) {
      return !this.selected.find((e) => {
        return e.id === survey.id;
      });
    },

    showStatistics() {
      const survey_ids = this.selected.map((e) => {
        return e.id;
      }).join(',')

      this.$router.push({
        name: "backend.statistics.view",
        params: {
          survey_ids,
          'test': 'Der Test'
        },
      });
    },
  },
};
</script>