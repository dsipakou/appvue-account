<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <q-btn flat no-caps
        class="text-primary text-weight-bold"
        label="Daily Transactions >"
        to="/transactions/daily"/>
      <div class="row justify-center">
        <div
          v-for="account in mainAccounts"
          :key="account.id"
          class="avatar-container">
          <span>{{ account.source }}</span>
          <q-avatar
            :color="selectedAccountId === account.id ? 'red': 'red-3'"
            size="80px"
            text-color="white"
            font-size="40px"
            :icon="selectedAccountId === account.id ? 'check' : ''"
            @click="selectAccount(account)">
          </q-avatar>
        </div>
      </div>
    </div>
    <div class="row justify-center">
      <q-expansion-item
        expand-separator
        dense
        label="Additional accounts"
        class="q-mt-sm row justify-center">
        <div class="row justify-center q-mt-sm">
          <div
            v-for="account in secondaryAccounts"
            :key="account.id"
            class="avatar-container col justify-center">
            <span>{{ account.source }}</span>
            <q-avatar
              :color="selectedAccountId === account.id ? 'red' : 'red-3'"
              size="60px"
              font-size="30px"
              text-color="white"
              :icon="selectedAccountId === account.id ? 'check' : ''"
              @click="selectAccount(account)">
            </q-avatar>
          </div>
        </div>
      </q-expansion-item>
    </div>
    <CategoryList
      :categoryList="categoryList"
      :isCategoryListLoading="isCategoryListLoading"
      @selectCategory="selectCategory($event)"
    />
    <div class="row">
      <div class="col-12">
        <TransactionList
          :transactions="transactionList.slice(0, 15)"
          :accountList="accountList"
          :budgetList="budgetList"
          :categoryList="categoryList"
          :currencyList="currencyList"
          :ratesList="ratesList"
          :userList="userList"
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
        :accountId="selectedAccountId"
        :category="selectedCategory"
        :userId="selectedUserId"
        :budgetList="budgetList"
        :categoryList="categoryList"
        :currencyList="currencyList"
        :ratesList="ratesList"
        :transactionLastAdded="transactionLastAdded"
        :currencyListLoaded="currencyListLoaded"
        :createTransaction="createTransaction"
        :setTransactionLastAdded="setTransactionLastAdded"
        :updateBudget="updateBudget"
        @closeForm="createForm = false"
      />
    </q-dialog>
    <q-dialog v-model="editForm">
      <EditForm
        :transaction="editedTransaction"
        :accountList="accountList"
        :budgetList="budgetList"
        :categoryList="categoryList"
        :currencyList="currencyList"
        :currencyListLoaded="currencyListLoaded"
        :ratesList="ratesList"
        :userList="userList"
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
import TransactionList from '@/views/transaction/components/TransactionList.vue';
import CategoryList from '@/views/transaction/components/CategoryList.vue';

export default {
  name: 'Transaction',

  components: {
    AddForm,
    EditForm,
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
      selectedAccountId: 0,
      selectedUserId: 0,
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
      'budgetList',
      'transactionLastAdded',
      'currencyListLoaded',
      'transactionListLoaded',
      'isAccountListLoading',
      'isUserListLoading',
      'isCategoryListLoading',
    ]),

    mainAccounts() {
      return this.accountList.filter((item) => item.isMain);
    },

    secondaryAccounts() {
      return this.accountList.filter((item) => !item.isMain);
    },
  },

  mounted() {
    this.fetchTransactions({
      sorting: this.transactionsSorting,
    });
    this.fetchRates();
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
      'fetchRates',
      'createTransaction',
      'deleteTransaction',
      'updateTransaction',
      'setTransactionLastAdded',
      'updateBudget',
    ]),

    selectCategory(payload) {
      this.selectedCategory = payload.category;
      this.createForm = true;
    },

    selectAccount(account) {
      this.selectedAccountId = this.selectedAccountId === account.id ? 0 : account.id;
      this.selectedUserId = account.userId;
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
