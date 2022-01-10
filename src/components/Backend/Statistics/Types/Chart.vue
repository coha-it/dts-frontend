<template lang="pug">
.chart(v-if="loaded")
  h1 {{ question_title }}

  div(v-if="info_only")
    .text-subtitle1 {{ question_subtitle }}
    .text-overline Question-ID: \#{{ question_id }} Question Format: {{ question_format }}
    .text-body1(v-html="question_description")

  keep-alive(v-else, v-for="type in chartTypes")
    component(
      :is="type",
      :stats="stats",
      :question_title="question_title",
      :filteredCount="filteredCount",
      :chartData="chartData",
      :options="options"
    )
</template>

<script>
import { colors } from 'quasar'

export default {
  props: ["stats", "question", "question_id"],

  data() {
    return {
      // Disable it first, then set it to loaded
      loaded: false,

      // Chart Types
      chartTypes: [
        () =>
          import("@/components/Backend/Statistics/Types/Charts/PieChart.vue"),
        () =>
          import("@/components/Backend/Statistics/Types/Charts/BarChart.vue"),
      ],

      // Filtering Data
      filteredCount: {},

      // Default Colors
      fallbackColors: 'primary secondary accent error negative info success green positive red orange warning background'.split(' ').map(
        e => colors.getPaletteColor(e)
      )
    };
  },

  computed: {
    filteredValues () {
      return this.filterNulls(Object.values(this.filteredCount));
    },

    filteredKeys () {
      return this.filterNulls(Object.keys(this.filteredCount));
    },

    filteredKeysColor () {
      return this.filteredKeys.map(
        (e) => this.stats.find((x) => x.option_title === e)?.option_color || this.fallbackColors.shift()
      )
    },

    question_title () {
      return this.question?.question_title;
    },

    question_format () {
      return this.question?.question_format;
    },

    question_subtitle () {
      return this.question?.question_subtitle;
    },

    question_description () {
      return this.question?.question_description;
    },


    // enable () {
    //   return !["info_only"].includes(
    //     this.question?.question_format
    //   );
    // },

    info_only () {
      return this.question?.question_format == 'info_only'
    },

    chartData () {
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

    options () {
      return {
        // scales: {
        //   yAxes: [
        //     {
        //       ticks: {
        //         beginAtZero: true,
        //       },
        //       gridLines: {
        //         display: true,
        //       },
        //     },
        //   ],
        //   xAxes: [
        //     {
        //       gridLines: {
        //         display: false,
        //       },
        //     },
        //   ],
        // },
        legend: {
          display: true,
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    },
  },

  mounted() {
    this.stats
      .map((e) => this.question?.question_format === 'comment_only' ? e.awnser_comment : e.option_title)
      .forEach(
        (x) => (this.filteredCount[x] = (this.filteredCount[x] || 0) + 1)
      );

    // this.stats.map(e=>e.awnser_comment).forEach(x => this.commentsCount[x] = (this.commentsCount[x] || 0)+1)

    // console.log(
    //   this.question_title, this.countKeys, this.countValues
    // )

    this.loaded = true;
  },

  methods: {
    filterNulls(arr) {
      return arr;
      // return arr.filter(el => el != null && el != 'null')
    },
  },
};
</script>