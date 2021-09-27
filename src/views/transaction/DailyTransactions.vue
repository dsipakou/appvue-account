<template>
  <div class="q-pa-md">
    <div class="row q-ma-sm justify-center">
      <q-btn flat no-caps
        class="text-primary text-weight-bold"
        label="< Transactions"
        to="/transactions"/>
      <span class="text-h4">Daily Transactions</span>
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
    };
  },

  data() {
    return {
      transactions: [],
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
    ]),

    days() {
      return Array.from({ length: moment().daysInMonth() }, (_, i) => i + 1);
    },
  },

  watch: {
    activeDay() {
      this.filterTransactions();
    },
  },

  methods: {
    ...mapActions([
      'fetchTransactions',
      'updateTransaction',
      'deleteTransaction',
    ]),

    filterTransactions() {
      const day = this.activeDay < 10 ? `0${this.activeDay}` : this.activeDay;
      const selectedDate = `${moment().format('YYYY-MM')}-${day}`;
      this.fetchTransactions({
        sorting: 'added',
        dateFrom: selectedDate,
        dateTo: selectedDate,
      });
    },
  },

  mounted() {
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
