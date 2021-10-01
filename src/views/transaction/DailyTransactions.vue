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
    <div class="row q-ma-lg justify-center">
      <div class="col-6">
        <q-pagination outline
          padding="sm md"
          class="days-pagination"
          color="grey"
          text-color="black"
          :max="30"
          :max-pages="9"
          :boundary-numbers="false"
          :ellipses="false"
          direction-links
          v-model="activeDay">
        </q-pagination>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <TransactionList
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
            <span class="header__title">Transactions on {{ activeDay }}</span>
          </template>
        </TransactionList>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import { ref } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import TransactionList from '@/views/transaction/components/TransactionList.vue';

export default {
  name: 'DailyTransactions',
  inheritAttrs: false,

  components: {
    TransactionList,
  },

  setup() {
    return {
      activeDay: ref(moment().date()),
      activeMonth: ref(moment().month()),
    };
  },

  data() {
    return {
      transactions: [],
      selectedCurrencies: [],
      selectedDay: '',
      selectedDayRates: [],
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
      'transactionArchiveMonth',
    ]),

    days() {
      return Array.from({ length: moment().daysInMonth() }, (_, i) => i + 1);
    },

    months() {
      return moment.months().map((item, index) => (
        {
          name: item.charAt(0).toUpperCase() + item.slice(1),
          id: index,
        }
      ));
    },
  },

  watch: {
    activeDay() {
      this.selectedDay = this.activeDay < 10 ? `0${this.activeDay}` : this.activeDay;
      this.filterTransactions();
    },

    activeMonth() {
      this.setTransactionArchiveMonth(this.activeMonth.id);
    },
  },

  methods: {
    ...mapActions([
      'fetchTransactions',
      'fetchCurrencies',
      'setTransactionArchiveMonth',
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
  },

  beforeMount() {
    this.clearTransactions();
    this.fetchCurrencies();
  },

  mounted() {
    this.selectedDay = this.activeDay < 10 ? `0${this.activeDay}` : this.activeDay;
    this.filterTransactions();
    if (this.transactionArchiveMonth) {
      this.activeMonth = this.transactionArchiveMonth;
    }
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
