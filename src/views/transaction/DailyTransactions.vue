<template>
  <div class="q-pa-md">
    <div class="row q-ma-sm justify-center">
      <q-btn flat no-caps
        class="text-primary text-weight-bold"
        label="< Transactions"
        to="/transactions"/>
      <span class="text-h4">Daily Transactions</span>
    </div>
    <div class="row justify-center">
      <div class="col-2 q-mr-lg">
        <q-select dense map-options
          v-model="activeYear"
          option-value="id"
          option-label="name"
          :options="years"
          label="Year"
          />
      </div>
      <div class="col-4">
        <q-select dense map-options
          v-model="activeMonth"
          option-value="id"
          option-label="name"
          :options="months"
          label="Month"
          />
      </div>
    </div>
    <div class="row q-ma-lg justify-right">
      <div class="self-center">
        <q-btn-toggle dense
          v-model="activeDay"
          padding="sm 12px"
          :options="days">
        </q-btn-toggle>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <TransactionGroupedList
          :transactions="transactionList"
          :accountList="accountList"
          :budgetList="budgetList"
          :categoryList="categoryList"
          :currencyList="currencyList"
          :ratesList="ratesList"
          :userList="userList"
          :updateTransaction="updateTransaction"
          :deleteTransaction="deleteTransaction"
          :currencyListLoaded="currencyListLoaded">
          <template v-slot:header>
            <span class="header__title">Transactions: {{ activeDay }}</span>
          </template>
        </TransactionGroupedList>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import { ref } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import TransactionGroupedList from '@/views/transaction/components/TransactionGroupedList.vue';
import {
  getDaysInMonth,
  getDay,
  getMonth,
  getYear,
} from 'date-fns';

export default {
  name: 'DailyTransactions',
  inheritAttrs: false,

  components: {
    TransactionGroupedList,
  },

  setup() {
    return {
      activeDay: ref(getDay(new Date())),
      activeMonth: ref(getMonth(new Date())),
      activeYear: ref(getYear(new Date())),
    };
  },

  data() {
    return {
      transactions: [],
      selectedCurrencies: [],
      selectedDay: '',
      selectedDayRates: [],
      days: [],
      months: [],
      years: [],
    };
  },

  computed: {
    ...mapGetters([
      'accountList',
      'budgetList',
      'categoryList',
      'currencyList',
      'ratesList',
      'userList',
      'currencyListLoaded',
      'transactionList',
      'transactionArchive',
    ]),
  },

  watch: {
    activeDay() {
      this.selectedDay = this.activeDay < 10 ? `0${this.activeDay}` : this.activeDay;
      this.setTransactionArchiveDay(this.activeDay);
      this.filterTransactions();
      this.update();
    },

    activeMonth() {
      this.setTransactionArchiveMonth(this.activeMonth.id);
      this.update();
    },

    activeYear() {
      this.setTransactionArchiveYear(this.activeYear.id);
      this.update();
    },
  },

  methods: {
    ...mapActions([
      'fetchTransactions',
      'fetchCurrencies',
      'setTransactionArchiveDay',
      'setTransactionArchiveMonth',
      'setTransactionArchiveYear',
      'updateTransaction',
      'deleteTransaction',
      'clearTransactions',
    ]),

    filterTransactions() {
      const selectedDate = `${moment().format('YYYY-MM')}-${this.selectedDay}`;
      this.fetchTransactions({
        sorting: 'added',
        dateFrom: selectedDate,
        dateTo: selectedDate,
      });
    },

    getDays() {
      this.days = [];
      const selectedYear = this.transactionArchive.year;
      const selectedMonth = this.transactionArchive.month;

      console.log(selectedYear, selectedMonth);

      for (let i = 0; i < getDaysInMonth(new Date(selectedYear, selectedMonth)); i += 1) {
        this.days.push({ label: i + 1, value: i + 1 });
      }
    },

    getMonths() {
      this.months = moment.months().map((item, index) => (
        {
          name: item.charAt(0).toUpperCase() + item.slice(1),
          id: index,
        }
      ));
    },

    getYears() {
      this.years = [];
      const currentYear = getYear(new Date());
      for (let i = 0; i < 5; i += 1) {
        this.years.push({
          name: String(currentYear - i),
          id: i,
        });
      }
    },

    update() {
      this.getDays();
      this.getMonths();
      this.getYears();
    },
  },

  beforeMount() {
    this.clearTransactions();
    this.fetchCurrencies();
  },

  mounted() {
    this.update();
    if (this.transactionArchive.month) {
      this.activeMonth = this.transactionArchive.month;
    }

    if (this.transactionArchive.day) {
      this.activeDay = this.transactionArchive.day;
    }

    if (this.transactionArchive.year) {
      this.activeYear = this.transactionArchive.year;
    }

    this.selectedDay = this.activeDay < 10 ? `0${this.activeDay}` : this.activeDay;
    this.filterTransactions();
  },
};
</script>
<style scoped>
.header__title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 800;
}

.days-carousel {
  display: flex;
  justify-content: center;
  height: 100px;
  background: none;
}

.header__title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 800;
}
</style>
