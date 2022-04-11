<template>
  <q-card class="currency-card">
    <div class="row col-12">
      <span class="cur-title">{{ title }}</span>
    </div>
    <div class="row col-12">
      <div class="row col-6">
        <span>{{ rate }}</span>
      </div>
      <div class="row col-6 chart">
        chart here
      </div>
    </div>
    <div class="col-12">
      {{ lastDate }}
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Currency card',

  props: {
    title: { type: String, required: true },
    rate: { type: Number, required: true },
    lastDate: { type: Date, required: true },
  },
});
</script>
<style>
.currency-card {
  height: 119px;
  width: 236px;
}
</style>
