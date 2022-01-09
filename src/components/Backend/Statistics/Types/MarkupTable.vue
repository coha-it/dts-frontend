<template lang="pug">
.markup_table
  q-markup-table(dense, cell)
    thead
      tr
        th
        th(v-for="head in stats.header") {{ head }}
    tbody
      tr(v-for="(tr, i) in stats.data")
        td {{ i }}
        td(v-for="td in tr") {{ td }}
  q-btn(color="primary" icon-right="archive" label="Export to csv" no-caps @click="exportTable(stats)")
</template>

<script>
export default {
  props: ['stats']
}
</script>
