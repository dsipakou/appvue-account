<template>
  <div class="card card--front">
    <div class="card__number">4111 1111 1111 1111</div>
    <div class="card__expiry-date">10/17</div>
    <div class="card__owner">Jane Doe</div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CreditCard',
});
</script>
<style scoped>
.card {
  font: 16px/1.5 'Helvetica Neue', Helvetica, sans-serif;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 375px;
  height: 220px;
  text-align: left;
  padding: 30px;
  margin-bottom: 50px;
  color: #fff;
  border-radius: 20px;
  box-sizing: border-box;
}
</style>
