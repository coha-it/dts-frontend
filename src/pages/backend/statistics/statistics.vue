<template lang="pug">
div
  h1 Statistics

  q-tabs.text-grey(
    v-model="tab"
    align="justify"
    class="q-mb-lg"
    active-color="primary"
    indicator-color="grey"
    narrow-indicator
  )
    q-tab(name='surveys' label='Surveys')
    q-tab(name='statistics' label='Statistics')
  q-separator
  q-tab-panels(v-model='tab' animated='' keep-alive)
    q-tab-panel(name='surveys')
      .text-h6 Surveys
      StatisticSelectSurvey(:initUrlQuerys="initUrlQuerys")

    q-tab-panel(name='statistics')
      .text-h6 Statistics
      StatisticStatistics(:initUrlQuerys="initUrlQuerys")

</template>
<script>
// import axios from 'axios'
// import { mapGetters } from 'vuex'

import StatisticSelectSurvey from '@/components/Backend/StatisticSelectSurvey'
import StatisticStatistics from '@/components/Backend/StatisticStatistics'

export default {

  components: {
    StatisticSelectSurvey,
    StatisticStatistics
  },

  data () {
    return {

      // Tabs
      tab: 'surveys',
    }
  },

  created: function () {
    if (this.$route?.query?.ids) {
      this.tab = 'statistics'
    }
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
  }

}
</script>
