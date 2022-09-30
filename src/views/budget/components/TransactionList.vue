<template>
  <div class="column">
    <span>Transactions</span>
    <div
      v-for="item in transactions"
      :key="item.uuid">
      {{ item.spentInCurrencies['BYN'] }}
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
  },
});
</script>
