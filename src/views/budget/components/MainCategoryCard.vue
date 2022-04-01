<template>
  <div class="container">
    <q-card flat bordered
      class="main-category-card"
      :class="activeCategory === title ? 'selected': ''"
      @click="categoryClick(title)">
      <div class="row col-12 price-container">
        <div class="row col-6 left-block items-center">
          <span class="planned-text">{{ planned }}</span>
          <div class="planned-chart"></div>
        </div>
        <div class="row col-6 items-center">
          <div class="actual-chart"></div>
          <span class="actual-text">  {{ spent.toFixed(2) }}</span>
        </div>
      </div>
      <span class="category-name">{{ title }}</span>
    </q-card>
  </div>
  <div class="arrow" v-show="activeCategory === title">
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

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
  padding: 15px;
  border-radius: 20px;
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
  padding: 14px 0;
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
  height: 24px;
  background-color: #23A8F5;
  margin: 0 5px 0 11px;
}

.actual-chart {
  width: 7px;
  height: 24px;
  background-color: #23A8F5;
  margin: 0 11px 0 6px;
}

.category-name {
  margin-top: 4px;
  font-size: 20px;
}
</style>
