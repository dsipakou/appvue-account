<template>
  <LineChart v-if="renderComponent" ref="chartRef" :chartData="chartData" />
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
} from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import { format } from 'date-fns';
import { ChartRange } from '@/store/constants';
import { Rate, Currency } from '@/types';

Chart.register(...registerables);

const RangeMapping = {
  [ChartRange.Month]: 30,
  [ChartRange.Quater]: 90,
};

const ColorMapping: { [key: string]: string } = {
  USD: 'rgba(54, 162, 235, 0.8)',
  EUR: 'rgba(153, 102, 255, 0.8)',
  RUB: 'brown',
  PLN: 'burlywood',
};

export default defineComponent({
  name: 'Home',

  components: { LineChart },

  props: {
    ratesList: { type: Array as PropType<Array<Rate>>, required: true },
    currencyList: { type: Array as PropType<Array<Currency>>, required: true },
    selectedCurrencies: { type: Array as PropType<Array<string>>, required: true },
    range: { type: String as PropType<ChartRange>, default: ChartRange.Month },
  },

  data() {
    return {
      renderComponent: true,
    };
  },

  setup() {
    const chartRef = ref();

    return { chartRef };
  },

  computed: {
    currencyIds() {
      const ids: number[] = [];

      this.selectedCurrencies.forEach((currency: string) => {
        const currencyId = this.currencyList.find(
          (item: Currency) => item.code === currency,
        )?.id || -1;

        if (currencyId >= 0) ids.push(currencyId);
      });

      return ids;
    },

    chartData() {
      const dataset: object[] = [];
      this.currencyIds.forEach((id) => {
        const data = this.ratesList.filter((item: Rate) => (
          item.currencyId === id
        )).map((item: Rate) => item.rate).slice(0, RangeMapping[this.range]).reverse();
        const { code } = this.currencyList.find((item: Currency) => item.id === id)!;
        const borderColor = ColorMapping[code] || 'black';
        const chartItem = {
          data,
          cubicInterpolationMode: 'monotone',
          borderColor,
          label: code,
          tension: 0.4,
          position: 'start',
        };
        dataset.push(chartItem);
      });

      return {
        labels: [...this.ratesList.filter((item: Rate) => (
          item.currencyId === 7
        )).map((item: Rate) => format(new Date(item.rateDate), 'yyyy-MM-dd'))].slice(0, RangeMapping[this.range]).reverse(),

        datasets: dataset,
      };
    },
  },

  watch: {
    chartData() {
      this.renderComponent = false;
      this.$nextTick(() => { this.renderComponent = true; });
    },
  },
});
</script>
