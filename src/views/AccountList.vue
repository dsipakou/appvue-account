<template>
  <div>
    <h3>Account list</h3>
    <div id="accountList">
      <div v-for="account in accounts" :key="account.id">
        {{ account.source }}
      </div>
    </div>
    <div id="accountCreate">
      <form>
        <h3>Create Account</h3>

        <div>
          <label>User</label>
          <input v-model="input.user" placeholder="User" />
        </div>
        <div>
          <label>Source</label>
          <input v-model="input.source" placeholder="Source" />
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
          <button type="button" v-on:click="create()">Create account</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { getAccounts, createAccount } from '@/service';

export default {
  name: 'AccountList',
  data() {
    return {
      accounts: [],
      input: {
        user: '',
        source: '',
        amount: 0,
        description: '',
      },
    };
  },
  methods: {
    async loadAccounts() {
      this.accounts = await getAccounts();
    },
    async create() {
      await createAccount(
        this.input.user,
        this.input.source,
        this.input.amount,
        this.input.description,
      );
    },
  },
  beforeMount() {
    this.loadAccounts();
  },
};
</script>
