<template lang="pug">
div
  h1 Statistics

  q-select(
    filled=''
    v-model="selectedStatistic"
    use-input=''
    input-debounce='0'
    label='Simple filter'
    :options='statistics'
    style='width: 250px'
    behavior='menu'
    @filter='filterFn'
  )
    // Options
    template(v-slot:option='scope')
      q-item(v-bind='scope.itemProps' v-on='scope.itemEvents')
        q-item-section(avatar)
          q-icon(:name='scope.opt.icon')
        q-item-section
          q-item-label(v-html='scope.opt.label')
          q-item-label(caption) {{ scope.opt.description }}
    // Nothing Selected
    template(v-slot:no-option='')
      q-item
        q-item-section.text-grey
          | No results
    // Clear Button
    template(v-slot:append)
      q-icon.cursor-pointer(v-if='selectedStatistic !== null' name='clear' @click.stop='selectedStatistic = null')

  // Load Statitics Button
  br
  q-btn(
    label="Load Statistics"
    outline
    unelevated
    no-caps
    @click="getSurveyStatistics"
    :disable="!selectedStatistic || $q.loading.isActive")

  // Buttons
  //- template(v-for="statistic in statistics")
  //-   q-btn(
  //-     :label="statistic.label"
  //-     unelevated
  //-     :color="currentStatisticId && currentStatisticId != statistic.id ? 'grey' : 'primary'"
  //-     outline
  //-     no-caps
  //-     @click="getSurveyStatistics(statistic.id)"
  //-   )
  //-   br

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

const constStatistics = [
  {
    id: 1,
    label: "Statistic 1. BE",
    value: 'Blank Excel',
    description: 'User1; User2; User 3; ... User47; etc',
    icon: 'bar_chart'
  },
  {
    id: 2,
    label: 'Statistic 2. UT',
    value: 'User Table',
    description: 'Each Row one User',
    icon: 'leaderboard'
  },
  {
    id: 3,
    label: 'Statistic 3. FR',
    value: 'For a full redundant SQL-Query',
    description: 'Table format full Redundant Query',
    icon: 'analytics'
  },
]

export default {

  data () {
    return {
      // IDs
      surveyIds: [],
      stats: null,

      // 
      selectedStatistic: null,
      currentStatisticId: null,

      // Statistic Options
      statistics: constStatistics,

      // Pagination
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

  watch: {
    selectedStatistic: {
      handler (statistic) {

        // Build Query
        let query = {
          ids: this.$route.query.ids
        }

        // If Statistic is Selected
        if (statistic && statistic.id) {
          query.statistic = String(statistic.id)
        }

        // If unequal Route
        if (!this.sameObjects(query, this.$route.query)) {
          // Push to Router
          this.$router.push({
            name: 'backend.statistic',
            query: query
          });
        }
      }
    }
  },

  methods: {

    log (data) {
      console.log(data)
    },

    initUrlQuerys () {
      try {
        const query = this.$route.query

        if (query) {
          this.surveyIds = query.ids
          this.statisticId = query.statistic
          const statisticId = this.statisticId

          // Get from URL
          this.selectedStatistic = this.statistics.find((x) => x.id == parseInt(statisticId))
        }
      } catch {
        console.log('Error - no IDs')
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


    getSurveyStatistics () {

      if (!this.selectedStatistic) {
        return this.$q.notify({
            message: this.$t('Please select the Statistic-Type'),
            caption: 'Error',
            type: 'negative',
            position: 'top',
            timeout: 10000,
            progress: true
        })
      }

      // Loader
      this.showLoader()

      // Define IDs for Surveys and Statistic
      const surveyIds = this.surveyIds
      const statisticId = this.selectedStatistic.id

      // Ajax Call
      axios
        .post('/api/backend/surveys-statistics', {
          type: statisticId,
          ids: surveyIds
        })
        .then((res) => {
          this.stats = res.data
          this.currentStatisticId = statisticId
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
    },

    // Filter for Selection of Statistics
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.statistics = constStatistics

          // with Quasar v1.7.4+
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.statistics = constStatistics.filter(v =>
          v.label.toLowerCase().indexOf(needle) > -1 ||
          v.description.toLowerCase().indexOf(needle) > -1 ||
          v.value.toLowerCase().indexOf(needle) > -1
        )
      })
    },


    // Compare two Objects
    sameObjects (ob1, ob2) {
      return JSON.stringify(ob1) == JSON.stringify(ob2)
    }

  }

}
</script>
