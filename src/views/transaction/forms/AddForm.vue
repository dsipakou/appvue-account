<template>
  <q-card style="width: 400px;">
    <q-card-section>
      <span class="text-h5">
        {{ getCategory(category.id).name }}
      </span>
      <q-chip dense class="q-ml-sm">
        {{ getCategory(category.id).parentName }}
      </q-chip>
    </q-card-section>

    <q-separator />

    <q-card-section horizontal class="justify-between">
      <q-card-section>
        <q-input outlined stack-label autofocus
          ref="price"
          label="Amount"
          v-model="input.amount" />
      </q-card-section>
      <q-card-section>
        <q-input outlined stack-label
          type="date"
          label="Date"
          v-model="input.transactionDate" />
      </q-card-section>
      <q-card-section>
        <CurrencyDropdown
          :currencyList="currencyList"
          :ratesList="ratesList"
          :selectedDate="activeDate"
          :currencyListLoaded="currencyListLoaded"
          @selectCurrency="input.currency = $event" />
      </q-card-section>
    </q-card-section>
    <q-card-section horizontal class="space-between">
      <q-card-section>
        <q-select outlined clearable label-stacked
          label="Budget items"
          :options="currentWeekBudget"
          option-value="id"
          option-label="title"
          style="width: 300px;"
          v-model="input.budget" />
      </q-card-section>
      <q-card-section>
        <q-checkbox v-model="input.budgetDone" label="Complete budget" />
      </q-card-section>
    </q-card-section>
    <q-card-section>
      <q-input outlined stack-label
        type="textarea"
        label="Description"
        v-model="input.description" />
    </q-card-section>
    <q-card-actions align="center" class="action-buttons">
      <q-btn color="primary" rounded style="width: 100px;" @click="create()">Save</q-btn>
      <q-btn rounded color="secondary" style="width: 130px;" @click="createClose()">
        Save and Close
      </q-btn>
    </q-card-actions>
  </q-card>
</template>
<script lang="ts">
import moment from 'moment';
import { defineComponent } from 'vue';
import CurrencyDropdown from '@/components/dropdown/CurrencyDropdown.vue';
import * as constants from '@/utils/constants';
// import { getFirstDayOfWeek } from '@/utils/dateTimeUtils';
import { Budget, Currency } from '@/types';

interface InputFields {
  amount: string,
  budget: Budget,
  budgetDone: boolean,
  currency: Currency,
  description: string,
  transactionDate: string,
}

interface BudgetItem {
  id: number,
  title: string,
  disable?: boolean,
}

export default defineComponent({
  name: 'AddForm',

  inheritAttrs: false,

  components: {
    CurrencyDropdown,
  },

  props: {
    accountId: { type: Number, required: true },
    userId: { type: Number, required: true },
    category: { type: Object, required: true },
    transactionLastAdded: { type: Object, default: () => ({}) },
    budgetList: { type: Array, required: true },
    categoryList: { type: Array, requierd: true },
    currencyList: { type: Array, required: true },
    ratesList: { type: Array, required: true },
    currencyListLoaded: { type: Boolean, required: true },
    createTransaction: { type: Function, required: true },
    setTransactionLastAdded: { type: Function, required: true },
    updateBudget: { type: Function, required: true },
  },

  data() {
    return {
      activeDate: '',
      input: {
        amount: '',
        budget: null as unknown,
        budgetDone: false,
        currency: {} as Currency,
        description: '',
        transactionDate: '',
      } as InputFields,
    };
  },

  computed: {
    currentWeekBudget(): Array<BudgetItem> {
      const weekBudget = this.budgetList.filter((budget: unknown): budget is Budget => (
        moment((budget as Budget).budgetDate).week() === moment().week()
      ));

      const incompletedItems = weekBudget.filter((budget) => (
        !(budget as Budget).isCompleted
      )) as Array<BudgetItem>;

      const completedItems = weekBudget.filter((budget) => (
        (budget as Budget).isCompleted
      )) as Array<BudgetItem>;

      const items: Array<BudgetItem> = incompletedItems;
      items.push({
        id: 0,
        title: constants.dropdownSeparator,
        disable: true,
      } as BudgetItem);

      items.push(...completedItems);
      return items;
    },
  },

  methods: {
    getBudget(id: number): Budget {
      return this.budgetList.find((item: any) => item.id === id) as Budget;
    },

    getCategory(id: number) {
      return this.categoryList!.find((item: any) => item.id === id);
    },

    getRate(id: number, date: string) {
      return this.ratesList.find((item: any) => {
        const transactionDate = moment(date).startOf('day');
        const rateDate = moment(item.rateDate).startOf('day');
        return transactionDate.isSame(rateDate) && item.currencyId === id;
      });
    },

    setActiveDate() {
      this.activeDate = this.input.transactionDate;
    },

    create() {
      const rate: any = this.getRate(
        this.input.currency.id,
        this.input.transactionDate,
      );

      const transaction = {
        userId: this.userId,
        categoryId: this.category.id,
        amount: this.input.amount,
        rate: rate?.rate || 1,
        accountId: this.accountId,
        budgetId: this.input.budget?.id || null,
        transactionDate: this.input.transactionDate,
        type: constants.transactionTypes.OUTCOME,
        description: this.input.description,
      };

      if (this.input.budgetDone && this.input.budget) {
        const modifiedBudget = {
          ...this.input.budget,
          isCompleted: true,
        };
        this.updateBudget(modifiedBudget);
      }
      this.setTransactionLastAdded({
        date: this.input.transactionDate,
        budget: this.input.budgetDone ? null : this.input.budget?.id,
      });

      this.createTransaction(transaction);

      const priceInput = this.$refs.price as any;

      priceInput.focus();
      priceInput.select();
    },

    createClose() {
      this.create();
      this.$emit('closeForm');
    },
  },

  watch: {
    'input.transactionDate': 'setActiveDate',
  },

  mounted() {
    this.activeDate = this.input.transactionDate;
    this.input.transactionDate = this.transactionLastAdded?.date
      ? this.transactionLastAdded?.date
      : new Date().toISOString().substr(0, 10);

    if (this.transactionLastAdded?.budget) {
      this.input.budget = this.getBudget(this.transactionLastAdded.budget);
    }
  },
});
</script>
