<template>
  <input type="hidden" v-model="input.type" />
  <div class="col-4">
    <q-select outlined map-options dense
      class="q-mx-lg"
      style="max-width: 400px;"
      v-model="input.category"
      :options="input.type === 'income' ? systemCategories : categories"
      option-value="id"
      option-label="value"
      label="Category" />
  </div>
  <div class="col-3">
    <q-input outlined stack-label dense
      v-model="input.transactionDate"
      style="max-width: 150px;"
      type="date"
      label="Date" />
  </div>
  <div class="col-2">
    <q-select outlined map-options dense
      v-model="input.account"
      :options="accountList"
      option-value="id"
      option-label="source"
      label="Account" />
  </div>
  <div class="col-1 q-ml-sm">
    <q-input outlined stack-label dense label="Amount" v-model="input.amount" />
  </div>
  <div class="col">
    save
  </div>
</template>
<script lang="ts">
export default {
  name: 'EditInlineForm',

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

  data() {
    return {
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

    getUser(id) {
      return this.userList.find((item) => item.id === id);
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
