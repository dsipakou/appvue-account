<template>
  <div>
    <div class="row">
      <div class="flex md12">
        <h3>Account list</h3>
      </div>
      <va-list fix>
        <div id="account-list">
          <div v-for="account in accountList" :key="account.id">
            <q-card flat bordered class="item">
              <q-card-section horizontal class="item-content">
                <q-card-section class="item-title">
                  {{ account.source }}
                  {{ account.amount }}
                </q-card-section>
                <q-card-section>
                  <q-btn-dropdown flat dropdown-icon="more_vert">
                    <q-list>
                      <q-item clickable v-close-popup @click="edit(account)">
                        <q-item-section>
                          <q-item-label>Edit</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="deleteAccount(account.id)">
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
    <q-dialog v-model="updateForm">
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
              selected-item="1"
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
            <q-input
              outlined
              stack-label
              type="textarea"
              label="Description"
              v-model="input.description" />
          </q-card-section>

          <q-card-actions align="center" class="action-buttons">
            <q-btn color="primary" rounded style="width: 100px;" @click="update()">Save</q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import {
  mapActions,
  mapGetters,
} from 'vuex';
import { ref } from 'vue';

export default {
  name: 'AccountList',
  setup() {
    return {
      updateForm: ref(false),
    };
  },

  data() {
    return {
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
      'userList',
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

  },

  methods: {
    ...mapActions([
      'createAccount',
      'deleteAccount',
      'updateAccount',
    ]),

    save() {
      const account = {
        userId: this.input.user,
        source: this.input.source,
        amount: this.input.amount,
        description: this.input.description,
      };
      this.createAccount(account);
    },

    edit(account) {
      const {
        id,
        userId,
        source,
        amount,
        description,
      } = account;

      this.input.id = id;
      this.input.user = userId;
      this.input.source = source;
      this.input.amount = amount;
      this.input.description = description;
      this.updateForm = true;
    },

    update() {
      const account = {
        id: this.input.id,
        userId: this.input.user,
        source: this.input.source,
        amount: this.input.amount.toString(),
        description: this.input.description,
      };

      this.updateAccount(account);
      this.updateForm = false;
    },

  },
};
</script>
<style scoped>
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
