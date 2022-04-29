<template>
  <div class="q-pa-md">
    <q-btn rounded
      color="primary"
      class="btn-add fixed"
      icon="add"
      @click="ratesForm = true"
    />
    <div class="row col-12">
      <div v-for="currency in notBaseCurrencies" :key="currency.uuid">
        <CurrencyCard
          :currency="currency"
          :rate="getLastRateForCurrency(currency.uuid)"
          :selectCurrency="selectCurrency"
          :selectedCurrencies="selectedCurrencies"
        />
      </div>
    </div>
    <div class="row col-12 chart-area">
      <div class="row col-12 justify-center">
        <div>
          <q-btn-group flat>
            <q-btn no-caps
              class="range-button"
              v-for="item in rangeLabels"
              :key="item.value"
              :label="item.label"
              :class="currencyRange === item.value
                ? 'active-range-button'
                : 'inactive-range-button'"
              @click="selectCurrencyRange(item.value)"
              />
          </q-btn-group>
        </div>

        <CurrencyChart
          style="height: 300px;"
          :ratesList="ratesList"
          :currencyList="currencyList"
          :data="ratesChartData"
          :selectedCurrencies="selectedCurrencies"
          :range="selectedRange" />
      </div>
    </div>
    <div class="row justify-center">
      <q-btn rounded
        color="primary"
        @click="getCurrentRate"
        :disabled="ratesInProgress">
        Get rates
      </q-btn>
      <q-btn rounded
        color="primary"
        class="q-ml-lg"
        @click="createForm = true">
        Add currency
      </q-btn>
    </div>
    <q-dialog v-model="createForm">
      <AddForm
        :createCurrency="createCurrency"
        @closeForm="createForm = false" />
    </q-dialog>
    <q-dialog v-model="editForm">
      <EditForm
        :currency="selectedCurrency"
        :updateCurrency="updateCurrency"
        @closeForm="editForm = false" />
    </q-dialog>
    <q-dialog v-model="confirmForm">
      <ConfirmForm
        :currency="selectedCurrency"
        :deleteCurrency="deleteCurrency"
        @closeForm="confirmForm = false" />
    </q-dialog>
    <q-dialog v-model="ratesForm">
      <RatesForm
        :currencies="currencyList"
        :rateListOnDate="rateListOnDate"
        :isRatesListLoading="isRatesListLoading"
        :createRate="createRate"
        :updateRate="updateRate"
        :fetchRatesOnDate="fetchRatesOnDate"
        @closeForm="ratesForm = false" />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import CurrencyChart from '@/views/currency/components/CurrencyChart.vue';
import { ChartRange, rangeLabels } from '@/store/constants';
import AddForm from '@/views/currency/forms/AddForm.vue';
import EditForm from '@/views/currency/forms/EditForm.vue';
import RatesForm from '@/views/currency/forms/RatesForm.vue';
import ConfirmForm from '@/views/currency/forms/ConfirmForm.vue';
import CurrencyCard from '@/views/currency/components/CurrencyCard.vue';
import { Currency, Rate } from '@/types';
import { getRate } from '../service';

export default defineComponent({
  name: 'Currencies',

  components: {
    CurrencyChart,
    AddForm,
    EditForm,
    RatesForm,
    ConfirmForm,
    CurrencyCard,
  },

  data() {
    return {
      ratesInProgress: false,
      selectedCurrency: {},
      input: {
        code: '',
        sign: '',
        verbalName: '',
        isDefault: false,
      },
    };
  },

  setup() {
    return {
      selectedDays: ref([]),
      selectedRange: ref(ChartRange.Month),
      createForm: ref(false),
      editForm: ref(false),
      ratesForm: ref(false),
      confirmForm: ref(false),
      rangeLabels,
    };
  },

  computed: {
    ...mapGetters([
      'currencyList',
      'selectedCurrencies',
      'currencyRange',
      'ratesList',
      'rateListOnDate',
      'ratesChartData',
      'isCurrencyListLoading',
      'isRatesListLoading',
    ]),

    notBaseCurrencies(): Currency[] {
      return this.currencyList.filter((item: Currency) => !item.isBase);
    },

    baseCurrency(): Currency[] {
      return this.currencyList.find((item: Currency) => item.isBase);
    },
  },

  methods: {
    ...mapActions([
      'createRate',
      'updateRate',
      'createCurrency',
      'updateCurrency',
      'deleteCurrency',
      'fetchCurrencies',
      'fetchRates',
      'fetchRatesOnDate',
      'fetchChartData',
      'selectCurrency',
      'selectCurrencyRange',
    ]),

    async isRateExist(selectedDay: string, currencyUuid: string) {
      return this.ratesList.find((rate: Rate) => {
        const selectedDate = moment(selectedDay).startOf('day');
        const existingDate = moment(rate.rateDate).startOf('day');
        return selectedDate.isSame(existingDate) && currencyUuid === rate.currency;
      });
    },

    async getCurrentRate() {
      this.ratesInProgress = true;
      await Promise.all(this.selectedDays.map(async (day: string) => {
        await Promise.all(this.currencyList.map(async (currency: Currency) => {
          const fullCurrency = this.currencyList.find(
            (item: Currency) => item.code === currency.code,
          );
          const existingRate = await this.isRateExist(day, fullCurrency.uuid);
          if (!existingRate && !currency.isBase) {
            const rate = await getRate(currency.code, day);
            const payload = {
              currency: fullCurrency.uuid,
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

    getLastRateForCurrency(currencyUuid: string) {
      return this.ratesList.filter((item: Rate) => item.currency === currencyUuid)[0];
    },
  },

  beforeMount() {
    this.fetchCurrencies();
    this.fetchRates();
    this.fetchChartData(this.currencyRange);
  },

  watch: {
    currencyRange() {
      this.fetchChartData(this.currencyRange);
    },
  },
});
</script>
<style>
.chart-area {
  margin-top: 15px;
}

.chart-buttons {
  padding: 0 72px;
}

.range-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 33px;
  width: 132px;
  border-radius: 5px !important;
  font-size: 16px;
  color: #047A94;
  margin: 0 20px;
}

.inactive-range-button {
  border: 1px solid #ADADAD;
  color: #047A94;
  box-shadow:
    0 1px 3px rgb(0 0 0 / 20%),
    0 1px 1px rgb(0 0 0 / 14%),
    0 1px 1px rgb(0 0 0 / 12%);
}

.active-range-button {
  background-color: #047A94 !important;
  color: white !important;
}

.btn-add {
  width: 55px !important;
  height: 55px !important;
  right: 30px;
  bottom: 30px;
  z-index: 10;
}
</style>
