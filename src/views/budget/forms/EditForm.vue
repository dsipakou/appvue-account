<template>
  <input type="hidden" v-model="input.uuid" />
  <input type="hidden" v-model="input.isCompleted" />
  <q-card style="width: 400px;">
    <q-card-section>
      <h4>Update your plans</h4>
    </q-card-section>
    <q-card-section horizontal class="justify-between">
      <q-card-section style="width: 100%;">
        <q-input outlined stack-label label="Name" v-model="input.title" />
      </q-card-section>
    </q-card-section>
    <q-card-section horizontal class="justify-between">
      <q-card-section>
        <q-select outlined label-stacked map-options emit-value
          label="User"
          option-value="uuid"
          option-label="username"
          :options="users"
          style="width: 100px;"
          v-model="input.user" />
      </q-card-section>
      <q-card-section>
        <q-select outlined label-stacked map-options emit-value
          label="Category"
          option-value="uuid"
          option-label="name"
          :options="categories"
          style="width: 200px;"
          v-model="input.category" />
      </q-card-section>
      <q-card-section>
        <q-select outlined clearable label-stacked map-options emit-value
          label="Repeat"
          option-value="name"
          option-label="value"
          :options="recurrent_options"
          style="width: 150px;"
          v-model="input.recurrent" />
      </q-card-section>
    </q-card-section>
    <q-card-section horizontal class="justify-between">
      <q-card-section>
        <q-input outlined stack-label label="Amount" v-model="input.amount" />
      </q-card-section>
      <q-card-section>
        <q-select outlined clearable label-stacked map-options emit-value
          label="Currency"
          option-value="uuid"
          option-label="code"
          :options="currencyList"
          style="width: 150px;"
          v-model="input.currency" />
      </q-card-section>
      <q-card-section>
        <q-input outlined stack-label
          type="date"
          label="Date"
          v-model="input.budgetDate"
        />
      </q-card-section>
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
      <q-btn color="primary" rounded style="width: 100px;" @click="update()">Update</q-btn>
      <q-btn color="red" rounded style="width: 100px;" @click="remove()">Delete</q-btn>
      <q-btn outlined rounded style="width: 100px;" @click="duplicate()">Duplicate</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { RECURRENT_OPTIONS } from '@/service/budget';

export default {
  name: 'EditForm',

  inheritAttrs: false,

  props: {
    users: { type: Array, required: true },
    updateBudget: { type: Function, required: true },
    deleteBudget: { type: Function, required: true },
    item: { type: Object, required: true },
    categories: { type: Array, required: true },
    currencyList: { type: Array, required: true },
  },

  emits: [
    'closeForm',
    'duplicateClick',
  ],

  data() {
    return {
      recurrent_options: RECURRENT_OPTIONS,
      input: {
        uuid: '',
        isCompleted: false,
        title: '',
        amount: 0,
        budgetDate: '',
        category: '',
        user: '',
        currency: '',
        recurrent: null,
        description: '',
      },
    };
  },

  mounted() {
    this.input.uuid = this.item.uuid;
    this.input.isCompleted = this.item.isCompleted;
    this.input.title = this.item.title;
    this.input.amount = this.item.planned;
    this.input.budgetDate = this.item.budgetDate;
    this.input.category = this.item.category;
    this.input.user = this.item.user;
    this.input.currency = this.item.currency;
    this.input.recurrent = this.item.recurrent;
    this.input.description = this.item.description;
  },

  methods: {
    update() {
      const budget = {
        uuid: this.input.uuid,
        budgetDate: this.input.budgetDate,
        currency: this.input.currency,
        user: this.input.user,
        title: this.input.title,
        amount: this.input.amount,
        category: this.input.category,
        recurrent: this.input.recurrent,
        description: this.input.description,
        isCompleted: this.input.isCompleted,
      };
      this.updateBudget(budget);
      this.$emit('closeForm');
    },

    remove() {
      this.deleteBudget(this.input.uuid);
      this.$emit('closeForm');
    },

    duplicate() {
      const budget = {
        title: this.input.title,
        amount: this.input.amount,
        category: this.input.category,
        description: this.input.description,
        recurrent: this.input.recurrent,
      };
      this.$emit('duplicateClick', budget);
    },
  },
};
</script>
