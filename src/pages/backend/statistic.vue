<template lang="pug">
div
  h1 Statistics

  // Buttons
  template(v-for="statistic in statistics")
    q-btn(
      :label="statistic.label"
      unelevated
      :color="currentStatisticId && currentStatisticId != statistic.id ? 'grey' : 'primary'"
      outline
      no-caps
      @click="getSurveyStatistics(statistic.id)"
    )
    br

  // If Stats
  template(v-if="stats")

    // Only Stats THREE
    template(v-if="currentStatisticId === 3")
      | Jo 3

    // Go Through Stats
    div
      span(v-for='head in stats.header') {{ head }};
      div(v-for='(tr, i) in stats.data')
        span {{ i }}
        span(v-for='td in tr') {{ td }};

    // If Stats-Survey
    template(v-if='stats.surveys')
      div(v-for="survey in stats.surveys")
        q-table(
          :columns="survey.questions"
          :data="survey.awnsers"
          :pagination="pagination"
          dense
        )
    
    // If Stats
    q-markup-table(dense cell)
      thead
        tr
          th
          th(v-for='head in stats.header') {{ head }}
      tbody
        tr(v-for='(tr, i) in stats.data')
          td {{ i }}
          td(v-for='td in tr') {{ td }}
    div.code.c_code(style='max-height: unset;') {{ stats }}
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {

  data () {
    return {
      // IDs
      surveyIds: [],
      stats: null,

      // 
      currentStatisticId: null,

      // Statistic Buttons
      statistics: [
        {
          id: 1,
          label: "Statistic 1. Blank Excel"
        },
        {
          id: 2,
          label: "Statistic 2. Blank Excel"
        },
        {
          id: 3,
          label: "Statistic 3. Table format full Redundant Query"
        }
      ],
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 2,
        rowsPerPage: null
        // rowsNumber: xx if getting data from a server
      }
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },

  mounted: function () {
    this.initUrlQuerys()
  },

  methods: {

    log (data) {
      console.log(data)
    },

    initUrlQuerys () {
      try {
        this.surveyIds = this.$route.query.ids
      } catch {
        alert('Error - no IDs')
      }
    },

    showLoader () {
      this.$q.loading.show({
        delay: 0,
        message: this.$t('loading.statistics')
      })
    },

    hideLoader () {
      this.$q.loading.hide()
    },

    getSurveyStatistics (type = 1, surveyIds = this.surveyIds) {
      // Loader
      this.showLoader()

      // Ajax Call
      axios
        .post('/api/backend/surveys-statistics', {
          type: type,
          ids: surveyIds
        })
        .then((res) => {
          this.stats = res.data
          this.currentStatisticId = type
        })
        .catch((e) => {
          this.$q.notify({
            message: this.$t(e),
            caption: 'Error',
            type: 'negative',
            position: 'top',
            timeout: 10000,
            progress: true
          })
        }).then(() => {
          this.hideLoader()
        })
    }
  }

}
</script>
