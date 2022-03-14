<template>
  <q-card flat class="container">
    <div class="row title--main">{{ item.name }}</div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Category } from '@/types';
import '@splidejs/splide/dist/css/themes/splide-skyblue.min.css';

export default defineComponent({
  name: 'SubCategoryCard',

  props: {
    item: { type: Object, required: true },
    categories: { type: Array as PropType<Category[]>, required: true },
  },

  methods: {
    getCategory(id: number): Category|undefined {
      return this.categories.find((item: Category) => item.id === id);
    },
  },
});
</script>
<style scoped>
.container {
  width: 95%;
  height: 162px;
  width: 362px;
  margin: 10px 0;
  border-radius: 10px;
}

.title

.content {
  display: flex;
  flex-direction: column;
}

.title--main {
  white-space: nowrap;
  font-size: 18px;
  padding: 15px 0 0 15px;
}

.caption--main {
  white-space: nowrap;
  font-size: 16px;
}
</style>
