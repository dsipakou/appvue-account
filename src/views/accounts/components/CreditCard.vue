<template>
  <div class="card card--front">
    <div class="card__number">
      **** **** **** {{ number }}
    </div>
    <div class="card__expiry-date">
      {{ date }}
    </div>
    <div class="card__owner">
      {{ title }}
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CreditCard',

  props: {
    number: { type: String, default: '****' },
    date: { type: String, default: 'Unknown expiration date' },
    title: { type: String, requried: true },
  },
});
</script>
<style scoped>
.card {
  font: 16px/1.5 'Helvetica Neue', Helvetica, sans-serif;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 315px;
  height: 180px;
  text-align: left;
  padding: 30px;
  margin-bottom: 50px;
  color: #fff;
  border-radius: 20px;
  box-sizing: border-box;
  background: -webkit-linear-gradient(145deg, #4684c1, #343174);
}

.card__number {
  font-size: 20px;
  padding: 25px 0 15px;
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
