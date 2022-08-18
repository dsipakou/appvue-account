<template>
  <div v-for="account in mainAccounts"
    :key="account.id"
    class="account-container">
    <span>{{ account.title }}</span>
    <div
      class="account-inner"
      :class="isActiveAccount(account) ? 'selected-category': ''"
      @click="selectAccount(account)">
      <q-icon name="check" v-show="isActiveAccount(account)" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'MainAccounts',

  props: {
    accountList: { type: Array, required: true },
    selectedAccountUuid: { type: String, required: true },
  },

  emits: [
    'selectAccount',
  ],

  computed: {
    mainAccounts() {
      return this.accountList.filter((item) => item.isMain);
    },
  },

  methods: {
    selectAccount(account) {
      this.$emit('selectAccount', account);
    },

    isActiveAccount(account) {
      return this.selectedAccountUuid === account.uuid;
    },
  },
};
</script>

<style scoped>
.account-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.account-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 60px;
  color: white;
  background-color: rgba(255, 0, 0, 0.2);
  font-size: 40px;
  margin: 0 10px;
  border-radius: 5px;
  cursor: pointer;
}

.selected-category {
  background-color: red;
}
</style>
