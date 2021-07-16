<template>
  <div class="flex" style="max-width: 1100px; margin: auto;">
    <div class="row">
      <div class="flex md12">
        <h3>Account list</h3>
      </div>
      <va-list fix>
        <div id="accountList">
          <div v-for="account in accounts" :key="account.id">
            <va-list-item>
              {{ account.source }}
            </va-list-item>
          </div>
        </div>
      </va-list>
    </div>
    <va-button v-on:click="showModal = true">Add</va-button>
    <div class="row" id="accountCreate">
      <div class="item">
        <va-modal size="medium" v-model="showModal">
          <va-form>
            <h3>Create Account</h3>

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
              <va-input
                class="mb-4"
                v-model="input.source"
                label="Source"
                placeholder="Where are money come from"
              />
            </div>
            <div>
              <va-input
                class="mb-4"
                v-model="input.amount"
                label="Amount"
                placeholder="How much money"
              />
            </div>
            <div>
              <va-input
                class="mb-4"
                v-model="input.description"
                type="textarea"
                label="Description"
                placeholder="Change description"
                :min-rows="7"
                :max-rows="11"
              />
            </div>
            <div>
              <va-button v-on:click="create()">Create account</va-button>
            </div>
          </va-form>
        </va-modal>
      </div>
    </div>
  </div>
</template>
<script>
import { getUsers, getAccounts, createAccount } from '../service';

export default {
  name: 'AccountList',
  data() {
    return {
      accounts: [],
      users: [],
      showModal: false,
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
      this.users = await getUsers();
    },
    async create() {
      await createAccount(
        this.input.user,
        this.input.source,
        this.input.amount,
        this.input.description,
      );
      await this.loadAccounts();
    },
  },
  beforeMount() {
    this.loadAccounts();
  },
};
</script>
