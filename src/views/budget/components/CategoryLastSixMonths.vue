<template>
  <div class="row col-12">
    <div class="row col-12 title--main">
      Previous 6 months
    </div>
    <div class="row col-12 bar-container">
      <div v-for="item in getBarsHeight"
        :key="item.month"
        class="col align-center" style="max-width: 30px;">
        <div class="bar-amount">{{ item.planned }}</div>
        <div class="row bar" :style="item.height"></div>
        <div class="bar-caption">{{ getMonth(item.month) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { BudgetArchive } from '@/types/Budget';
import { format, parseISO } from 'date-fns';

const MAX_HEIGHT = 110;
const MIN_HEIGHT = 40;

interface Chart {
  month: string,
  height: string,
  planned: number,
}

export default defineComponent({
  name: 'Previous 6 month card',

  props: {
    budgetArchive: { type: Array as PropType<BudgetArchive[]>, required: true },
  },

  computed: {
    getBarsHeight(): Chart[] {
      const intervalMin = Math.min(...this.budgetArchive.map(
        (item: BudgetArchive) => item.planned,
      ));
      const intervalMax = Math.max(...this.budgetArchive.map(
        (item: BudgetArchive) => item.planned,
      ));

      const heights: Chart[] = [];
      this.budgetArchive.forEach(
        (item: BudgetArchive) => {
          if (item.planned === 0) {
            heights.push({
              month: item.month,
              height: 'height: 1px',
              planned: item.planned,
            });
          } else {
            const rate = (item.planned - intervalMin) / (intervalMax - intervalMin);
            const height = MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) * rate;
            heights.push({
              month: item.month,
              height: `height: ${height.toFixed(0)}px`,
              planned: item.planned,
            });
          }
        },
      );
      return heights;
    },
  },

  methods: {
    getMonth(date: string): string {
      return format(parseISO(date), 'MMM');
    },
  },
});
</script>

<style scoped>
.title--main {
  font-size: 16px;
  font-weight: bold;
}

.bar-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}
.bar {
  max-width: 30px;
  background: #BB11F6;
  margin: 0 2px;
  border-radius: 3px;
}

.bar-caption {
  display: flex;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
}

.bar-amount {
  display: flex;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
}
</style>
