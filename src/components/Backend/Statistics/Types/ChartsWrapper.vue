<template lang="pug">
.charts-wrapper
  Charts(
    v-for="id in q_ids"
    :key="id"
    :question_id="id"
    :stats="stats.filter(e => e.question_id === id)"
  )
</template>

<script>
import Charts from "@/components/Backend/Statistics/Types/Charts.vue";

export default {
  props: [
    "stats"
  ],

  components: {
    Charts,
  },

  computed: {
    q_ids () {
      console.log('q_ids', this.stats.map(e => e.question_id))
      return this.stats.map(e => e.question_id)
    },
  },
};
</script>