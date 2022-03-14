<template>
  <div class="container">
    <div class="row title--main">
     This month
    </div>
    <div class="row graph">
      Hello
    </div>
    <div class="row">
      <div class="chart-background"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Category Month Summary component',
});
</script>
<style scoped>
.title--main {
  font-size: 16px;
  font-weight: bold;
}

.graph {
  margin-top: 47px;
  justify-content: center;
  font-size: 16px;
}

.chart-background {
  height: 50px;
  width: 361px;
  background-color: #FFFFFF;
  border-radius: 3px;
}
</style>
