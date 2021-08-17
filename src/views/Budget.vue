<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="header">
        Budget
      </div>
    </div>
    <div>
      <q-btn round color="primary" label="+" @click="openAddForm"></q-btn>
    </div>
  </div>
  <q-dialog v-model="createForm">
    <q-card style="width: 400px;">
      <div>Make your plans</div>
      <div class="q-pa-md">
        <q-input></q-input>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref } from 'vue';

export default {
  name: 'Budget',

  setup() {
    return {
      createForm: ref(false),
    };
  },

  methods: {
    openAddForm() {
      this.createForm = true;
    },
  },
};
</script>
