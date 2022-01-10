<template lang="pug">
div
  h6.q-my-sm(header) {{ $t('your_surveys') }}

  div(style="max-width: 400px")
    .row.q-gutter-md
      template(v-if="aSurveys && aSurveys.length > 0")
        q-card.col.col-12.col-xs-12.col-xl-12(
          v-for="oSurvey in aSurveys",
          :id="'survey-' + oSurvey.id",
          :key="oSurvey.id",
          :class="isEnabled(oSurvey) ? 'pointer' : null",
          clickable,
          flat,
          bordered,
          ripple,
          :disabled="isDisabled(oSurvey)",
          @click="isEnabled(oSurvey) ? link('survey/' + oSurvey.id + '#overview') : null"
        )
          q-card-section
            .text-subtitle2
              template(v-if="oSurvey.author") Von {{ oSurvey.author }}

              q-badge(
                outline,
                :color="getBadgeColor(oSurvey)",
                :label="getBadgeLabel(oSurvey)",
                style="float: right"
              )

            .text-h6.text-black {{ oSurvey.title || 'Umfrage #' + oSurvey.id }}

            .row.justify-center.full-height.full-width.text-center.items-center(
              v-if="oSurvey.question_count"
            )
              .col.col-4
                q-linear-progress(
                  rounded,
                  size="8px",
                  :value="oSurvey.answer_count / oSurvey.question_count",
                  color="green"
                )

              .col.col-8.text-left.q-pl-sm
                small.text-caption {{ oSurvey.answer_count + ' von ' + oSurvey.question_count + ' Fragen beantwortet' }}

            .q-mt-smxxx {{ oSurvey.desc_short }}

          q-card-section
            .text-right.text-grey.text-caption
              | Startet am {{ fhd(oSurvey.start_datetime) }} um {{ fht(oSurvey.start_datetime) }}
              | Endet um {{ fhd(oSurvey.end_datetime) }} um {{ fht(oSurvey.end_datetime) }}

      template(v-else)
        .col.col-12.col-xs-12.col-xl-12.text-grey-7
          p.text-body2 Es wurden aktuell noch keine Umfragen erstellt, welche Sie ausfüllen können. Tut uns Leid
</template>

<script>
// import axios from 'axios'
import { mapGetters } from "vuex";
import dayjs from "dayjs";
import _ from "lodash";

export default {
  data() {
    return {
      sSearch: "",
      aSurveys: [],
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
      surveysMembering: "surveys/surveysMembering",
    }),
  },
  watch: {
    surveysMembering: function (promise) {
      // Order
      promise = _.orderBy(
        promise,
        [
          "user_finished", // 1 .. 0
          "is_fillable", // 1 .. 0
          "is_finished", // 0 .. 1
          "has_ended", // 0 .. 1
          "has_started", // 1 .. 0
          "start_datetime", // 0 .. 1
        ],
        [
          "desc", // 1 .. 0
          "desc", // 1 .. 0
          "asc", // 0 .. 1
          "asc", // 0 .. 1
          "desc", // 1 .. 0
          "asc", // 0 .. 1
        ]
      );

      // Set
      this.aSurveys = promise;
    },
  },
  created: function () {
    this.$store.dispatch("surveys/fetchSurveysMembering");
  },
  methods: {
    link(url) {
      this.$router.push(url);
    },
    isDisabled(s) {
      return !this.isEnabled(s);
    },
    isEnabled(s) {
      return s.is_fillable && !s.user_finished;
    },
    fhd(d) {
      return dayjs(d).format("DD.MM.YYYY");
    },
    fht(d) {
      return dayjs(d).format("hh:mm");
    },
    getBadgeColor(s) {
      if (s.is_fillable) return "green";
      if (s.is_expired) return "red";
      return "primary";
    },
    getBadgeLabel(s) {
      if (s.user_finished) return "Erfolgreich ausgefüllt";
      if (s.is_fillable) return "Jetzt Verfügbar";
      if (s.is_expired) return "Abgelaufen";
      return "Bald verfügbar";
    },
  },
};
</script>
