<template>
  <q-card flat class="container">
    <div class="row col-12 title--main">{{ item.name }}</div>
    <div class="row progress-container">
      <div class="row col-12 justify-center remains">
        <span class="number">{{ Math.abs(getDiff) }}</span>
        <span class="text" v-if="getDiff < 0">over</span>
        <span class="text" v-else>left</span>
      </div>
      <div class="row desc-text multiply">
        <span>{{ getMultiplier(item.name) }}x</span>
      </div>
      <q-linear-progress
        class="progress-bar"
        :value="getProgressRate"
        :color="getDiff < 0 ? 'red-14' : 'green-14'"
        size="34px"
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
import { Category } from '@/types';
import { BudgetPlan } from '@/types/Budget';
import '@splidejs/splide/dist/css/themes/splide-skyblue.min.css';

export default defineComponent({
  name: 'SubCategoryCard',

  props: {
    item: { type: Object, required: true },
    categories: { type: Array as PropType<Category[]>, required: true },
    budgetPlan: { type: Array as PropType<BudgetPlan[]>, required: true },
  },

  computed: {
    getPlanned(): string {
      return this.item.planned.toFixed(2);
    },

    getActualUsage(): string {
      return this.item.actualUsage.toFixed(2);
    },

    getDiff(): string {
      return (this.item.planned - this.item.actualUsage).toFixed(2);
    },

    getProgressRate(): number {
      if (this.item.planned === 0) return 1;
      return this.item.actualUsage / this.item.planned;
    },

    getProgressRateText(): string {
      if (this.item.planned === 0) return 'Unplanned';
      return `${(this.getProgressRate * 100).toFixed(0)}%`;
    },
  },

  methods: {
    getCategory(id: number): Category|undefined {
      return this.categories.find((item: Category) => item.id === id);
    },

    getMultiplier(title: string): number {
      return this.budgetPlan.filter((item: BudgetPlan) => item.title === title)?.length || 0;
    },
  },
});
</script>
<style scoped>
.container {
  width: 95%;
  height: 162px;
  width: 362px;
  margin: 10px 0;
  border-radius: 10px;
}

.progress-text {
  font-size: 13px;
  color: white;
}

.title

.content {
  display: flex;
  flex-direction: column;
}

.title--main {
  white-space: nowrap;
  font-size: 18px;
  padding: 15px 0 0 15px;
}

.caption--main {
  white-space: nowrap;
  font-size: 16px;
}

.remains {
  margin-top: 5px;
  font-size: 14px;
}

.progress-container {
  margin: 0 36px;
}

.multiply {
  font-size: 10px;
  margin-bottom: 5px;
}

.progress-bar {
  font-size: 13px;
  font-weight: bold;
  color: white;
}

.bottom {
  font-size: 10px;
  margin-top: 5px;
}

.desc-text {
  padding: 0 5px;
}

.remains>.text, .bottom .text {
  margin: 0 5px;
}

.remains>.number, .bottom .number {
  font-weight: bold;
}
</style>
