<template>
  <q-select map-options multiple stack-label
    :options="selectList"
    :loading="!currencyListLoaded"
    :readonly="!currencyListLoaded"
    v-model="selectedCurrencies"
    option-value="id"
    option-label="verbalName"
    style="width: 600px;">
    <template v-slot:selected>
      Currency:
      <q-chip dense square
        v-for="currency in selectedCurrencies"
        :key="currency.id"
        color="white"
        text-color="primary"
        style="max-width: 100px;"
        class="q-ml-sm overflow-hidden align-center"
        >
        <q-avatar color="primary" text-color="white" class="vertical-middle">
          <span class="text-weight-bold text-body1 align-center">
            {{ currency.sign }}
          </span>
        </q-avatar>
        <span class="text-weight-light header__span q-ml-xs">
          {{ currency.verbalName }}</span>
      </q-chip>
    </template>
  </q-select>
</template>
<script>
import { ref } from 'vue';

export default {
  name: 'CurrencyFilterDropdown',

  props: {
    currencyList: Array,
    currencyListLoaded: Boolean,
  },

  setup() {
    return {
      selectedCurrencies: ref([]),
    };
  },

  data() {
    return {
      selectList: [],
    };
  },

  methods: {
    initCurrencies() {
      this.selectList = this.currencyList.filter((item) => (
        !item.isDefault
      ));
    },
  },

  watch: {
    selectedCurrencies() {
      this.$emit('selectCurrency', this.selectedCurrencies);
    },

    currencyListLoaded() {
      if (this.currencyListLoaded) {
        this.initCurrencies();
      }
    },
  },
};
</script>
