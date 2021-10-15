<template>
  <q-card style="width: 400px;">
    <q-card-section>
      <h4>Make your plans</h4>
    </q-card-section>
    <q-card-section>
      <q-input outlined stack-label label="Name" v-model="input.title" />
    </q-card-section>
    <q-card-section horizontal class="justify-between">
      <q-card-section>
        <q-input outlined stack-label label="Amount" v-model.number="input.amount" />
      </q-card-section>
      <q-card-section>
        <q-input outlined stack-label
          type="date"
          label="Date"
          v-model="input.budgetDate"
          />
      </q-card-section>
      <q-card-section>
        <q-select outlined label-stacked map-options emit-value
          label="Category"
          option-value="id"
          option-label="name"
          :options="categories"
          style="width: 200px;"
          v-model="input.categoryId" />
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
export default {
  name: 'AddForm',

  inheritAttrs: false,

  emits: [
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
        };
      },
    },
  },

  data() {
    return {
      input: {
        budgetDate: '',
        amount: 0,
        title: '',
        description: '',
        categoryId: 0,
      },
    };
  },

  methods: {
    save() {
      const budget = {
        id: this.input.id,
        budgetDate: this.input.budgetDate,
        title: this.input.title,
        amount: this.input.amount,
        categoryId: this.input.categoryId,
        description: this.input.description,
      };

      this.createBudget(budget);
      this.$emit('closeForm');
    },
  },

  mounted() {
    this.input.amount = this.budget.amount;
    this.input.title = this.budget.title;
    this.input.description = this.budget.description;
    this.input.categoryId = this.budget.categoryId;
  },
};
</script>
