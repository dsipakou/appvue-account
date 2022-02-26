<template>
  <q-card flat class="container">
    <Splide :options="{ rewind: true }">
      <SplideSlide
        class="content"
        v-for="item in item.items"
        :key="item.name"
      >
        <span class="title--main">{{ item.title }}</span>
        <span class="caption--main">{{ getCategory(item.categoryId).name }}</span>
      </SplideSlide>
    </Splide>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import { Category } from '@/types';
import '@splidejs/splide/dist/css/themes/splide-skyblue.min.css';

export default defineComponent({
  name: 'SubCategoryCard',

  components: {
    Splide,
    SplideSlide,
  },

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
  height: 150px;
  padding: 20px;
  margin: 10px;
}

.content {
  display: flex;
  flex-direction: column;
}

.title--main {
  white-space: nowrap;
  font-size: 20px;
}

.caption--main {
  white-space: nowrap;
  font-size: 16px;
}
</style>
