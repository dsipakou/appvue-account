<template>
  <q-card flat bordered
    class="main-panel">
    Hello
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainCategoryDetails',
});
</script>
<style scoped>
.main-panel {
  margin: 10px;
  width: 100%;
  max-width: 100%;
  padding: 15px;
  border-radius: 20px;
  min-height: 800px;
}
</style>
