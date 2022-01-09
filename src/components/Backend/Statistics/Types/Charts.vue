<template lang="pug">
.charts
  h1 {{ question_title }}
  Chart(
    v-if="enable"
    :stats="stats"
    :question="question"
    :question_id="id"
    :question_title="question_title"
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

    id () {
      return this.question_id
    },

    question () {
      return this.stats.find(e => e.question_id == this.id)
    },

    question_title () {
      return this.question?.question_title
    },

    enable () {
      return !["info_only", 'comment_only'].includes(this.question?.question_format)
    },

  },

  mounted () {
    console.log(this.question, this.enable)
  },

}
</script>
