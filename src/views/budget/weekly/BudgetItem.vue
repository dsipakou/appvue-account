<template>
  <q-card flat bordered
    :style="cardBackground"
    class="row main-card">
    <div v-show="getActualDay === 0" class="absolute-left current-indicator"></div>
    <div class="row col-12 justify-center">
      <span class="header">{{ item.title }}</span>
    </div>
    <div class="row progress-container">
      <div class="absolute-left flex flex-center">
        <q-icon v-if="item.isCompleted" name="lock" class="lock-icon" @click="completeBudget()" />
        <q-icon v-else name="lock_open" class="lock-icon" @click="completeBudget()" />
      </div>
      <q-linear-progress
          class="progress-bar"
          :value="getProgressRate"
          :color="getProgressColor"
          track-color="grey-6">
        <div class="absolute-full flex flex-center progress-text">
          {{ getProgressRateText }}
        </div>
      </q-linear-progress>
      <div class="row bottom">
        <div class="row desc-text col-4">
          <span class="number">{{ getActualUsage }}</span>
          <span class="text">spent</span>
        </div>
        <div class="row justify-center col-4">
          <span class="overall-text">{{ getDiff }}</span>
          <span v-if="getDiff < 0" class="overall-subtext">over</span>
          <span v-else class="overall-subtext">left</span>
        </div>
        <div class="row desc-text justify-end col-4">
          <span class="text">of</span>
          <span class="number">{{ getPlanned }}</span>
        </div>
      </div>
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { getDayOfYear } from 'date-fns';

export default defineComponent({
  name: 'Budget Item',

  props: {
    item: { type: Object as PropType<any>, required: true },
    updateStatusBudget: { type: Function, required: true },
  },

  computed: {
    getPlanned(): string {
      if (this.item?.planned === undefined) return '';

      return this.item?.planned.toFixed(2);
    },

    getActualUsage(): string {
      if (this.item?.planned === undefined) return '';

      return this.item?.spentInBaseCurrency?.toFixed(2) || '0.00';
    },

    getDiff(): string {
      if (!this.item?.planned === undefined) return '';

      return (this.item.planned - this.item.spentInBaseCurrency).toFixed(2);
    },

    getProgressRate(): number {
      if (!this.item?.planned === undefined) return 0;

      if (this.item.planned === 0) return 1;
      return this.item.spentInBaseCurrency / this.item.planned;
    },

    getProgressColor(): string {
      if (!this.item?.planned === undefined) return '';

      if (this.item.planned === 0) return 'brown-14';
      if (this.getProgressRate > 1) return 'red-14';
      return 'green-14';
    },

    getProgressRateText(): string {
      if (!this.item?.planned === undefined) return '';

      if (this.item.planned === 0) return 'Unplanned';
      return `${(this.getProgressRate * 100).toFixed(0)}%`;
    },

    cardBackground() {
      let color = '#FFFFFF';
      if (this.getActualDay === 0) {
        color = '#D2ECFF';
      } else if (this.getActualDay === -1) {
        color = '#DDDDDD';
      }

      return {
        'background-color': color,
      };
    },

    getActualDay(): number {
      if (this.item?.planned === undefined) return 0;

      const currentDay = getDayOfYear(new Date());
      const budgetDay = getDayOfYear(new Date(this.item.budgetDate));
      if (currentDay === budgetDay) return 0;
      if (currentDay < budgetDay) return 1;
      return -1;
    },
  },

  methods: {
    completeBudget() {
      const item = {
        ...this.item,
        isCompleted: !this.item.isCompleted,
      };
      this.updateStatusBudget(item);
    },
  },
});
</script>
<style scoped>
.main-card {
  height: 73px;
  width: 350px;
  max-width: 350px;
}

.header {
  font-size: 18px;
}

.current-indicator {
  height: 55px;
  width: 3px;
  background-color: #0094FF;
  border-radius: 2px !important;
  margin: auto 0 auto 5px;
}

.progress-container {
  margin: 0 33px;
}

.progress-bar {
  border-radius: 2px;
  height: 15px;
}

.progress-text {
  font-size: 12px;
  color: white;
  align-content: center;
  font-weight: bold;
}

.remains>.text, .bottom .text {
  margin: 0 5px;
  font-size: 11px;
}

.remains>.number, .bottom .number {
  font-weight: bold;
  font-size: 11px;
}

.desc-text {
  padding: 0 5px;
}

.overall-text {
  font-size: 14px;
  font-weight: bold;
}

.overall-subtext {
  font-weight: normal;
  margin-left: 5px;
}

.lock-icon {
  margin-left: 15px;
  cursor: pointer;
}

.lock-icon:hover {
  transform: scale(1.3);
}
</style>
