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
        <q-card-section>
          <h4>Make your plans</h4>
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            type="date"
            stack-label
            label="Date"
            v-model="input.date"
            />
        </q-card-section>
        <q-card-section>
          <q-input outlined stack-label label="Name" v-model="input.name" />
        </q-card-section>
        <q-card-section>
          <q-input outlined stack-label label="Amount" v-model="input.amount" />
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            stack-label
            label="Description"
            type="textarea"
            v-model="input.description"
            />
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

export default {
  name: 'Budget',

  setup() {
    return {
      createForm: ref(false),
    };
  },

  data() {
    return {
      input: {
        date: '',
        amount: 0,
        name: '',
        description: '',
      },
    };
  },

  methods: {
    openAddForm() {
      this.createForm = true;
    },
  },
};
</script>
