<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,

  props: [
    "stats",
    "question_title",
    "filteredCount",
    "chartData",
    "options",
  ],

  mounted() {
    this.renderChart(this.chartData, this.options);
  },

};
</script>