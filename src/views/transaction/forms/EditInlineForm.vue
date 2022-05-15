<template>
  <div class="col-4">
    <q-select outlined map-options use-input fill-input hide-selected dense
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
  <div class="col q-ml-lg">
    <q-btn flat round color="green" icon="done" @click="save" />
    <q-btn flat round color="red" icon="close" @click="cancel" />
  </div>
</template>
<script>
export default {
  name: 'EditInlineForm',

  props: {
    transaction: Object,
    accountList: Array,
    budgetPlan: Array,
    categoryList: Array,
    currencyList: Array,
    ratesList: Array,
    userList: Array,
    fetchBudgetPlan: Function,
    updateTransaction: Function,
    currencyListLoaded: Boolean,
  },

  emits: [
    'close',
  ],

  data() {
    return {
      input: {
        accountId: 0,
        amount: '',
        categoryId: 0,
        transactionDate: '',
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
      return this.budgetPlan.find((item) => item.id === id);
    },

    getCategory(id) {
      return this.categories.find((item) => item.id === id)
        || this.systemCategories.find((item) => item.id === id);
    },

    getUser(id) {
      return this.userList.find((item) => item.id === id);
    },

    cancel() {
      this.$emit('close');
    },

    save() {
      const transaction = {
        id: this.transaction.id,
        userId: this.transaction.userId,
        categoryId: this.input.category.id,
        budgetId: this.transaction.budgetId,
        amount: this.input.amount.toString(),
        currencyId: this.transaction.currencyId,
        accountId: this.input.account.id,
        transactionDate: this.input.transactionDate,
        type: this.transaction.type,
        description: this.transaction.description,
      };

      this.updateTransaction(transaction);
      this.$emit('close');
    },
  },

  mounted() {
    this.input.category = this.getCategory(this.transaction.categoryId);
    this.input.amount = this.transaction.amount;
    this.input.account = this.getAccount(this.transaction.accountId);
    this.input.transactionDate = this.transaction.transactionDate.substr(0, 10);
  },
};
</script>
