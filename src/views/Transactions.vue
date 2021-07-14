<template>
  <div>
    <h3>Transaction list</h3>
    <div class="drag-zone" id="transactionList">
      <div class="drag-el" v-for="transaction in transactions" :key="transaction.id" draggable>
        {{ transaction.category }} {{ transaction.amount }}
      </div>
    </div>
    <div id="transactionCreate">
      <form>
        <h3>Add transaction</h3>

        <div>
          <label>User</label>
          <select v-model="input.user">
            <option disabled value="">Select user</option>
            <option
              v-bind:value="user.id"
              v-for="user in users"
              :key="user.id">{{user.name}}
            </option>
          </select>
        </div>
        <div>
          <label>Account</label>
          <select v-model="input.account">
            <option disabled value="">Select account</option>
            <option
              v-bind:value="account.id"
              v-for="account in accounts"
              :key="account.id">{{account.source}} {{account.id}}
            </option>
          </select>
        </div>
        <div>
          <label>Category</label>
          <input v-model="input.category" placeholder="Category" />
        </div>
        <div>
          <label>Amount</label>
          <input v-model="input.amount" placeholder="Amount" />
        </div>
        <div>
          <label>Description</label>
          <textarea v-model="input.description" placeholder="Description" />
        </div>
        <div>
          <button type="button" v-on:click="create()">Create transaction</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import {
  getUsers,
  getAccounts,
  getTransactions,
  createTransaction,
} from '../service';

export default {
  name: 'TransactionList',
  data() {
    return {
      transactions: [],
      users: [],
      accounts: [],
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
  },
  beforeMount() {
    this.initLoad();
  },
};
</script>
<style scoped>
  .drag-el {
    background-color: #fff;
    margin-bottom: 10px;
    padding: 5px;
  }

  .drop-zone {
    background-color: #eee;
    margin-bottom: 10px;
    padding: 10px;
  }
</style>
