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
          @closeSubCategory="closeSubCategory"
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
import { Budget, Category } from '@/types';

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

  props: {
    categoryItems: { type: Array as PropType<Category[]>, required: true },
    createBudget: { type: Function, required: true },
    updateBudget: { type: Function, required: true },
    deleteBudget: { type: Function, required: true },
    budgetUsage: { type: Array, required: true },
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
      return this.budgetPlan.reduce((acc: {[key: string]: number}, item: BudgetPlan) => {
        const amount = acc[item.categoryName] || 0;
        acc[item.categoryName] = amount + item.amount;
        return acc;
      }, {});
    },

    groupedByName(): object {
      return this.budgetUsage.reduce((acc: {[key: string]: Budget[]}, item: any) => {
        const arr: Budget[] = acc[item.title] || [];
        arr.push(item);
        acc[item.title] = arr;
        return acc;
      }, {});
    },

    groupedByCategory(): object {
      const categoryClass: {[key: string]: any[]} = {};
      Object.entries(this.groupedByName).forEach((item) => {
        const { categoryId } = item[1][0];
        const categoryName = categoryId === null
          ? 'undefined'
          : this.categoryItems.find((category) => category.id === categoryId)!.name;
        const arr: any[] = categoryClass[categoryName] || [];
        const sortedGroupedBudgets = item[1].sort(
          (a: { budgetDate: string }, b: { budgetDate: string }) => {
            if (a.budgetDate < b.budgetDate) {
              return -1;
            }
            if (a.budgetDate > b.budgetDate) {
              return 1;
            }
            return 0;
          },
        );

        const countedPlannedObject = item[1].reduce(
          (acc: {
            ids: number[],
            sum: number
          }, subItem: {
            id: number,
            amount: number
          }) => {
            if (!acc.ids.includes(subItem.id)) {
              acc.ids.push(subItem.id);
              acc.sum += subItem.amount;
            }
            return acc;
          }, { ids: [], sum: 0 },
        );
        const group = {
          name: item[0],
          items: sortedGroupedBudgets,
          planned: countedPlannedObject.sum,
          actualUsage: item[1].reduce(
            (
              acc: number,
              subItem: { spentInBaseCurrency: number },
            ) => acc + subItem.spentInBaseCurrency, 0,
          ),
        };
        arr.push(group);
        categoryClass[categoryName] = arr;
      });
      return categoryClass;
    },

    groupedBudgetUsage() {
      const groupedList: any[] = [];
      Object.entries(this.groupedByCategory).forEach((item) => {
        const categoryItem = {
          name: item[0],
          items: item[1],
          planned: item[1].reduce(
            (acc: number, subItem: { planned: number }) => acc + subItem.planned, 0,
          ),
          actualUsage: item[1].reduce(
            (acc: number, subItem: { actualUsage: number }) => acc + subItem.actualUsage, 0,
          ),
        };
        if (categoryItem.name === 'undefined') {
          groupedList.unshift(categoryItem);
        } else {
          groupedList.push(categoryItem);
        }
      });
      return groupedList.sort((a: { name: string }, b: { name: string }) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
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
  },
});
</script>
<style scoped>
.main-category-container {
  margin: 5px 0;
  justify-content: center;
}
</style>
