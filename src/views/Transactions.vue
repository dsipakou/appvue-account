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
        @drop="onDrop($event)"
        @dragover.prevent
        @dragenter.prevent
        >
        <span>
          {{ category.name }}
        </span>
      </div>
    </div>
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
          <table class="va-table">
            <tr>
              <td><label>User</label></td>
              <td>
                <select v-model="input.user">
                  <option disabled value="">Select user</option>
                  <option
                    v-bind:value="user.id"
                    v-for="user in users"
                    :key="user.id">{{user.name}}
                  </option>
                </select>
              </td>
            </tr>
            <tr>
              <td><label>Account</label></td>
              <td>
                <select v-model="input.account">
                  <option disabled value="">Select account</option>
                  <option
                    v-bind:value="account.id"
                    v-for="account in accounts"
                    :key="account.id">{{account.source}} {{account.id}}
                  </option>
                </select>
              </td>
            </tr>
            <tr>
              <td><label>Category</label></td>
              <td>
                <input v-model="input.category" placeholder="Category" />
              </td>
            </tr>
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
      transactions: [],
      users: [],
      accounts: [],
      categories: [],
      input: {
        user: '',
        category: '',
        amount: 0,
        account: '',
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
    startDrag(evt, item) {
      // eslint-disable-next-line
      console.log(item.id);
    },
    onDrop(evt) {
      // eslint-disable-next-line
      console.log(evt);
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
