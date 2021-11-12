<template>
  <input type="hidden" v-model="input.type" />
  <q-card style="width: 400px;">
    <q-card-section>
      <h4>Edit transaction</h4>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-select outlined map-options
        v-model="input.user"
        :options="userList"
        option-value="id"
        option-label="name" label="User" />
    </q-card-section>
    <q-card-section>
      <q-select outlined map-options
        v-model="input.account"
        :options="accountList"
        option-value="id"
        option-label="source"
        label="Account" />
    </q-card-section>
    <q-card-section>
      <q-select outlined map-options
        v-model="input.category"
        :options="input.type === 'income' ? systemCategories : categories"
        option-value="id"
        option-label="value"
        label="Category" />
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
      <q-input outlined stack-label label="Amount" v-model="input.amount" />
    </q-card-section>
    <q-card-section>
      <CurrencyDropdown
        :currencyList="currencyList"
        :ratesList="ratesList"
        :selectedDate="activeDate"
        :currencyListLoaded="currencyListLoaded"
        @selectCurrency="input.currency = $event" />
    </q-card-section>
    <q-card-section>
      <q-input outlined stack-label
        type="date"
        label="Date"
        v-model="input.transactionDate" />
    </q-card-section>
    <q-card-section>
      <q-input outlineds stack-label
        type="textarea"
        label="Description"
        v-model="input.description"
        />
    </q-card-section>
    <q-card-actions align="center">
      <q-btn
        color="primary"
        rounded
        style="width: 100px;"
        @click="update()">Save</q-btn>
    </q-card-actions>
  </q-card>
</template>
<script>
import moment from 'moment';
import CurrencyDropdown from '@/components/dropdown/CurrencyDropdown.vue';

export default {
  name: 'EditForm',

  components: {
    CurrencyDropdown,
  },

  props: {
    transaction: Object,
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

  emits: [
    'closeForm',
  ],

  data() {
    return {
      activeDate: '',
      input: {
        accountId: 0,
        amount: '',
        budgetId: null,
        categoryId: 0,
        currency: '',
        description: '',
        transactionDate: '',
        userId: 0,
      },
    };
  },

  methods: {
    getAccount(id) {
      return this.accountList.find((item) => item.id === id);
    },

    getBudget(id) {
      return this.budgetList.find((item) => item.id === id);
    },

    getCategory(id) {
      return this.categories.find((item) => item.id === id)
        || this.systemCategories.find((item) => item.id === id);
    },

    getRate(id, date) {
      return this.ratesList.find((item) => {
        const transactionDate = moment(date).startOf('day');
        const rateDate = moment(item.rateDate).startOf('day');
        return transactionDate.isSame(rateDate) && item.currencyId === id;
      });
    },

    getUser(id) {
      return this.userList.find((item) => item.id === id);
    },

    update() {
      const rate = this.getRate(
        this.input.currency.id,
        this.input.transactionDate,
      );

      const transaction = {
        id: this.input.id,
        userId: this.input.user.id,
        categoryId: this.input.category.id,
        budgetId: this.input.budget?.id,
        amount: this.input.amount.toString(),
        rate: rate?.rate || 1,
        accountId: this.input.account.id,
        transactionDate: this.input.transactionDate,
        type: this.input.type,
        description: this.input.description,
      };
      this.updateTransaction(transaction);
      this.$emit('closeForm');
    },
  },

  computed: {
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
      const sortedCategoryList = modifiedCategoryList.sort((a, b) => {
        if (a.value < b.value) return -1;
        if (a.value > b.value) return 1;
        return 0;
      });

      return sortedCategoryList;
    },

    systemCategories() {
      const filteredCategoryList = this.categoryList.filter((item) => (
        item.isSystem
      ));
      return filteredCategoryList;
    },

    currentWeekBudget() {
      const items = this.budgetList.filter((item) => (
        moment(item.budgetDate).week() === moment().week()
        && !item.isCompleted
      ));
      items.unshift({ id: null, title: 'Default' });
      return items;
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
    this.input.id = this.transaction.id;
    this.input.user = this.getUser(this.transaction.userId);
    this.input.budget = this.getBudget(this.transaction.budgetId);
    this.input.category = this.getCategory(this.transaction.categoryId);
    this.input.amount = this.transaction.amount;
    this.input.account = this.getAccount(this.transaction.accountId);
    this.input.transactionDate = this.transaction.transactionDate.substr(0, 10);
    this.input.type = this.transaction.type;
    this.input.description = this.transaction.description;
  },
};
</script>
