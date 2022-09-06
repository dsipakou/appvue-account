<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <q-btn flat no-caps
        class="text-primary text-weight-bold"
        label="Daily Transactions >"
        to="/transactions/daily"/>
      <div class="row justify-center">
        <MainAccounts
          :accountList="accountList"
          :selectedAccountUuid="selectedAccountUuid"
          @selectAccount="selectAccount($event)" />
      </div>
    </div>
    <div class="row justify-center">
      <AdditionalAccounts
        :accountList="accountList"
        :selectedAccountUuid="selectedAccountUuid"
        @selectAccount="selectAccount($event)" />
    </div>
    <CategoryList
      :categoryList="categoryList"
      :selectedCategory="selectedCategory"
      :isCategoryListLoading="isCategoryListLoading"
      v-show="selectedAccountUuid != ''"
      @selectCategory="selectCategory($event)"
    />
    <div class="row">
      <div class="col-12">
        <TransactionList
          :transactions="transactionList"
          :accountList="accountList"
          :budgetPlan="budgetPlan"
          :categoryList="categoryList"
          :currencyList="currencyList"
          :ratesList="ratesList"
          :userList="userList"
          :fetchBudgetPlan="fetchBudgetPlan"
          :updateTransaction="updateTransaction"
          :deleteTransaction="deleteTransaction"
          :currencyListLoaded="currencyListLoaded">
          <template v-slot:header>
            <span class="header__title">Latest Transactions</span>
          </template>
        </TransactionList>
      </div>
    </div>
    <q-dialog v-model="createForm">
      <AddForm
        :account="selectedAccountUuid"
        :category="selectedCategory"
        :user="selectedUserUuid"
        :budgetPlan="budgetPlan"
        :categoryList="categoryList"
        :currencyList="currencyList"
        :ratesList="ratesList"
        :transactionLastAdded="transactionLastAdded"
        :currencyListLoaded="currencyListLoaded"
        :createTransaction="createTransaction"
        :setTransactionLastAdded="setTransactionLastAdded"
        :fetchBudgetPlan="fetchBudgetPlan"
        :updateBudget="updateBudget"
        @closeForm="createForm = false"
      />
    </q-dialog>
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
        :fetchBudgetPlan="fetchBudgetPlan"
        :updateTransaction="updateTransaction"
        @closeForm="editForm = false"
      />
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import AddForm from '@/views/transaction/forms/AddForm.vue';
import EditForm from '@/views/transaction/forms/EditForm.vue';
import MainAccounts from '@/views/transaction/components/MainAccounts.vue';
import AdditionalAccounts from '@/views/transaction/components/AdditionalAccounts.vue';
import CategoryList from '@/views/transaction/components/CategoryList.vue';
import TransactionList from '@/views/transaction/components/TransactionList.vue';

export default {
  name: 'Transaction',

  components: {
    AddForm,
    EditForm,
    MainAccounts,
    AdditionalAccounts,
    TransactionList,
    CategoryList,
  },

  setup() {
    return {
      createForm: ref(false),
      editForm: ref(false),
      categoryTabs: ref(''),
      selectedCurrencies: ref([]),
      transactionsSorting: ref('added'),
    };
  },

  data() {
    return {
      editedTransaction: null,
      subCategories: [],
      selectedCategory: null,
      selectedAccountUuid: '',
      selectedUserUuid: '',
    };
  },

  computed: {
    ...mapGetters([
      'transactionList',
      'accountList',
      'userList',
      'categoryList',
      'currencyList',
      'ratesList',
      'budgetPlan',
      'transactionLastAdded',
      'currencyListLoaded',
      'transactionListLoaded',
      'isAccountListLoading',
      'isUserListLoading',
      'isCategoryListLoading',
    ]),
  },

  mounted() {
    this.fetchTransactions({
      sorting: this.transactionsSorting,
    });
    this.fetchCurrencies();
  },

  watch: {
    transactionsSorting() {
      this.fetchTransactions({
        sorting: this.transactionsSorting,
      });
    },
  },

  methods: {
    ...mapActions([
      'fetchTransactions',
      'fetchCurrencies',
      'createTransaction',
      'deleteTransaction',
      'updateTransaction',
      'setTransactionLastAdded',
      'fetchBudgetPlan',
      'updateBudget',
    ]),

    selectCategory(payload) {
      this.selectedCategory = payload.category;
      this.createForm = true;
    },

    selectAccount(account) {
      this.selectedAccountUuid = this.selectedAccountUuid === account.uuid ? '' : account.uuid;
      this.selectedUserUuid = account.user;
    },
  },
};
</script>
<style scoped>
.header__title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 800;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  width: 120px;
  align-items: center;
  justify-content: flex-end;
  min-height: 100px;
}

.avatar-container span {
  font-size: 1.1em;
}
</style>
