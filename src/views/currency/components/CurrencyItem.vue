<template>
  <div class="row">
    <div class="col-3">
      <q-input outlined stack-label dense
        type="date"
        label="Date"
        v-model="currencyDate"
      />
    </div>
    <div class="col-1">
      <q-input dense
        mask="#.####"
        :rules="[ val => val.length > 5 || 'Should be #.#### number']"
        v-model="currencyRate" />
    </div>
    <div>
      <q-btn dense no-caps flat label="Save" @click="save()" />
      <q-btn dense no-caps flat label="Edit" @click="edit()" />
      <q-btn dense no-caps flat label="Delete" @click="remove()" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'CurrencyItem',

  emits: ['save', 'edit', 'remove'],

  setup() {
    return {
      currencyDate: ref(''),
      currencyRate: ref(''),
    };
  },

  props: {
    currency: { type: Object, required: true },
    createRate: { type: Function, required: true },
  },

  methods: {
    save() {
      if (this.currencyDate && this.currencyRate.length > 5) {
        this.createRate({
          currency: this.currency.uuid,
          rateDate: this.currencyDate,
          rate: this.currencyRate,
        });
      }
      this.$emit('save');
    },

    edit() {
      this.$emit('edit', this.currency);
    },

    remove() {
      this.$emit('remove', this.currency);
    },
  },
});
</script>
