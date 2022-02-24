<template>
  <q-card flat class="container">
    <Splide :options="{ rewind: true }">
      <SplideSlide
        v-for="item in item.items"
        :key="item.name"
      >
        <span class="title--subcat">{{ item.title }}</span>
      </SplideSlide>
    </Splide>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/themes/splide-skyblue.min.css';

export default defineComponent({
  name: 'SubCategoryCard',

  components: {
    Splide,
    SplideSlide,
  },

  props: {
    item: { type: Object, required: true },
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
.title--subcat {
  white-space: nowrap;
  font-size: 21px;
}
</style>
