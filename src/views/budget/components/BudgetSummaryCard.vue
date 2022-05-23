<template>
  <q-card rounded flat
    class="main-card"
  >
  <div class="row col-12 justify-center header-title">
    <slot name="header"></slot>
  </div>
  <div class="row col-12">
    <div class="row col-6 content">
      <div class="row justify-end data-container content-planned">
        <div class="column planned-values-container">
          <div class="planned-number">
            {{ plannedUsage }}
          </div>
          <div class="planned-text">
            Planned
          </div>
        </div>
        <div
          class="row planned-bar self-end"
          :style="plannedHeight"></div>
      </div>
    </div>
    <div class="row col-6 content">
      <div class="row data-container">
        <div
          class="row actual-bar self-end"
          :style="spentHeight"></div>
        <div class="column actual-values-container">
          <div class="actual-number">
            {{ spentUsage }}
          </div>
          <div class="actual-text">
            Spent
          </div>
        </div>
      </div>
    </div>
  </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

const MAX_CHART_HEIGHT = 40;

export default defineComponent({
  name: 'Budget Summary Card',

  props: {
    planned: { type: Number, required: true },
    spent: { type: Number, required: true },
  },

  computed: {
    plannedUsage(): string {
      return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(this.planned);
    },

    spentUsage(): string {
      return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(this.spent);
    },

    plannedHeight(): string {
      const spent = this.spent || 0;
      if (this.planned > spent) return `height: ${MAX_CHART_HEIGHT}px`;
      return `height: ${((this.planned / spent) * MAX_CHART_HEIGHT).toFixed(0)}px`;
    },

    spentHeight(): string {
      const spent = this.spent || 0;
      if (this.planned < spent) return `height: ${MAX_CHART_HEIGHT}px`;
      return `height: ${((spent / this.planned) * MAX_CHART_HEIGHT).toFixed(0)}px`;
    },
  },
});
</script>
<style scoped>
.header-title {
  margin-top: 4px;
  font-size: 16px;
  line-height: 1em;
  color: #FFD600;
}

.main-card {
  width: 300px;
  height: 80px;
  background-color: #666666;
}

.content {
  color: white;
}

.content-planned {
  border-right: 1px solid white;
}

.planned-values-container {
  margin-right: 13px;
}

.planned-number {
  display: flex;
  justify-content: flex-end;
  font-size: 20px;
}

.planned-text {
  font-size: 12px;
  display: flex;
  justify-content: flex-end;
}

.actual-values-container {
  margin-left: 13px;
}

.actual-number {
  font-size: 20px;
  font-weight: bold;
}

.actual-text {
  font-size: 12px;
  font-weight: bold;
}

.data-container {
  line-height: 1.5em;
  margin-top: 7px;
}

.planned-bar {
  max-width: 12px;
  background-color: #FFD600;
  margin-right: 5px;
}

.actual-bar {
  max-width: 12px;
  background-color: #FFD600;
  margin-left: 5px;
}
</style>
