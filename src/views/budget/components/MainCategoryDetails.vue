<template>
  <q-card flat bordered
    class="row main-panel">
    <div class="col-6" style="height: 150px;">
      <SubCategoryCard />
    </div>
    <div class="col-6" style="height: 150px;">
      <SubCategoryCard />
    </div>
    <div class="col-6" style="height: 150px;">
      <SubCategoryCard />
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
