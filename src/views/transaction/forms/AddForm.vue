<template>
  <q-card style="width: 400px;">
    <q-card-section>
      <span class="text-h5">
        {{ getCategory(category.uuid)?.name }}
      </span>
      <br />
      <q-chip dense class="q-ml-sm q-px-md">
        {{ getCategory(category.parent)?.name }}
      </q-chip>
    </q-card-section>

    <q-separator />

    <q-card-section horizontal class="justify-between">
      <q-card-section>
        <q-input outlined stack-label autofocus
          ref="price"
          label="Amount"
          v-on:keydown.enter="createClose()"
          v-model="input.amount" />
      </q-card-section>
      <q-card-section>
        <q-input outlined stack-label
          type="date"
          label="Date"
          v-model="input.transactionDate" />
      </q-card-section>
      <q-card-section style="min-width: 200px;">
        <CurrencyDropdown
          :currencyList="currencyList"
          :availableRates="availableRates"
          :selectedDate="activeDate"
          :getAvailableRates="getAvailableRates"
          :currencyListLoaded="currencyListLoaded"
          @selectCurrency="input.currency = $event" />
      </q-card-section>
    </q-card-section>
    <q-card-section horizontal class="space-between">
      <q-card-section>
        <q-select outlined clearable label-stacked
          label="Budget items"
          :options="selectedWeekBudget"
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
import { evaluate } from 'mathjs';
import { defineComponent, PropType } from 'vue';
import CurrencyDropdown from '@/components/dropdown/CurrencyDropdown.vue';
import * as constants from '@/utils/constants';
import { getFirstDayOfWeek, getLastDayOfWeek } from '@/utils/dateTimeUtils';
import {
  AvailableRates,
  Budget,
  BudgetPlan,
  Category,
  Currency,
} from '@/types';

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
    account: { type: String, required: true },
    user: { type: String, required: true },
    category: { type: Object as PropType<Category>, required: true },
    transactionLastAdded: { type: Object, default: () => ({}) },
    budgetPlan: { type: Array as PropType<Array<BudgetPlan>>, required: true },
    categoryList: { type: Array as PropType<Array<Category>>, requierd: true },
    currencyList: { type: Array as PropType<Array<Currency>>, required: true },
    currencyListLoaded: { type: Boolean, required: true },
    createTransaction: { type: Function, required: true },
    setTransactionLastAdded: { type: Function, required: true },
    fetchBudgetPlan: { type: Function, required: true },
    availableRates: { type: Object as PropType<AvailableRates>, required: true },
    getAvailableRates: { type: Function, required: true },
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
    selectedWeekBudget(): Array<any> {
      const incompletedItems = this.budgetPlan.filter((budget: BudgetPlan) => (
        !budget.isCompleted && budget.user === this.user
      ));

      const completedItems = this.budgetPlan.filter((budget: BudgetPlan) => (
        budget.isCompleted && budget.user === this.user
      ));

      const separator = { id: 0, title: constants.dropdownSeparator, disable: true };

      const items: Array<any> = [];

      items.push(...incompletedItems);
      items.push(separator as BudgetItem);
      items.push(...completedItems);

      return items;
    },
  },

  methods: {
    getBudget(uuid: string): Budget {
      return this.budgetPlan.find((item: any) => item.uuid === uuid) as Budget;
    },

    getCategory(uuid: string) {
      return this.categoryList!.find((item: any) => item.uuid === uuid);
    },

    setActiveDate() {
      this.activeDate = this.input.transactionDate;
    },

    setBudgetList() {
      this.fetchBudgetPlan({
        dateFrom: getFirstDayOfWeek(this.input.transactionDate),
        dateTo: getLastDayOfWeek(this.input.transactionDate),
      });
    },

    create() {
      const transaction = {
        user: this.user,
        category: this.category.uuid,
        amount: String(evaluate(this.input.amount.replace(',', '.'))),
        account: this.account,
        currency: this.input.currency.uuid,
        budget: this.input.budget?.uuid || null,
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
        budget: this.input.budgetDone ? null : this.input.budget?.uuid,
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
    'input.transactionDate': {
      handler() {
        this.setActiveDate();
        this.setBudgetList();
      },
    },
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
