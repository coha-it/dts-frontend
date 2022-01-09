<template lang="pug">
.charts
  Chart(
    v-if="enable"
    :stats="stats"
    :question="question"
    :question_id="question_id"
  )
</template>

<script>
import Chart from "@/components/Backend/Statistics/Types/Chart.vue";

export default {
  props: [
    "stats",
    "question_id"
  ],

  components: {
    Chart,
  },

  data () {
    return {
      loaded: false,
    }
  },

  computed: {
    question () {
      return this.stats.find(e => e.question_id == this.question_id)
    },
    enable () {
      return !["info_only", 'comment_only'].includes(this.question?.question_format)
    },

  },

  // mounted () {},

}
</script>
