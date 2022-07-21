<template>
  <q-card
    class="currency-card"
    :class="isActive ? 'active' : 'inactive'"
    @click="currencyClick">
    <div class="row col-12 cur-code">
      <span>{{ currency.code }}</span>
    </div>
    <div class="row col-12 cur-title">
      <span>{{ currency.verbalName }}</span>
    </div>
    <div class="row col-12 cur-rate">
      <div class="row col-12">
        <span class="cur-rate">{{ rate?.rate }}</span>
      </div>
    </div>
    <div class="row col-12 cur-percentage">
      <span
        :class="{'text-red': percentage < 0, 'text-green': percentage > 0}"
      >
        <span v-show="percentage > 0">+</span>{{ percentage }}%
      </span>
    </div>
    <div class="row col-12 cur-date">
      <span>{{ formattedDate }}</span>
    </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { format } from 'date-fns';
import { Currency, Rate } from '@/types';

const DATE_FORMAT = 'dd-MM-yyyy';

export default defineComponent({
  name: 'Currency card',

  props: {
    currency: { type: Object as PropType<Currency>, required: true },
    rate: { type: Object as PropType<Rate>, required: true },
    percentage: { type: Number, required: true },
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
  padding: 20px 0 10px 21px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 30px !important;
}

.inactive {
  color: black;
  background-color: white !important;
  border: 1px solid #ADADAD;
}

.active {
  color: white;
  background-color: #047A94 !important;
  box-shadow: none !important;
  border-color: #047A94;
}

.cur-code {
  font-size: 22px;
  font-weight: bold;
}

.cur-title {
  font-size: 16px;
}

.cur-rate {
  font-size: 32px !important;
  height: 44px;
  padding-top: 5px;
  font-weight: bold;
}

.cur-percentage {
  padding-top: 5px;
  font-size: 14px;
  font-weight: 700;
}

.cur-date {
  padding: 5px 25px 0 0;
  font-size: 12px;
  justify-content: end;
}
</style>
