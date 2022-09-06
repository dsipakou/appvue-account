<template>
  <q-card flat bordered class="main-panel">
    <div class="row justify-center col-12">
      <span class="weekly-title">{{ weekDays[0].formated }} -- {{ weekDays.at(-1).formated }}</span>
    </div>
    <div class="row justify-left">
      <q-timeline color="grey-5" side="right" layout="comfortable" class="timeline">
        <q-timeline-entry
          v-for="day in weekDays"
          :key="day.formated"
          v-bind="currentDayItem(day) ? iconBinding : null"
          :color="currentDayItem(day) ? 'blue' : ''"
          >
          <template v-slot:subtitle>
            <span>{{ day.formated }}</span>
          </template>
          <div v-for="item in getDayBudget(day.full)" :key="item">
            <BudgetItem
              :item="item"
              :updateStatusBudget="updateStatusBudget"
              :activeUser="activeUser"
              @budgetItemClick="budgetItemClick(item)"
            />
          </div>
        </q-timeline-entry>
      </q-timeline>
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import {
  startOfWeek,
  addDays,
  format,
  isSameDay,
} from 'date-fns';
import { Category } from '@/types';
import BudgetItem from '@/views/budget/weekly/BudgetItem.vue';
import { BudgetUsageItem } from '@/types/Budget';

export interface GroupedByCategoryItem {
  name: string,
  items: any[],
  planned: number,
  actualUsage: number,
}

const DATE_FORMAT = 'dd MMM';

export default defineComponent({
  name: 'Week Budget',

  components: {
    BudgetItem,
  },

  emits: [
    'budgetItemClick',
  ],

  props: {
    activeUser: { type: String, required: true },
    weeklyUsage: { type: Array as PropType<Array<BudgetUsageItem>>, required: true },
    budgetUsage: { type: Array as PropType<any[]>, required: true },
    categoryItems: { type: Array as PropType<Category[]>, required: true },
    selectedDay: { type: Date, required: true },
    updateStatusBudget: { type: Function, required: true },
  },

  computed: {
    iconBinding(): object {
      return {
        icon: '',
      };
    },

    weekDays(): { full: Date, formated: string }[] {
      const firstDayOfWeek = startOfWeek(new Date(this.selectedDay), { weekStartsOn: 1 });
      const days = [];
      for (let i = 0; i < 7; i += 1) {
        days.push({
          full: addDays(firstDayOfWeek, i),
          formated: format(addDays(firstDayOfWeek, i), DATE_FORMAT),
        });
      }
      return days;
    },
  },

  methods: {
    getDayBudget(date: string): any {
      return this.weeklyUsage?.filter((item: any) => (
        isSameDay(new Date(item.budgetDate), new Date(date))
      ));
    },

    currentDayItem(date: { full: string, formatted: string }) {
      return isSameDay(new Date(), new Date(date.full));
    },

    budgetItemClick(item: any) {
      console.log('click');
      this.$emit('budgetItemClick', item);
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
</style>

<style>
.q-timeline__subtitle {
  width: auto !important;
  text-transform: none !important;
  font-size: 12px !important;
  font-weight: normal !important;
  color: rgba(0, 0, 0, 1) !important;
}

.weekly-title {
  font-size: 24px;
}
</style>
