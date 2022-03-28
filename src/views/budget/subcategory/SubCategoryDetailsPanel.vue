<template>
  <q-card flat bordered
    class="row main-panel">
    <div class="row col-12">
      <q-icon name="arrow_back" size="33px" class="pointer" @click="closeSubCategory" />
      <div class="header-title">{{ category.name }}</div>
    </div>
    <div class="row col-8">
      <q-timeline color="grey-5" side="right" layout="comfortable" class="timeline">
        <q-timeline-entry
          v-for="i in [...Array(numberOfWeeks).keys()]"
          :key="i"
          v-bind="currentWeekItem(i + 1) ? iconBinding : null"
          :color="currentWeekItem(i + 1) ? 'blue' : ''" >
          <template v-slot:subtitle>
            <span>{{ `Week ${i + 1}` }}</span>
          </template>
          <div v-show="groupedByWeek[i + 1]">
            <div v-for="item in groupedByWeek[i + 1]" :key="item">
              <BudgetItem :item="item" />
            </div>
          </div>
        </q-timeline-entry>
      </q-timeline>
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { getWeekOfMonth, getWeeksInMonth } from 'date-fns';
import { BudgetUsage } from '@/types/Budget';
import BudgetItem from '@/views/budget/subcategory/components/BudgetItem.vue';

interface Category {
  name: string,
  items: BudgetUsage[],
}

export default defineComponent({
  name: 'Sub category details',

  components: {
    BudgetItem,
  },

  emits: [
    'closeSubCategory',
  ],

  props: {
    category: { type: Object as PropType<Category>, required: true },
  },

  computed: {
    iconBinding(): object {
      return {
        icon: '',
      };
    },

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

    groupedByWeek(): {[key: number]: BudgetUsage[]} {
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

      return {};
    },

    numberOfWeeks(): number {
      return getWeeksInMonth(new Date());
    },

  },

  methods: {
    closeSubCategory() {
      this.$emit('closeSubCategory');
    },

    getWeek(date: string): number {
      return getWeekOfMonth(new Date(date), { weekStartsOn: 1 });
    },

    currentWeekItem(index: number): boolean {
      return getWeekOfMonth(new Date(), { weekStartsOn: 1 }) === index;
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
  margin-top: 60px;
}

</style>
<style>
.q-timeline__subtitle {
  width: auto !important;
  text-transform: none !important;
  font-size: 12px !important;
  font-weight: normal !important;
  color: rgba(0, 0, 0, 1) !important;
}
</style>
