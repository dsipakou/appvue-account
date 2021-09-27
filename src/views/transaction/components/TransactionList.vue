<template>
  <div class="main-container q-pa-md">
    <div class="row">
      <div class="col-12 header">
        <div>
          <slot name="header"></slot>
        </div>
        <div>
          <CurrencyFilterDropdown
            :currencyList="currencyList"
            :currencyListLoaded="currencyListLoaded"
            @selectCurrency="selectedCurrencies = $event"/>
        </div>
        <div>
          Day overall: {{ transactionsSum }}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col transaction-list">
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
        </div>
      </div>
    </div>
  </div>
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
import EditForm from '@/views/transaction/forms/EditForm.vue';
import CurrencyFilterDropdown from '@/components/dropdown/CurrencyFilterDropdown.vue';
import { ref } from 'vue';

export default {
  name: 'TransactionList',

  components: {
    EditForm,
    CurrencyFilterDropdown,
  },

  setup() {
    return {
      editForm: ref(false),
    };
  },

  props: {
    transactions: Array,
    accountList: Array,
    budgetList: Array,
    categoryList: Array,
    currencyList: Array,
    ratesList: Array,
    userList: Array,
    updateTransaction: Function,
    deleteTransaction: Function,
    currencyListLoaded: Boolean,
  },

  data() {
    return {
      defaultCurrency: '',
      currenciesListSelect: [],
      selectedCurrencies: [],
      editedTransaction: null,
    };
  },

  computed: {
    transactionsSum() {
      return this.transactions.reduce((acc, item) => (
        acc + item.amount
      ), 0)?.toFixed(2);
    },

    categories() {
      const filteredCategoryList = this.categoryList.filter((item) => (
        !item.isParent && !item.isSystem
      ));
      const modifiedCategoryList = filteredCategoryList.map((item) => (
        {
          id: item.id,
          value: `${item.name} / ${item.parentName}`,
        }
      ));
      return modifiedCategoryList;
    },

    systemCategories() {
      const filteredCategoryList = this.categoryList.filter((item) => (
        item.isSystem
      ));
      return filteredCategoryList;
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
      return this.accountList.find((item) => item.id === id);
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

    getRate(id, date) {
      return this.ratesList.find((item) => {
        const transactionDate = moment(date).startOf('day');
        const rateDate = moment(item.rateDate).startOf('day');
        return transactionDate.isSame(rateDate) && item.currencyId === id;
      });
    },

    initCurrencies() {
      this.defaultCurrency = this.currencyList.find((item) => item.isDefault);
      this.currenciesListSelect = this.currencyList.filter((item) => (
        !item.isDefault
      ));
    },

    clickEdit(transaction) {
      this.editedTransaction = transaction;
      this.editForm = true;
    },
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
<style scoped>

.header {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  align-items: center;
  width: 100%;
}

.header__span {
  align-self: flex-end;
}

.transaction-list {
  background-color: #FFFFFF;
  border-radius: 10px;
  margin-top: 20px;
  padding: 20px;
}
</style>
