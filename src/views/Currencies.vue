<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="header">
        <h3>Currencies</h3>
      </div>
    </div>
    <div class="row justify-center">
      <q-btn rounded color="primary" @click="getCurrentRate">Get rates</q-btn>
    </div>
    <div class="row justify-center q-mt-lg">
      <q-date v-model="days" multiple mask="YYYY-MM-DD"></q-date>
    </div>
    <div class="column q-mt-lg">
      <q-toggle
        v-for="currency in currenciesList"
        :key="currency.id"
        v-model="selectedCurrencies"
        :label="currency.verbalName"
        :val="currency"/>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import { getRate } from '../service';

export default {
  name: 'Currencies',

  setup() {
    return {
      days: ref([]),
      selectedCurrencies: ref([]),
    };
  },

  computed: {
    ...mapGetters([
      'currenciesList',
      'ratesList',
      'isCurrencyListLoading',
      'isRatesListLoading',
    ]),
  },

  methods: {
    ...mapActions([
      'createRate',
    ]),

    async getCurrentRate() {
      await Promise.all(this.days.map(async (day) => {
        await Promise.all(this.selectedCurrencies.map(async (currency) => {
          const rate = await getRate(currency.code, day);
          const payload = {
            currencyId: currency.id,
            rateDate: day,
            rate,
            description: '',
          };

          await this.storeRate(payload);
        }));
      }));
    },

    async storeRate(rate) {
      const existingRate = this.ratesList.find((item) => {
        const itemDate = moment(item.rateDate).startOf('day');
        const rateDate = moment(rate.rateDate).startOf('day');
        return itemDate.isSame(rateDate);
      });

      if (!existingRate) {
        this.createRate(rate);
      }
    },
  },
};
</script>
