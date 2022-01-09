<template lang="pug">
.chart(v-if="loaded")
  h1 {{ question_title }}

  keep-alive(
    v-if="enable"
    v-for="type in chartTypes"
  )
    component(
      :is="type"
      :stats="stats"
      :question_title="question_title"
      :filteredCount="filteredCount"
      :chartData="chartData"
      :options="options"
    )

</template>

<script>
export default {

  props: ["stats", "question", "question_id"],

  data() {
    return {
      // Disable first, then loaded
      loaded: false,

      // Chart Types
      chartTypes: [
        () => import('@/components/Backend/Statistics/Types/Charts/PieChart.vue'),
        () => import('@/components/Backend/Statistics/Types/Charts/BarChart.vue'),
      ],

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

    enable () {
      return !["info_only", 'comment_only'].includes(this.question?.question_format)
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

    this.loaded = true
  },

  methods: {
    filterNulls(arr) {
      return arr;
      // return arr.filter(el => el != null && el != 'null')
    },
  },
};
</script>