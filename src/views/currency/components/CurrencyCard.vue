<template>
  <q-card class="currency-card inactive">
    <div class="row col-12 cur-title">
      <span>{{ title }}</span>
    </div>
    <div class="row col-12 cur-rate">
      <div class="row col-6">
        <span>{{ rate }}</span>
      </div>
      <div class="row col-6 chart">
      </div>
    </div>
    <div class="col-12 cur-date">
      <span>Last update: {{ formattedDate }}</span>
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { format } from 'date-fns';

const DATE_FORMAT = 'dd-MMM-yyyy';

export default defineComponent({
  name: 'Currency card',

  props: {
    title: { type: String, required: true },
    rate: { type: Number, required: true },
    lastDate: { type: String, required: true },
  },

  computed: {
    formattedDate() {
      return format(new Date(this.lastDate), DATE_FORMAT);
    },
  },
});
</script>
<style>
.currency-card {
  height: 119px;
  width: 236px;
  padding: 10px 0 10px 21px;
  margin-left: 10px;
}

.inactive {
  color: white;
  background-color: #047A94 !important;
}

.cur-title {
  font-size: 18px;
}

.cur-rate {
  font-size: 32px;
}

.cur-date {
  font-size: 14px;
}
</style>
