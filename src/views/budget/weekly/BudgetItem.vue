<template>
  <q-card flat bordered class="row main-card">
    <div class="row col-12 justify-center">
      <span class="header">{{ item.title }}</span>
    </div>
    <div class="row progress-container">
      <q-linear-progress
          class="progress-bar"
          value=0.5
          color="blue"
          track-color="grey-6">
        <div class="absolute-full flex flex-center progress-text">
          51%
        </div>
      </q-linear-progress>
      <div class="row bottom">
        <div class="row desc-text col-6">
          <span class="number">{{ getActualUsage }}</span>
          <span class="text">spent</span>
        </div>
        <div class="row desc-text justify-end col-6">
          <span class="text">of</span>
          <span class="number">{{ getPlanned }}</span>
        </div>
      </div>
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

  computed: {
    getPlanned(): string {
      if (this.item?.amount === undefined) return '';

      return this.item?.amount.toFixed(2);
    },

    getActualUsage(): string {
      if (this.item?.amount === undefined) return '';

      return this.item?.spentInBaseCurrency?.toFixed(2) || '0.00';
    },
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

.progress-container {
  margin: 0 33px;
}

.progress-bar {
  border-radius: 2px;
  height: 15px;
}

.progress-text {
  font-size: 12px;
  color: white;
  align-content: center;
  font-weight: bold;
}
</style>
