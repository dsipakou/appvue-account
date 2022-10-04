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
export default {
  name: 'CurrencyDropdown',

  props: {
    currencyList: Array,
    selectedCurrencyId: { type: Number, default: -1 },
    availableRates: { type: Object, required: true },
    selectedDate: { type: String, default: new Date().toISOString().substr(0, 10) },
    currencyListLoaded: Boolean,
    getAvailableRates: { type: Function, required: true },
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
    isRateExist(currencyCode) {
      return this.availableRates[currencyCode];
    },

    async getAvailableCurrencies() {
      await this.getAvailableRates(this.selectedDate);
      const extendedCurrencyList = this.currencyList.map((item) => {
        if (!this.isRateExist(item.code)) {
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
    async selectedDate() {
      await this.getAvailableCurrencies();
      this.currencyModel = this.preSelectedCurrency;
    },

    currencyModel() {
      this.$emit('selectCurrency', this.currencyModel);
    },
  },
};
</script>
