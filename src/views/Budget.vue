<template>
  <div>
    <div class="q-pa-md">
      <div class="row q-mt-lg justify-center">
        <div class="col-9 q-px-md">
          <div class="row justify-between">
            <h5>Monthly Budget</h5>
            <q-btn round color="primary" label="+" @click="openAddForm"></q-btn>
          </div>
        </div>
        <div class="col-3 q-px-md">
          <div class="row justify-between">
            <h5>This week</h5>
            <span>'$1000'</span>
          </div>
        </div>
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
  </div>
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
