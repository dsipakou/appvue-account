<template>
  <q-card flat bordered
    class="row main-panel">
    <div class="row col-12 justify-center header">
      {{ title }}
    </div>
    <div class="row col-6 justify-center" v-for="item in items" :key="item.name">
      <SubCategoryCard :item=item :categories="categories" />
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import SubCategoryCard from '@/views/budget/components/SubCategoryCard.vue';

export default defineComponent({
  name: 'MainCategoryDetails',

  components: {
    SubCategoryCard,
  },

  props: {
    title: { type: String, required: true },
    items: { type: Array, required: true },
    categories: { type: Array, required: true },
  },
});
</script>
<style scoped>
.main-panel {
  margin: 5px 0;
  width: 100%;
  max-width: 100%;
  justify-content: start;
  align-content: start;
  padding: 15px;
  border-radius: 20px;
  background-color: #EED;
}

.header {
  font-size: 22px;
  font-weight: bold;
}
</style>
