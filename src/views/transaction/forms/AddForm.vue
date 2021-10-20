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
      <q-card-section>
        <q-select outlined label-stacked
          label="Budget items"
          :options="currentWeekBudget"
          option-value="id"
          option-label="title"
          v-model="input.budget" />
        <q-checkbox v-model="input.budgetDone" label="Complete budget" />
      </q-card-section>
      <q-card-section>
        <q-input outlined stack-label
          type="textarea"
          label="Description"
          v-model="input.description"
          />
      </q-card-section>
      <q-card-actions align="center" class="action-buttons">
        <q-btn color="primary" rounded style="width: 100px;" @click="create()">Save</q-btn>
      </q-card-actions>
  </q-card>
</template>
<script>
import moment from 'moment';
import CurrencyDropdown from '@/components/dropdown/CurrencyDropdown.vue';
import { transactionTypes } from '@/utils/constants';

export default {
  name: 'AddForm',

  inheritAttrs: false,

  components: {
    CurrencyDropdown,
  },

  props: {
    accountId: { type: String, required: true },
    category: { type: Object, required: true },
    userId: { type: String, required: true },
    transactionDate: { type: String, default: null },
    budgetList: { type: Array, required: true },
    categoryList: { type: Array, requierd: true },
    currencyList: { type: Array, required: true },
    ratesList: { type: Array, required: true },
    currencyListLoaded: { type: Boolean, required: true },
    createTransaction: { type: Function, required: true },
  },

  data() {
    return {
      availableCurrencies: [],
      defaultCurrency: '',
      activeDate: '',
      input: {
        amount: '',
        budget: null,
        budgetDone: false,
        currency: '',
        description: '',
        transactionDate: '',
      },
    };
  },

  computed: {
    currentWeekBudget() {
      const items = this.budgetList.filter((item) => (
        moment(item.budgetDate).week() === moment().week()
        && !item.isCompleted
      ));
      items.unshift({ id: null, title: 'Default' });
      return items;
    },
  },

  methods: {
    getCategory(id) {
      return this.categoryList.find((item) => item.id === id);
    },

    initCurrencies() {
      this.defaultCurrency = this.currencyList.find((item) => item.isDefault);
    },

    getRate(id, date) {
      return this.ratesList.find((item) => {
        const transactionDate = moment(date).startOf('day');
        const rateDate = moment(item.rateDate).startOf('day');
        return transactionDate.isSame(rateDate) && item.currencyId === id;
      });
    },

    create() {
      const rate = this.getRate(
        this.input.currency.id,
        this.input.transactionDate,
      );

      const transaction = {
        userId: this.userId,
        categoryId: this.category.id,
        amount: this.input.amount,
        rate: rate?.rate || 1,
        accountId: this.accountId,
        budgetId: this.input.budget?.id,
        transactionDate: this.input.transactionDate,
        type: transactionTypes.OUTCOME,
        description: this.input.description,
      };
      this.createTransaction(transaction);
      this.$emit('closeForm');
    },
  },

  watch: {
    'input.transactionDate': {
      handler() {
        this.activeDate = this.input.transactionDate;
      },
    },
  },

  mounted() {
    this.input.transactionDate = this.transactionDate
      ? this.transactionDate : new Date().toISOString().substr(0, 10);
    this.activeDate = this.input.transactionDate;
  },
};
</script>
