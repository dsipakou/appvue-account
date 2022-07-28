<template>
  <q-card style="width: 500px;">
    <q-card-section>
      <h4>Make your plans</h4>
    </q-card-section>
    <q-card-section horizontal class="justify-between">
      <q-card-section style="width: 100%;">
        <q-input outlined stack-label label="Name" autofocus v-model="input.title" />
      </q-card-section>
      <q-card-section style="width: auto;">
        <q-select outlined label-stacked map-options emit-value
          label="Category"
          option-value="uuid"
          option-label="name"
          :options="categories"
          style="width: 200px;"
          v-model="input.category" />
      </q-card-section>
    </q-card-section>

    <q-card-section horizontal class="justify-between">
      <q-card-section>
        <q-input outlined stack-label
          label="Amount"
          v-model="input.amount"
        />
      </q-card-section>
      <q-card-section>
        <q-input outlined stack-label
          type="date"
          label="Date"
          v-model="input.budgetDate"
          />
      </q-card-section>
      <q-card-section>
        <q-select outlined clearable label-stacked map-options emit-value
          label="Repeat"
          option-value="name"
          option-label="value"
          :options="recurrent_options"
          style="width: 180px;"
          v-model="input.recurrent" />
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
      <q-btn color="primary" rounded style="width: 100px;" @click="save()">Save</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { RECURRENT_OPTIONS } from '@/service/budget';

export default {
  name: 'AddForm',

  inheritAttrs: false,

  emits: [
    'addBudget',
    'closeForm',
  ],

  props: {
    categories: { type: Array, required: true },
    createBudget: { type: Function, required: true },
    budget: {
      type: Object,
      default() {
        return {
          amount: 0,
          title: '',
          description: '',
          categoryId: 0,
          recurrent: null,
        };
      },
    },
  },

  data() {
    return {
      recurrent_options: RECURRENT_OPTIONS,
      input: {
        budgetDate: '',
        amount: 0,
        title: '',
        description: '',
        categoryId: 0,
        recurrent: null,
      },
    };
  },

  methods: {
    save() {
      const budget = {
        uuid: this.input.uuid,
        budgetDate: this.input.budgetDate,
        title: this.input.title,
        amount: this.input.amount,
        category: this.input.category,
        description: this.input.description,
        recurrent: this.input.recurrent,
      };

      this.createBudget(budget);
      this.$emit('closeForm');
    },
  },

  mounted() {
    this.input.amount = this.budget.amount;
    this.input.title = this.budget.title;
    this.input.description = this.budget.description;
    this.input.category = this.budget.category;
    this.input.recurrent = this.budget.recurrent;
  },
};
</script>
