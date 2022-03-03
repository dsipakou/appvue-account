<template>
  <div class="row">
    <div class="col-4">
      <q-toggle
        v-model="selectedCurrenciesModel"
        />
    </div>
    <div class="col-2">
      <q-input outlined stack-label dense
        type="date"
        label="Date"
        />
    </div>
    <div class="col-1">
      <q-input dense />
    </div>
    <div>
      <q-btn dense no-caps flat label="Save" @click="save()" />
      <q-btn dense no-caps flat label="Edit" @click="edit()" />
      <q-btn dense no-caps flat label="Delete" @click="remove()" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CurrencyItem',

  emits: [
    'save',
    'edit',
    'remove',
  ],

  props: {
    currency: { type: Object, required: true },
  },

  methods: {
    save() {
      console.log(this.currency);
      this.$emit('save', this.currency);
    },

    edit() {
      this.$emit('edit', this.currency);
    },

    remove() {
      this.$emit('remove', this.currency);
    },
  },

  mounted() {
    console.log(this.currency);
  },
});
</script>
