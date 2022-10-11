<template>
  <q-card style="width: 500px;">
    <q-card-section>
      <h4>Make your plans</h4>
    </q-card-section>
    <q-card-section horizontal class="justify-between">
      <q-card-section style="width: 100%;">
        <q-input outlined stack-label label="Name" autofocus v-model="input.title" />
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
      <q-card-section style="width: auto;">
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
        <q-input outlined stack-label
          label="Amount"
          v-model="input.amount"
        />
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
    'closeForm',
  ],

  props: {
    categories: { type: Array, required: true },
    users: { type: Array, required: true },
    currencyList: { type: Array, required: true },
    activeUser: { type: String, default: '' },
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
        user: '',
        currency: '',
        recurrent: null,
      },
    };
  },

  computed: {
    preSelectedUser() {
      return this.users.find((item) => item.email === this.activeUser)?.uuid;
    },

    defaultCurrency() {
      return this.currencyList.find((item) => item.isDefault).uuid;
    },

    baseCurrency() {
      return this.currencyList.find((item) => item.isBase).uuid;
    },
  },

  methods: {
    async save() {
      const budget = {
        uuid: this.input.uuid,
        budgetDate: this.input.budgetDate,
        user: this.input.user,
        currency: this.input.currency,
        title: this.input.title,
        amount: this.input.amount,
        category: this.input.category,
        description: this.input.description,
        recurrent: this.input.recurrent,
      };

      await this.createBudget(budget);
      this.$emit('closeForm');
      this.$emit('update');
    },
  },

  mounted() {
    this.input.amount = this.budget.amount;
    this.input.title = this.budget.title;
    this.input.description = this.budget.description;
    this.input.user = this.preSelectedUser;
    this.input.category = this.budget.category;
    this.input.currency = this.baseCurrency;
    this.input.recurrent = this.budget.recurrent;
  },
};
</script>
