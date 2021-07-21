<template>
  <div class="container">
    <div ckass="accounts">
      <div class="main-area">
        <div class="drop-zone">
          <div
            class="drag-el"
            v-for="account in accounts"
            :key="account.id"
            draggable="true"
            @dragstart="startDrag($event, account)">
            <span>
              {{ account.source }}
            </span>
          </div>
        </div>
        <div class="drop-zone">
          <div
            class="drag-el"
            v-for="category in subCategories"
            :key="category.id"
            @drop="onDrop($event, category)"
            @dragover.prevent
            @dragenter.prevent
            >
            <span>
              {{ category.name }}
            </span>
          </div>
        </div>
      </div>
      <div class="parent-categories">
        <div class="drop-zone">
          <div
            class="drag-el"
            v-for="category in mainCategories"
            :key="category.id"
            :class="activeCategory === category.id ? 'active-el' : ''"
            @dragover="onDragOver($event, category)"
            @dragenter.prevent
            >
            <span>
              {{ category.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <slot name="transactionList"></slot>
    <h3>Transaction list</h3>
    <form>
      <div v-for="transaction in transactionList" :key="transaction.id">
        {{ transaction.category }} {{ transaction.amount }}
        <va-button type="button" icon="create" gradient v-on:click="edit(transaction)"/>
        <va-button type="button" icon="block" v-on:click="remove(transaction.id)"/>
      </div>
    </form>
    <va-modal size="medium" v-model="createModal" hide-default-actions>
      <div id="transactionCreate">
        <h3>Add transaction</h3>
        <div class="va-table-responsive">
          <form>
            <input type="hidden" v-model="input.category" />
            <input type="hidden" v-model="input.account" />
            <table class="va-table">
              <tr>
                <td><label>Amount</label></td>
                <td>
                  <input v-model="input.amount" placeholder="Amount" />
                </td>
              </tr>
              <tr>
                <td><label>Date</label></td>
                <td>
                  <input type="date" v-model="input.transactionDate" placeholder="Date" />
                </td>
              </tr>
              <tr>
                <td><label>Description</label></td>
                <td><textarea v-model="input.description" placeholder="Description" /></td>
              </tr>
              <tr>
                <td colspan="2">
                  <va-button type="button" v-on:click="save()">Save transaction</va-button>
                </td>
              </tr>
            </table>
          </form>
        </div>
      </div>
    </va-modal>
    <va-modal size="medium" v-model="updateModal" hide-default-actions>
      <div id="transactionUpdate">
        <va-form ref="udpateForm">
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
              <va-button type="button" v-on:click="save()">
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
  getAccounts,
  getTransactions,
  getCategories,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from '../service';

export default {
  name: 'TransactionList',
  data() {
    return {
      createModal: false,
      updateModal: false,
      transactions: [],
      id: -1,
      users: [],
      accounts: [],
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
    ...mapGetters(['transactionList']),
    mainCategories() {
      return this.categories.filter((item) => item.parentName === '');
    },
  },
  methods: {
    ...mapActions(['fetchTransactions']),
    async initLoad() {
      this.accounts = await getAccounts();
      this.users = await getUsers();
      this.transactions = await getTransactions();
      this.categories = await getCategories();
    },
    async save() {
      if (this.input.id !== -1) {
        await updateTransaction(
          this.input.id,
          this.input.user,
          this.input.category,
          this.input.amount,
          this.input.account,
          this.input.transactionDate,
          this.input.description,
        );
        this.updateModal = false;
      } else {
        await createTransaction(
          this.input.user,
          this.input.category,
          this.input.amount,
          this.input.account,
          this.input.transactionDate,
          this.input.description,
        );
        this.createModal = false;
      }
      this.input.amount = 0;
      this.input.id = -1;
    },
    async remove(id) {
      await deleteTransaction(id);
      await this.initLoad();
    },
    async edit(transaction) {
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
      this.input.amount = amount.toString();
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
    this.fetchTransactions();
  },
};
</script>
<style scoped>
#transactionCreate {
  margin: auto;
}

.container {
  display: flex;
  width: 100%;
}

.main-area {
  width: 80%;
}

.parent-categories {
  width: 20%;
  display: flex;
  flex-direction: vertical;
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

.drop-zone {
  display: flex;
  margin-bottom: 10px;
  padding: 10px;
  justify-content: center;
}
</style>
