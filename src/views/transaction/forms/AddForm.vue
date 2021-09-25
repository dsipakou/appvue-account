<template>
  <input type="hidden" v-model="input.categoryId" />
  <input type="hidden" v-model="input.accountId" />
  <q-card style="width: 400px;">
    <q-card-section>
      <span class="text-h5">
        {{ getCategory(input.categoryId).name }}
      </span>
      <q-chip dense class="q-ml-sm">
        {{ getCategory(input.categoryId).parentName }}
      </q-chip>
    </q-card-section>

    <q-separator />

      <q-card-section horizontal class="justify-between">
        <q-card-section>
          <q-input
            outlined
            stack-label
            autofocus
            ref="price"
            label="Amount"
            v-model="input.amount" />
        </q-card-section>
        <q-card-section>
          <q-select
            outlined
            label="Currency"
            label-stacked
            :loading="!currencyListLoaded"
            :readonly="!currencyListLoaded"
            :options="availableCurrencies"
            option-value="id"
            option-label="verbalName"
            v-model="input.currency" />
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            type="date"
            stack-label
            label="Date"
            v-model="input.transactionDate"
            />
        </q-card-section>
      </q-card-section>
      <q-card-section>
        <q-select
          outlined
          label="Budget items"
          label-stacked
          :options="currentWeekBudget"
          option-value="id"
          option-label="title"
          v-model="input.budget" />
      </q-card-section>
      <q-card-section>
        <q-input
          outlined
          type="textarea"
          stack-label
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

export default {
  name: 'AddForm',

  inheritAttrs: false,

  props: {
    budgetList: {
      type: Array,
      required: true,
    },

    categoryList: {
      type: Array,
      requierd: true,
    },

    currencyList: {
      type: Array,
      required: true,
    },

    rateslist: {
      type: Array,
      required: true,
    },

    currencyListLoaded: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      availableCurrencies: [],
      defaultCurrency: '',
      input: {
        accountId: 0,
        amount: '',
        budget: null,
        categoryId: 0,
        currency: '',
        description: '',
        transactionDate: '',
        userId: 0,
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

    getAvailableCurrencies() {
      const isRateExist = (id) => this.ratesList.some((item) => {
        const inputDate = moment(this.input.transactionDate).startOf('day');
        const rateDate = moment(item.rateDate).startOf('day');
        return rateDate.isSame(inputDate) && item.currencyId === id;
      });
      const newList = this.currencyList.map((item) => {
        if (item === this.defaultCurrency) {
          return item;
        }
        if (!isRateExist(item.id)) {
          return {
            ...item,
            verbalName: `${item.verbalName} (no exchange rate)`,
            disable: true,
          };
        }
        return item;
      });
      this.availableCurrencies = newList;
    },
  },

  watch: {
    'input.transactionDate': {
      handlers() {
        this.getAvailableCurencies();
        this.input.currency = this.defalutCurrency;
      },
    },
  },
};
</script>
