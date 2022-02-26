<script>
import { Line } from 'vue3-chart-v2';
import { format, parse } from 'date-fns';
import { ChartRange } from '@/store/constants';

const RangeMapping = {
  [ChartRange.Month]: 30,
  [ChartRange.Quater]: 90,
};

const ColorMapping = {
  USD: 'rgba(54, 162, 235, 0.2)',
  EUR: 'rgba(153, 102, 255, 0.2)',
  RUB: 'brown',
  PLN: 'burlywood',
};

export default {
  name: 'CurrencyChart',

  extends: Line,

  props: {
    ratesList: { type: Array, required: true },
    currencyList: { type: Array, required: true },
    selectedCurrencies: { type: Array, required: true },
    range: { type: String, default: Range.Month },
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
        })?.slice(0, RangeMapping[this.range]).reverse();
        labelsToShow = labels;
        const rateMap = currList.map((item) => item.rate);
        const dataList = rateMap?.slice(0, RangeMapping[this.range]).reverse();
        const dataSetData = {
          label: currency,
          backgroundColor: ColorMapping[currency],
          borderColor: 'black',
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

    range() {
      this.updateChart();
      this.renderChart(this.chartdata, this.options);
    },
  },
};
</script>
