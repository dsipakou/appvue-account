<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="header">
        Reports
      </div>
      <q-select outlined dense map-options
        class="q-ml-lg q-pb-md"
        style="max-width: 300px;"
        v-model="selectedCurrency"
        :options="currencyList"
        option-value="id"
        option-label="verbalName">
        <template v-slot:prepend>
          <q-icon name="toll" />
        </template>
      </q-select>
      <q-select outlined dense map-options emit-value
        class="q-ml-lg"
        :options="[{label: 'Income', value: 'INC'}, {label: 'Expenses', value: 'EXP'}]"
        v-model="cashflowType"
      >

      </q-select>
    </div>
    <q-markup-table
      :separator="separator"
      flat
      bordered
      v-show="cashflowType === 'EXP'"
      dense
    >
      <thead>
        <tr>
          <th>Days</th>
          <th
            v-for="month in monthSequence"
            :key="month"
            class="text-left">
            {{ month }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          :key="dayNumber"
          v-for="dayNumber in daySequence"
          class="text-center">
          <td>{{ dayNumber }}</td>
          <td
            v-for="month in monthSequence"
            :class="isToday(month, dayNumber) ? 'current-day' : ''"
            :key="month">
            {{ currentDayAmount(month, dayNumber) }}
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <div v-show="cashflowType === 'INC'">
      <Income />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import {
  addMonths,
  format,
  isSameDay,
  parse,
} from 'date-fns';
import Income from '@/views/reports/components/Income.vue';

export default {
  name: 'Reports',

  components: {
    Income,
  },

  setup() {
    return {
      cashflowType: ref('EXP'),
    };
  },

  data() {
    return {
      selectedCurrency: {},
    };
  },

  computed: {
    ...mapGetters([
      'categoryList',
      'currencyList',
      'currencyListLoaded',
      'groupedTransactionList',
    ]),

    baseCurrency() {
      return this.currencyList.find((item) => item.isBase);
    },

    mainCategories() {
      const categories = this.categoryList.filter((item) => (
        item.isParent
      ));
      return categories;
    },

    daySequence() {
      const numbers = [];
      for (let i = 1; i <= 31; i += 1) {
        numbers.push(i);
      }
      return numbers;
    },

    monthSequence() {
      const months = [];
      for (let i = 11; i >= 0; i -= 1) {
        months.push(`${moment().subtract(i, 'month').year()}-${moment().subtract(i, 'month').month() + 1}`);
      }
      return months;
    },
  },

  methods: {
    ...mapActions([
      'fetchCurrencies',
      'fetchGroupedTransaction',
      'fetchIncome',
    ]),

    currentDayAmount(month, day) {
      const sums = this.groupedTransactionList.filter((item) => (
        item.day <= day && item.month === month
      ));
      const overall = sums.reduce((acc, item) => (
        acc + item.groupedAmount
      ), 0);
      return overall.toFixed(2);
    },

    isToday(month, day) {
      const parsedDate = parse(`${month}-${day}`, 'yyyy-M-dd', new Date());
      return isSameDay(parsedDate, new Date());
    },
  },

  watch: {
    selectedCurrency() {
      if (this.currencyListLoaded) {
        const dateFrom = this.monthSequence[0];
        const dateTo = format(addMonths(new Date(dateFrom), 12), 'yyyy-MM');
        const { code } = this.selectedCurrency;
        this.fetchGroupedTransaction({ dateFrom, dateTo, currency: code });
      }
    },
    currencyListLoaded() {
      if (this.currencyListLoaded) {
        this.selectedCurrency = this.baseCurrency;
      }
    },
  },

  mounted() {
    const dateFrom = this.monthSequence[0];
    const dateTo = format(addMonths(new Date(dateFrom), 12), 'yyyy-MM');
    this.fetchCurrencies();
    this.fetchIncome({ dateFrom, dateTo });
    this.selectedCurrency = this.baseCurrency;
    this.fetchGroupedTransaction({ dateFrom, dateTo, currency: 'USD' });
  },
};
</script>
<style scoped>
.header {
  font-size: 24px;
}

.current-day {
  font-weight: 900;
  background-color: cadetblue;
}
</style>
