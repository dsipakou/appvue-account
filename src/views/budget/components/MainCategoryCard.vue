<template>
  <div class="container">
    <q-card flat bordered
      class="main-category-card"
      :class="activeCategory === title ? 'selected': ''"
      @click="categoryClick(title)">
      <div class="row col-12 price-container">
        <div class="row col-6 left-block items-end">
          <span class="planned-text">{{ planned }}</span>
          <div class="planned-chart" :style="plannedHeight"></div>
        </div>
        <div class="row col-6 items-end">
          <div
            class="actual-chart"
            :class="planned > spent ? 'bg-green' : 'bg-red'"
            :style="actualHeight"></div>
          <span class="actual-text">  {{ spent.toFixed(2) }}</span>
        </div>
      </div>
      <span class="category-name no-wrap overflow-hidden">{{ title }}</span>
    </q-card>
  </div>
  <div class="arrow" v-show="activeCategory === title">
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

const MAX_CHART_HEIGHT = 28;

export default defineComponent({
  name: 'MainCategoryCard',

  emits: [
    'categoryClick',
  ],

  props: {
    title: { type: String, required: true },
    planned: { type: Number, required: true },
    spent: { type: Number, required: true },
    activeCategory: { type: String, default: '' },
  },

  computed: {
    plannedHeight(): string {
      const spent = this.spent || 0;
      if (this.planned > spent) return `height: ${MAX_CHART_HEIGHT}px`;
      return `height: ${((this.planned / spent) * MAX_CHART_HEIGHT).toFixed(0)}px`;
    },

    actualHeight(): string {
      const spent = this.spent || 0;
      if (this.planned < spent) return `height: ${MAX_CHART_HEIGHT}px`;
      return `height: ${((spent / this.planned) * MAX_CHART_HEIGHT).toFixed(0)}px`;
    },
  },

  methods: {
    categoryClick(title: string) {
      this.$emit('categoryClick', { title });
    },
  },
});
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  position: relative;
}

.main-category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;
  max-width: 280px;
  height: 86px;
  max-height: 86px;
  border-radius: 20px;
  padding: 12px;
  cursor: pointer;
}

.selected::after {
    content:'';
    position: absolute;
    top: 100%;
    left: 100%;
    margin-left: 10px;
    margin-top: -50px;
    width: 0;
    height: 0;
    border-left: solid 12px #ABB;
    border-bottom: solid 12px transparent;
    border-top: solid 12px transparent;
}

.selected {
  border: 3px solid #B9B9B9;
  height: 86px;
  width: 322px;
  max-width: 300px;
  padding: 11px 0;
  background-color: #BFF7FF;
}

.price-container {
  width: 100%;
}

.left-block {
  border-right: 1px solid black;
  justify-content: right;
}

.planned-text {
  font-size: 20px;
}

.actual-text {
  font-size: 20px;
  font-weight: bold;
}

.planned-chart {
  width: 7px;
  background-color: #d2d2d2;
  margin: 0 5px 0 11px;
}

.actual-chart {
  width: 7px;
  margin: 0 11px 0 6px;
}

.bg-green {
  background-color: chartreuse;
}

.bg-red {
  background-color: crimson;
}

.category-name {
  font-size: 21px;
}
</style>
