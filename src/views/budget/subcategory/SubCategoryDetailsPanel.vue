<template>
  <q-card flat bordered
    class="row main-panel">
    <div class="row">
      <q-icon name="arrow_back" size="33px" />
      <div>{{ category.name }}</div>
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface Category {
  name: string,
  items: object[],
}

export default defineComponent({
  name: 'Sub category details',

  props: {
    category: { type: Object as PropType<Category>, required: true },
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
  background-color: #EEE;
}
</style>
