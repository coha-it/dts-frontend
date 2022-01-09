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

    keep-alive
      component(
        :is="selectedView.component"
        :stats="stats"
      )

</template>

<script>

const constViews = [
  {
    id: 'charts',
    label: "Chart View",
    value: "Chart View",
    description: "Chart View",
    icon: "stacked_bar_chart",
    component: () => import('@/components/Backend/Statistics/Types/Charts.vue'),
  },
  {
    id: 'csv',
    label: "CSV-View",
    value: "CSV",
    description: "CSV like View with Comma , seperated",
    icon: "list",
    component: () => import('@/components/Backend/Statistics/Types/Csv.vue'),
  },
  {
    id: 'markup_table',
    label: "Markup-Table",
    value: "View 3 - Markup Table",
    description: "The Markup Table!",
    icon: "table_rows",
    component: () => import('@/components/Backend/Statistics/Types/MarkupTable.vue'),
  },
  {
    id: 'quasar_table',
    label: "Quasar-Table",
    value: "View 3 - Quasar Table",
    description: "The Quasar Table!",
    icon: "table_rows",
    component: () => import('@/components/Backend/Statistics/Types/QuasarTable.vue'),
  },
  {
    id: 'json',
    label: "JSON",
    value: "Blank",
    description: "Blank Json",
    icon: "data_object",
    component: () => import('@/components/Backend/Statistics/Types/Json.vue'),
  },
];

export default {

  props: {
    stats: {
      type: Object,
      required: true,
    }
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
