<template>
  <q-select outlined label-stacked
    label="Currency"
    :options="availableCurrencies"
    :loading="!currencyListLoaded"
    :readonly="!currencyListLoaded"
    option-value="id"
    option-label="verbalName"
    v-model="currencyModel" />
</template>
<script>
import moment from 'moment';

export default {
  name: 'CurrencyDropdown',

  props: {
    currencyList: Array,
    selectedCurrencyId: { type: Number, default: -1 },
    ratesList: Array,
    selectedDate: { type: String, default: new Date().toISOString().substr(0, 10) },
    currencyListLoaded: Boolean,
  },

  data() {
    return {
      preSelectedCurrency: '',
      availableCurrencies: [],
      currencyModel: '',
    };
  },

  computed: {
    defaultCurrency() {
      return this.currencyList.find((item) => item.isDefault);
    },

    baseCurrency() {
      return this.currencyList.find((item) => item.isBase);
    },

    selectedCurrency() {
      return this.currencyList.find((item) => item.id === this.selectedCurrencyId);
    },
  },

  methods: {
    isRateExist(id) {
      return this.ratesList.some((item) => {
        const inputDate = moment(this.selectedDate).startOf('day');
        const rateDate = moment(item.rateDate).startOf('day');
        return rateDate.isSame(inputDate) && item.currencyId === id;
      });
    },

    getAvailableCurrencies() {
      const extendedCurrencyList = this.currencyList.map((item) => {
        if (item.isBase) {
          return item;
        }
        if (!this.isRateExist(item.id)) {
          return {
            ...item,
            verbalName: `${item.verbalName} (no exchange rate)`,
            disable: true,
          };
        }
        return item;
      });

      this.availableCurrencies = extendedCurrencyList;

      if (this.selectedCurrency) {
        this.preSelectedCurrency = this.selectedCurrency;
        return;
      }

      this.preSelectedCurrency = this.defaultCurrency;
      if (extendedCurrencyList.find((item) => item.id === this.defaultCurrency.id).disable) {
        this.preSelectedCurrency = this.baseCurrency;
      }
    },
  },

  watch: {
    selectedDate() {
      this.getAvailableCurrencies();
      this.currencyModel = this.preSelectedCurrency;
    },

    currencyModel() {
      this.$emit('selectCurrency', this.currencyModel);
    },
  },
};
</script>
