<template>
  <div v-for="account in mainAccounts"
    :key="account.id"
    class="avatar-container">
    <span>{{ account.source }}</span>
    <q-avatar
      :color="selectedAccountId === account.id ? 'red': 'red-3'"
      size="80px"
      text-color="white"
      font-size="40px"
      :icon="selectedAccountId === account.id ? 'check' : ''"
      @click="selectAccount(account)">
    </q-avatar>
  </div>
</template>
<script>
export default {
  name: 'MainAccounts',

  props: {
    accountList: { type: Array, required: true },
    selectedAccountId: { type: Number, required: true },
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
  },
};
</script>
