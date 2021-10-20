<template>
  <div class="row">
    <div class="vertical-middle">
      <slot name="title"></slot>
      <q-card flat class="q-pt-sm card">
        <div
          class="q-mx-sm item-block"
          v-for="item in items"
          :key="item.id"
          @click="itemClick(item)"
          dragable="true"
          @dragstart="$event">
            <span>{{ item.title }}</span>
            <span>{{ item.amount }}</span>
        </div>
        <q-card-section>
          Amount: {{ overallSum }}
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PlannerCard',

  data() {
    return {
      selectedBudget: {},
    };
  },

  emits: [
    'editBudgetClick',
  ],

  props: {
    items: { type: Array, required: true },
    categoryItems: { type: Array, required: true },
    updateBudget: { type: Function, required: true },
    deleteBudget: { type: Function, required: true },
  },

  computed: {
    overallSum() {
      return this.items.reduce((acc, item) => item.amount + acc, 0);
    },
  },

  methods: {
    itemClick(item) {
      this.selectedBudget.id = item.id;
      this.selectedBudget.budgetDate = item.budgetDate.substr(0, 10);
      this.selectedBudget.title = item.title;
      this.selectedBudget.amount = item.amount;
      this.selectedBudget.categoryId = item.categoryId;
      this.selectedBudget.description = item.description;
      this.selectedBudget.isCompleted = item.isCompleted;
      this.$emit('editBudgetClick', this.selectedBudget);
    },
  },
};
</script>
<style scoped>
.card {
  min-width: 200px;
  min-height: 400px;
}

.item-block {
  display: flex;
  align-items: center;
  border-bottom: 1px solid;
  min-height: 40px;
  justify-content: space-between;
  cursor: pointer;
}
</style>
