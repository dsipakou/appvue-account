<template>
  <div class="container">
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
        v-for="category in categories"
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
    <div>
      <va-modal size="medium" v-model="showModal">
    <h3>Transaction list</h3>
    <div class="drag-zone" id="transactionList">
      <div v-for="transaction in transactions" :key="transaction.id">
        {{ transaction.category }} {{ transaction.amount }}
      </div>
    </div>
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
              <td><label>Description</label></td>
              <td><textarea v-model="input.description" placeholder="Description" /></td>
            </tr>
            <tr>
              <td colspan="2">
                <button type="button" v-on:click="create()">Create transaction</button>
              </td>
            </tr>
          </table>
        </form>
      </div>
    </div>
      </va-modal>
    </div>
  </div>
</template>
<script>
import {
  getUsers,
  getAccounts,
  getTransactions,
  getCategories,
  createTransaction,
} from '../service';

export default {
  name: 'TransactionList',
  data() {
    return {
      showModal: false,
      transactions: [],
      users: [],
      accounts: [],
      categories: [],
      input: {
        user: 0,
        category: 0,
        amount: '',
        account: 0,
        description: '',
      },
    };
  },
  methods: {
    async initLoad() {
      this.accounts = await getAccounts();
      this.users = await getUsers();
      this.transactions = await getTransactions();
      this.categories = await getCategories();
    },
    async create() {
      await createTransaction(
        this.input.user,
        this.input.category,
        this.input.amount,
        this.input.account,
        this.input.description,
      );
    },
    startDrag(evt, account) {
      evt.dataTransfer.setData('accountID', account.id);
      evt.dataTransfer.setData('userID', account.userId);
    },
    onDrop(evt, category) {
      this.input.category = category.id;
      this.input.account = Number(evt.dataTransfer.getData('accountID'));
      this.input.user = Number(evt.dataTransfer.getData('userID'));
      this.showModal = true;
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

.container {
  max-width: 1200px;
  margin: auto;
}

.drag-el {
  width: 100px;
  height: 100px;
  background-color: #eee;
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 50%;
  text-align: center;
  margin: auto;
  line-height: 50px;
}

.drop-zone {
  display: flex;
  margin-bottom: 10px;
  padding: 10px;
}
</style>
