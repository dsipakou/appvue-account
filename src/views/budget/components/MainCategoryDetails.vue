<template>
  <q-card flat bordered
    class="row main-panel">
    <div class="col-6" v-for="item in items" :key="item.name">
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
    items: { type: Array, required: true },
    categories: { type: Array, required: true },
  },
});
</script>
<style scoped>
.main-panel {
  margin: 10px;
  width: 100%;
  max-width: 100%;
  align-content: start;
  padding: 15px;
  border-radius: 20px;
  min-height: 800px;
  background-color: #EED;
}
</style>
