<template>
  <q-card flat bordered
    class="row col-12 main-panel">
    <div class="row">
      <q-icon name="arrow_back" size="33px" class="pointer" @click="closeSubCategory" />
      <div class="header-title">{{ category.name }}</div>
    </div>
    {{ groupedByWeek }}
    <div class="row col-10">
      <q-timeline color="grey" layout="comfortable" class="timeline">
        <q-timeline-entry
          v-for="i in [1,2,3,4,5]"
          :subtitle="`Week ${i}`"
          :key="i">
          <div style="height: 50px;">
            Hello there
          </div>
        </q-timeline-entry>
      </q-timeline>
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { getWeekOfMonth } from 'date-fns';
import { BudgetUsage } from '@/types/Budget';

interface Category {
  name: string,
  items: BudgetUsage[],
}

export default defineComponent({
  name: 'Sub category details',

  emits: [
    'closeSubCategory',
  ],

  props: {
    category: { type: Object as PropType<Category>, required: true },
  },

  computed: {
    mergedByBudget(): Array<BudgetUsage> {
      if (this.category?.items) {
        return this.category.items.reduce(
          (acc: Array<BudgetUsage>, item: BudgetUsage) => {
            const index = acc.findIndex((groupedItem: BudgetUsage) => groupedItem.id === item.id);
            if (index > -1) {
              acc[index] = {
                ...acc[index],
                spentInOriginalCurrency: acc[index].spentInOriginalCurrency
                  + item.spentInOriginalCurrency,
                spentInBaseCurrency: acc[index].spentInBaseCurrency + item.spentInBaseCurrency,
              };
            } else {
              acc.push(item);
            }

            return acc;
          }, [],
        );
      }

      return [];
    },

    groupedByWeek() {
      if (this.mergedByBudget) {
        return this.mergedByBudget.reduce(
          (acc: {[key: number]: BudgetUsage[]}, item: BudgetUsage) => {
            const week = this.getWeek(item.budgetDate);
            const arr = acc[week] || [];
            arr.push(item);
            acc[week] = arr;
            return acc;
          }, {},
        );
      }
      return [];
      /* return this.category.items.reduce(
        (acc: WeekGroup, item: BudgetPlan) => {
          const week = this.getWeek(item.budgetDate);
          const arr = acc[week]?.items || [];
          arr.push(item);
          acc[week] = arr;
          return acc;
        }, {},
      ); */
    },
  },

  methods: {
    closeSubCategory() {
      this.$emit('closeSubCategory');
    },

    getWeek(date: string): number {
      return getWeekOfMonth(new Date(date));
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

.pointer {
  cursor: pointer;
}

.header-title {
  margin-left: 20px;
  font-size: 24px;
}

.timeline {
  margin-top: 90px;
}
</style>
