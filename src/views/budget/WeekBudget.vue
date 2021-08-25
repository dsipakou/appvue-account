<template>
  <div>
    <div class="row justify-between">
      <div>
        <h5>This week</h5>
      </div>
      <div class="align-center">
        <span>{{ spentSum }}</span>
        <span class="q-mx-sm">/</span>
        <span class="text-weight-bold">{{ plannedSum }}</span>
      </div>
    </div>
    <div>
      <q-linear-progress
        stripe
        rounded
        size="25px"
        :value="progressBarValue"
        color="primary"
        class="q-mt-sm" >
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
        <q-card
          flat
          bordered
          class="q-mt-lg">
          <q-card-section>
            <q-card
              v-for="item in currentWeek"
              :key="item.id"
              class="q-my-md"
              :class="item.isCompleted ? 'completed' : ''"
              @mouseover="setItemOver(item.id, true)"
              @mouseleave="setItemOver(item.id, false)"
              flat
              bordered>
              <q-card-section horizontal class="justify-between">
                <div
                  class="absolute-left justify-between"
                  style="z-index: 1;"
                  v-if="itemsState[item.id]">
                  <q-btn
                    flat
                    outlined
                    no-caps
                    size="sm"
                    @click="completeItem(item)"
                    :label="item.isCompleted ? 'Incomplete' : 'Complete'"
                    dense />
                  <q-btn
                    flat
                    outlined
                    no-caps
                    size="sm"
                    dense
                    label="Delete"
                    @click="deleteItem(item.id)" />
                  <q-btn
                    flat
                    outlined
                    no-caps
                    size="sm"
                    dense
                    label="Edit" />
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
                <q-linear-progress
                  rounded
                  size="5px"
                  :value="spentOnItem(item) / item.amount"
                  :color="spentOnItem(item) / item.amount > 1 ? 'red' : 'secondary'" />
              </div>
            </q-card>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: 'WeekBudget',

  data() {
    return {
      itemsState: {},
    };
  },

  computed: {
    ...mapGetters([
      'budgetList',
      'transactionList',
    ]),

    currentWeek() {
      const thisWeek = this.budgetList.filter((item) => (
        moment(item.budgetDate).week() === moment().week()
      ));
      return [
        ...thisWeek.filter((item) => !item.isCompleted),
        ...thisWeek.filter((item) => item.isCompleted),
      ];
    },

    transactionsCurrentWeek() {
      const resultList = this.transactionList.filter((item) => (
        item.budgetId !== null
        && moment(item.transactionDate).week() === moment().week()
      ));
      return resultList;
    },

    plannedSum() {
      return this.currentWeek.reduce((acc, item) => (
        acc + item.amount
      ), 0);
    },

    spentSum() {
      return this.transactionsCurrentWeek.reduce((acc, item) => (
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
    ...mapActions([
      'updateStatusBudget',
      'deleteBudget',
    ]),

    spentOnItem(budgetItem) {
      return this.transactionsCurrentWeek.filter((item) => (
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
  },
};
</script>
<style scoped>
.completed {
  background-color: lightgrey;
  color: darkgray;
}
</style>
