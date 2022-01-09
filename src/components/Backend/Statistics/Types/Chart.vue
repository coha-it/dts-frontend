<template lang="pug">
.chart(v-if="enable")
  h1 {{ question_title }}
  BarChart(
    :stats="stats",
    :question_title="question_title",
    :filteredCount="filteredCount",
    :chartData="chartData",
    :options="options",
  )
</template>

<script>
import BarChart from "@/components/Backend/Statistics/Types/Charts/BarChart.vue";

export default {
  components: {
    BarChart,
  },

  props: ["stats", "question", "question_id"],

  data() {
    return {
      // Disable first, then enable
      enable: false,

      // Data
      filteredCount: {},
      // commentsCount: {},

      // Charts
      chartData: {},
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
    };
  },

  computed: {
    filteredValues() {
      return this.filterNulls(Object.values(this.filteredCount));
    },

    filteredKeys() {
      return this.filterNulls(Object.keys(this.filteredCount));
    },

    filteredKeysColor() {
      return this.filteredKeys.map(
        (e) => this.stats.find((x) => x.option_title === e)?.option_color
      );
    },

    question_title() {
      return this.question?.question_title;
    },
  },

  mounted() {
    this.stats
      .map((e) => e.option_title)
      .forEach(
        (x) => (this.filteredCount[x] = (this.filteredCount[x] || 0) + 1)
      );

    // this.stats.map(e=>e.awnser_comment).forEach(x => this.commentsCount[x] = (this.commentsCount[x] || 0)+1)

    this.chartData = {
      datasets: [
        {
          label: this.question_title,
          backgroundColor: this.filteredKeysColor,
          data: this.filteredValues,
        },
      ],
      labels: this.filteredKeys,
    };

    // console.log(
    //   this.question_title, this.countKeys, this.countValues
    // )

    this.enable = true
  },

  methods: {
    filterNulls(arr) {
      return arr;
      // return arr.filter(el => el != null && el != 'null')
    },
  },
};
</script>