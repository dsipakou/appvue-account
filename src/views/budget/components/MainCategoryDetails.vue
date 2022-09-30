<template>
  <q-card flat bordered
    class="row main-panel">
    <div class="row col-12 justify-center header">
      {{ categoryUsage.categoryName }}
    </div>
    <div class="row col-12">
      <div class="row col-6 justify-center">
        <CategoryMonthSummary
          :categoryUsage="categoryUsage"
          :defaultCurrency="defaultCurrency"
        />
      </div>
      <div class="row col-6">
        <CategoryLastSixMonths
          :budgetArchive="budgetArchive"
        />
      </div>
    </div>
    <div class="row justify-start">
      <div
        class="row col-6 justify-center"
        v-for="budget in categoryUsage.budgets"
        :key="budget.title"
      >
        <SubCategoryCard
          :activeUser="activeUser"
          :item=budget
          :defaultCurrency="defaultCurrency"
          :userList="userList"
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
import CategoryLastSixMonths from '@/views/budget/components/CategoryLastSixMonths.vue';
import { CategoryBudgetUsageItem, BudgetArchive, User } from '@/types';

export default defineComponent({
  name: 'MainCategoryDetails',

  components: {
    SubCategoryCard,
    CategoryMonthSummary,
    CategoryLastSixMonths,
  },

  emits: [
    'selectSubCategory',
  ],

  props: {
    activeUser: { type: String, required: true },
    userList: { type: Array as PropType<Array<User>>, required: true },
    budgetUsage: { type: Array, required: true },
    budgetArchive: { type: Array as PropType<BudgetArchive[]>, required: true },
    categoryUsage: { type: Object as PropType<CategoryBudgetUsageItem>, required: true },
    defaultCurrency: { type: String, required: true },
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
