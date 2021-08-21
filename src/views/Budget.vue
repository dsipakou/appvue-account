<template>
  <div>
    <div class="q-pa-md">
      <div class="row q-mt-lg justify-center">
        <div class="col-8 q-px-md">
          <div class="row justify-between">
            <h5>Monthly Budget</h5>
            <q-btn round color="primary" label="+" @click="createForm = true"></q-btn>
          </div>
        </div>
        <div class="col-4 q-px-md">
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
              <q-card flat bordered class="q-mt-lg">
                <q-card-section>
                  <q-card
                    v-for="item in budgetCurrentWeek"
                    :key="item.id"
                    class="q-my-md"
                    flat
                    bordered>
                    <q-card-section horizontal class="justify-between">
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
                        color="secondary" />
                    </div>
                  </q-card>
                </q-card-section>
              </q-card>
            </div>
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
          <q-input outlined stack-label label="Name" v-model="input.title" />
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
          <q-btn color="primary" rounded style="width: 100px;" @click="save()">Save</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { ref } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';

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

  computed: {
    ...mapGetters([
      'budgetList',
      'transactionList',
    ]),

    budgetCurrentWeek() {
      return this.budgetList.filter((item) => (
        moment(item.budgetDate).week() === moment().week()
      ));
    },

    plannedSum() {
      return this.budgetCurrentWeek.reduce((acc, item) => (
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

    transactionsCurrentWeek() {
      const resultList = this.transactionList.filter((item) => (
        item.budgetId !== null
        && moment(item.transactionDate).week() === moment().week()
      ));
      return resultList;
    },
  },

  methods: {
    ...mapActions([
      'createBudget',
    ]),

    spentOnItem(budgetItem) {
      return this.transactionsCurrentWeek.filter((item) => (
        item.budgetId === budgetItem.id
      )).reduce((acc, item) => (
        acc + item.amount
      ), 0).toFixed(2);
    },

    save() {
      const budget = {
        budgetDate: this.input.date,
        title: this.input.title,
        amount: this.input.amount,
        description: this.input.description,
      };
      this.createBudget(budget);
      this.createForm = false;
    },
  },
};
</script>
