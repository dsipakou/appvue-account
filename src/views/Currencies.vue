<template>
  <div class="q-pa-md">
    <div class="q-pb-md row justify-center">
      <div class="header">
        <h3>Currencies</h3>
      </div>
    </div>
    <div class="row justify-center">
      <q-btn
        rounded
        color="primary"
        @click="getCurrentRate"
        :disabled="ratesInProgress">
        Get rates
      </q-btn>
      <q-btn
        rounded
        color="primary"
        class="q-ml-lg"
        @click="createForm = true">
        Add currency
      </q-btn>
    </div>
    <div class="row justify-center q-mt-lg">
      <q-date v-model="selectedDays" multiple mask="YYYY-MM-DD"></q-date>
    </div>
    <div class="row justify-center q-mt-lg">
      <div class="column">
        <q-toggle
          v-for="currency in notDefaultCurrencies"
          :key="currency.id"
          v-model="selectedCurrenciesModel"
          :label="currency.verbalName"
          :val="currency.code" />
      </div>
    </div>
    <q-dialog v-model="createForm">
      <AddForm
        :createCurrency="createCurrency"
        @closeForm="createForm = false" />
    </q-dialog>
    <div class="row">
      <q-select map-options
        v-model="rangeSelect"
        label="Period"
        :options="rangeOptions"
        class="col-2" />
    </div>
    <CurrencyChart
      style="height: 300px;"
      :ratesList="ratesList"
      :currencyList="currencyList"
      :selectedCurrencies="selectedCurrencies"
      :range="selectedRange" />
  </div>
</template>
<script>
import { computed, ref } from 'vue';
import { mapGetters, mapActions, useStore } from 'vuex';
import moment from 'moment';
import CurrencyChart from '@/views/currency/components/CurrencyChart.vue';
import { Range } from '@/store/constants';
import AddForm from '@/views/currency/forms/AddForm.vue';
import { getRate } from '../service';

export default {
  name: 'Currencies',

  components: {
    CurrencyChart,
    AddForm,
  },

  data() {
    return {
      ratesInProgress: false,
      input: {
        code: '',
        sign: '',
        verbalName: '',
        isDefault: false,
      },
    };
  },

  setup() {
    const store = useStore();

    const selectedCurrenciesModel = computed({
      get: () => store.getters.selectedCurrencies,
      set: (val) => store.commit('selectCurrency', val),
    });

    return {
      selectedDays: ref([]),
      selectedCurrenciesModel,
      selectedRange: ref(Range.Month),
      createForm: ref(false),
      rangeSelect: ref(null),
      rangeOptions: [
        {
          value: Range.Month,
          label: '30 days',
        },
        {
          value: Range.Quater,
          label: '90 days',
        },
      ],
    };
  },

  computed: {
    ...mapGetters([
      'currencyList',
      'selectedCurrencies',
      'currencyRange',
      'ratesList',
      'isCurrencyListLoading',
      'isRatesListLoading',
    ]),

    notDefaultCurrencies() {
      return this.currencyList.filter((item) => !item.isDefault);
    },
  },

  methods: {
    ...mapActions([
      'createRate',
      'createCurrency',
      'fetchCurrencies',
      'fetchRates',
      'selectCurrencyRange',
    ]),

    async isRateExist(selectedDay, currencyId) {
      return this.ratesList.find((rate) => {
        const selectedDate = moment(selectedDay).startOf('day');
        const existingDate = moment(rate.rateDate).startOf('day');
        return selectedDate.isSame(existingDate) && currencyId === rate.currencyId;
      });
    },

    async getCurrentRate() {
      this.ratesInProgress = true;
      await Promise.all(this.selectedDays.map(async (day) => {
        await Promise.all(this.currencyList.map(async (currency) => {
          const fullCurrency = this.currencyList.find((item) => item.code === currency.code);
          const existingRate = await this.isRateExist(day, fullCurrency.id);
          if (!existingRate && !currency.isDefault) {
            const rate = await getRate(currency.code, day);
            const payload = {
              currencyId: fullCurrency.id,
              rateDate: day,
              rate,
              description: '',
            };
            this.createRate(payload);
          }
        }));
      }));
      this.ratesInProgress = false;
    },

  },

  watch: {
    rangeSelect(data) {
      if (data) {
        this.selectCurrencyRange(data.value);
        this.selectedRange = data.value;
      }
    },
  },

  beforeMount() {
    this.fetchCurrencies();
    this.fetchRates();
  },

  mounted() {
    this.rangeSelect = this.currencyRange;
  },
};
</script>
