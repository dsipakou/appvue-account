<template>
  <q-layout view="hHh lpR fFf">
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
      <q-list>
        <q-item>
          <q-item-secion>
            <q-item-label>
              <router-link to="/">Home</router-link>
            </q-item-label>
          </q-item-secion>
        </q-item>
        <q-item>
          <router-link to="/signup">SignUp</router-link>
        </q-item>
        <q-item>
          <router-link to="/accounts">Accounts</router-link>
        </q-item>
        <q-item>
          <router-link to="/transactions">Transactions</router-link>
        </q-item>
        <q-item>
          <router-link to="/categories">Categories</router-link>
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
};
</script>
<style>
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
