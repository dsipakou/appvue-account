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
            color="red"
            size="80px"
            font-size="20px"
            draggable="true"
            @dragstart="startDrag($event, account)">
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
              color="red"
              size="60px"
              font-size="20px"
              draggable="true"
              @dragstart="startDrag($event, account)">
            </q-avatar>
          </div>
        </div>
      </q-expansion-item>
    </div>
    <div class="row justify-center">
      <div class="col-10 items-center sub-categories">
        <div class="row justify-center">
          <q-card
            v-for="category in subCategories"
            :key="category.id"
            flat
            bordered
            @drop="onDrop($event, category)"
            @dragover.prevent
            @dragenter.prevent
            class="column bg-secondary q-pb-sm q-ma-sm avatar-container align-center">
            <div class="row text-center text-white text-weight-bolder">
              <span>{{ category.name }}</span>
            </div>
          </q-card>
        </div>
      </div>
      <div class="col-2 main-categories-list self-end">
        <q-tabs
          v-model="categoryTabs"
          vertical
          indicator-color="white"
          active-bg-color="white"
          active-color="primary"
          switch-indicator
          no-caps
          dense
          class="text-dark">
          <q-tab
            v-for="category in mainCategories"
            :name="category.id"
            :label="category.name"
            :key="category.id"
            class="main-category-tab"
            @click="chooseCategory(category)"/>
        </q-tabs>
      </div>
    </div>
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

export default {
  name: 'Transaction',

  components: {
    AddForm,
    EditForm,
    TransactionList,
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

    mainCategories() {
      const categories = this.categoryList.filter((item) => (
        item.parentName === '' && !item.isSystem
      )).sort((a, b) => {
        const left = a.name;
        const right = b.name;
        if (left > right) {
          return 1;
        }
        if (left < right) {
          return -1;
        }
        return 0;
      });
      return categories;
    },

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

    getAccount(id) {
      return this.accountList?.find((item) => item.id === id);
    },

    getCategory(id) {
      return this.categoryList?.find((item) => item.id === id);
    },

    openEditForm(transaction) {
      this.editedTransaction = transaction;
      this.editForm = true;
    },

    startDrag(evt, account) {
      evt.dataTransfer.setData('accountID', account.id);
      evt.dataTransfer.setData('userID', account.userId);
    },

    onDrop(evt, category) {
      this.selectedCategory = category;
      this.selectedUserId = Number(evt.dataTransfer.getData('userID'));
      this.selectedAccountId = Number(evt.dataTransfer.getData('accountID'));
      this.createForm = true;
    },

    chooseCategory(category) {
      this.subCategories = this.categoryList.filter((item) => item.parentName === category.name);
    },
  },
};
</script>
<style scoped>
.main-categories-list {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}

.header__title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 800;
}

.sub-categories {
  margin-top: 30px;
  border-radius: 10px 0 0 10px;
  background-color: white;
  padding: 20px 0;
  justify-content: center;
}

.main-category-tab {
  border-radius: 0 10px 10px 0;
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
