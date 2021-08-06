<template>
  <q-layout view="hHh lpR fFf" class="container">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Title
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      persistent
      bordered>
      <q-list padding class="text-primary">
        <q-item to="/" exact clickable>
          <q-item-section>
            <q-item-label>
              Home
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/signup" exact clickable>
          <q-item-section>
            <q-item-label>
              SignUp
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/accounts" exact clickable>
          <q-item-section>
            <q-item-label>
              Accounts
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/transactions" exact clickable>
          <q-item-section>
            <q-item-label>
              Transactions
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/categories" exact clickable>
          <q-item-section>
            <q-item-label>
              Categories
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view class="main" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue';
import {
  mapActions,
} from 'vuex';

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  methods: {
    ...mapActions([
      'fetchAccounts',
      'fetchCategories',
      'fetchTransactions',
      'fetchUsers',
      'fetchCurrencies',
      'fetchRates',
    ]),
  },
  beforeMount() {
    this.fetchAccounts();
    this.fetchCategories();
    this.fetchTransactions();
    this.fetchUsers();
    this.fetchCurrencies();
    this.fetchRates();
  },
};
</script>
<style>
.container {
  background: #EFEFEF;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.main {
  display: flex;
  max-width: 1200px;
  flex-direction: column;
  justify-content: center;
  margin: auto;
}

</style>
