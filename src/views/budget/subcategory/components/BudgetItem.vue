<template>
  <q-card flat bordered class="card">
    <div class="row justify-center top">
      <span>75</span><span>left</span>
    </div>
    <div class="row justify-center">
      <q-linear-progress
          class="progress-bar"
          value=0.46
          color="green-14"
          size="15px"
          track-color="grey-6">
        <div class="absolute-full flex flex-center progress-text">
          56%
        </div>
      </q-linear-progress>
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Budget Item',
});
</script>
<style scoped>
.card {
  height: 73px;
  background-color: #DDDDDD;
}

.top {
  margin-top: 10px;
  font-size: 14px;
}

.progress-bar {
  width: 290px;
}

.progress-text {
  font-size: 12px;
  color: white;
  align-content: center;
}
</style>
