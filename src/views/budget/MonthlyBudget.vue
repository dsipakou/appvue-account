<template>
  <div class="main-category-container" v-for="budget in budgetList" :key="budget.id">
    <MainCategoryCard :amount="budget.amount" :title="budget.name" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import MainCategoryCard from '@/views/budget/components/MainCategoryCard.vue';

export default defineComponent({
  name: 'MonthlyBudget',

  components: {
    MainCategoryCard,
  },

  props: {
    budgetItems: { type: Array, required: true },
    categoryItems: { type: Array, required: true },
    createBudget: { type: Function, required: true },
    updateBudget: { type: Function, required: true },
    deleteBudget: { type: Function, required: true },
    budgetUsage: { type: Array, required: true },
    selectedMonth: { type: Date, required: true },
    updateStatusBudget: { type: Function, required: true },
  },

  computed: {
    groupedByName(): Array<any> {
      return this.budgetItems.reduce((acc, item) => {
        const arr = acc[item.title] || [];
        arr.push(item);
        acc[item.title] = arr;
        return acc;
      }, {});
    },

    groupedByCategory(): object {
      const categoryClass = {};
      Object.entries(this.groupedByName).forEach((item) => {
        const { categoryId } = item[1][0];
        const categoryName = categoryId === null
          ? 'undefined'
          : this.categoryItems.find((category) => category.id === categoryId).name;
        const arr = categoryClass[categoryName] || [];
        const sortedGroupedBudgets = item[1].sort((a, b) => {
          if (a.budgetDate < b.budgetDate) {
            return -1;
          }
          if (a.budgetDate > b.budgetDate) {
            return 1;
          }
          return 0;
        });
        arr.push({
          name: item[0],
          value: sortedGroupedBudgets,
          amount: item[1].reduce((acc, subItem) => acc + subItem.amount, 0),
        });
        categoryClass[categoryName] = arr;
      });
      return categoryClass;
    },

    budgetList() {
      const groupedList = [];
      Object.entries(this.groupedByCategory).forEach((item) => {
        const categoryItem = {
          name: item[0],
          value: item[1],
          amount: item[1].reduce((acc, subItem) => acc + subItem.amount, 0),
        };
        if (categoryItem.name === 'undefined') {
          groupedList.unshift(categoryItem);
        } else {
          groupedList.push(categoryItem);
        }
      });

      return groupedList.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    },
  },
});
</script>
<style scoped>
.main-category-container {
  margin: 5px 0;
}
</style>
