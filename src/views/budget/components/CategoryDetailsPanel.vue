<template>
  <div class="row bg-blue-grey-4 justify-center sub-categories">
    <div class="row justify-center text-h4 text-white q-pt-md">
      {{ category.name }}
    </div>
    <div class="row justify-center" style="width: 100%;">
      <template v-for="budgetItem in categoryItems" :key="budgetItem.name">
        <BudgetCard
          :budgetItem="budgetItem"
          :updateStatus="updateStatus"
          @budgetItemClick="budgetItemClick($event)"/>
      </template>
    </div>
  </div>
</template>
<script>
import BudgetCard from './BudgetCard.vue';

export default {
  name: 'CategoryDetailsPanel',

  props: {
    category: { type: Object, required: true },
    categoryItems: { type: Array, required: true },
    updateStatus: { type: Function, required: true },
  },

  components: {
    BudgetCard,
  },

  emits: [
    'budgetItemClick',
  ],

  methods: {
    budgetItemClick(item) {
      this.$emit('budgetItemClick', item);
    },
  },
};
</script>
