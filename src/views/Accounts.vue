<template>
  <div>
    <div class="row">
      <div class="header">
        <span>Your accounts</span>
        <div>
          <q-btn
            rounded
            color="primary"
            icon="add"
            unelevated
            @click="addIncome()">
            Add income
          </q-btn>
        </div>
        <div>
          <q-btn
            rounded
            color="primary"
            icon="add"
            unelevated
            @click="addAccount()">
            Add account
          </q-btn>
        </div>
        <div>
          <q-btn
            rounded
            color="primary"
            icon="add"
            unelevated
            @click="transferMoneyClick()">
            Transfer money
          </q-btn>
        </div>
      </div>
      <div id="account-list" class="row">
        <div v-for="account in accountList" class="col-3 q-ml-sm" :key="account.id">
          <CreditCard
            :title=account.source
            @click="edit(account)"
            draggable="true"
            @dragstart="startDrag($event, account)"
            @dragend="endDrag($event)"
            @drop="onDrop($event, account)"
            @dragover.prevent
            @dragenter.prevent>
          </CreditCard>
        </div>
      </div>
    </div>
    <q-dialog v-model="createAccountForm">
      <q-card class="shadow-24" style="width: 400px;">
        <q-card-section>
          <h4>Create account</h4>
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
          <q-input outlined stack-label label="Source" v-model="input.source" />
        </q-card-section>
        <q-card-section>
          <q-input outlined stack-label label="Amount" v-model="input.amount" />
        </q-card-section>
        <q-card-section>
          <q-checkbox outlined stack-label label="Main Account" v-model="input.isMain" />
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            stack-label
            type="textarea"
            label="Description"
            v-model="input.description" />
        </q-card-section>

        <q-card-actions align="center" class="action-buttons">
          <q-btn color="primary" rounded style="width: 100px;" @click="create()">Save</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="createIncomeForm">
      <AddForm
        :currencyListLoaded="currencyListLoaded"
        :accountList="accountList"
        :categoryList="categoryList"
        :currencyList="currencyList"
        :ratesList="ratesList"
        :userList="userList"
      />
    </q-dialog>
    <q-dialog v-model="updateAccountForm">
      <q-card class="shadow-24" style="width: 400px;">
        <q-card-section>
          <h4>Edit account</h4>
        </q-card-section>

        <q-separator />

        <q-form>
          <input type="hidden" v-model="input.id" />
          <q-card-section>
            <q-select
              clearable
              outlined
              map-options
              v-model="input.user"
              :options="users"
              label="User" /> </q-card-section>
          <q-card-section>
            <q-input outlined stack-label label="Source" v-model="input.source" />
          </q-card-section>
          <q-card-section>
            <q-input outlined stack-label label="Amount" v-model="input.amount" />
          </q-card-section>
          <q-card-section>
            <q-checkbox outlined stack-label label="Main Account" v-model="input.isMain" />
          </q-card-section>
          <q-card-section>
            <q-input
              outlined
              stack-label
              type="textarea"
              label="Description"
              v-model="input.description" />
          </q-card-section>

          <q-card-actions align="center" class="action-buttons">
            <q-btn color="primary" rounded style="width: 100px;" @click="update()">Save</q-btn>
            <q-btn
              color="negative"
              rounded
              style="width: 100px;"
              label="Remove"
              @click="removeAccount(input.id)"
              />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="transferMoneyForm">
      <q-card class="shadow-24" style="width: 400px;">
        <q-card-section>
          <span class="text-h5">{{ getAccount(input.sourceAccount).source }}</span>
          <span class="text-h5"> -> </span>
          <span class="text-h5">{{ getAccount(input.destinationAccount).source }}</span>
        </q-card-section>

        <q-separator />

        <q-form>
          <input type="hidden" v-model="input.id" />
          <q-card-section>
            <q-select
              outlined
              map-options
              v-model="input.sourceAccount"
              :options="accounts"
              label="Source" />
          </q-card-section>
          <q-card-section>
            <q-select
              outlined
              map-options
              v-model="input.destinationAccount"
              :options="accounts"
              label="Destination" />
          </q-card-section>
          <q-card-section>
            <q-input
              outlined
              type="date"
              stack-label
              label="Date"
              v-model="input.transactionDate" />
          </q-card-section>
          <q-card-section>
            <q-input outlined stack-label label="Amount" v-model="input.amount" />
          </q-card-section>
          <q-card-section>
            <q-input
              outlined
              stack-label
              type="textarea"
              label="Description"
              v-model="input.description" />
          </q-card-section>

          <q-card-actions align="center" class="action-buttons">
            <q-btn color="primary" rounded style="width: 100px;" @click="transfer()">
              Transfer
            </q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
/* eslint no-param-reassign: ["error", { "props": false }] */

import {
  mapActions,
  mapGetters,
} from 'vuex';
import moment from 'moment';
import { ref } from 'vue';
import CreditCard from '@/views/accounts/components/CreditCard.vue';
import AddForm from '@/views/accounts/forms/AddForm.vue';
import { transactionTypes } from '../utils/constants';

export default {
  name: 'AccountList',

  components: {
    AddForm,
    CreditCard,
  },

  setup() {
    return {
      createAccountForm: ref(false),
      createIncomeForm: ref(false),
      updateAccountForm: ref(false),
      transferMoneyForm: ref(false),
    };
  },

  data() {
    return {
      showModal: false,
      availableCurrencies: [],
      defaultCurrency: '',
      input: {
        user: '',
        source: '',
        amount: 0,
        transactionDate: '',
        isMain: false,
        description: '',
        sourceAccount: '',
        destinationAccount: '',
      },
    };
  },
  computed: {
    ...mapGetters([
      'accountList',
      'categoryList',
      'currencyList',
      'ratesList',
      'userList',
      'currencyListLoaded',
      'isAccountListLoading',
      'isUserListLoading',
    ]),

    users() {
      return this.userList.map((item) => {
        const obj = {};
        obj.label = item.name;
        obj.value = item.id;
        return obj;
      });
    },

    accounts() {
      const accounts = this.makeSelectList(this.accountList, 'source');
      return accounts;
    },

    systemCategories() {
      return this.categoryList.filter((item) => item.isSystem);
    },
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
      'createAccount',
      'createTransaction',
      'deleteAccount',
      'updateAccount',
    ]),

    initCurrencies() {
      this.defaultCurrency = this.currencyList.find((item) => item.isDefault);
    },

    addIncome() {
      const category = this.systemCategories[0];
      this.input.category = category;
      this.input.transactionDate = new Date().toISOString().substr(0, 10);
      this.input.amount = '';
      this.createIncomeForm = true;
    },

    addAccount() {
      this.input.user = '';
      this.input.source = '';
      this.input.amount = '';
      this.input.description = '';
      this.input.isMain = false;

      this.createAccountForm = true;
    },

    edit(account) {
      const {
        uuid,
        user,
        source,
        amount,
        description,
        isMain,
      } = account;

      this.input.uuid = uuid;
      this.input.user = user;
      this.input.source = source;
      this.input.amount = amount;
      this.input.description = description;
      this.input.isMain = isMain;
      this.updateAccountForm = true;
    },

    create() {
      const account = {
        userId: this.input.user.value,
        source: this.input.source,
        amount: this.input.amount,
        description: this.input.description,
        isMain: this.input.isMain,
      };
      this.createAccount(account);
      this.createAccountForm = false;
    },

    createIncome() {
      const rate = this.getRate(
        this.input.currency.id,
        this.input.transactionDate,
      );

      const transaction = {
        userId: this.input.user.value || this.input.user,
        categoryId: this.input.category.id,
        amount: this.input.amount,
        rate: rate?.rate || 1,
        accountId: this.input.account.value || this.input.account,
        transactionDate: new Date().toISOString().substr(0, 10),
        type: transactionTypes.INCOME,
        description: this.input.description,
      };

      this.createTransaction(transaction);
      this.createIncomeForm = false;
    },

    update() {
      const account = {
        uuid: this.input.uuid,
        user: this.input.user,
        source: this.input.source,
        amount: this.input.amount.toString(),
        description: this.input.description,
        isMain: this.input.isMain,
      };

      this.updateAccount(account);
      this.updateAccountForm = false;
    },

    getAccount(id) {
      return this.accountList.find((item) => item.id === id);
    },

    getRate(id, date) {
      return this.ratesList.find((item) => {
        const transactionDate = moment(date).startOf('day');
        const rateDate = moment(item.rateDate).startOf('day');
        return transactionDate.isSame(rateDate) && item.currencyId === id;
      });
    },

    makeSelectList(items, labelField, optional = '') {
      return items.map((item) => {
        const obj = {};
        obj.label = item[optional] ? `${item[optional]}/${item[labelField]}` : `${item[labelField]}`;
        obj.value = item.id;
        return obj;
      });
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

    transferMoneyClick() {
      this.transferMoneyForm = true;
    },

    removeAccount(id) {
      this.deleteAccount(id);
      this.updateAccountForm = false;
    },

    startDrag(evt, account) {
      evt.dataTransfer.setData('fromAccount', account.id);
      evt.target.classList.add('hide');
    },

    endDrag(evt) {
      evt.srcElement.classList.remove('hide');
    },

    onDrop(evt, account) {
      this.input.sourceAccount = Number(evt.dataTransfer.getData('fromAccount'));
      this.input.destinationAccount = account.id;
      this.input.transactionDate ||= new Date().toISOString().substr(0, 10);
      this.transferMoneyForm = true;
    },
  },

  mounted() {
    this.initCurrencies();
  },
};
</script>
<style scoped>
#account-list {
  width: 100%;
  margin-top: 30px;
}

.hide {
  transition: 0.001s;
  transform: translateX(-9999px);
}

.header {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  width: 100%;
}

.header span {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 800;
}

.action-buttons {
  margin-bottom: 10px;
}

.item {
  margin-bottom: 20px;
}

.item-content {
  justify-content: space-between;
}

.item-title {
  display: flex;
  align-items: center;
  padding-left: 50px;
}
</style>
