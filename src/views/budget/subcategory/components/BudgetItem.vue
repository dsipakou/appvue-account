<template>
  <q-card flat bordered class="card" :style="cardBackground">
    <div v-show="getActualWeek === 0" class="absolute-left current-indicator"></div>
    <div class="row justify-center top remains">
      <div class="absolute-left date-badge">
        <q-icon v-show="item.isCompleted" name="lock" class="lock-icon" />
        <q-badge :label="getDate" class="badge" />
      </div>
      <span class="number">{{ getDiff }}</span>
      <span v-if="getDiff < 0" class="text">over</span>
      <span v-else class="text">left</span>
    </div>
    <div class="row progress-container">
      <q-linear-progress
          class="progress-bar"
          :value="getProgressRate"
          :color="getProgressColor"
          size="24px"
          track-color="grey-6">
        <div class="absolute-full flex flex-center progress-text">
          {{ getProgressRateText }}
        </div>
      </q-linear-progress>
      <div class="row bottom">
        <div class="row desc-text col-6">
          <span class="number">{{ getActualUsage }}</span>
          <span class="text">spent</span>
        </div>
        <div class="row desc-text justify-end col-6">
          <span class="text">of</span>
          <span class="number">{{ getPlanned }}</span>
        </div>
      </div>
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { BudgetUsage } from '@/types/Budget';
import { format, getWeekOfMonth } from 'date-fns';

const DATE_FORMAT = 'dd - MMM';

export default defineComponent({
  name: 'Budget Item',

  props: {
    item: { type: Object as PropType<BudgetUsage>, required: true },
  },

  computed: {
    cardBackground() {
      let color = '#FFFFFF';
      if (this.getActualWeek === 0) {
        color = '#D2ECFF';
      } else if (this.getActualWeek === -1) {
        color = '#DDDDDD';
      }

      return {
        'background-color': color,
      };
    },

    getDate(): string {
      if (this.item?.amount === undefined) return '';

      return format(new Date(this.item.budgetDate), DATE_FORMAT);
    },

    getActualWeek(): number {
      if (this.item?.amount === undefined) return 0;

      const currentWeek = getWeekOfMonth(new Date(), { weekStartsOn: 1 });
      const budgetWeek = getWeekOfMonth(new Date(this.item.budgetDate), { weekStartsOn: 1 });
      if (currentWeek === budgetWeek) return 0;
      if (currentWeek < budgetWeek) return 1;
      return -1;
    },

    getPlanned(): string {
      if (this.item?.amount === undefined) return '';

      return this.item?.amount.toFixed(2);
    },

    getActualUsage(): string {
      if (this.item?.amount === undefined) return '';

      return this.item?.spentInBaseCurrency?.toFixed(2) || '0.00';
    },

    getDiff(): string {
      if (!this.item?.amount === undefined) return '';

      return (this.item.amount - this.item.spentInBaseCurrency).toFixed(2);
    },

    getProgressRate(): number {
      if (!this.item?.amount === undefined) return 0;

      if (this.item.amount === 0) return 1;
      return this.item.spentInBaseCurrency / this.item.amount;
    },

    getProgressColor(): string {
      if (!this.item?.amount === undefined) return '';

      if (this.item.amount === 0) return 'brown-14';
      if (this.getProgressRate > 1) return 'red-14';
      return 'green-14';
    },

    getProgressRateText(): string {
      if (!this.item?.amount === undefined) return '';

      if (this.item.amount === 0) return 'Unplanned';
      return `${(this.getProgressRate * 100).toFixed(0)}%`;
    },
  },
});
</script>
<style scoped>
.card {
  height: 90px;
}

.lock-icon {
  margin-right: 5px;
}

.current-indicator {
  height: 65px;
  width: 5px;
  background-color: #0094FF;
  border-radius: 2px !important;
  margin: auto 0 auto 5px;
}

.date-badge {
  padding-left: 15px;
  padding-top: 10px;
}

.top {
  margin-top: 10px;
  font-size: 14px;
}

.badge {
  background-color: #555555;
  color: white;
  font-size: 11px;
}

.progress-container {
  margin: 5px 45px 0 45px;
}

.progress-bar {
  border-radius: 2px;
}

.progress-text {
  font-size: 12px;
  color: white;
  align-content: center;
}

.bottom {
  font-size: 10px;
  height: auto;
}

.desc-text {
  padding: 0 5px;
}

.remains>.text, .bottom .text {
  margin: 0 5px;
}

.remains>.number, .bottom .number {
  font-weight: bold;
}
</style>
