<template>
  <q-card flat bordered class="row main-card">
    <div class="row col-12 justify-center">
      <span class="header">{{ item.title }}</span>
    </div>
    <div class="row col-12">
      {{ item.budgetDate }}
    </div>
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
<style scoped>
.main-card {
  height: 73px;
  width: 350px;
  max-width: 350px;
}

.header {
  font-size: 18px;
}
</style>
