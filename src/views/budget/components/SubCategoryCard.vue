<template>
  <q-card flat class="container">
    {{ item.name }}
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SubCategoryCard',

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
