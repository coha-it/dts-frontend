<template lang="pug">
div
  template(
    v-for="id in q_ids"
  )
    h1 {{ getQuestionTitle(id) }}
    Chart(
      :stats="filteredStats(id)"
      :question="getQuestion(id)"
      :question_id="id"
      :question_title="getQuestionTitle(id)"
    )
</template>

<script>
import Chart from "@/components/Backend/Statistics/Types/Chart.vue";

export default {
  props: ["stats"],

  components: {
    Chart,
  },

  computed: {
    q_ids () {
      return this.stats.map(e => e.question_id)
    },
  },

  methods: {
    getQuestion (id) {
      return this.stats.find(e => e.question_id == id)
    },

    getQuestionTitle (id) {
      return this.getQuestion(id).question_title
    },

    filteredStats (id) {
      return this.stats.filter(e => e.question_id === id)
    },
  }
};
</script>