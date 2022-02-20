<template>
  <div class="main-category-container" v-for="category in categoryItems" :key="category.id">
    <MainCategoryCard amount="123" :title="category.name" />
    {{ category.parentName }}
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
    updateStatusBudget: { type: Function, required: true },
  },
});
</script>
<style scoped>
.main-category-container {
  margin: 5px 0;
}
</style>
