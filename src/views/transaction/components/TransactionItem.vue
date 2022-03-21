<template>
  <q-card flat bordered>
    <q-card-section horizontal class="justify-between">
      <div class="row q-pa-md">
        <div class="col-1 align-center">
          <q-avatar
            color="primary"
            text-color="white">
            {{ category.name[0] }}
          </q-avatar>
        </div>
        <div class="row items-center" v-if="!editMode">
          <div class="col-7 align-center">
            <div class="text-h6" @click="clickItem">
              {{ transaction.type === 'income' ? account.source : category.name }}
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
               class="q-ml-sm overflow-hidden align-center text-caption">
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
          <div class="q-ml-md">
            <q-chip
              dense
              color="info"
              text-color="white"
              class="text-caption text-weight-bold">
              {{ transaction.amount }} {{ getCurrency(transaction.currencyId)?.sign }}
            </q-chip>
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
                <q-item clickable v-close-popup @click="deleteTransaction(transaction.id)">
                  <q-item-section>
                    <q-item-label>Delete</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
        <div class="row items-center justify-start" v-else>
          <EditInlineForm
            :transaction="editedTransaction"
            :accountList="accountList"
            :budgetPlan="budgetPlan"
            :categoryList="categoryList"
            :currencyList="currencyList"
            :currencyListLoaded="currencyListLoaded"
            :ratesList="ratesList"
            :userList="userList"
            :updateTransaction="updateTransaction"
            @close="editMode = false"/>
        </div>
      </div>
    </q-card-section>
  </q-card>
  <q-dialog v-model="editForm">
    <EditForm
      :transaction="editedTransaction"
      :accountList="accountList"
      :budgetPlan="budgetPlan"
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
import EditInlineForm from '@/views/transaction/forms/EditInlineForm.vue';
import {
  Account,
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
  id: number,
  amount?: string,
  baseAmount: string,
  sign: string,
}

export default defineComponent({
  name: 'TransactionItem',

  inheritAttrs: false,

  components: {
    EditForm,
    EditInlineForm,
  },

  setup() {
    return {
      editForm: ref(false),
      editMode: ref(false),
      selectedCategory: ref(null),
    };
  },

  props: {
    account: { type: Object as PropType<Account>, required: true },
    accountList: { type: Array as PropType<Array<Account>>, required: true },
    budgetPlan: { type: Array, required: true },
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
        const baseCurrency = this.currencyList.find((item) => item.isBase);
        const objDefault: ShortTransaction = {
          id: transaction.currencyId,
          amount: transaction.amount.toFixed(2),
          baseAmount: transaction.baseAmount.toFixed(2),
          sign: baseCurrency!.sign,
        } as ShortTransaction;

        currencies.push(objDefault);

        Object.values(this.selectedCurrencies).forEach((currency) => {
          const rate = this.getRate(currency.id, transaction.transactionDate);
          const obj = {
            id: currency.value,
            baseAmount: rate ? (transaction.baseAmount / rate.rate).toFixed(2) : '-',
            sign: currency.sign,
          } as ShortTransaction;

          currencies.push(obj);
        });
      }

      return currencies;
    },

    getRate(id: number, date: string): Rate | undefined {
      return this.ratesList.find((item) => {
        const transactionDate = moment(date).startOf('day');
        const rateDate = moment(item.rateDate).startOf('day');
        return transactionDate.isSame(rateDate) && item.currencyId === id;
      });
    },

    getCurrency(id: number): Currency | undefined {
      return this.currencyList.find((item) => item.id === id);
    },

    clickItem() {
      this.editedTransaction = this.transaction;
      this.editMode = true;
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
});
</script>
