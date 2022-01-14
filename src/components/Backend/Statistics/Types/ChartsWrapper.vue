<template lang="pug">
.charts-wrapper
  div
    h2 Umfragen:
    div(v-for="survey in surveys")
      h5.q-ma-none Survey-ID {{ survey.id }}
      div Survey created_by {{ survey.created_by }}
      div Survey active {{ survey.active }}
      div Survey author {{ survey.author }}
      div Survey title {{ survey.title }}
      div Survey desc_short {{ survey.desc_short }}
      div Survey desc_long {{ survey.desc_long }}
      div Survey desc_before_submit {{ survey.desc_before_submit }}
      div Survey desc_after_submit {{ survey.desc_after_submit }}
      div Survey start_datetime {{ survey.start_datetime }}
      div Survey end_datetime {{ survey.end_datetime }}
      div Survey is_finished {{ survey.is_finished }}
      div Survey is_canceled {{ survey.is_canceled }}
      div Survey only_editable_by_creator {{ survey.only_editable_by_creator }}
      div Survey is_public {{ survey.is_public }}
      div Survey use_html {{ survey.use_html }}
      div Survey created_at {{ survey.created_at }}
      div Survey updated_at {{ survey.updated_at }}
      div Survey deleted_at {{ survey.deleted_at }}
      div Survey group_id {{ survey.group_id }}
      div Survey survey_id {{ survey.survey_id }}
      div Survey is_editable {{ survey.is_editable }}
      div Survey is_fillable {{ survey.is_fillable }}
      div Survey has_started {{ survey.has_started }}
      div Survey is_expired {{ survey.is_expired }}
      div Survey question_count {{ survey.question_count }}
      div Survey answer_count {{ survey.answer_count }}
  div
    h2 Frage-Stats übersicht:
    div Fragen insgesamt: {{ questions.length }}
    div Aktive Teilnehmer: {{ users.length }}
    div Beantwortete & übersprungene Fragen: {{ answers.length }}
    div Übersprungene Fragen: {{ answersSkipped.length }}
    div Nicht-Übersprungene Fragen: {{ answersNotSkipped.length }}
    div Kommentierte Fragen: {{ answersCommented.length }}
    div Nicht-Kommentierte Fragen: {{ answersNotCommented.length }}
  Charts(
    v-for="(id, key) in questions.map(e => e.question_id)"
    :key="key"
    :question_id="id"
    :stats="stats.filter(e => e.question_id === id)"
  )
</template>

<script>
import Charts from "@/components/Backend/Statistics/Types/Charts.vue";
import {_} from 'vue-underscore';

export default {
  props: [
    "data"
  ],

  components: {
    Charts,
  },

  computed: {
    stats () {
      return this.data.answers
    },
    surveys () {
      return this.data.surveys
    },
    questions () {
      return _
        .uniq(this.stats, x => x.question_id)
        .map(e => ({
          question_id: e.question_id,
          question_format: e.question_format,
          question_title: e.question_title,
          question_subtitle: e.question_subtitle,
          question_description: e.question_description,
        }))
    },
    answers () {
      return _
        .uniq(this.stats, x => x.answer_id)
        .map(e => ({
          answer_id: e.answer_id,
          answer_skipped: e.answer_skipped,
          answer_comment: e.answer_comment,
        }))
    },
    answersSkipped () {
      return _.filter(this.answers, e => e.answer_skipped == 1)
    },
    answersNotSkipped () {
      return _.filter(this.answers, e => e.answer_skipped == 0)
    },
    answersCommented () {
      return _.filter(this.answers, e => e.answer_comment)
    },
    answersNotCommented () {
      return _.filter(this.answers, e => !e.answer_comment)
    },
    users () {
      return _
        .uniq(this.stats, x => x.pan)
        .map(e => ({
          pan: e.pan,
          location_name: e.location_name,
          department_name: e.department_name,
          company_name: e.company_name
        }))
    },

  },

  mounted () {

  }
};
</script>