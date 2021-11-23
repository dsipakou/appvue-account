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
    <div class="row transaction-list">
      <div class="col">
        <div class="row" v-for="parent in groupedTransactions" :key="parent.name">
          <div class="col-12 q-mb-sm">
            <div class="row justify-start">
              <div class="col-6">
                <span class="text-h4">{{ parent.name }}</span>
              </div>
              <div class="col">
                <span class="text-h3">{{ parent.sum.toFixed(2) }}</span>
              </div>
            </div>
            <div class="row" v-for="child in parent.items" :key="child.name">
              <div class="row">
                <span class="text-h5">{{ child.name }}</span>
              </div>
              <div class="col-12" v-for="transaction in child.items" :key="transaction.id">
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
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import CurrencyFilterDropdown from '@/components/dropdown/CurrencyFilterDropdown.vue';
import TransactionItem from '@/views/transaction/components/TransactionItem.vue';
import { Account, Category, Transaction } from '@/types';

interface ModifiedCategory {
  id: number,
  value: string,
}

interface SubCategory {
  items: Transaction[],
  name: string,
  sum: number,
}

interface MainCategory {
  items: SubCategory[],
  name: string,
  sum: number,
}

interface GroupedTransaction {
  [index: string]: MainCategory,
}

export default defineComponent({
  name: 'TransactionGroupedList',

  components: {
    CurrencyFilterDropdown,
    TransactionItem,
  },

  props: {
    transactions: {
      type: Array as PropType<Transaction[]>,
      default: () => [],
    },
    accountList: {
      type: Array as PropType<Account[]>,
      default: () => [],
    },
    budgetList: Array,
    categoryList: {
      type: Array as PropType<Category[]>,
      default: () => [],
    },
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
    transactionsSum(): string {
      return this.transactions.reduce((acc, item) => (
        acc + item.amount
      ), 0)?.toFixed(2);
    },

    categories(): ModifiedCategory[] {
      const filteredCategoryList = this.categoryList.filter((item) => (
        !item.isParent && !item.isSystem
      ));
      const modifiedCategoryList = filteredCategoryList.map((item) => (
        {
          id: item.id,
          value: `${item.name} / ${item.parentName}`,
        }
      )) as ModifiedCategory[];
      return modifiedCategoryList;
    },

    systemCategories(): Category[] {
      const filteredCategoryList = this.categoryList.filter((item) => (
        item.isSystem
      ));
      return filteredCategoryList;
    },

    groupedTransactions(): any {
      const transactionList = [...this.transactions];
      const result = transactionList.reduce((acc: GroupedTransaction, item: Transaction) => {
        const parentCategory = this.getCategory(item.categoryId)?.parentName || 'unknown';

        acc[parentCategory] = acc[parentCategory]
          || { items: {}, name: parentCategory, sum: 0 } as MainCategory;
        acc[parentCategory].items[item.categoryId] = acc[parentCategory].items[item.categoryId]
          || { items: [], name: this.getCategory(item.categoryId)?.name || 'unknown' };
        acc[parentCategory].items[item.categoryId].items.push(item);
        acc[parentCategory].sum += item.amount;

        return acc;
      }, {});

      return result;
    },
  },

  methods: {
    getCategory(id: number): Category | undefined {
      return this.categoryList.find((item: Category) => item.id === id);
    },

    getAccount(id: number): Account | undefined {
      return this.accountList.find((item: Account) => item.id === id);
    },
  },
});
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
