<template>
  <div v-for="account in mainAccounts"
    :key="account.id"
    class="avatar-container">
    <span>{{ account.source }}</span>
    <q-avatar
      :color="selectedAccountUuid === account.uuid ? 'red': 'red-3'"
      size="80px"
      text-color="white"
      font-size="40px"
      :icon="selectedAccountUuid === account.uuid ? 'check' : ''"
      @click="selectAccount(account)">
    </q-avatar>
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
  },
};
</script>
