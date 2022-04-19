<template>
  <LineChart
    v-if="renderComponent"
    ref="chartRef"
    :chartData="chartData"
    class="chart-container"
    />
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
} from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import { ChartRange } from '@/store/constants';
import { Rate, Currency } from '@/types';

interface RateItem {
    rateDate: string,
    rate: number,
}

interface RateDetails {
    currencyUuid: string,
    data: RateItem[],
}

Chart.register(...registerables);

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
    data: { type: Array as PropType<Array<RateDetails>>, required: true },
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
      const uuids: string[] = [];

      this.selectedCurrencies.forEach((currency: string) => {
        const currencyUuid = this.currencyList.find(
          (item: Currency) => item.code === currency,
        )?.uuid || '';

        if (currency !== '') uuids.push(currencyUuid);
      });

      return uuids;
    },

    chartData() {
      const dataset: object[] = [];
      this.currencyIds.forEach((currencyUuid) => {
        const rateDetails = this.data.find(
          (details: RateDetails) => details.currencyUuid === currencyUuid,
        );
        const data = rateDetails?.data.map((item: RateItem) => item.rate).reverse();
        console.log(data);
        const { code } = this.currencyList.find((item: Currency) => item.uuid === currencyUuid)!;
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

      const chartLabels = this.data[0]?.data.map((item: RateItem) => item.rateDate).reverse();

      return {
        labels: chartLabels,
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
<style>
.chart-container {
  width: 100%;
}
</style>
