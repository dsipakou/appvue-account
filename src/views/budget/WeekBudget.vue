<template>
  <div class="row justify-between">
    <div>
      <h5>This week</h5>
    </div>
    <div class="align-center justify-right">
      <div>
        <span class="q-mr-sm">Planned</span>
        <span>{{ spentSum }}</span>
        <span class="q-mx-sm">/</span>
        <span class="text-weight-bold">{{ plannedSum }}</span>
      </div>
      <div class="row justify-between">
        <span>Unplanned</span>
        <span class="q-ml-sm">{{ unplannedSum }}</span>
      </div>
      <q-separator />
        <div class="row justify-between">
          <span>Overall</span>
          <span class="q-ml-sm text-weight-bold">{{ overallSum }}</span>
        </div>
    </div>
  </div>
  <div>
    <q-linear-progress stripe rounded size="25px" color="primary"
      class="q-mt-sm"
      :value="progressBarValue">
      <div class="absolute-center flex flex-center">
        <q-badge
          color="white"
          text-color="primary"
          :label="budgetPercentRemains" />
      </div>
    </q-linear-progress>
  </div>
  <div class="row">
    <div class="col">
      <q-card flat bordered class="q-mt-lg">
        <q-card-section>
          <q-card flat bordered
            v-for="item in currentWeek"
            :key="item.id"
            class="q-my-md"
            :class="item.isCompleted ? 'completed' : ''"
            @mouseover="setItemOver(item.id, true)"
            @mouseleave="setItemOver(item.id, false)">
            <q-card-section horizontal class="justify-between">
              <div
                class="absolute-left justify-between"
                style="z-index: 1;"
                v-if="itemsState[item.id]">
                <q-btn flat outlined no-caps size="sm" dense
                  :label="item.isCompleted ? 'Incomplete' : 'Complete'"
                  @click="completeItem(item)" />
                <q-btn flat outlined no-caps size="sm" dense
                  label="Delete"
                  @click="deleteItem(item.id)" />
                <q-btn flat outlined no-caps size="sm" dense
                  label="Edit"
                  @click="editItemClick(item)" />
              </div>
              <q-card-section>
                {{ item.title }}
              </q-card-section>
              <q-card-section>
                <span class="text-caption">
                  {{ spentOnItem(item) }}
                </span>
                <span class="q-mx-xs">/</span>
                <span class="text-weight-bold">
                  {{ item.amount }}
                </span>
              </q-card-section>
            </q-card-section>
            <div class="q-mb-xs q-px-xs">
              <q-linear-progress rounded size="5px"
                :value="spentOnItem(item) / item.amount"
                :color="spentOnItem(item) / item.amount > 1 ? 'red' : 'secondary'" />
            </div>
          </q-card>
        </q-card-section>
      </q-card>
    </div>
  </div>
  <q-dialog v-model="editForm">
    <EditForm
      :categories="categories"
      :item="selectedBudget"
      :updateBudget="updateBudget"
      :deleteBudget="deleteBudget" />
  </q-dialog>
</template>

<script>
import { ref } from 'vue';
import moment from 'moment';
import EditForm from './forms/EditForm.vue';

export default {
  name: 'WeekBudget',

  inheritAttrs: false,

  components: {
    EditForm,
  },

  data() {
    return {
      itemsState: {},
      selectedBudget: {},
    };
  },

  setup() {
    return {
      editForm: ref(false),
    };
  },

  props: {
    budgetItems: { type: Array, required: true },
    categoryItems: { type: Array, required: true },
    transactionItems: { type: Array, required: true },
    updateBudget: { type: Function, required: true },
    deleteBudget: { type: Function, required: true },
    updateStatusBudget: { type: Function, required: true },
  },

  computed: {
    categories() {
      return this.categoryItems.filter((item) => item.isParent);
    },

    currentWeek() {
      const thisWeek = this.budgetItems.filter((item) => (
        moment(item.budgetDate).week() === moment().week()
      ));
      return [
        ...thisWeek.filter((item) => !item.isCompleted),
        ...thisWeek.filter((item) => item.isCompleted),
      ];
    },

    plannedTransactions() {
      return this.transactionItems.filter((item) => (
        item.budgetId !== null
      ));
    },

    unplannedTransactions() {
      return this.transactionItems.filter((item) => (
        item.budgetId === null
      ));
    },

    plannedSum() {
      return this.currentWeek.reduce((acc, item) => (
        acc + item.amount
      ), 0);
    },

    spentSum() {
      return this.plannedTransactions.reduce((acc, item) => (
        acc + item.amount
      ), 0).toFixed(2);
    },

    unplannedSum() {
      return this.unplannedTransactions.filter((item) => (
        item.type === 'outcome'
      )).reduce((acc, item) => (
        acc + item.amount
      ), 0).toFixed(2);
    },

    overallSum() {
      return this.transactionItems.filter((item) => (
        item.type === 'outcome'
      )).reduce((acc, item) => (
        acc + item.amount
      ), 0).toFixed(2);
    },

    progressBarValue() {
      return (this.spentSum / this.plannedSum);
    },

    budgetPercentRemains() {
      return `${(this.progressBarValue * 100).toFixed(2)}%`;
    },
  },

  methods: {
    spentOnItem(budgetItem) {
      return this.transactionItems.filter((item) => (
        item.budgetId === budgetItem.id
      )).reduce((acc, item) => (
        acc + item.amount
      ), 0).toFixed(2);
    },

    setItemOver(id, state) {
      this.itemsState[id] = state;
    },

    completeItem(item) {
      const budget = {
        ...item,
        isCompleted: !item.isCompleted,
      };
      this.updateStatusBudget(budget);
    },

    deleteItem(id) {
      this.deleteBudget(id);
    },

    editItemClick(item) {
      this.selectedBudget.id = item.id;
      this.selectedBudget.budgetDate = item.budgetDate.substr(0, 10);
      this.selectedBudget.title = item.title;
      this.selectedBudget.amount = item.amount;
      this.selectedBudget.categoryId = item.categoryId;
      this.selectedBudget.description = item.description;
      this.selectedBudget.isCompleted = item.isCompleted;
      this.editForm = true;
    },
  },
};
</script>
<style scoped>
.completed {
  background-color: lightgrey;
  color: darkgray;
}
</style>
