<template>
  <div class="q-pa-md">
    <div class="row justify-center">
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
        @click="createCurrency = true">
        Add currency
      </q-btn>
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
    <q-dialog v-model="createCurrency">
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
        <q-card-actions align="center" class="action-buttons">
          <q-btn color="primary" rounded style="width: 100px;" @click="create()">Save</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { ref } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import { getRate } from '../service';

export default {
  name: 'Currencies',

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
    return {
      days: ref([]),
      selectedCurrencies: ref([]),
      createCurrency: ref(false),
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
      this.ratesInProgress = true;
      await Promise.all(this.days.map(async (day) => {
        await Promise.all(this.selectedCurrencies.map(async (currency) => {
          const existingRate = this.ratesList.find((item) => {
            const itemDate = moment(day).startOf('day');
            const rateDate = moment(item.rateDate).startOf('day');
            return itemDate.isSame(rateDate);
          });
          if (!existingRate) {
            const rate = await getRate(currency.code, day);
            const payload = {
              currencyId: currency.id,
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
};
</script>
