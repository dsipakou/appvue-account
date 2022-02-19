<template>
  <q-card flat bordered
    class="main-category-card">
    <span class="text-h6 text-weight-bold">{{ amount }}</span>
    <span class="text-subtitle2">{{ title }}</span>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainCategoryCard',

  props: {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
  },
});
</script>
<style scoped>
.main-category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 250px;
}
</style>
