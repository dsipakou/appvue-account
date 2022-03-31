<template>
  <div class="row">
    <div class="col-4">
        <div
          class="row main-category-container"
          v-for="[ name, amount ] in Object.entries(monthlyBudget)"
          :key="name">
          <MainCategoryCard
            :amount="amount"
            :title="name"
            :activeCategory="activeCategory.title"
            @categoryClick=mainCategoryClick($event) />
        </div>
    </div>
    <div class="col-8">
      <div class="row" v-show="activeCategory.title && !activeSubCategory.title">
        <MainCategoryDetails
          :budgetUsage="groupedBudgetUsage"
          :budgetPlan="budgetPlan"
          :title="activeCategory.title"
          :items="activeBudget"
          :categories="categoryItems"
          @selectSubCategory="selectSubCategory($event)"
        />
      </div>
      <div class="row" v-show="activeSubCategory.title && activeSubCategoryObject">
        <SubCategoryDetailsPanel
          :category="activeSubCategoryObject"
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
import { BudgetUsage } from '@/types/Budget';
import BudgetUtils from '@/utils/budgetUtils';
import { isSameMonth } from 'date-fns';

interface ActiveCategory {
  index: number,
  title: undefined | string,
}

interface ActiveSubCategory {
  title: undefined | string,
}

interface BudgetItem {
  name: string,
  items: any[],
  amount: number,
}

interface BudgetPlan {
  id: number,
  categoryId: number,
  title: string,
  amount: number,
  budgetDate: string,
  description: string,
  isCompleted: boolean,
  createdAt: string,
  updatedAt: string,
  categoryName: string,
}

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
    createBudget: { type: Function, required: true },
    updateBudget: { type: Function, required: true },
    deleteBudget: { type: Function, required: true },
    budgetUsage: { type: Array as PropType<BudgetUsage[]>, required: true },
    budgetPlan: { type: Array as PropType<BudgetPlan[]>, required: true },
    selectedMonth: { type: Date, required: true },
    updateStatusBudget: { type: Function, required: true },
  },

  data() {
    return {
      activeCategory: {
        title: undefined,
        index: -1,
      } as ActiveCategory,
      activeSubCategory: {
        title: undefined,
      } as ActiveSubCategory,
    };
  },

  computed: {
    monthlyBudget(): { [key: string]: number } {
      const mainCategoryObj = this.budgetPlan.reduce(
        (acc: {[key: string]: number}, item: BudgetPlan) => {
          const amount = acc[item.categoryName] || 0;
          acc[item.categoryName] = amount + item.amount;
          return acc;
        }, {},
      );

      return Object.keys(mainCategoryObj).sort().reduce(
        (acc: {[key: string]: number}, key) => {
          acc[key] = mainCategoryObj[key];
          return acc;
        }, {},
      );
    },

    groupedBudgetUsage() {
      const budgetUtils = new BudgetUtils();
      const filteredMonthBudgetUsage = this.budgetUsage.filter((item: BudgetUsage) => (
        isSameMonth(new Date(this.selectedMonth), new Date(item.budgetDate))
      ));
      return budgetUtils.groupedBudgetUsage(filteredMonthBudgetUsage, this.categoryItems);
    },

    activeBudget(): any | undefined {
      const typedBudgetList = this.groupedBudgetUsage as [];
      const budgetItem: BudgetItem = typedBudgetList.find(
        (item: { name: string, value: string }) => item.name === this.activeCategory.title,
      )! as BudgetItem;
      return budgetItem?.items || undefined;
    },

    activeSubCategoryObject(): any {
      if (this.activeBudget && this.activeSubCategory.title) {
        return this.activeBudget.find((item: any) => item.name === this.activeSubCategory.title);
      }

      return {};
    },
  },

  methods: {
    mainCategoryClick(event: { title: string }) {
      this.activeCategory.title = event.title;
      this.activeSubCategory.title = undefined;
    },

    selectSubCategory(title: string) {
      this.activeSubCategory.title = title;
    },

    closeSubCategory() {
      this.activeSubCategory.title = undefined;
    },

    budgetItemClick(item: BudgetUsage) {
      this.$emit('budgetItemClick', item);
    },
  },

  watch: {
    monthlyBudget() {
      if (!this.activeCategory.title) {
        const name = Object.keys(this.monthlyBudget)[0];
        this.activeCategory.title = name;
      }
    },

    selectedMonth() {
      this.closeSubCategory();
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
