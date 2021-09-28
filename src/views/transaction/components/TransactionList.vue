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
          <TransactionItem
            :account="getAccount(transaction.accountId)"
            :category="getCategory(transaction.categoryId)"
            :currencyList="currencyList"
            :selectedCurrencies="selectedCurrencies"
            :accountList="accountList"
            :budgetList="budgetList"
            :categoryList="categoryList"
            :currencyListLoaded="currencyListLoaded"
            :ratesList="ratesList"
            :userList="userList"
            :updateTransaction="updateTransaction"
            :transaction="transaction" />
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
import TransactionItem from '@/views/transaction/components/TransactionItem.vue';
import { ref } from 'vue';

export default {
  name: 'TransactionList',

  components: {
    EditForm,
    CurrencyFilterDropdown,
    TransactionItem,
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
