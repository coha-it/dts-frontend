<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,

  props: [
    "stats",
    "question_title"
  ],

  data() {
    return {
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
    filteredValues () {
      return this.filterNulls(Object.values(this.filteredCount))
    },

    filteredKeys () {
      return this.filterNulls(Object.keys(this.filteredCount))
    },

    filteredKeysColor () {
      return this.filteredKeys.map(e => this.stats.find(x => x.option_title === e)?.option_color)
    },
  },

  mounted() {
    this.stats.map(e=>e.option_title).forEach(x => this.filteredCount[x] = (this.filteredCount[x] || 0)+1)

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
    }

    // console.log(
    //   this.question_title, this.countKeys, this.countValues
    // )

    this.renderChart(this.chartData, this.options);

  },

  methods: {
    filterNulls (arr) {
      return arr
      // return arr.filter(el => el != null && el != 'null')
    }
  }
};
</script>