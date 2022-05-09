<template>
  <div class="q-pa-md main-container">
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
          :transactions="groupedByParentTransactionsList"
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
      activeDay: ref(null),
      activeMonth: ref(null),
      activeYear: ref(null),
    };
  },

  data() {
    return {
      transactions: [],
      selectedCurrencies: [],
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
      'groupedByParentTransactionsList',
      'transactionArchive',
    ]),
  },

  watch: {
    activeDay() {
      this.setTransactionArchiveDay(this.activeDay);
      this.updateDateInputs();
      this.filterTransactions();
    },

    activeMonth() {
      this.setTransactionArchiveMonth(this.activeMonth.id);
      this.updateDateInputs();
      this.filterTransactions();
    },

    activeYear() {
      this.setTransactionArchiveYear(this.activeYear.id);
      this.updateDateInputs();
      this.filterTransactions();
    },
  },

  methods: {
    ...mapActions([
      'fetchTransactions',
      'fetchCurrencies',
      'fetchGroupedByParentTransaction',
      'setTransactionArchiveDay',
      'setTransactionArchiveMonth',
      'setTransactionArchiveYear',
      'updateTransaction',
      'deleteTransaction',
      'clearTransactions',
    ]),

    filterTransactions() {
      const formattedMonth = String(this.transactionArchive.month).padStart(2, '0');
      const formattedDay = String(this.transactionArchive.day).padStart(2, '0');
      const selectedDate = `${this.transactionArchive.year}-${formattedMonth}-${formattedDay}`;
      this.fetchGroupedByParentTransaction({
        dateFrom: selectedDate,
        dateTo: selectedDate,
      });
    },

    getDays() {
      this.days = [];

      const selectedMonth = this.transactionArchive.month;
      const selectedYear = this.transactionArchive.year;
      for (let i = 0; i < getDaysInMonth(new Date(selectedYear, selectedMonth - 1)); i += 1) {
        this.days.push({ label: i + 1, value: i + 1 });
      }
      if (this.days.length < this.transactionArchive.day) {
        this.setTransactionArchiveDay(1);
        this.activeDay = 1;
      }
    },

    getMonths() {
      this.months = moment.months().map((item, index) => (
        {
          name: item.charAt(0).toUpperCase() + item.slice(1),
          id: index + 1,
        }
      ));
    },

    getYears() {
      this.years = [];
      const currentYear = getYear(new Date());
      for (let i = 0; i < 5; i += 1) {
        this.years.push({
          name: String(currentYear - i),
          id: currentYear - i,
        });
      }
    },

    updateDateInputs() {
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
    this.updateDateInputs();
    this.activeDay = this.transactionArchive.day;
    this.activeMonth = this.months.find((item) => item.id === this.transactionArchive.month);
    this.activeYear = this.years.find((item) => item.id === this.transactionArchive.year);
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
