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
    ratesList: Array,
    selectedDate: { type: String, default: new Date().toISOString().substr(0, 10) },
    currencyListLoaded: Boolean,
  },

  data() {
    return {
      defaultCurrency: '',
      availableCurrencies: [],
      currencyModel: '',
    };
  },

  methods: {
    initCurrencies() {
      this.defaultCurrency = this.currencyList.find((item) => item.isDefault);
    },

    getAvailableCurrencies() {
      const isRateExist = (id) => this.ratesList.some((item) => {
        const inputDate = moment(this.selectedDate).startOf('day');
        const rateDate = moment(item.rateDate).startOf('day');
        return rateDate.isSame(inputDate) && item.currencyId === id;
      });

      const newList = this.currencyList.map((item) => {
        if (item === this.defaultCurrency) {
          return item;
        }
        if (!isRateExist(item.id)) {
          return {
            ...item,
            verbalName: `${item.verbalName} (no exchange rate)`,
            disable: true,
          };
        }
        return item;
      });
      this.availableCurrencies = newList;
    },
  },

  watch: {
    selectedDate() {
      this.getAvailableCurrencies();
      this.currencyModel = this.defaultCurrency;
    },

    currencyModel() {
      this.$emit('selectCurrency', this.currencyModel);
    },
  },

  mounted() {
    this.initCurrencies();
  },
};
</script>
