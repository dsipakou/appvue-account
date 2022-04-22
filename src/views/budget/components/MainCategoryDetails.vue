<template>
  <q-card flat bordered
    class="row main-panel">
    <div class="row col-12 justify-center header">
      {{ categoryUsage.categoryName }}
    </div>
    <div class="row col-12">
      <div class="row col justify-center">
        <CategoryMonthSummary
          :categoryUsage="categoryUsage"
        />
      </div>
      <div class="row col"></div>
    </div>
    <div class="row justify-start">
      <div
        class="row col-6 justify-center"
        v-for="budget in categoryUsage.budgets"
        :key="budget.title"
      >
        <SubCategoryCard
          :item=budget
          @selectSubCategory="selectSubCategory($event)"
        />
      </div>
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import SubCategoryCard from '@/views/budget/components/SubCategoryCard.vue';
import CategoryMonthSummary from '@/views/budget/components/CategoryMonthSummary.vue';
import { CategoryBudgetUsageItem } from '@/types/Budget';

export default defineComponent({
  name: 'MainCategoryDetails',

  components: {
    SubCategoryCard,
    CategoryMonthSummary,
  },

  emits: [
    'selectSubCategory',
  ],

  props: {
    budgetUsage: { type: Array, required: true },
    categoryUsage: { type: Object as PropType<CategoryBudgetUsageItem>, required: true },
    budgetPlan: { type: Array, required: true },
    items: { type: Array, required: true },
    categories: { type: Array, required: true },
  },

  methods: {
    selectSubCategory(uuid: string) {
      this.$emit('selectSubCategory', uuid);
    },
  },
});
</script>
<style scoped>
.main-panel {
  margin: 5px 0;
  width: 100%;
  max-width: 100%;
  justify-content: start;
  align-content: start;
  padding: 15px;
  border-radius: 20px;
  background-color: #EEE;
}

.header {
  font-size: 22px;
  font-weight: bold;
}
</style>
