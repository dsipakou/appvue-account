<template>
  <div class="container">
    <q-card flat bordered
      class="main-category-card"
      :class="activeCategory === title ? 'selected': ''"
      @click="categoryClick(title)">
      <span class="text-h6 text-weight-bold">{{ amount }}</span>
      <span class="text-subtitle2">{{ title }}</span>
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
    amount: { type: Number, required: true },
    activeCategory: { type: String, default: '' },
  },

  methods: {
    categoryClick(title) {
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
  border: 2px solid;
  width: 300px;
  max-width: 300px;
  padding: 14px 0;
  background-color: #DEE;
}

.arrow {
}
</style>
