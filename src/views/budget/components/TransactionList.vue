<template>
  <div class="column container" v-show="transactions?.length > 0">
    <span class="text-h5">Transactions</span>
    <div
      class="inner"
      v-for="item in transactions"
      :key="item.uuid">
      {{ item.transactionDate }} |
      {{ item.spentInCurrencies[defaultCurrency].toFixed(2) }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { BudgetUsageItem } from '@/types';

export default defineComponent({
  name: 'Budget item transaction list',

  props: {
    transactions: { type: Array as PropType<Array<BudgetUsageItem>>, required: true },
    defaultCurrency: { type: String, required: true },
  },
});
</script>

<style scoped>
.container {
  border: 1px solid #7b7575;
  padding: 15px;
  border-radius: 5px;
}

.inner {
  border-top: 1px solid #7b7575;
  padding-top: 3px;
}
</style>
