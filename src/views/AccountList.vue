<template>
  <div>
    <div class="row">
      <div class="flex md12">
        <h3>Account list</h3>
      </div>
      <va-list fix>
        <div id="account-list">
          <div v-for="account in accountList" :key="account.id">
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
                  v-for="user in userList"
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
              <va-button v-on:click="save()">Create account</va-button>
            </div>
          </va-form>
        </va-modal>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapActions,
  mapGetters,
} from 'vuex';

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
  computed: {
    ...mapGetters([
      'accountList',
      'isAccountListLoading',
      'userList',
      'isUserListLoading',
    ]),
  },
  methods: {
    ...mapActions(['createAccount']),
    save() {
      const account = {
        userId: this.input.user,
        source: this.input.source,
        amount: this.input.amount,
        description: this.input.description,
      };
      this.createAccount(account);
    },
  },
};
</script>
