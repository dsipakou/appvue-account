<template>
  <div class="row">
    <div class="header">
      <div>
        <q-select
          :options="currenciesListSelect"
          v-model="selectedCurrencies"
          map-options
          multiple
          stack-label
          option-value="id"
          option-label="verbalName"
          style="width: 600px;">
          <template v-slot:selected>
            Currency:
            <q-chip
              v-for="currency in selectedCurrencies"
              :key="currency.id"
              dense
              square
              color="white"
              text-color="primary"
              style="max-width: 100px;"
              class="q-ml-sm overflow-hidden align-center"
              >
              <q-avatar color="primary" text-color="white" class="vertical-middle">
                <span class="text-weight-bold text-body1 align-center">
                  {{ currency.sign }}
                </span>
              </q-avatar>
              <span class="text-weight-light header__span q-ml-xs">
                {{ currency.verbalName }}</span>
            </q-chip>
          </template>
        </q-select>
      </div>
      <div>
        Day overall: {{ transactionsSum }}
      </div>
    </div>
  </div>
  <div class="transaction-list">
    <div v-for="transaction in sortedTransactions" :key="transaction.id">
      <q-card flat bordered class="q-mb-lg">
        <q-card-section horizontal class="justify-between">
          <div class="row q-pa-md">
            <div class="col-1 align-center">
              <q-avatar
                color="primary"
                text-color="white">
                {{ getCategory(transaction.categoryId).name[0] }}
              </q-avatar>
            </div>
            <div class="col-7 align-center">
              <div class="text-h6">{{
                transaction.type === 'income' ?
                getAccount(transaction.accountId).source :
                getCategory(transaction.categoryId).name }}
                <q-chip dense color="teal" text-color="white" class="q-px-sm text-weight-bold">
                  {{ getCategory(transaction.categoryId).parentName }}
                </q-chip>
              </div>
              <div class="text-subtitle2">
                {{ getFormattedDate(transaction.transactionDate) }}
              </div>
            </div>
            <div class="col self-center">
              <q-chip square outline color="primary"
                class="q-ml-sm overflow-hidden align-center">
                <q-avatar
                  color="primary"
                  text-color="white"
                  class="vertical-middle"
                  icon="credit_card"/>
                  <span>
                    {{ getAccount(transaction.accountId).source }}
                  </span>
              </q-chip>
            </div>
            <div class="col self-center items-end">
              <div v-for="amount in transactionCurrencyList(transaction)" :key="amount.id">
                <span
                  :class="transaction.type === 'income' ? 'text-positive': 'text-negative'"
                  class="text-bold q-pl-lg">
                  {{ transaction.type === 'income' ? '+' : '-' }}{{ amount.amount }}
                  {{ amount.sign }}
                </span>
              </div>
            </div>
            <div class="col-1 self-center items-end">
              <q-btn-dropdown flat dropdown-icon="more_horiz">
                <q-list>
                  <q-item clickable v-close-popup @click="openEditForm(transaction)">
                    <q-item-section>
                      <q-item-label>Edit</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="deleteTransaction(transaction.id)">
                    <q-item-section>
                      <q-item-label>Delete</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import { ref } from 'vue';

export default {
  name: 'TransactionList',

  setup() {
    return {
      selectedCurrencies: ref([]),
    };
  },

  props: {
    transactions: {
      type: Array,
      required: true,
    },

    accountList: {
      type: Array,
      required: true,
    },

    categoryList: {
      type: Array,
      required: true,
    },

    currencyList: {
      type: Array,
      required: true,
    },

    currencyListLoaded: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      defaultCurrency: '',
      currenciesListSelect: [],
    };
  },

  computed: {
    transactionsSum() {
      return this.transactions.reduce((acc, item) => (
        acc + item.amount
      ), 0)?.toFixed(2);
    },

    sortedTransactions() {
      const transactions = [...this.transactions];
      return transactions.sort((a, b) => {
        if (a.categoryId < b.categoryId) return -1;
        if (a.categoryId > b.categoryId) return 1;
        return 0;
      });
    },
  },

  methods: {
    getCategory(id) {
      return this.categoryList.find((item) => item.id === id);
    },

    getAccount(id) {
      return this.accountList?.find((item) => item.id === id);
    },

    getFormattedDate(date) {
      return moment(date).calendar().split(' at')[0];
    },

    transactionCurrencyList(transaction) {
      const currencies = [];
      if (this.currencyListLoaded) {
        const defaultCurrency = this.currencyList.find((item) => item.isDefault);
        const objDefault = {
          id: transaction.currencyId,
          amount: transaction.amount.toFixed(2),
          sign: defaultCurrency.sign,
        };

        currencies.push(objDefault);

        Object.values(this.selectedCurrencies).forEach((currency) => {
          const rate = this.getRate(currency.id, transaction.transactionDate);
          const obj = {
            id: currency.value,
            amount: rate ? (transaction.amount / rate.rate).toFixed(2) : '-',
            sign: currency.sign,
          };

          currencies.push(obj);
        });
      }

      return currencies;
    },

    initCurrencies() {
      this.defaultCurrency = this.currencyList.find((item) => item.isDefault);
      this.currenciesListSelect = this.currencyList.filter((item) => (
        !item.isDefault
      ));
    },
  },

  mounted() {
    this.initCurrencies();
  },
};
</script>
