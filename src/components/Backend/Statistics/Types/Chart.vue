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
      filtered: {},

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
      return this.filterNulls(Object.values(this.filtered))
    },

    filteredKeys () {
      return this.filterNulls(Object.keys(this.filtered))
    },

    filteredKeysColor () {
      return this.filteredKeys.map(e => this.stats.find(x => x.option_title === e)?.option_color)
    },
  },

  mounted() {
    this.stats.map(e=>e.option_title).forEach(x => this.filtered[x] = (this.filtered[x] || 0)+1)

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