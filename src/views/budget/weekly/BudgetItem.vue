<template>
  <q-card>
    {{ item.title }}
  </q-card>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { BudgetUsage } from '@/types/Budget';

export default defineComponent({
  name: 'Budget Item',

  props: {
    item: { type: Object as PropType<BudgetUsage>, required: true },
  },
});
</script>
