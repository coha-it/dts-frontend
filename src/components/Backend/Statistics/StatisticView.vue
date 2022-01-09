<template lang="pug">
// If Stats
.statistics
  q-select(
    filled
    v-model="selectedView"
    use-input
    input-debounce="0",
    label="Select View",
    :options="views",
    style="width: 250px",
    behavior="menu"
    @input="viewChanged"
  )
    // Options
    template(v-slot:option="scope")
      q-item(v-bind="scope.itemProps", v-on="scope.itemEvents")
        q-item-section(avatar)
          q-icon(:name="scope.opt.icon")
        q-item-section
          q-item-label(v-html="scope.opt.label")
          q-item-label(caption) {{ scope.opt.description }}
    // Nothing Selected
    template(v-slot:no-option="")
      q-item
        q-item-section.text-grey
          | No results
    // Clear Button
    template(v-slot:append)
      q-icon.cursor-pointer(
        v-if="selectedView !== null",
        name="clear",
        @click="selectedView = null"
      )

  template(v-if="selectedView")
    // Go Through Stats

    Csv(
      v-if="viewId === 'csv'"
      :stats="stats"
    )
    Charts(
      v-else-if="viewId === 'charts'"
      :stats="stats"
    )
    QuasarTable(
      v-else-if="selectedView.id === 'quasar_table'"
      :stats="stats"
    )
    MarkupTable(
      v-else-if="selectedView.id === 'markup_table'"
      :stats="stats"
    )
    Json(
      v-else-if="selectedView.id === 'json'"
      :stats="stats"
    )
</template>

<script>

import Csv from '@/components/Backend/Statistics/Types/Csv.vue'
import Charts from '@/components/Backend/Statistics/Types/Charts.vue'
import QuasarTable from '@/components/Backend/Statistics/Types/QuasarTable.vue'
import MarkupTable from '@/components/Backend/Statistics/Types/MarkupTable.vue'
import Json from '@/components/Backend/Statistics/Types/Json.vue'

const constViews = [
  {
    id: 'charts',
    label: "Chart View",
    value: "Chart View",
    description: "Chart View",
    icon: "stacked_bar_chart",
  },
  {
    id: 'csv',
    label: "CSV-View",
    value: "CSV",
    description: "CSV like View with Comma , seperated",
    icon: "list",
  },
  {
    id: 'markup_table',
    label: "Markup-Table",
    value: "View 3 - Markup Table",
    description: "The Markup Table!",
    icon: "table_rows",
  },
  {
    id: 'quasar_table',
    label: "Quasar-Table",
    value: "View 3 - Quasar Table",
    description: "The Quasar Table!",
    icon: "table_rows",
  },
  {
    id: 'json',
    label: "JSON",
    value: "Blank",
    description: "Blank Json",
    icon: "data_object",
  },
];

export default {

  props: {
    stats: {
      type: Object,
      required: true,
    }
  },

  components: {
    Csv,
    Charts,
    QuasarTable,
    MarkupTable,
    Json,
  },

  data () {
    return {
      // Selected View
      selectedView: 1,

      // Views
      views: constViews,
    }
  },

  computed: {
    viewId() {
      return this.$route?.params?.view_id
    },
  },

  mounted () {
    this.selectedView = constViews.find(e => e.id == this.viewId)
  },

  methods: {
    viewChanged (view) {
      this.$router.replace({ params: {view_id: view.id} })
    },
  }
}
</script>
