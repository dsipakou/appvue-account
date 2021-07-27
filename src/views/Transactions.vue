<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-9">
        <div class="column">
          <div class="col">
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
          <div class="col categories-list">
            <q-avatar
              color="teal-10"
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
        </div>
      </div>
      <div class="col-3 main-categories-list">
        <q-avatar
          color="blue"
          v-for="category in mainCategories"
          :key="category.id"
          size="70px"
          font-size="12px"
          :class="activeCategory === category.id ? 'active-el' : ''"
          @dragover="onDragOver($event, category)"
          @dragenter.prevent>
          {{ category.name }}
        </q-avatar>
      </div>
    </div>
    <h3>Transaction list</h3>
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
    <va-modal size="medium" v-model="createModal" hide-default-actions>
      <div id="transactionCreate">
        <h3>Add transaction</h3>
        <div class="va-table-responsive">
          <form>
            <input type="hidden" v-model="input.category" />
            <input type="hidden" v-model="input.account" />
            <va-list>
              <va-list-label>Add transaction</va-list-label>
              <va-list-item>
                <q-input outlined label="Amount" stack-label v-model="input.amount" dence="true"/>
              </va-list-item>
              <va-list-item>
                <q-input
                  outlined
                  label="Date"
                  stack-label
                  dence=true
                  type="date"
                  v-model="input.transactionDate" />
              </va-list-item>
              <va-list-item>
                <q-input
                  outlined
                  label="Description"
                  stack-label
                  dence="true"
                  type="textarea"
                  v-model="input.description" />
              </va-list-item>
              <va-list-item>
                <q-btn label="Save" type="button" color="primary" @click="save()" />
              </va-list-item>
            </va-list>
          </form>
        </div>
      </div>
    </va-modal>
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
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import {
  getUsers,
  getCategories,
} from '../service';

export default {
  name: 'TransactionList',
  data() {
    return {
      createModal: false,
      updateModal: false,
      id: -1,
      users: [],
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
      'isTransactionListLoading',
      'accountList',
      'isAccountListLoading',
    ]),
    mainCategories() {
      return this.categories.filter((item) => item.parentName === '');
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

    save() {
      const transaction = {
        userId: this.input.user,
        categoryId: this.input.category,
        amount: this.input.amount,
        accountId: this.input.account,
        transactionDate: this.input.transactionDate,
        description: this.input.description,
      };
      this.createTransaction(transaction);
      this.createModal = false;
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
      this.updateModal = true;
    },

    startDrag(evt, account) {
      evt.dataTransfer.setData('accountID', account.id);
      evt.dataTransfer.setData('userID', account.userId);
    },

    onDrop(evt, category) {
      this.input.category = category.id;
      this.input.account = Number(evt.dataTransfer.getData('accountID'));
      this.input.user = Number(evt.dataTransfer.getData('userID'));
      this.createModal = true;
    },

    onDragOver(evt, category) {
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

.active-el {
  background-color: #abc;
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
</style>
