<template>
  <q-card flat bordered class="row main-card">
    <div class="row col-12 justify-center">
      <span class="header">{{ item.title }}</span>
    </div>
    <div class="row progress-container">
      <q-linear-progress
          class="progress-bar"
          :value="getProgressRate"
          :color="getProgressColor"
          track-color="grey-6">
        <div class="absolute-full flex flex-center progress-text">
          {{ getProgressRateText }}
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

    getDiff(): string {
      if (!this.item?.amount === undefined) return '';

      return (this.item.amount - this.item.spentInBaseCurrency).toFixed(2);
    },

    getProgressRate(): number {
      if (!this.item?.amount === undefined) return 0;

      if (this.item.amount === 0) return 1;
      return this.item.spentInBaseCurrency / this.item.amount;
    },

    getProgressColor(): string {
      if (!this.item?.amount === undefined) return '';

      if (this.item.amount === 0) return 'brown-14';
      if (this.getProgressRate > 1) return 'red-14';
      return 'green-14';
    },

    getProgressRateText(): string {
      if (!this.item?.amount === undefined) return '';

      if (this.item.amount === 0) return 'Unplanned';
      return `${(this.getProgressRate * 100).toFixed(0)}%`;
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

.remains>.text, .bottom .text {
  margin: 0 5px;
}

.remains>.number, .bottom .number {
  font-weight: bold;
}
</style>
