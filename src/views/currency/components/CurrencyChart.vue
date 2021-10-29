<script>
import { Line } from 'vue3-chart-v2';

export default {
  name: 'CurrencyChart',

  extends: Line,

  props: {
    ratesList: { type: Array, required: true },
    currencyList: { type: Array, required: true },
  },

  data: () => ({
    chartdata: {
      labels: [],
      datasets: [],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  }),

  mounted() {
    const currencyId = this.currencyList.find((item) => item.code === 'USD')?.id;
    const currList = this.ratesList.filter((item) => item.currencyId === currencyId);
    this.chartdata.labels.push(
      this.currList?.map((item) => item.rateDate),
    );
    this.chartdata.datasets.push({
      label: 'USD',
      data: currList.map((item) => item.rate)?.slice(0, 20),
    });
    console.log(currList);
    console.log(this.currencyList.find((item) => item.code === 'USD'));

    this.renderChart(this.chartdata, this.options);
  },
};
</script>
