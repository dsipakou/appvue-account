<template>
  <q-card flat bordered class="q-mb-lg">
    <q-card-section horizontal class="justify-between">
      <div class="row q-pa-md">
        <div class="col-1 align-center">
          <q-avatar
            color="primary"
            text-color="white">
            {{ category.name[0] }}
          </q-avatar>
        </div>
        <div class="col-7 align-center">
          <div class="text-h6">{{
            transaction.type === 'income' ?
            account.source :
            category.name }}
            <q-chip dense color="teal" text-color="white" class="q-px-sm text-weight-bold">
              {{ category.parentName }}
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
                {{ account.source }}
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
              <q-item clickable v-close-popup @click="clickEdit(transaction)">
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
  <q-dialog v-model="editForm">
    <EditForm
      :transaction="editedTransaction"
      :accountList="accountList"
      :budgetList="budgetList"
      :categoryList="categoryList"
      :currencyList="currencyList"
      :currencyListLoaded="currencyListLoaded"
      :ratesList="ratesList"
      :userList="userList"
      :updateTransaction="updateTransaction"
      @closeForm="editForm = false"
    />
  </q-dialog>
</template>
<script>
import moment from 'moment';
import { ref } from 'vue';
import EditForm from '@/views/transaction/forms/EditForm.vue';

export default {
  name: 'TransactionItem',

  inheritAttrs: false,

  components: {
    EditForm,
  },

  setup() {
    return {
      editForm: ref(false),
    };
  },

  props: {
    account: { type: Object, required: true },
    accountList: { type: Array, required: true },
    budgetList: { type: Array, required: true },
    category: { type: Object, required: true },
    categoryList: { type: Array, required: true },
    currencyList: { type: Array, required: true },
    currencyListLoaded: { type: Boolean, required: true },
    ratesList: { type: Array, required: true },
    selectedCurrencies: { type: Array, required: true },
    userList: { type: Array, required: true },
    updateTransaction: { type: Function, required: true },
    deleteTransaction: { type: Function, required: true },
    transaction: { type: Object, required: true },
  },

  data() {
    return {
      editedTransaction: null,
      defaultCurrency: '',
    };
  },

  methods: {
    getFormattedDate(date) {
      return moment(date).calendar().split(' at')[0];
    },

    clickEdit() {
      this.editedTransaction = this.transaction;
      this.editForm = true;
    },

    initCurrencies() {
      this.defaultCurrency = this.currencyList.find((item) => item.isDefault);
      this.currenciesListSelect = this.currencyList.filter((item) => (
        !item.isDefault
      ));
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

    getRate(id, date) {
      return this.ratesList.find((item) => {
        const transactionDate = moment(date).startOf('day');
        const rateDate = moment(item.rateDate).startOf('day');
        return transactionDate.isSame(rateDate) && item.currencyId === id;
      });
    },
  },

  mounted() {
    this.initCurrencies();
  },

  watch: {
    currencyListLoaded() {
      if (this.currencyListLoaded) {
        this.initCurrencies();
      }
    },
  },
};
</script>
