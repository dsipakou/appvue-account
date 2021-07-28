<template>
  <div>
    <div class="row">
      <div class="header">
        <span>Your accounts</span>
        <div>
          <q-btn
            rounded
            color="primary"
            icon="add"
            unelevated
            @click="add()">
            Add account
          </q-btn>
        </div>
      </div>
      <div id="account-list">
        <div v-for="account in accountList" :key="account.id">
          <q-card flat class="item">
            <q-card-section horizontal class="item-content">
              <q-card-section class="item-title">
                {{ account.source }}
                {{ account.amount }}
              </q-card-section>
              <q-card-section>
                <q-btn-dropdown flat dropdown-icon="more_horiz">
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
    </div>
    <q-dialog v-model="createForm">
      <q-card class="shadow-24" style="width: 400px;">
        <q-card-section>
          <h4>Create account</h4>
        </q-card-section>

        <q-separator />

        <q-form>
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
            <q-btn color="primary" rounded style="width: 100px;" @click="create()">Save</q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
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
      createForm: ref(false),
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

    add() {
      this.input.user = '';
      this.input.source = '';
      this.input.amount = '';
      this.input.description = '';

      this.createForm = true;
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

    create() {
      const account = {
        userId: this.input.user.value,
        source: this.input.source,
        amount: this.input.amount,
        description: this.input.description,
      };
      this.createAccount(account);
      this.createForm = false;
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
#account-list {
  width: 100%;
  margin-top: 30px;
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
