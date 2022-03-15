<template>
  <div class="container">
    <div class="row title--main">
     This month
    </div>
    <div class="row remains">
      Hello
    </div>
    <div class="row">
      <q-linear-progress
        size="50px"
        value="0.36"
        class="progress-bar"
        color="green-14"
        track-color="grey-6">
        <div class="absolute-full flex flex-center progress-text">76%</div>
      </q-linear-progress>
    </div>
    <div class="row bottom">
      <div class="row col spent-container"><span>24p. spent</span></div>
      <div class="row col overall-container"><span>of 1000p.</span></div>
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

.remains {
  margin: 47px 0 12px 0;
  justify-content: center;
  font-size: 16px;
}

.progress-bar {
  height: 50px;
  width: 361px;
  background-color: #FFFFFF;
  border-radius: 3px;
}

.progress-text {
  font-size: 16px;
  font-weight: bold;
  color: white;
}

.bottom {
  font-size: 10px;
}

.spent-container {
  margin: 5px 0 0 5px;
}

.overall-container {
  margin: 5px 5px 0 0;
  justify-content: end;
}

</style>
