<template>
  <q-expansion-item expand-separator dense
    label="Additional accounts"
    class="q-mt-sm justify-center dropdown">
    <div class="q-mt-sm row" style="width: 250px;">
      <div
        v-for="account in secondaryAccounts"
        :key="account.id"
        class="avatar-container col justify-center">
        <span>{{ account.title }}</span>
        <q-avatar
          :color="selectedAccountUuid === account.uuid ? 'red' : 'red-3'"
          size="60px"
          font-size="30px"
          text-color="white"
          :icon="selectedAccountUuid === account.uuid ? 'check' : ''"
          @click="selectAccount(account)">
        </q-avatar>
      </div>
    </div>
  </q-expansion-item>
</template>
<script>
export default {
  name: 'AdditionalAccounts',

  props: {
    accountList: { type: Array, required: true },
    selectedAccountUuid: { type: String, required: true },
  },

  emits: [
    'selectAccount',
  ],

  computed: {
    secondaryAccounts() {
      return this.accountList.filter((item) => !item.isMain);
    },
  },

  methods: {
    selectAccount(account) {
      this.$emit('selectAccount', account);
    },
  },
};
</script>
<style scoped>
.avatar-container {
  width: 200px;
}

.dropdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
</style>
