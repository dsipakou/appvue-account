<script>
import { Line } from 'vue3-chart-v2';
import { format, parse } from 'date-fns';

export default {
  name: 'CurrencyChart',

  extends: Line,

  props: {
    ratesList: { type: Array, required: true },
    currencyList: { type: Array, required: true },
    selectedCurrencies: { type: Array, required: true },
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
      const datasetsToShow = [];
      let labelsToShow = null;
      Object.values(this.selectedCurrencies).forEach((currency) => {
        const currencyId = this.currencyList.find((item) => item.code === currency)?.id;
        const currList = this.ratesList.filter((item) => item.currencyId === currencyId);
        const labels = currList?.map((item) => {
          const parsed = parse(item.rateDate, 'yyyy-MM-dd\'T\'HH:mm:ssX', new Date());
          const formatted = format(parsed, 'MMM-dd');
          return formatted;
        })?.slice(0, 30).reverse();
        labelsToShow = labels;
        const dataList = currList.map((item) => item.rate)?.slice(0, 30).reverse();
        const dataSetData = {
          label: currency,
          backgroundColor: '#f87979',
          borderColor: '#153645',
          data: dataList,
        };
        datasetsToShow.push(dataSetData);
        this.chartdata = {
          labels,
          datasets: [dataSetData],
        };
      });
      this.chartdata = {
        labels: labelsToShow,
        datasets: datasetsToShow,
      };
    },
  },

  watch: {
    ratesList() {
      if (this.currencyList.length > 0 && this.ratesList.length > 0) {
        this.updateChart();
        this.renderChart(this.chartdata, this.options);
      }
    },

    selectedCurrencies() {
      this.updateChart();
      this.renderChart(this.chartdata, this.options);
    },
  },
};
</script>
