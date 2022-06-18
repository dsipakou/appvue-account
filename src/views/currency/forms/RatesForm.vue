<template>
  <q-card class="shadow-24" style="width: 500px; max-width: 50vw;">
    <q-card-section>
      <h4>Add rates</h4>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="row col-6 justify-center">
          <div class="column">
            <CurrencyItem
              v-for="currency in notBaseCurrencies"
              :key="currency.uuid"
              :currency="currency"
              :currencyDate="selectedDay"
              :rateListOnDate="rateListOnDate"
              :createRate="createRate"
              :updateRate="updateRate"
              :ref="item => currencyItems.add(item)"
            />
          </div>
        </div>
        <div class="row col-6">
          <q-date :disable="isRatesListLoading" v-model="selectedDay" mask="YYYY-MM-DD"></q-date>
        </div>
      </div>
    </q-card-section>
    <q-card-actions class="q-ma-sm" align="center">
      <q-btn @click="closeForm" label="Close" />
      <q-btn @click="save" label="Save rates" />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { Currency, Rate } from '@/types';
import CurrencyItem from '@/views/currency/components/CurrencyItem.vue';

export default defineComponent({
  name: 'Add rates form',

  components: {
    CurrencyItem,
  },

  setup() {
    return {
      selectedDay: ref(),
    };
  },

  emits: [
    'closeForm',
  ],

  props: {
    currencies: { type: Array as PropType<Array<Currency>>, required: true },
    rateListOnDate: { type: Array as PropType<Array<Rate>>, required: true },
    isRatesListLoading: { type: Boolean, required: true },
    createRate: { type: Function, required: true },
    updateRate: { type: Function, required: true },
    fetchRatesOnDate: { type: Function, required: true },
  },

  data() {
    return {
      currencyItems: new Set() as Set<InstanceType<typeof CurrencyItem>>,
    };
  },

  computed: {
    notBaseCurrencies(): Currency[] {
      return this.currencies.filter((item: Currency) => !item.isBase);
    },

    baseCurrency(): string {
      return this.currencies.find((item: Currency) => item.isBase)?.uuid || '';
    },
  },

  methods: {
    closeForm() {
      this.$emit('closeForm');
    },

    save() {
      this.currencyItems.forEach(
        (item: InstanceType<typeof CurrencyItem>) => item.save(this.baseCurrency),
      );
    },
  },

  watch: {
    selectedDay() {
      this.fetchRatesOnDate(this.selectedDay);
    },
  },
});
</script>
