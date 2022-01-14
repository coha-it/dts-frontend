<template lang="pug">
div
  h1 Statistics View

  | Wähle Statstiken für die Umfragen mit der ID: {{ surveyIds }}
  br

  .q-gutter-md.row.items-start
    q-select(
      filled
      v-model="selectedStatistic"
      use-input
      input-debounce="0",
      :label="$t('select_statistic_type')",
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
          @click="selectedStatistic = null"
        )
    q-input(
      v-model="limit"
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
      :error="!!limit"
      error-message="Warning: ein Limit beschränkt die Ausgabe der Ergebnisse"
    )

  // Load Statitics Button
  br
  q-btn(
    :label="(data ? 'Reload' : 'Load') + ' Statistics'",
    outline,
    unelevated,
    no-caps,
    :icon="data ? 'cached' : 'download'",
    :disable="!selectedStatistic || $q.loading.isActive",
    @click="getSurveyStatistics"
  )

  StatisticView(
    v-if="data"
    :data="data"
  )
</template>

<script>
import axios from "axios"
import { exportFile } from 'quasar'
import StatisticView from '@/components/Backend/Statistics/StatisticView.vue'

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
    id: 'answer_options',
    label: "Answer Options",
    value: "Get all selected Answer Options",
    description: "Default statistic. each answer-option",
    icon: "data_usage",
  },
  {
    id: 'csv_type',
    label: "Blank Excel",
    value: "Blank Excel",
    description: "User1; User2; User 3; ... User47; etc",
    icon: "bar_chart",
  },
  {
    id: 'user_table',
    label: "User Table",
    value: "User Table",
    description: "Each Row one User",
    icon: "leaderboard",
  },
  {
    id: 'sql_query',
    label: "SQL Query",
    value: "For a full redundant SQL-Query",
    description: "Table format full Redundant Query",
    icon: "insights",
  },
  {
    id: 'debug',
    label: "Debugging",
    value: "Testing",
    description: "Only for Testing and Debug",
    icon: "analytics",
  },
  {
    id: 'error',
    label: "Error",
    value: "Error Stats - No Valid Data",
    description: "Should return an Error",
    icon: "error",
  },
];

export default {

  components: {
    StatisticView,
  },

  data() {
    return {
      // IDs
      data: null,

      // Selected View
      selectedStatistic: null,
      currentStatisticId: null,

      // Statistic Options
      statistics: constStatistics,

      // Filter Data
      limit: null,

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
    this.selectedStatistic = constStatistics.find(e => e.id == this.statisticId)

    if(this.selectedStatistic) {
      this.getSurveyStatistics()
    }
  },

  computed: {
    surveyIds() {
      return this.$route?.params?.survey_ids?.split(',')
    },
    statisticId() {
      return this.$route?.params?.statistic_id
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
      const survey_ids = this.surveyIds
      const statistic_id = this.statisticId
      const limit = this.limit

      // Ajax Call
      axios
        .post("/api/backend/surveys-statistics", {
          survey_ids,
          statistic_id,
          limit
        })
        .then((res) => {
          this.data = res.data
          this.currentStatisticId = statistic_id
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
    exportTable (data = this.data) {

      // naive encoding to csv format
      const content = [ data.header.map(col => wrapCsvValue(col)).join(';') ].concat(
        data.data.map(row => data.header.map(col => wrapCsvValue(
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