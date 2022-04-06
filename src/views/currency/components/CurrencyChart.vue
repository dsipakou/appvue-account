<template>
  <LineChart :chartData="chartData" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import { format } from 'date-fns';
// import { ChartRange } from '@/store/constants';

Chart.register(...registerables);

/* const RangeMapping = {
  [ChartRange.Month]: 30,
  [ChartRange.Quater]: 90,
}; */

const ColorMapping = {
  USD: 'rgba(54, 162, 235, 0.2)',
  EUR: 'rgba(153, 102, 255, 0.2)',
  RUB: 'brown',
  PLN: 'burlywood',
};

export default defineComponent({
  name: 'Home',

  components: { LineChart },

  props: {
    ratesList: { type: Array, required: true },
    currencyList: { type: Array, required: true },
    selectedCurrencies: { type: Array, required: true },
    range: { type: String, default: Range.Month },
  },

  setup() {
    const testData = {
      labels: ['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre'],
      datasets: [
        {
          data: [30, 40, 60, 70, 5],
          backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
        },
      ],
    };

    return { testData };
  },

  computed: {
    chartData() {
      return {
        labels: [...this.ratesList.filter((item) => (
          item.currencyId === 7
        )).map((item) => format(new Date(item.rateDate), 'yyyy-MM-dd'))].slice(0, 40),
        datasets: [
          {
            data: [...this.ratesList.filter((item) => (
              item.currencyId === 2
            )).map((item) => item.rate)].slice(0, 40),
            cubicInterpolationMode: 'monotone',
            borderColor: ColorMapping.USD,
            label: 'USD',
          },
          {
            data: [...this.ratesList.filter((item) => (
              item.currencyId === 4
            )).map((item) => item.rate)].slice(0, 40),
            cubicInterpolationMode: 'monotone',
            borderColor: ColorMapping.EUR,
            label: 'EUR',
          },
        ],
      };
    },
  },
});
</script>
