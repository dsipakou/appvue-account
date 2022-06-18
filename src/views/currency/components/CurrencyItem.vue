<template>
  <div class="row">
    <div class="row col-6">
      <q-input dense
        mask="#.####"
        :rules="[ val => val.length > 5 || 'Should be #.#### number']"
        v-model="rate" >
        <template v-slot:prepend>
          {{ currency.sign }}
        </template>
      </q-input>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { Rate } from '@/types';

export default defineComponent({
  name: 'CurrencyItem',

  emits: ['edit', 'remove'],

  setup() {
    return {
      rate: ref(''),
    };
  },

  props: {
    currency: { type: Object, required: true },
    currencyDate: { type: String },
    rateListOnDate: { type: Array as PropType<Array<Rate>>, required: true },
    createRate: { type: Function, required: true },
    updateRate: { type: Function, required: true },
  },

  computed: {
    rateOnDate() {
      return this.rateListOnDate.find((item: Rate) => item.currency === this.currency.uuid);
    },
  },

  methods: {
    save(baseCurrency: string) {
      if (this.currencyDate && this.rate.length > 5) {
        if (this.rateOnDate) {
          if (Number(this.rate) !== this.rateOnDate.rate) {
            this.updateRate({
              uuid: this.rateOnDate.uuid,
              rate: Number(this.rate),
            });
          }
        } else {
          this.createRate({
            currency: this.currency.uuid,
            rateDate: this.currencyDate,
            rate: Number(this.rate),
            baseCurrency,
          });
        }
      }
    },

    edit() {
      this.$emit('edit', this.currency);
    },

    remove() {
      this.$emit('remove', this.currency);
    },
  },

  watch: {
    rateListOnDate() {
      if (this.rateOnDate) {
        this.rate = this.rateOnDate.rate.toString().padEnd(6, '0');
      } else {
        this.rate = '';
      }
    },
  },
});
</script>
