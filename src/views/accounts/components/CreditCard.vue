<template>
  <div class="card card--front">
    <div class="card__number">4111 1111 1111 1111</div>
    <div class="card__expiry-date">10/17</div>
    <div class="card__owner">
      <slot name="title">Default card</slot></div>
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
  width: 335px;
  height: 200px;
  text-align: left;
  padding: 30px;
  margin-bottom: 50px;
  color: #fff;
  border-radius: 20px;
  box-sizing: border-box;
  background: -webkit-linear-gradient(145deg, #4684c1, #343174);
}

.card__number {
  font-size: 24px;
  padding: 40px 0 15px;
  text-align: center;
}

.card__expiry-date {
  font-size: 14px;
  padding-bottom: 20px;
  text-align: center;
}

.card__owner {
  text-align: left;
}

.card--front {
  font-size: 16px;
  font-family: 'Source Code Pro';
  text-shadow: 0 1px 1px rgba(255, 255, 255, .6);
}
</style>
