<template>
  <div class="container">
    <div class="row title--main">
      This month
    </div>
    <div class="row remains">
      <span class="number">{{ getDiff?.toFixed(2) }}</span>
      <span class="text" v-if="negativeDiff">over</span>
      <span class="text" v-else>left</span>
    </div>
    <div class="row">
      <q-linear-progress
        size="50px"
        :value="getProgressRate"
        class="progress-bar"
        :color="getDiff < 0 ? 'red-14' : 'green-14'"
        track-color="grey-6">
        <div class="absolute-full flex flex-center progress-text">
          {{ Math.min((getProgressRate * 100)?.toFixed(0), 100) }}%
        </div>
      </q-linear-progress>
    </div>
    <div class="row bottom">
      <div class="row col spent-container">
        <span class="number">{{ categoryUsage.spentInBaseCurrency?.toFixed(2) }}</span>
        <span class="text">spent</span>
      </div>
      <div class="row col overall-container">
        <span class="text">of</span>
        <span class="number">{{ categoryUsage.planned?.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CategoryBudgetUsageItem } from '@/types/Budget';

export default defineComponent({
  name: 'Category Month Summary component',

  props: {
    categoryUsage: { type: Object as PropType<CategoryBudgetUsageItem>, required: true },
  },

  computed: {
    getDiff(): number {
      return this.categoryUsage.planned - this.categoryUsage.spentInBaseCurrency;
    },

    negativeDiff() {
      return this.getDiff < 0;
    },

    getProgressRate(): number {
      if (this.categoryUsage.planned === 0) return 1;
      return this.categoryUsage.spentInBaseCurrency / this.categoryUsage.planned;
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
