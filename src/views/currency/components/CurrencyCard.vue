<template>
  <q-card
    class="currency-card"
    :class="isActive ? 'active' : 'inactive'"
    @click="currencyClick">
    <div class="row col-12 cur-title">
      <span>{{ currency.verbalName }}</span>
    </div>
    <div class="row col-12 cur-rate">
      <div class="row col-6">
        <span class="cur-rate">{{ rate?.rate }}</span>
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
import { defineComponent, PropType } from 'vue';
import { format } from 'date-fns';
import { Currency, Rate } from '@/types';

const DATE_FORMAT = 'dd-MMM-yyyy';

export default defineComponent({
  name: 'Currency card',

  props: {
    currency: { type: Object as PropType<Currency>, required: true },
    rate: { type: Object as PropType<Rate>, required: true },
    lastDate: { type: String, required: true },
    selectCurrency: { type: Function, required: true },
    selectedCurrencies: { type: Array as PropType<string[]>, required: true },
  },

  computed: {
    formattedDate() {
      if (this.rate) {
        return format(new Date(this.rate.rateDate), DATE_FORMAT);
      }
      return null;
    },

    isActive() {
      return this.selectedCurrencies.find((item: string) => item === this.currency.code);
    },
  },

  methods: {
    currencyClick() {
      this.selectCurrency(this.currency.code);
    },
  },
});
</script>
<style>
.currency-card {
  height: 186px;
  width: 205px;
  padding: 10px 0 10px 21px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 30px !important;
}

.inactive {
  color: #047A94;
  background-color: white !important;
  border: 1px solid #ADADAD;
}

.active {
  color: white;
  background-color: #047A94 !important;
  box-shadow: none !important;
}

.cur-title {
  font-size: 18px;
}

.cur-rate {
  font-size: 32px !important;
  height: 44px;
}

.cur-date {
  font-size: 14px;
}
</style>
