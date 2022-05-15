<template>
  <div class="main-container q-pa-md">
    <div class="row">
      <div class="col-12 header">
        <div>
          <slot name="header"></slot>
        </div>
        <div class="text-h4">
          Overall: {{ overallSum.toFixed(2) }}
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
        <div class="row" v-for="parent in transactions" :key="parent.categoryName">
          <q-expansion-item switch-toggle-side
            class="col-12"
            :caption="parent">
            <template v-slot:header>
              <div class="row col-12">
                <span class="col-6 text-h5">{{ parent.categoryName }}</span>
                <span class="col text-h5 self-center">
                  {{ parent.spentInBaseCurrency?.toFixed(2) }}
                </span>
              </div>
            </template>
          <div class="col-12 q-mb-sm">
            <div class="row" v-for="child in parent.items" :key="child.categoryName">
              <q-expansion-item switch-toggle-side
                class="col-11 text-h6 q-ml-lg">
                <template v-slot:header>
                  <div class="row col-12">
                    <span class="col-7 text-h6">{{ child.categoryName }}</span>
                    <span class="col text-h6">{{ child.spentInBaseCurrency?.toFixed(2) }}</span>
                    <span class="col text-subtitle2 self-center">
                      ({{ child.items.length }} transactions)
                    </span>
                  </div>
                </template>
                <div class="col-12" v-for="transaction in child.items" :key="transaction.uuid">
                  <TransactionItemLight
                    :account="getAccount(transaction.account)"
                    :category="getCategory(transaction.category)"
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
import TransactionItemLight from '@/views/transaction/components/TransactionItemLight.vue';
import { Account, Category, Transaction } from '@/types';

interface ModifiedCategory {
  uuid: string,
  value: string,
}

interface SpendingDetails {
  amount: number,
  sign: string,
  currency: string,
}

interface CategoryGroup {
  categoryName: string,
  parentName: string,
  spentInBaseCurrency: number,
  spentInCurrencies: { [code:string]: SpendingDetails },
  items: Transaction[],
}

interface ParentGroupedTransaction {
  categoryName: string,
  spentInBaseCurrency: number,
  spentInCurrencies: { [code:string]: SpendingDetails },
  items: CategoryGroup[],
}

export default defineComponent({
  name: 'TransactionGroupedList',

  components: {
    CurrencyFilterDropdown,
    TransactionItemLight,
  },

  props: {
    transactions: {
      type: Array as PropType<ParentGroupedTransaction[]>,
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
    overallSum(): number {
      if (this.transactions) {
        return this.transactions.reduce(
          (acc: number, item: ParentGroupedTransaction) => acc + item.spentInBaseCurrency, 0,
        );
      }
      return 0;
    },

    categories(): ModifiedCategory[] {
      const filteredCategoryList = this.categoryList.filter((item: Category) => !item.isIncome);
      const modifiedCategoryList = filteredCategoryList.map((item: Category) => (
        {
          uuid: item.uuid,
          value: `${item.name} / ${item.parent}`,
        }
      )) as ModifiedCategory[];
      return modifiedCategoryList;
    },

    systemCategories(): Category[] {
      const filteredCategoryList = this.categoryList.filter((item: Category) => (
        item.isIncome
      ));
      return filteredCategoryList;
    },
  },

  methods: {
    getCategory(uuid: string): Category | undefined {
      return this.categoryList.find((category: Category) => category.uuid === uuid);
    },

    getAccount(uuid: string): Account | undefined {
      return this.accountList.find((account: Account) => account.uuid === uuid);
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
