<template>
  <div class="row">
    <div class="col-4">
      <div
        class="row main-category-container"
        v-for="item in budgetUsage"
        :key="item.categoryName">
        <MainCategoryCard
          :planned="item.planned"
          :spent="item.spentInBaseCurrency"
          :title="item.categoryName"
          :activeCategory="activeCategory.categoryName"
          @categoryClick=mainCategoryClick($event) />
      </div>
    </div>
    <div class="col-8">
      <div class="row" v-show="activeCategory.categoryName && !activeSubCategory">
        <MainCategoryDetails
          :budgetUsage="budgetUsage"
          :budgetArchive="budgetArchive"
          :categoryUsage="activeCategory"
          :items="activeBudget"
          :categories="categoryItems"
          @selectSubCategory="selectSubCategory($event)"
        />
      </div>
      <div class="row" v-show="activeSubCategory !== undefined">
        <SubCategoryDetailsPanel
          :budgets="activeSubCategory?.items"
          :category="activeSubCategory"
          :selectedMonth="selectedMonth"
          @closeSubCategory="closeSubCategory"
          @budgetItemClick="budgetItemClick($event)"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import MainCategoryCard from '@/views/budget/components/MainCategoryCard.vue';
import MainCategoryDetails from '@/views/budget/components/MainCategoryDetails.vue';
import SubCategoryDetailsPanel from '@/views/budget/subcategory/SubCategoryDetailsPanel.vue';
import { Category } from '@/types';
import {
  CategoryBudgetUsageItem,
  BudgetPlan,
  GroupedBudgetUsageItem,
  BudgetArchive,
} from '@/types/Budget';
import {
  DATE_FORMAT,
} from '@/utils/dateTimeUtils';
import { format } from 'date-fns';

export default defineComponent({
  name: 'MonthlyBudget',

  components: {
    MainCategoryCard,
    MainCategoryDetails,
    SubCategoryDetailsPanel,
  },

  emits: [
    'budgetItemClick',
  ],

  props: {
    categoryItems: { type: Array as PropType<Category[]>, required: true },
    budgetArchive: { type: Array as PropType<BudgetArchive[]>, required: true },
    createBudget: { type: Function, required: true },
    updateBudget: { type: Function, required: true },
    deleteBudget: { type: Function, required: true },
    budgetUsage: { type: Array as PropType<CategoryBudgetUsageItem[]>, required: true },
    budgetPlan: { type: Array as PropType<BudgetPlan[]>, required: true },
    selectedMonth: { type: Date, required: true },
    updateStatusBudget: { type: Function, required: true },
    fetchBudgetArchive: { type: Function, required: true },
  },

  data() {
    return {
      activeCategory: {} as CategoryBudgetUsageItem,
      activeSubCategory: undefined as GroupedBudgetUsageItem | undefined,
    };
  },

  methods: {
    mainCategoryClick(event: { title: string }) {
      this.activeCategory = this.getCategoryByName(event.title);
      this.activeSubCategory = undefined;
    },

    selectSubCategory(uuid: string) {
      this.activeSubCategory = this.activeCategory.budgets.find(
        (item: GroupedBudgetUsageItem) => item.uuid === uuid,
      );
    },

    closeSubCategory() {
      this.activeSubCategory = undefined;
    },

    getCategoryByName(name: string): CategoryBudgetUsageItem {
      return this.budgetUsage.find((item: CategoryBudgetUsageItem) => item.categoryName === name)!;
    },

    budgetItemClick(item: CategoryBudgetUsageItem) {
      this.$emit('budgetItemClick', item);
    },

    fetchArchive() {
      console.log('fetching archive');
      this.fetchBudgetArchive({
        date: format(this.selectedMonth, DATE_FORMAT),
        category: this.activeCategory.uuid,
      });
    },
  },

  watch: {
    budgetUsage() {
      if (this.budgetUsage.length > 0) {
        [this.activeCategory] = this.budgetUsage;
      }
    },

    selectedMonth() {
      this.closeSubCategory();
      this.fetchArchive();
    },

    activeCategory() {
      this.fetchArchive();
    },
  },
});
</script>
<style scoped>
.main-category-container {
  margin: 5px 0;
  justify-content: center;
}
</style>
