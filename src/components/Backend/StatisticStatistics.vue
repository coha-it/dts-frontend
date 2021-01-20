<template lang="pug">
div
  template(v-if="getSurveyIds()")
    | Wähle Statstiken für die Umfragen mit der ID: {{ getSurveyIds() }}
    br
  q-select(
    filled="",
    v-model="selectedStatistic",
    use-input="",
    input-debounce="0",
    label="Simple filter",
    :options="statistics",
    style="width: 250px",
    behavior="menu",
    @filter="filterFn"
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
    // Only Stats THREE
    template(v-if="currentStatisticId === 3")
      div jo

    // If not Three
    template(v-else)
      // Go Through Stats
      div
        span(v-for="head in stats.header") {{ head }};
        div(v-for="(tr, i) in stats.data")
          span {{ i }}
          span(v-for="td in tr") {{ td }};

      // If Stats-Survey
      template(v-if="stats.surveys")
        div(v-for="survey in stats.surveys")
          q-table(
            :columns="survey.questions",
            :data="survey.awnsers",
            :pagination="pagination",
            dense
          )
      q-markup-table(dense, cell)
        thead
          tr
            th
            th(v-for="head in stats.header") {{ head }}
        tbody
          tr(v-for="(tr, i) in stats.data")
            td {{ i }}
            td(v-for="td in tr") {{ td }}

      .code.c_code(style="max-height: unset") {{ stats }}
</template>

<script>
import axios from "axios";
// import { mapGetters } from 'vuex'

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
  props: {
    initUrlQuerys: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      // IDs
      stats: null,

      //
      selectedStatistic: null,
      currentStatisticId: null,

      // Statistic Options
      statistics: constStatistics,

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

  watch: {
    selectedStatistic: {
      handler(statistic) {
        // Build Query
        let query = {
          ids: this.$route.query.ids,
        };

        // If Statistic is Selected
        if (statistic && statistic.id) {
          query.statistic = String(statistic.id);
        }

        // If unequal Route
        if (!this.sameObjects(query, this.$route.query)) {
          // Push to Router
          this.$router.push({
            name: "backend.statistics",
            query: query,
          });
        }
      },
    },
  },

  mounted: function () {
    this.initUrlQuerys()
  },

  methods: {
    showLoader() {
      this.$q.loading.show({
        delay: 0,
        message: this.$t("loading.statistics"),
      });
    },

    hideLoader() {
      this.$q.loading.hide();
    },

    getSurveyIds () {
      return this.$route?.query?.ids
    },

    getSurveyStatistics() {
      // Reinit Query URLS
      this.initUrlQuerys()

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
      const surveyIds = this.$route.query.ids
      const statisticId = this.$route.query.statistic

      // Ajax Call
      axios
        .post("/api/backend/surveys-statistics", {
          type: statisticId,
          ids: surveyIds,
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
  },
};
</script>