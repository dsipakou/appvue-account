<template>
  <div class="container">
    <div class="row title--main">
     This month
    </div>
    <div class="row remains">
      <span class="number">{{ Math.abs(getDiff(title)).toFixed(2) }}</span>
      <span class="text" v-if="getDiff(title) < 0">over</span>
      <span class="text" v-else>left</span>
    </div>
    <div class="row">
      <q-linear-progress
        size="50px"
        :value="getProgressRate(title)"
        class="progress-bar"
        :color="getDiff(title) < 0 ? 'red-14' : 'green-14'"
        track-color="grey-6">
        <div class="absolute-full flex flex-center progress-text">
          {{ Math.min((getProgressRate(title) * 100).toFixed(0), 100) }}%
        </div>
      </q-linear-progress>
    </div>
    <div class="row bottom">
      <div class="row col spent-container">
        <span class="number">{{ getActualAmount(title).toFixed(2) }}</span>
        <span class="text">spent</span>
      </div>
      <div class="row col overall-container">
        <span class="text">of</span>
        <span class="number">{{ getPlannedAmount(title).toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface BudgetUsageItem {
  name: string,
  amount: number,
}

interface BudgetPlannedItem {
  name: string,
  items: object[],
  amount: number,
}

export default defineComponent({
  name: 'Category Month Summary component',

  props: {
    budgetList: { type: Array as PropType<BudgetPlannedItem[]>, required: true },
    budgetUsage: { type: Array as PropType<BudgetUsageItem[]>, required: true },
    title: { type: String, required: true },
  },

  methods: {
    getPlannedAmount(category: string): number {
      const budgetItem: BudgetPlannedItem | undefined = this.budgetList.find(
        (item: BudgetPlannedItem) => item.name === category,
      );
      return budgetItem?.amount || 0;
    },

    getActualAmount(category: string): number {
      const budgetItem: BudgetUsageItem | undefined = this.budgetUsage.find(
        (item: BudgetUsageItem) => item.name === category,
      );
      return budgetItem?.amount || 0;
    },

    getDiff(category: string): number {
      return this.getPlannedAmount(category) - this.getActualAmount(category);
    },

    getProgressRate(category: string): number {
      const planned: number = this.getPlannedAmount(category);
      if (planned === 0) return 1;
      return this.getActualAmount(category) / this.getPlannedAmount(category);
    },
  },
});
</script>
<style scoped>
.title--main {
  font-size: 16px;
  font-weight: bold;
}

.remains {
  margin: 47px 0 12px 0;
  justify-content: center;
  font-size: 16px;
}

.progress-bar {
  height: 50px;
  width: 361px;
  background-color: #FFFFFF;
  border-radius: 3px;
}

.progress-text {
  font-size: 16px;
  font-weight: bold;
  color: white;
}

.bottom {
  font-size: 11px;
}

.spent-container {
  margin: 5px 0 0 5px;
}

.overall-container {
  margin: 5px 5px 0 0;
  justify-content: end;
}

.remains>.text, .bottom .text {
  margin: 0 5px;
}

.remains>.number, .bottom .number {
  font-weight: bold;
}

</style>
