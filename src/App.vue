<template>
  <q-layout view="hHh lpR fFf" class="container">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Flying Budget
        </q-toolbar-title>

        <q-space />

        <q-btn no-caps stretch flat
          v-show="!activeUser"
          label="Login"
          to="/login" />

        <q-select outlined label-stacked dense
          label="Active Currency"
          bg-color="white"
          style="max-width: 200px;"
          :options="currencyList"
          option-value="code"
          option-label="verbalName"
          map-options
          emit-value
          v-model="activeCurrency"
          />

        <q-space />

        <span
          v-show="activeUser">{{this.activeUser}}
        </span>

        <q-btn no-caps stretch flat
          label="Logout"
          v-show="activeUser"
          @click="logoutUser()" />
      </q-toolbar>
    </q-header>

    <q-drawer overlay persistent bordered mini
      v-model="leftDrawerOpen"
      side="left">
      <q-list class="q-pt-md">
        <q-item exact clickable
          class="menu-item q-pl-md"
          active-class="menu-item__active"
          to="/">
          <q-item-section>
            Home
          </q-item-section>
        </q-item>
        <q-item exact clickable
          class="menu-item q-pl-md"
          active-class="menu-item__active"
          to="/accounts">
          <q-item-section avatar>
            <q-avatar>
              <img src="../dist/icons/accounts.png" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Accounts
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item exact clickable
          class="menu-item q-pl-md"
          active-class="menu-item__active"
          to="/transactions">
          <q-item-section avatar>
            <q-avatar>
              <img src="../dist/icons/transactions.png" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Transactions
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item exact clickable
          class="menu-item q-pl-md"
          active-class="menu-item__active"
          to="/budget">
          <q-item-section avatar>
              <q-avatar>
                <img src="../dist/icons/budget.png" />
              </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Budget
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item exact clickable
          class="menu-item q-pl-md"
          active-class="menu-item__active"
          to="/categories">
          <q-item-section avatar>
              <q-avatar>
                <img src="../dist/icons/categories.png" />
              </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Categories
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item exact clickable
          class="menu-item q-pl-md"
          active-class="menu-item__active"
          to="/currencies">
          <q-item-section avatar>
            <q-avatar>
              <img src="../dist/icons/currency.png" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Currencies
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item exact clickable
          class="menu-item q-pl-md"
          active-class="menu-item__active"
          to="/reports">
          <q-item-section avatar>
              <q-avatar>
                <img src="../dist/icons/reports.png" />
              </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Reports
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view class="main-container" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed } from 'vue';
import {
  mapActions,
  mapGetters,
  useStore,
} from 'vuex';

export default {
  setup() {
    const $store = useStore();
    const leftDrawerOpen = ref(false);
    const activeCurrency = computed({
      get: () => $store.state.users.defaultCurrency,
      set: (val) => {
        $store.commit('updateCurrency', val);
      },
    });
    return {
      leftDrawerOpen,
      activeCurrency,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },

  computed: {
    ...mapGetters([
      'activeUser',
      'currencyList',
    ]),
  },

  methods: {
    ...mapActions([
      'fetchAccounts',
      'fetchCategories',
      'fetchCurrencies',
      'fetchUsers',
      'fetchRates',
      'logoutUser',
      'loadUser',
      'changeCurrency',
    ]),
  },

  watch: {
    activeCurrency() {
      this.changeCurrency(this.activeCurrency);
    },
  },

  beforeMount() {
    this.fetchAccounts();
    this.fetchCategories();
    this.fetchCurrencies();
    this.fetchRates();
    this.fetchUsers();
    this.loadUser();
  },
};
</script>
<style>
.container {
  background: #EFEFEF;
}
#app {
  font-family: 'Nunito', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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

.main-container {
  display: flex;
  max-width: 1200px;
  flex-direction: column;
  justify-content: center;
  margin: auto !important;
}

.menu-item {
  color: #141715;
  font-size: 16px;
  font-weight: bolder;
  justify-content: left;
}

.menu-item__active {
  color: #7D83E0 !important;
  font-size: 16px;
  font-weight: bold;
}

</style>
