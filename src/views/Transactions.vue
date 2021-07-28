<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="column">
        <div class="col-12">
          <q-avatar
            color="red"
            v-for="account in accountList"
            :key="account.id"
            size="100px"
            font-size="20px"
            draggable="true"
            @dragstart="startDrag($event, account)">
            {{ account.source }}
          </q-avatar>
        </div>
      </div>
    </div>
    <div class="row justify-between">
        <div class="col-9 items-center">
          <q-avatar
            color="teal-5"
            v-for="category in subCategories"
            size="100px"
            font-size="16px"
            :key="category.id"
            @drop="onDrop($event, category)"
            @dragover.prevent
            @dragenter.prevent>
            {{ category.name }}
          </q-avatar>
        </div>
        <div class="col-3 main-categories-list self-end">
          <q-tabs
            v-model="tab"
            vertical
            class="text-teal">
            <q-tab
              v-for="category in mainCategories"
              name="categories"
              :label="category.name"
              :key="category.id"
              @click="chooseCategory(category)"/>
          </q-tabs>
        </div>
    </div>
    <div class="row">
      <div class="header">
        <span>Latest transactions</span>
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
            <q-card-section class="item-title">
              {{ getAccount(transaction.accountId).source }}
              {{ transaction.transactionDate }}
            </q-card-section>
            <q-card-section class="item-title">
              {{ transaction.amount }}
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
    <va-modal size="medium" v-model="updateModal" hide-default-actions>
      <div id="transactionUpdate">
        <va-form>
          <input type="hidden" v-model="input.id" />
          <va-list>
            <va-list-label>Edit transaction</va-list-label>
            <va-list-item>
              <va-input label="User" v-model="input.user" />
            </va-list-item>
            <va-list-item>
              <va-input label="Account" v-model="input.account" />
            </va-list-item>
            <va-list-item>
              <va-input label="Category" v-model="input.category" />
            </va-list-item>
            <va-list-item>
              <va-input
                label="Amount"
                v-model="input.amount"
                focused
                :rules="[value => (value && value.length > 0 && value > 0)] || 'Wrong value'"
                />
            </va-list-item>
            <va-list-item>
              <va-input type="date" label="Date" v-model="input.transactionDate" />
            </va-list-item>
            <va-list-item>
              <va-input type="textarea" label="Description" v-model="input.description" />
            </va-list-item>
            <va-list-item>
              <va-button type="button" v-on:click="update()">
                Save
              </va-button>
            </va-list-item>
          </va-list>
        </va-form>
      </div>
    </va-modal>
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
          <q-input
            outlined
            type="textarea"
            stack-label
            label="Description"
            v-model="input.description"
            />
        </q-card-section>
        <q-card-actions>
          <q-btn color="primary" rouded style="width: 100px;" @click="create()">Save</q-btn>
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
          <q-input
            outlined
            type="textarea"
            stack-label
            label="Description"
            v-model="input.description"
            />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import {
  getUsers,
  getCategories,
} from '../service';

export default {
  name: 'TransactionList',

  setup() {
    return {
      createForm: ref(false),
      updateForm: ref(false),
    };
  },

  data() {
    return {
      createModal: false,
      updateModal: false,
      id: -1,
      categories: [],
      subCategories: [],
      activeCategory: -1,
      input: {
        user: 0,
        category: 0,
        amount: '',
        account: 0,
        transactionDate: new Date().toISOString().substr(0, 10),
        description: '',
      },
    };
  },
  computed: {
    ...mapGetters([
      'transactionList',
      'accountList',
      'userList',
      'isTransactionListLoading',
      'isAccountListLoading',
      'isUserListLoading',
    ]),

    mainCategories() {
      return this.categories.filter((item) => item.parentName === '');
    },

    accounts() {
      const accounts = this.makeSelectList(this.accountList, 'source');
      return accounts;
    },

    users() {
      const users = this.makeSelectList(this.userList, 'name');
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
      return this.accountList.filter((item) => item.id === id)[0];
    },

    async initLoad() {
      this.users = await getUsers();
      this.categories = await getCategories();
    },

    makeSelectList(items, labelField) {
      return items.map((item) => {
        const obj = {};
        obj.label = item[labelField];
        obj.value = item.id;
        return obj;
      });
    },

    create() {
      const transaction = {
        userId: this.input.user,
        categoryId: this.input.category,
        amount: this.input.amount,
        accountId: this.input.account,
        transactionDate: this.input.transactionDate,
        description: this.input.description,
      };
      this.createTransaction(transaction);
      this.createForm = false;
    },

    update() {
      const transaction = {
        id: this.input.id,
        userId: this.input.user,
        categoryId: this.input.category,
        amount: this.input.amount.toString(),
        accountId: this.input.account,
        transactionDate: this.input.transactionDate,
        description: this.input.description,
      };
      this.updateTransaction(transaction);
      this.updateModal = false;
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

      this.input.id = id;
      this.input.user = userId;
      this.input.category = categoryId;
      this.input.amount = amount;
      this.input.account = accountId;
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
      this.subCategories = this.categories.filter((item) => item.parentName === category.name);
      this.activeCategory = category.id;
    },
  },

  beforeMount() {
    this.initLoad();
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
  color: white;
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
  width: 100%;
}

.header span {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 800;
}
</style>
