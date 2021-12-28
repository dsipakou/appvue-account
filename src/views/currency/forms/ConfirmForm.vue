<template>
  <q-card style="max-width: 400px;">
    <q-card-section class="row justify-between">
      <span class="q-ml-sm text-h6">Delete {{currency.verbalName}}</span>
      <q-btn flat dense icon="close" v-close-popup />
    </q-card-section>
    <q-card-section class="row items-left">
      <span class="q-ml-sm text-subtitle1">
        This action also deletes all rates for the currency.
      </span>
    </q-card-section>

    <q-card-actions class="q-mx-sm justify-between">
      <q-btn flat no-caps label="Cancel" color="primary" v-close-popup />
      <q-btn no-caps label="Delete" color="negative" @click="removeCurrency()" />
    </q-card-actions>
  </q-card>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ConfirmForm',

  props: {
    currency: Object,
    deleteCurrency: Function,
  },

  emits: [
    'closeForm',
  ],

  methods: {
    removeCurrency() {
      this.deleteCurrency(this.currency.id);
      this.$emit('closeForm');
    },
  },
});
</script>
