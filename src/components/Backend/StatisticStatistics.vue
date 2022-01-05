<template lang="pug">
div
  template(v-if="surveyIds")
    | Wähle Statstiken für die Umfragen mit der ID: {{ surveyIds }}
    br

  .q-gutter-md.row.items-start
    q-select(
      filled
      v-model="selectedStatistic"
      use-input
      input-debounce="0",
      label="Select Statistic",
      :options="statistics",
      style="width: 250px",
      behavior="menu",
      @filter="filterFn"
      @input="statisticChanged"
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
          v-if="selectedStatistic !== null",
          name="clear",
          @click.stop="selectedStatistic = null"
        )
    q-input(
      v-model="filterData.limit"
      filled
      use-input
      type="number"
      label="Limit"
      color="orange"
      placeholder="Kein Limit"
      style="max-width: 200px"
      clearable
      bottom-slots
      hint="Limitieren Sie die Ausgabe"
      :error="!!filterData.limit"
      error-message="Warning: ein Limit beschränkt die Ausgabe der Ergebnisse"
    )

  // Load Statitics Button
  br
  q-btn(
    :label="(stats ? 'Reload' : 'Load') + ' Statistics'",
    outline,
    unelevated,
    no-caps,
    :icon="stats ? 'cached' : 'download'",
    :disable="!selectedStatistic || $q.loading.isActive",
    @click="getSurveyStatistics"
  )

  // If Stats
  template(v-if="stats")
    q-select(
      filled
      v-model="selectedView"
      use-input
      input-debounce="0",
      label="Select View",
      :options="views",
      style="width: 250px",
      behavior="menu"
    )

    template
      // Go Through Stats
      div(v-if="selectedView.id === 1")
        span(v-for="head in stats.header") {{ head }};
        div(v-for="(tr, i) in stats.data")
          span {{ i }}
          span(v-for="td in tr") {{ td }};

      // If Stats-Survey
      div(v-else-if="selectedView.id === 2")
        template(v-if="stats.surveys")
          div(v-for="survey in stats.surveys")
            q-table(
              :columns="survey.questions",
              :data="survey.awnsers",
              :pagination="pagination",
              dense
            )
      div(v-else-if="selectedView.id === 3")
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
      div(v-else-if="selectedView.id === 4")
        .code.c_code(style="max-height: unset") {{ stats }}
</template>

<script>
import axios from "axios"
import { exportFile } from 'quasar'

// import { mapGetters } from 'vuex'

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0
    ? formatFn(val)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

const constStatistics = [
  {
    id: 1,
    label: "Statistic 1. BE",
    value: "Blank Excel",
    description: "User1; User2; User 3; ... User47; etc",
    icon: "bar_chart",
  },
  {
    id: 2,
    label: "Statistic 2. UT",
    value: "User Table",
    description: "Each Row one User",
    icon: "leaderboard",
  },
  {
    id: 3,
    label: "Statistic 3. FR",
    value: "For a full redundant SQL-Query",
    description: "Table format full Redundant Query",
    icon: "insights",
  },
  {
    id: 4,
    label: "Statistic 4. TT",
    value: "Testing",
    description: "Only for Testing and Debug",
    icon: "analytics",
  },
  {
    id: 99,
    label: "Statistic 99. ER",
    value: "Error Stats - No Valid Data",
    description: "Should return an Error",
    icon: "error",
  },
];

export default {
  data() {
    return {
      // IDs
      stats: null,

      // Selected View
      selectedStatistic: null,
      currentStatisticId: null,
      selectedView: 1,

      // Statistic Options
      statistics: constStatistics,
      views: [
        {
          id: 1,
          label: "View 1",
          value: "View 1",
          description: "View 1",
          icon: "insights",
        },
        {
          id: 2,
          label: "View 2",
          value: "View 2",
          description: "View 2",
          icon: "insights",
        },
        {
          id: 3,
          label: "Markup-Table",
          value: "View 3 - Markup Table",
          description: "Markuptable!",
          icon: "insights",
        },
        {
          id: 4,
          label: "Blank JSON",
          value: "View 4",
          description: "View 4 - Blank Json",
          icon: "insights",
        },
      ],

      // Filter Data
      filterData: {
        limit: null
      },

      // Pagination
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 2,
        rowsPerPage: null,
        // rowsNumber: xx if getting data from a server
      },
    };
  },

  mounted () {
    this.selectedStatistic = this.statisticId
  },

  computed: {
    surveyIds() {
      return this.$route?.params?.survey_ids?.split(',')
    },
    statisticId() {
      return this.$route?.params?.statistic_id?.split(',')
    },
  },

  methods: {
    statisticChanged (statistic) {
      this.$router.replace({ params: {statistic_id: statistic.id} })
    },
    showLoader () {
      this.$q.loading.show({
        delay: 0,
        message: this.$t("loading.statistics"),
      });
    },

    hideLoader () {
      this.$q.loading.hide();
    },

    getSurveyStatistics () {
      // If there is no Selected Statistic
      if (!this.selectedStatistic) {
        return this.$q.notify({
          message: this.$t("Please select the Statistic-Type"),
          caption: "Error",
          type: "negative",
          position: "top",
          timeout: 10000,
          progress: true,
        });
      }

      // Loader
      this.showLoader();

      // Define IDs for Surveys and Statistic
      const surveyIds = this.surveyIds
      const statisticId = this.statsticId

      // Ajax Call
      axios
        .post("/api/backend/surveys-statistics", {
          type: statisticId,
          ids: surveyIds,
          filter: this.filterData
        })
        .then((res) => {
          this.stats = res.data;
          this.currentStatisticId = statisticId;
        })
        .catch((e) => {
          this.$q.notify({
            message: this.$t(e),
            caption: "Error",
            type: "negative",
            position: "top",
            timeout: 10000,
            progress: true,
          });
        })
        .then(() => {
          this.hideLoader();
        });
    },

    // Filter for Selection of Statistics
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.statistics = constStatistics;

          // with Quasar v1.7.4+
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.statistics = constStatistics.filter(
          (v) =>
            v.label.toLowerCase().indexOf(needle) > -1 ||
            v.description.toLowerCase().indexOf(needle) > -1 ||
            v.value.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    // Compare two Objects
    sameObjects(ob1, ob2) {
      return JSON.stringify(ob1) == JSON.stringify(ob2);
    },

    // Export Table
    exportTable (stats = this.stats) {

      // naive encoding to csv format
      const content = [ stats.header.map(col => wrapCsvValue(col)).join(';') ].concat(
        stats.data.map(row => stats.header.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col === void 0 ? col : col],
          col.format
        )).join(';'))
      ).join('\r\n')

      const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    }
  },
};
</script>