<template>
  <q-card flat class="container">
    <Splide :options="{ rewind: true }">
      <SplideSlide>Hello</SplideSlide>
      <SplideSlide>World</SplideSlide>
    </Splide>
    {{ item.name }}
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Splide, SplideSlide } from '@splidejs/vue-splide';

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
  width: 90%;
  height: 100px;
  padding: 20px;
  margin: 5px;
}
</style>
