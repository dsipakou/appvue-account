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
          Overall: {{ transactionsSum }}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col transaction-list">
        <div class="row justify-between" v-for="parent in groupedTransactions" :key="parent">
          <div class="col justify-between">
            <span class="text-h4">{{ parent.name }}</span>
          </div>
          <div class="col">
            <span>{{ parent.sum.toFixed(2) }}</span>
          </div>
          <div v-for="transaction in parent.items" :key="transaction.id">
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
              :deleteTransaction="deleteTransaction"
              :transaction="transaction" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import CurrencyFilterDropdown from '@/components/dropdown/CurrencyFilterDropdown.vue';
import TransactionItem from '@/views/transaction/components/TransactionItem.vue';

export default {
  name: 'TransactionGroupedList',

  components: {
    CurrencyFilterDropdown,
    TransactionItem,
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

    groupedTransactions() {
      const transactionList = [...this.transactions];
      const result = transactionList.reduce((acc, item) => {
        const parentCategory = this.getCategory(item.categoryId).parentName;
        console.log(parentCategory);
        acc[parentCategory] = acc[parentCategory] || { items: [], sum: 0 };
        acc[parentCategory].items.push(item);
        acc[parentCategory].sum += item.amount;
        acc[parentCategory].name = parentCategory;
        console.log(acc[parentCategory].sum);
        return acc;
      }, {});
      console.log(result);
      return result;
    },
  },

  methods: {
    getCategory(id) {
      return this.categoryList.find((item) => item.id === id);
    },

    getAccount(id) {
      return this.accountList.find((item) => item.id === id);
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
