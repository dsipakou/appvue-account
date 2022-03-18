<template>
  <q-card flat class="container">
    <div class="row col-12 title--main">{{ item.name }}</div>
    <div class="row progress-container">
      <div class="row col-12 justify-center remains">
        <span>53 left</span>
      </div>
      <div class="row desc-text multiply">
        <span>2x</span>
      </div>
      <q-linear-progress
        class="progress-bar"
        value="0.46"
        color="green-14"
        size="34px"
        track-color="grey-6">
      </q-linear-progress>
      <div class="row bottom">
        <div class="row desc-text col-6">
          <span>250 spent</span></div>
        <div class="row desc-text justify-end col-6">
          <span>of 300</span></div>
      </div>
    </div>
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

.remains {
  margin-top: 5px;
  font-size: 14px;
}

.progress-container {
  margin: 0 36px;
}

.multiply {
  font-size: 10px;
  margin-bottom: 5px;
}

.progress-bar {
  font-size: 13px;
  font-weight: bold;
  color: white;
}

.bottom {
  font-size: 10px;
  margin-top: 5px;
}

.desc-text {
  padding: 0 5px;
}

</style>
