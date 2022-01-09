<script>
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,

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