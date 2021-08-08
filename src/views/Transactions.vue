<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="row justify-center">
        <div
          v-for="account in accountList"
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
    <div class="row justify-between">
      <div class="col-10 items-center sub-categories">
        <div style="margin-bottom: 20px;">
          <h4>Drag on category</h4>
        </div>
        <div class="row justify-center">
          <div v-for="category in subCategories" :key="category.id" class="avatar-container">
            <span>{{ category.name }}</span>
            <q-avatar
              color="teal-5"
              size="80px"
              font-size="16px"
              @drop="onDrop($event, category)"
              @dragover.prevent
              @dragenter.prevent>
            </q-avatar>
          </div>
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
      <div class="header">
        <div>
          <span class="header__title">Latest transactions</span>
        </div>
        <div>
          <q-select
            :options="currenciesListSelect"
            v-model="selectedCurrencies"
            map-options
            multiple
            stack-label
            style="width: 600px;">
            <template v-slot:selected>
              Currency:
              <q-chip
                v-for="currency in selectedCurrencies"
                :key="currency.id"
                dense
                square
                color="white"
                text-color="primary"
                style="max-width: 100px;"
                class="q-ml-sm overflow-hidden align-center"
                >
                <q-avatar color="primary" text-color="white" class="vertical-middle">
                  <span class="text-weight-bold text-body1 align-center">
                    {{ getCurrency(currency.value).sign }}
                  </span>
                </q-avatar>
                <span class="text-weight-light header__span">{{ currency.label }}</span>
              </q-chip>
            </template>
          </q-select>
        </div>
      </div>
    </div>
    <div class="transaction-list">
      <q-card flat class="item">
        <q-card-section horizontal class="item-content">
          <q-card-section class="item-header">
            Account
          </q-card-section>
          <q-card-section class="item-header">
            Amount
          </q-card-section>
          <q-card-section class="item-header">
            Actions
          </q-card-section>
        </q-card-section>
      </q-card>
      <div v-for="transaction in transactionList" :key="transaction.id">
        <q-card flat bordered class="item">
          <q-card-section horizontal class="item-content">
            <q-card-section>
              <q-avatar
                color="primary"
                text-color="white">
                {{ getCategory(transaction.categoryId).name[0] }}
              </q-avatar>
            </q-card-section>

            <q-card-section class="q-ml-xl absolute-left item-title">
              <div class="text-h6">{{
                transaction.type === 'income' ?
                  getAccount(transaction.accountId).source :
                  getCategory(transaction.categoryId).name }}</div>
              <div class="text-subtitle2">{{ transaction.transactionDate }}</div>
            </q-card-section>
            <q-card-section class="item-title justify-center">
              {{ getAccount(transaction.accountId).source }}
            </q-card-section>
            <q-card-section class="relative-left item-title justify-center">
              <span
                :class="transaction.type === 'income' ? 'text-positive': 'text-negative'"
                v-for="amount in transactionCurrencyList(transaction)"
                :key="amount.id"
                class="text-bold">
                {{ transaction.type === 'income' ? '+' : '-' }}{{ amount.amount }}
                {{ amount.sign }}
              </span>
            </q-card-section>
            <q-card-section>
              <q-btn-dropdown flat dropdown-icon="more_horiz">
                <q-list>
                  <q-item clickable v-close-popup @click="edit(transaction)">
                    <q-item-section>
                      <q-item-label>Edit</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="deleteTransaction(transaction.id)">
                    <q-item-section>
                      <q-item-label>Delete</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="createForm">
      <input type="hidden" v-model="input.category" />
      <input type="hidden" v-model="input.account" />
      <q-card style="width: 400px;">
        <q-card-section>
          <h4>Add transaction</h4>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input outlined stack-label label="Amount" v-model="input.amount" />
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
        <q-card-section>
          <q-select
            outlined
            label="Currency"
            label-stacked
            :options="currenciesListWithDefault"
            v-model="input.currency" />
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
    </q-dialog>
    <q-dialog v-model="updateForm">
      <q-card style="width: 400px;">
        <q-card-section>
          <h4>Edit transaction</h4>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-select
            clearable
            outlined
            map-options
            v-model="input.user"
            :options="users"
            label="User" />
        </q-card-section>
        <q-card-section>
          <q-select
            clearable
            outlined
            map-options
            v-model="input.account"
            :options="accounts"
            label="Account" />
        </q-card-section>
        <q-card-section>
          <q-select
            clearable
            outlined
            map-options
            v-model="input.category"
            :options="categories"
            label="Category" />
        </q-card-section>
        <q-card-section>
          <q-input outlined stack-label label="Amount" v-model="input.amount" />
        </q-card-section>
        <q-card-section>
          <q-select
            outlined
            label="Currency"
            label-stacked
            :options="currenciesListWithDefault"
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
        <q-card-section>
          <q-input
            outlined
            type="textarea"
            stack-label
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
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import { makeSelectList } from '../utils';
import { transactionTypes } from '../utils/constants';

export default {
  name: 'TransactionList',

  setup() {
    return {
      createForm: ref(false),
      updateForm: ref(false),
      categoryTabs: ref(''),
      selectedCurrencies: ref([]),
    };
  },

  data() {
    return {
      id: -1,
      subCategories: [],
      activeCategory: -1,
      input: {
        user: 0,
        category: 0,
        amount: '',
        account: 0,
        transactionDate: new Date().toISOString().substr(0, 10),
        currency: '',
        description: '',
      },
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
      'isTransactionListLoading',
      'isAccountListLoading',
      'isUserListLoading',
      'isCategoryListLoading',
      'isCurrencyListLoading',
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

    currenciesListSelect() {
      const currencies = makeSelectList(this.currencyList.filter((item) => (
        !item.isDefault
      )), 'verbalName');
      return currencies;
    },

    currenciesListWithDefault() {
      return makeSelectList(this.currencyList, 'verbalName');
    },

    defaultCurrency() {
      const defaultId = this.currencyList.find((item) => item.isDefault)?.id;
      return this.currenciesListWithDefault.find((item) => item.value === defaultId);
    },

    accounts() {
      const accounts = makeSelectList(this.accountList, 'source');
      return accounts;
    },

    categories() {
      const categories = makeSelectList(this.categoryList.filter((item) => (
        !item.isParent && !item.isSystem
      )), 'name', 'parentName');
      return categories;
    },

    users() {
      const users = makeSelectList(this.userList, 'name');
      return users;
    },
  },
  methods: {
    ...mapActions([
      'createTransaction',
      'deleteTransaction',
      'updateTransaction',
    ]),

    getAccount(id) {
      return this.accountList?.find((item) => item.id === id);
    },

    getCategory(id) {
      return this.categoryList?.find((item) => item.id === id);
    },

    getCurrency(id) {
      return this.currencyList?.find((item) => item.id === id);
    },

    getRate(id, date) {
      return this.ratesList.find((item) => {
        const transactionDate = moment(date).startOf('day');
        const rateDate = moment(item.rateDate).startOf('day');
        return transactionDate.isSame(rateDate) && item.currencyId === id;
      });
    },

    transactionCurrencyList(transaction) {
      const currencies = [];
      if (!this.isCurrencyListLoading) {
        const defaultCurrency = this.currencyList.find((item) => item.isDefault);
        const objDefault = {
          id: transaction.currencyId,
          amount: transaction.amount,
          sign: defaultCurrency.sign,
        };

        currencies.push(objDefault);

        Object.values(this.selectedCurrencies).forEach((currency) => {
          const rate = this.getRate(currency.value, transaction.transactionDate);
          const obj = {
            id: currency.value,
            amount: rate ? (transaction.amount / rate.rate).toFixed(2) : '-',
            sign: this.getCurrency(currency.value).sign,
          };

          currencies.push(obj);
        });
      }
      return currencies;
    },

    create() {
      const transaction = {
        userId: this.input.user,
        categoryId: this.input.category,
        amount: this.input.amount,
        accountId: this.input.account,
        transactionDate: this.input.transactionDate,
        type: transactionTypes.OUTCOME,
        description: this.input.description,
      };
      this.createTransaction(transaction);
      this.createForm = false;
    },

    update() {
      const transaction = {
        id: this.input.id,
        userId: this.input.user.value,
        categoryId: this.input.category.value,
        amount: this.input.amount.toString(),
        accountId: this.input.account.value,
        transactionDate: this.input.transactionDate,
        type: transactionTypes.OUTCOME,
        description: this.input.description,
      };
      this.updateTransaction(transaction);
      this.updateForm = false;
    },

    edit(transaction) {
      const {
        id,
        userId,
        categoryId,
        amount,
        accountId,
        transactionDate,
        description,
      } = transaction;

      const account = this.accounts.find((item) => (
        item.value === accountId
      ));

      const category = this.categories.find((item) => (
        item.value === categoryId
      ));

      const user = this.users.find((item) => (
        item.value === userId
      ));

      this.input.id = id;
      this.input.user = user;
      this.input.category = category;
      this.input.amount = amount;
      this.input.account = account;
      this.input.transactionDate = transactionDate.substr(0, 10);
      this.input.description = description;
      this.updateForm = true;
    },

    startDrag(evt, account) {
      evt.dataTransfer.setData('accountID', account.id);
      evt.dataTransfer.setData('userID', account.userId);
    },

    onDrop(evt, category) {
      this.input.category = category.id;
      this.input.amount = '';
      this.input.account = Number(evt.dataTransfer.getData('accountID'));
      this.input.user = Number(evt.dataTransfer.getData('userID'));
      this.createForm = true;
    },

    chooseCategory(category) {
      this.subCategories = this.categoryList.filter((item) => item.parentName === category.name);
      this.activeCategory = category.id;
    },
  },

  mounted() {
    this.input.currency = this.defaultCurrency;
  },

};
</script>
<style scoped>
#transactionCreate {
  margin: auto;
}

.transaction-list {
  background-color: #FFFFFF;
  border-radius: 10px;
  margin-top: 20px;
  padding: 20px;
}

.drag-el {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background-color: #eee;
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 50%;
  text-align: center;
  margin: 10px;
  line-height: auto;
}

.categories-list {
  display: flex;
  margin-top: 100px;
  justify-content: center;
  color: white;
  line-height: 1.1em;
}

.main-categories-list {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}

.item {
  margin-bottom: 20px;
}

.item-content {
  justify-content: space-between;
}

.item-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 50px;
}

.item-header {
  display: flex;
  justify-content: left;
  font-size: 18px;
  font-weight: 800;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  align-items: center;
  width: 100%;
}

.header__title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 800;
}

.header__span {
  align-self: flex-end;
}

.action-buttons {
  margin-bottom: 10px;
}

.sub-categories {
  margin-top: 30px;
  border-radius: 10px 0 0 10px;
  background-color: white;
  padding: 20px 0;
}

.main-category-tab {
  border-radius: 0 10px 10px 0
}

.avatar-container {
  display: flex;
  flex-direction: column;
  width: 120px;
  align-items: center;
  justify-content: flex-end;
}

.avatar-container span {
  font-size: 0.9em;
}

.over {
  background-color: black;
}

</style>
