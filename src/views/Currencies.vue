<template>
  <div class="q-pa-md">
    <div class="row col-12">
      <div v-for="currency in notBaseCurrencies" :key="currency.id">
        <CurrencyCard
          :currency="currency"
          :rate="getLastRateForCurrency(currency.id)"
          :selectCurrency="selectCurrency"
          :selectedCurrencies="selectedCurrencies"
        />
      </div>
    </div>
    <div class="q-pb-md row justify-center">
      <div class="header">
        <h3>Currencies</h3>
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
    <div class="row justify-center q-mt-lg">
      <div class="col-4">
        <q-date v-model="selectedDays" multiple mask="YYYY-MM-DD"></q-date>
      </div>
      <div class="col-6">
        <div class="column">
          Base currency: {{ baseCurrency?.verbalName }}
          <q-btn no-caps dense rounded style="width: 40px;" label="Edit"></q-btn>
          <div class="row justify-start" v-for="currency in notBaseCurrencies" :key="currency.id">
            <CurrencyItem
              :currency="currency"
              :createRate="createRate"
              @save="save($event)"
              @edit="edit($event)"
              @remove="remove($event)"
            />
          </div>
        </div>
      </div>
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
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import CurrencyChart from '@/views/currency/components/CurrencyChart.vue';
import { ChartRange } from '@/store/constants';
import AddForm from '@/views/currency/forms/AddForm.vue';
import EditForm from '@/views/currency/forms/EditForm.vue';
import ConfirmForm from '@/views/currency/forms/ConfirmForm.vue';
import CurrencyItem from '@/views/currency/components/CurrencyItem.vue';
import CurrencyCard from '@/views/currency/components/CurrencyCard.vue';
import { Currency, Rate } from '@/types';
import { getRate } from '../service';

export default defineComponent({
  name: 'Currencies',

  components: {
    CurrencyChart,
    AddForm,
    EditForm,
    ConfirmForm,
    CurrencyItem,
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
      confirmForm: ref(false),
      rangeSelect: ref(null),
      rangeOptions: [
        {
          value: ChartRange.Month,
          label: '30 days',
        },
        {
          value: ChartRange.Quater,
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
      'createCurrency',
      'updateCurrency',
      'deleteCurrency',
      'fetchCurrencies',
      'fetchRates',
      'selectCurrency',
      'selectCurrencyRange',
    ]),

    async isRateExist(selectedDay: string, currencyId: number) {
      return this.ratesList.find((rate: Rate) => {
        const selectedDate = moment(selectedDay).startOf('day');
        const existingDate = moment(rate.rateDate).startOf('day');
        return selectedDate.isSame(existingDate) && currencyId === rate.currencyId;
      });
    },

    async getCurrentRate() {
      this.ratesInProgress = true;
      await Promise.all(this.selectedDays.map(async (day: string) => {
        await Promise.all(this.currencyList.map(async (currency: Currency) => {
          const fullCurrency = this.currencyList.find(
            (item: Currency) => item.code === currency.code,
          );
          const existingRate = await this.isRateExist(day, fullCurrency.id);
          if (!existingRate && !currency.isBase) {
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

    edit(currency: Currency) {
      this.selectedCurrency = currency;
      this.editForm = true;
    },

    remove(currency: Currency) {
      this.selectedCurrency = currency;
      this.confirmForm = true;
    },

    save() {
      console.log('Saved!');
    },

    getLastRateForCurrency(currencyId: number) {
      return this.ratesList.filter((item: Rate) => item.currencyId === currencyId)[0];
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
});
</script>
