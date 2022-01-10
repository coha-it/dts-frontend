<template lang="pug">
.quasar_table
  template(v-if="stats.surveys")
    div(v-for="survey in stats.surveys")
      q-table(
        :columns="survey.questions",
        :data="survey.answers",
        :pagination="pagination",
        dense
      )
</template>

<script>
export default {
  props: ['stats']
}
</script>
