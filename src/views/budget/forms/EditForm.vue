<template>
  <input type="hidden" v-model="input.id" />
  <input type="hidden" v-model="input.isCompleted" />
  <q-card style="width: 400px;">
    <q-card-section>
      <h4>Update your plans</h4>
    </q-card-section>
    <q-card-section horizontal class="justify-between">
      <q-card-section>
        <q-input outlined stack-label label="Name" v-model="input.title" />
      </q-card-section>
      <q-card-section>
        <q-input outlined stack-label label="Amount" v-model.number="input.amount" />
      </q-card-section>
      <q-card-section>
        <q-input
          outlined
          type="date"
          stack-label
          label="Date"
          v-model="input.budgetDate"
          />
      </q-card-section>
    </q-card-section>
    <q-card-section>
      <q-select
        outlined
        label="Category"
        label-stacked
        map-options
        emit-value
        option-value="id"
        option-label="name"
        :options="categories"
        v-model="input.categoryId" />
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
export default {
  name: 'EditForm',

  inheritAttrs: false,

  props: {
    updateBudget: { type: Function, required: true },
    deleteBudget: { type: Function, required: true },
    item: { type: Object, required: true },
    categories: { type: Array, required: true },
  },

  emits: [
    'closeForm',
    'duplicateClick',
  ],

  data() {
    return {
      input: {
        id: -1,
        isCompleted: false,
        title: '',
        amount: 0,
        budgetDate: '',
        categoryId: 0,
        description: '',
      },
    };
  },

  mounted() {
    this.input.id = this.item.id;
    this.input.isCompleted = this.item.isCompleted;
    this.input.title = this.item.title;
    this.input.amount = this.item.amount;
    this.input.budgetDate = this.item.budgetDate;
    this.input.categoryId = this.item.categoryId;
    this.input.description = this.item.description;
  },

  methods: {
    update() {
      const budget = {
        id: this.input.id,
        budgetDate: this.input.budgetDate,
        title: this.input.title,
        amount: this.input.amount,
        categoryId: this.input.categoryId,
        description: this.input.description,
        isCompleted: this.input.isCompleted,
      };
      this.updateBudget(budget);
      this.$emit('closeForm');
    },

    remove() {
      this.deleteBudget(this.input.id);
      this.$emit('closeForm');
    },

    duplicate() {
      const budget = {
        title: this.input.title,
        amount: this.input.amount,
        categoryId: this.input.categoryId,
        description: this.input.description,
      };
      this.$emit('duplicateClick', budget);
    },
  },
};
</script>
