<script>
import { Line } from 'vue3-chart-v2';
import { format, parse } from 'date-fns';

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
      datasets: [{ label: 'hello', data: [1, 2, 3] }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  }),

  methods: {
    updateChart() {
      const currencyId = this.currencyList.find((item) => item.code === 'USD')?.id;
      const eurId = this.currencyList.find((item) => item.code === 'EUR')?.id;
      const currList = this.ratesList.filter((item) => item.currencyId === currencyId);
      const eurList = this.ratesList.filter((item) => item.currencyId === eurId);
      const labels = currList?.map((item) => {
        const parsed = parse(item.rateDate, 'yyyy-MM-dd\'T\'HH:mm:ssX', new Date());
        const formatted = format(parsed, 'MMM-dd');
        return formatted;
      })?.slice(0, 30).reverse();
      const dataList = currList.map((item) => item.rate)?.slice(0, 30).reverse();
      const eurDataList = eurList.map((item) => item.rate)?.slice(0, 30).reverse();
      const dataSetData = {
        label: 'USD',
        backgroundColor: '#f87979',
        borderColor: '#153645',
        data: dataList,
      };
      const eurSetData = {
        label: 'EUR',
        data: eurDataList,
      };
      this.chartdata = {
        labels,
        datasets: [dataSetData, eurSetData],
      };
    },
  },

  mounted() {
    this.renderChart(this.chartdata, this.options);
  },

  watch: {
    ratesList() {
      if (this.currencyList.length > 0 && this.ratesList.length > 0) {
        this.updateChart();
        this.renderChart(this.chartdata, this.options);
      }
    },
  },
};
</script>
