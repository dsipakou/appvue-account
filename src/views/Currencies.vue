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
      <q-card class="shadow-24" style="width: 400px;">
        <q-card-section>
          <h4>Add currency</h4>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input outlined stack-label label="Code" v-model="input.code" />
        </q-card-section>
        <q-card-section>
          <q-input outlined stack-label label="Sign" v-model="input.sign" />
        </q-card-section>
        <q-card-section>
          <q-input outlined stack-label label="Verbal Name" v-model="input.verbalName" />
        </q-card-section>
        <q-card-section>
          <q-checkbox v-model="input.isDefault" label="Default currency"></q-checkbox>
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            stack-label
            type="textarea"
            label="Comments"
            v-model="input.comments" />
        </q-card-section>

        <q-card-actions align="center" class="action-buttons">
          <q-btn color="primary" rounded style="width: 100px;" @click="create()">Save</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row">
      <q-select
        v-model="rangeSelect"
        label="Period"
        :options="rangeOptions"
        map-options
        class="col-2" />
    </div>
    <CurrencyChart
      style="height: 300px;"
      :ratesList="ratesList"
      :currencyList="currencyList"
      :selectedCurrencies="selectedCurrencies" />
  </div>
</template>
<script>
import { computed, ref } from 'vue';
import { mapGetters, mapActions, useStore } from 'vuex';
import moment from 'moment';
import CurrencyChart from '@/views/currency/components/CurrencyChart.vue';
import { Range } from '@/store/constants';
import { getRate } from '../service';

export default {
  name: 'Currencies',

  components: {
    CurrencyChart,
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
      createForm: ref(false),
      rangeSelect: ref(null),
      rangeOptions: [
        {
          value: Range.Month,
          label: 'Month',
        },
        {
          value: Range.Quater,
          label: '3 months',
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
        await Promise.all(this.selectedCurrenciesModel.map(async (currency) => {
          const fullCurrency = this.currencyList.find((item) => item.code === currency);
          const existingRate = await this.isRateExist(day, fullCurrency.id);
          if (!existingRate) {
            const rate = await getRate(currency, day);
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

    create() {
      const currency = {
        code: this.input.code,
        sign: this.input.sign,
        verbalName: this.input.verbalName,
        isDefault: this.input.isDefault,
        comments: this.input.comments,
      };

      this.createCurrency(currency);
      this.createForm = false;
    },
  },

  watch: {
    rangeSelect(data) {
      if (data) {
        this.selectCurrencyRange(data.value);
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
