<template lang="pug">
.chart(v-if="loaded")
  h1 {{ question_title }}

  div(v-if="info_only")
    .text-subtitle1 {{ question_subtitle }}
    .text-overline Question-ID: \#{{ question_id }} Question Format: {{ question_format }}
    .text-body1(v-html="question_description")

  template(v-else)
    .code(v-if="lowestOptionValue") Niedrigster Optionswert: {{ lowestOptionValue }}
    .code(v-if="averageOptionValue") Durchschnittlicher Optionswert: {{ averageOptionValue }}
    .code(v-if="highestOptionValue") Höchster Optionswert: {{ highestOptionValue }}

    .code(v-if="lowestComment") Niedrigster Kommentarswert: {{ lowestComment }}
    .code(v-if="averageComment") Durchschnittlicher Kommentarswert: {{ averageComment }}
    .code(v-if="highestComment") Höchster Kommentarswert: {{ highestComment }}

    .row
      keep-alive.col-6(v-for="(chart, key) in chartTypes", :key="key")
        component(
          :is="chart.component",
          :stats="stats",
          :question_title="question_title",
          :filteredCount="filteredCount",
          :chartData="chartData",
          :options="chart.options"
        )
</template>

<script>
import { colors } from "quasar";
import {_} from 'vue-underscore';

export default {
  props: ["stats", "question", "question_id"],

  data() {
    return {
      // Disable it first, then set it to loaded
      loaded: false,

      // Chart Types
      chartTypes: [
        {
          type: "Pie",
          options: {},
          component: () =>
            import("@/components/Backend/Statistics/Types/Charts/PieChart.vue"),
        },
        {
          type: "Bar",
          options: {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                  gridLines: {
                    display: true,
                  },
                },
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false,
                  },
                },
              ],
            },
            legend: {
              display: true,
            },
            responsive: true,
            maintainAspectRatio: false,
          },
          component: () =>
            import("@/components/Backend/Statistics/Types/Charts/BarChart.vue"),
        },
      ],

      // Filtering Data
      filteredCount: {},

      // Default Colors
      fallbackColors: _
        .map(
          "primary secondary accent error negative info success green positive red orange warning background".split(" "),
          e => colors.getPaletteColor(e)
        )
    };
  },

  computed: {
    lowestOptionValue() {
      return this.calcLowest("option_value");
    },

    lowestComment() {
      return this.calcLowest("answer_comment");
    },

    highestOptionValue() {
      return this.calcHighest("option_value");
    },

    highestComment() {
      return this.calcHighest("answer_comment");
    },

    averageOptionValue() {
      return this.calcAverage("option_value");
    },

    averageComment() {
      return this.calcAverage("answer_comment");
    },

    filteredValues() {
      return this.filterNulls(Object.values(this.filteredCount));
    },

    filteredKeys() {
      return this.filterNulls(Object.keys(this.filteredCount));
    },

    filteredKeysColor() {
      return this.filteredKeys.map(
        (e) =>
          this.stats.find((x) => x.option_title === e)?.option_color ||
          this.fallbackColors.shift()
      );
    },

    question_title() {
      return this.question?.question_title;
    },

    question_format() {
      return this.question?.question_format;
    },

    question_subtitle() {
      return this.question?.question_subtitle;
    },

    question_description() {
      return this.question?.question_description;
    },

    // enable () {
    //   return !["info_only"].includes(
    //     this.question?.question_format
    //   );
    // },

    info_only() {
      return this.question?.question_format == "info_only";
    },

    chartData() {
      return {
        datasets: [
          {
            label: this.question_title,
            backgroundColor: this.filteredKeysColor,
            data: this.filteredValues,
          },
        ],
        labels: this.filteredKeys,
      };
    },
  },

  mounted() {
    this.stats
      .map((e) =>
        this.question?.question_format === "comment_only"
          ? e.answer_comment
          : e.option_title
      )
      .forEach(
        (x) => (this.filteredCount[x] = (this.filteredCount[x] || 0) + 1)
      );

    // this.stats.map(e=>e.answer_comment).forEach(x => this.commentsCount[x] = (this.commentsCount[x] || 0)+1)

    // console.log(
    //   this.question_title, this.countKeys, this.countValues
    // )

    this.loaded = true;
  },

  methods: {
    calcHighest(key) {
      let arr = this.calc(key);
      if (arr?.length) {
        return arr.reduce((a, b) => (a > b ? a : b));
      }
      return false;
    },

    calcLowest(key) {
      let arr = this.calc(key);
      if (arr?.length) {
        return arr.reduce((a, b) => (a < b ? a : b));
      }
      return false;
    },

    calcAverage(key) {
      let arr = this.calc(key)
      if (arr?.length > 0) {
        return (_.reduce(arr, (a,b) => (a + b)) / arr?.length).toFixed(2)
      }
      return false;
    },

    calc(key) {
      return _
        .map(this.stats, e => parseFloat(e[key]))
        .filter(e => !isNaN(e));
    },

    filterNulls(arr) {
      return arr;
      // return arr.filter(el => el != null && el != 'null')
    },
  },
};
</script>