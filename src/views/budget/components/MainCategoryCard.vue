<template>
  <q-card flat bordered
    class="main-category-card"
    :class="activeCategory === title ? 'selected': ''"
    @click="categoryClick(title)">
    <span class="text-h6 text-weight-bold">{{ amount }}</span>
    <span class="text-subtitle2">{{ title }}</span>
  </q-card>
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
.main-category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  max-width: 300px;
  padding: 15px;
  border-radius: 20px;
  cursor: pointer;
}

.selected {
  border: 2px solid;
  width: 340px;
  max-width: 320px;
  padding: 14px 0;
  background-color: #DEE;
}
</style>
