<template>
  <input type="hidden" v-model="input.type" />
  <q-card style="width: 400px;">
    <q-card-section>
      <h4>Edit transaction</h4>
    </q-card-section>

    <q-separator />
    <q-card-section>
      <q-select outlined map-options emit-value
        v-model="input.user"
        :options="userList"
        option-value="uuid"
        option-label="username"
        label="User" />
    </q-card-section>
    <q-card-section>
      <q-select outlined map-options emit-value
        v-model="input.account"
        :options="accountList"
        option-value="uuid"
        option-label="source"
        label="Account" />
    </q-card-section>
    <q-card-section>
      <q-select outlined map-options emit-value
        v-model="input.category"
        :options="input.type === 'income' ? systemCategories : categories"
        option-value="uuid"
        option-label="value"
        label="Category" />
    </q-card-section>
    <q-card-section>
      <q-select
        outlined
        label="Budget items"
        label-stacked
        :options="selectedWeekBudget"
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
        :selectedCurrencyId="transaction.currencyId"
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
import * as constants from '@/utils/constants';
import { getFirstDayOfWeek, getLastDayOfWeek } from '@/utils/dateTimeUtils';

export default {
  name: 'EditForm',

  components: {
    CurrencyDropdown,
  },

  props: {
    transaction: Object,
    accountList: Array,
    budgetPlan: Array,
    categoryList: Array,
    currencyList: Array,
    ratesList: Array,
    userList: Array,
    fetchBudgetPlan: { type: Function, required: true, default: () => {} },
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
        account: '',
        amount: '',
        budget: '',
        category: '',
        currency: '',
        description: '',
        transactionDate: '',
        user: '',
      },
    };
  },

  methods: {
    setBudgetList() {
      this.fetchBudgetPlan({
        dateFrom: getFirstDayOfWeek(this.input.transactionDate),
        dateTo: getLastDayOfWeek(this.input.transactionDate),
      });
    },

    setActiveDate() {
      this.activeDate = this.input.transactionDate;
    },

    getAccount(uuid) {
      return this.accountList.find((item) => item.uuid === uuid);
    },

    getBudget(uuid) {
      return this.budgetPlan.find((item) => item.uuid === uuid);
    },

    getCategory(uuid) {
      return this.categories.find((item) => item.uuid === uuid)
        || this.systemCategories.find((item) => item.uuid === uuid);
    },

    getParentCategory(uuid) {
      return this.categoryList.find((item) => item.uuid === uuid);
    },

    getRate(uuid, date) {
      return this.ratesList.find((item) => {
        const transactionDate = moment(date).startOf('day');
        const rateDate = moment(item.rateDate).startOf('day');
        return transactionDate.isSame(rateDate) && item.currency === uuid;
      });
    },

    getUser(uuid) {
      return this.userList.find((item) => item.uuid === uuid);
    },

    update() {
      const transaction = {
        uuid: this.input.uuid,
        user: this.input.user,
        category: this.input.category,
        budget: this.input.budget.uuid,
        amount: this.input.amount.toString(),
        currency: this.input.currency.uuid,
        account: this.input.account,
        transactionDate: this.input.transactionDate,
        description: this.input.description,
      };
      this.updateTransaction(transaction);
      this.$emit('closeForm');
    },
  },

  computed: {
    categories() {
      const filteredCategoryList = this.categoryList.filter((item) => (
        item.parent && !item.isIncome
      ));
      const modifiedCategoryList = filteredCategoryList.map((item) => (
        {
          uuid: item.uuid,
          value: `${item.name} / ${this.getParentCategory(item.parent).name}`,
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

    selectedWeekBudget() {
      const incompletedItems = this.budgetPlan.filter((budget) => (
        !budget.isCompleted
      ));

      const completedItems = this.budgetPlan.filter((budget) => (
        budget.isCompleted
      ));

      const separator = { id: 0, title: constants.dropdownSeparator, disable: true };

      const items = [];

      items.push(...incompletedItems);
      items.push(separator);
      items.push(...completedItems);

      return items;
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
    this.input.uuid = this.transaction.uuid;
    this.input.user = this.transaction.user;
    this.input.budget = this.getBudget(this.transaction.budget);
    this.input.category = this.transaction.category;
    this.input.amount = this.transaction.amount;
    this.input.account = this.transaction.account;
    this.input.transactionDate = this.transaction.transactionDate.substr(0, 10);
    this.input.description = this.transaction.description;
    console.log(this.transaction);
  },
};
</script>
