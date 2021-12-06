<template>
  <div class="main-container q-pa-md">
    <div class="row">
      <div class="col-12 header">
        <div>
          <slot name="header"></slot>
        </div>
        <div class="text-h4">
          Overall: {{ transactionsSum }}
        </div>
        <div>
          <CurrencyFilterDropdown
            :currencyList="currencyList"
            :currencyListLoaded="currencyListLoaded"
            @selectCurrency="selectedCurrencies = $event"/>
        </div>
      </div>
    </div>
    <div class="row transaction-list">
      <div class="col">
        <div class="row" v-for="parent in groupedTransactions" :key="parent.name">
          <q-expansion-item switch-toggle-side
            class="col-12"
            :caption="parent.sum.toFixed(2)">
            <template v-slot:header>
              <div class="row col-12">
                <span class="col-6 text-h5">{{ parent.name }}</span>
                <span class="col text-h5 self-center">{{ parent.sum.toFixed(2) }}</span>
              </div>
            </template>
          <div class="col-12 q-mb-sm">
            <div class="row" v-for="child in parent.items" :key="child.name">
              <q-expansion-item switch-toggle-side
                class="col-11 text-h6 q-ml-lg">
                <template v-slot:header>
                  <div class="row col-12">
                    <span class="col-7 text-h6">{{ child.name }}</span>
                    <span class="col text-h6">{{ child.sum.toFixed(2) }}</span>
                    <span class="col text-subtitle2 self-center">
                      ({{ child.items.length }} transactions)
                    </span>
                  </div>
                </template>
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
              </q-expansion-item>
            </div>
          </div>
          </q-expansion-item>
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
      const filteredCategoryList = this.categoryList.filter((item: Category) => (
        !item.isParent && !item.isSystem
      ));
      const modifiedCategoryList = filteredCategoryList.map((item: Category) => (
        {
          id: item.id,
          value: `${item.name} / ${item.parentName}`,
        }
      )) as ModifiedCategory[];
      return modifiedCategoryList;
    },

    systemCategories(): Category[] {
      const filteredCategoryList = this.categoryList.filter((item: Category) => (
        item.isSystem
      ));
      return filteredCategoryList;
    },

    groupedTransactions(): any {
      const transactionList = [...this.transactions];
      const result = transactionList.reduce((acc: GroupedTransaction, item: Transaction) => {
        const parentCategory = this.getCategory(item.categoryId)?.parentName || 'unknown';
        const subCategory = this.getCategory(item.categoryId)?.name || 'unknown';

        acc[parentCategory] = acc[parentCategory]
          || { items: {}, name: parentCategory, sum: 0 } as MainCategory;
        acc[parentCategory].items[item.categoryId] = acc[parentCategory].items[item.categoryId]
          || { items: [], name: subCategory, sum: 0 } as SubCategory;
        acc[parentCategory].items[item.categoryId].items.push(item);
        acc[parentCategory].sum += item.amount;
        acc[parentCategory].items[item.categoryId].sum += item.amount;

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
