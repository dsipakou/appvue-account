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
    <div class="row justify-center">
      <div class="col-10 items-center sub-categories">
        <div class="justify-center q-mb-lg">
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
            option-value="id"
            option-label="verbalName"
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
                    {{ currency.sign }}
                  </span>
                </q-avatar>
                <span class="text-weight-light header__span q-ml-xs">
                  {{ currency.verbalName }}</span>
              </q-chip>
            </template>
          </q-select>
        </div>
      </div>
    </div>
    <div class="transaction-list">
      <div v-for="transaction in transactionList.slice(0, 15)" :key="transaction.id">
        <q-card flat bordered class="q-mb-lg">
          <q-card-section horizontal class="justify-between">
            <div class="row q-pa-md">
              <div class="col-1 align-center">
                <q-avatar
                  color="primary"
                  text-color="white">
                  {{ getCategory(transaction.categoryId).name[0] }}
                </q-avatar>
              </div>
              <div class="col-7 align-center">
                <div class="text-h6">{{
                  transaction.type === 'income' ?
                  getAccount(transaction.accountId).source :
                  getCategory(transaction.categoryId).name }}
                  <q-chip dense color="teal" text-color="white" class="q-px-sm text-weight-bold">
                    {{ getCategory(transaction.categoryId).parentName }}
                  </q-chip>
                </div>
                <div class="text-subtitle2">
                  {{ getFormattedDate(transaction.transactionDate) }}
                </div>
              </div>
              <div class="col self-center">
                <q-chip
                  square
                  outline
                  color="primary"
                  class="q-ml-sm overflow-hidden align-center"
                  >
                  <q-avatar
                    color="primary"
                    text-color="white"
                    class="vertical-middle"
                    icon="credit_card"/>
                  <span>
                    {{ getAccount(transaction.accountId).source }}
                  </span>
                </q-chip>
              </div>
              <div class="col self-center items-end">
                <div v-for="amount in transactionCurrencyList(transaction)" :key="amount.id">
                  <span
                    :class="transaction.type === 'income' ? 'text-positive': 'text-negative'"
                    class="text-bold q-pl-lg">
                    {{ transaction.type === 'income' ? '+' : '-' }}{{ amount.amount }}
                    {{ amount.sign }}
                  </span>
                </div>
              </div>
              <div class="col-1 self-center items-end">
                <q-btn-dropdown flat dropdown-icon="more_horiz">
                  <q-list>
                    <q-item clickable v-close-popup @click="openEditForm(transaction)">
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
              </div>
            </div>
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

        <q-card-section horizontal class="justify-between">
          <q-card-section>
            <q-input outlined stack-label label="Amount" v-model="input.amount" />
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
    </q-dialog>
    <q-dialog v-model="updateForm">
      <input type="hidden" v-model="input.type" />
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
            :options="input.type === 'income' ? systemCategories : categories"
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
          <q-select
            outlined
            label="Currency"
            label-stacked
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
      currenciesListSelect: [],
      availableCurrencies: [],
      defaultCurrency: '',
      input: {
        user: 0,
        category: 0,
        amount: '',
        account: 0,
        budget: null,
        transactionDate: '',
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
      'budgetList',
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

    currentWeekBudget() {
      const items = this.budgetList.filter((item) => (
        moment(item.budgetDate).week() === moment().week()
      ));
      items.unshift({ id: null, title: 'Default' });
      return items;
    },

    systemCategories() {
      const categories = makeSelectList(this.categoryList.filter((item) => (
        item.isSystem
      )), 'name', 'parentName');
      return categories;
    },

    users() {
      const users = makeSelectList(this.userList, 'name');
      return users;
    },
  },

  mounted() {
    this.initCurrencies();
  },

  watch: {
    currencyList() {
      this.initCurrencies();
    },

    ratesList() {
      this.initCurrencies();
    },

    'input.transactionDate': {
      handler() {
        this.getAvailableCurrencies();
        this.input.currency = this.defaultCurrency;
      },
    },
  },

  methods: {
    ...mapActions([
      'createTransaction',
      'deleteTransaction',
      'updateTransaction',
    ]),

    initCurrencies() {
      this.defaultCurrency = this.currencyList.find((item) => item.isDefault);
      this.currenciesListSelect = this.currencyList.filter((item) => (
        !item.isDefault
      ));
    },

    getAccount(id) {
      return this.accountList?.find((item) => item.id === id);
    },

    getCategory(id) {
      return this.categoryList?.find((item) => item.id === id);
    },

    getFullCategoryName(categoryId) {
      const category = this.categoryList.find((item) => (
        item.id === categoryId
      ));

      return `${category.parentName} / ${category.name}`;
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

    getFormattedDate(date) {
      return moment(date).calendar().split(' at')[0];
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

    transactionCurrencyList(transaction) {
      const currencies = [];
      if (this.currencyListLoaded) {
        const defaultCurrency = this.currencyList.find((item) => item.isDefault);
        const objDefault = {
          id: transaction.currencyId,
          amount: transaction.amount.toFixed(2),
          sign: defaultCurrency.sign,
        };

        currencies.push(objDefault);

        Object.values(this.selectedCurrencies).forEach((currency) => {
          const rate = this.getRate(currency.id, transaction.transactionDate);
          const obj = {
            id: currency.value,
            amount: rate ? (transaction.amount / rate.rate).toFixed(2) : '-',
            sign: currency.sign,
          };

          currencies.push(obj);
        });
      }
      return currencies;
    },

    create() {
      const rate = this.getRate(
        this.input.currency.id,
        this.input.transactionDate,
      );

      const transaction = {
        userId: this.input.user,
        categoryId: this.input.category,
        amount: this.input.amount,
        rate: rate?.rate || 1,
        accountId: this.input.account,
        budgetId: this.input.budget?.id,
        transactionDate: this.input.transactionDate,
        type: transactionTypes.OUTCOME,
        description: this.input.description,
      };
      this.createTransaction(transaction);
    },

    update() {
      const rate = this.getRate(
        this.input.currency.id,
        this.input.transactionDate,
      );

      const transaction = {
        id: this.input.id,
        userId: this.input.user.value,
        categoryId: this.input.category.value,
        budgetId: this.input.budget?.id,
        amount: this.input.amount.toString(),
        rate: rate?.rate || 1,
        accountId: this.input.account.value,
        transactionDate: this.input.transactionDate,
        type: this.input.type,
        description: this.input.description,
      };
      this.updateTransaction(transaction);
      this.updateForm = false;
    },

    openEditForm(transaction) {
      const {
        id,
        userId,
        categoryId,
        amount,
        accountId,
        transactionDate,
        type,
        description,
      } = transaction;

      const account = this.accounts.find((item) => (
        item.value === accountId
      ));

      const category = this.categories.find((item) => (
        item.value === categoryId
      )) || this.systemCategories.find((item) => (
        item.value === categoryId
      ));

      const user = this.users.find((item) => (
        item.value === userId
      ));

      this.input.id = id;
      this.input.user = user;
      this.input.category = category;
      this.input.currency = this.defaultCurrency;
      this.input.amount = amount;
      this.input.account = account;
      this.input.transactionDate = transactionDate.substr(0, 10);
      this.input.type = type;
      this.input.description = description;
      this.updateForm = true;
    },

    startDrag(evt, account) {
      evt.dataTransfer.setData('accountID', account.id);
      evt.dataTransfer.setData('userID', account.userId);
    },

    onDrop(evt, category) {
      this.input.category = category.id;
      this.input.currency = this.defaultCurrency;
      this.input.transactionDate ||= new Date().toISOString().substr(0, 10);
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
  justify-content: center;
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
