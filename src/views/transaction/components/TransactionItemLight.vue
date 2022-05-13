<template>
  <q-card flat class="card bg-grey-2">
    <q-card-section horizontal class="justify-between">
      <div class="row q-px-md">
        <div class="row items-center">
          <div class="col self-center">
            <q-chip square outline color="primary"
               class="q-ml-sm overflow-hidden align-center">
              <q-avatar
                color="primary"
                text-color="white"
                class="vertical-middle"
                icon="credit_card" />
                <span>
                  {{ account.source }}
                </span>
            </q-chip>
          </div>
          <div class="col">
            {{ getBudgetName(transaction.budget) }}
          </div>
          <div class="col self-center items-end">
            <div v-for="amount in transactionCurrencyList(transaction)" :key="amount.id">
              <span
                :class="transaction.type === 'income' ? 'text-positive': 'text-negative'"
                class="text-bold q-pl-lg">
                {{ transaction.type === 'income' ? '+' : '-' }}{{ amount.baseAmount }}
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
                <q-item clickable v-close-popup @click="deleteTransaction(transaction.uuid)">
                  <q-item-section>
                    <q-item-label>Delete</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
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
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import moment from 'moment';
import EditForm from '@/views/transaction/forms/EditForm.vue';
import {
  Account,
  Budget,
  Category,
  Currency,
  Rate,
  Transaction,
} from '@/types';

interface InputData {
  editedTransaction: Transaction | undefined,
  defaultCurrency: Currency | undefined,
  currenciesListSelect: Array<Currency>,
}

interface ShortTransaction {
  uuid: string,
  baseAmount: string,
  sign: string,
}

export default defineComponent({
  name: 'TransactionItemLight',

  components: {
    EditForm,
  },

  props: {
    account: { type: Object as PropType<Account>, required: true },
    accountList: { type: Array as PropType<Array<Account>>, required: true },
    budgetList: { type: Array as PropType<Array<Budget>>, required: true },
    category: { type: Object as PropType<Category>, required: true },
    categoryList: { type: Array as PropType<Array<Category>>, required: true },
    currencyList: { type: Array as PropType<Array<Currency>>, required: true },
    currencyListLoaded: { type: Boolean, required: true },
    ratesList: { type: Array as PropType<Array<Rate>>, required: true },
    selectedCurrencies: { type: Array as PropType<Array<any>>, required: true },
    userList: { type: Array, required: true },
    updateTransaction: { type: Function, required: true },
    deleteTransaction: { type: Function, required: true },
    transaction: { type: Object as PropType<Transaction>, required: true },
  },

  setup() {
    return {
      editForm: ref(false),
    };
  },

  data() {
    return {
      editedTransaction: undefined,
      defaultCurrency: undefined,
      currenciesListSelect: [],
    } as InputData;
  },

  methods: {
    getFormattedDate(date: string): string {
      return moment(date).calendar().split(' at')[0];
    },

    clickEdit() {
      this.editedTransaction = this.transaction;
      this.editForm = true;
    },

    initCurrencies() {
      this.defaultCurrency = this.currencyList.find((item) => item.isBase);
      this.currenciesListSelect = this.currencyList.filter((item) => (
        !item.isDefault
      ));
    },

    transactionCurrencyList(transaction: Transaction): Array<ShortTransaction> {
      const currencies = [];
      if (this.currencyListLoaded) {
        const defaultCurrency = this.currencyList.find((item) => item.isBase);
        const objDefault: ShortTransaction = {
          uuid: transaction.currency,
          baseAmount: transaction.spentInBaseCurrency.toFixed(2),
          sign: defaultCurrency!.sign,
        } as ShortTransaction;

        currencies.push(objDefault);

        Object.values(this.selectedCurrencies).forEach((currency) => {
          const rate = this.getRate(currency.uuid, transaction.transactionDate);
          const obj = {
            uuid: currency!.value,
            baseAmount: rate ? (transaction.spentInBaseCurrency / rate.rate).toFixed(2) : '-',
            sign: currency!.sign,
          } as ShortTransaction;

          currencies.push(obj);
        });
      }

      return currencies;
    },

    getRate(uuid: string, date: string): Rate | undefined {
      return this.ratesList.find((item) => {
        const transactionDate = moment(date).startOf('day');
        const rateDate = moment(item.rateDate).startOf('day');
        return transactionDate.isSame(rateDate) && item.currency === uuid;
      });
    },

    getBudgetName(budgetUuid: string | undefined): string {
      if (budgetUuid) {
        const budget: Budget | undefined = this.budgetList?.find(
          (item) => item.uuid === budgetUuid,
        );
        if (budget) {
          return budget.title;
        }
      }
      return '(not planned)';
    },
  },
});
</script>
<style scoped>
.card {
  max-height: 60px;
  margin: 5px 0;
}
</style>
