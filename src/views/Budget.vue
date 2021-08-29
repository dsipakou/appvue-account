<template>
  <div>
    <div class="q-pa-md">
      <div class="row q-mt-lg justify-center">
        <div class="col-8 q-px-md">
          <div class="row justify-between"> <h5>Monthly Budget</h5>
            <q-btn round color="primary" label="+" @click="createForm = true"></q-btn>
          </div>
          <div class="row">
            <q-card
              v-for="budget in budgetCurrentMonth"
              :key="budget.id"
              flat
              class="q-ma-sm monthly-card"
              @click="budgetItemClick(budget)"
              >
              <q-card-section>
                {{ budget.title }}
              </q-card-section>
              <q-card-section>
                {{ budget.amount }}
              </q-card-section>
            </q-card>
          </div>
        </div>
        <WeekBudget class="col-4 q-px-md" />
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
            v-model="input.budgetDate"
            />
        </q-card-section>
        <q-card-section>
          <q-input outlined stack-label label="Name" v-model="input.title" />
        </q-card-section>
        <q-card-section>
          <q-input outlined stack-label label="Amount" v-model.number="input.amount" />
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
    <q-dialog v-model="editForm">
      <input type="hidden" v-model="input.id" />
      <q-card style="width: 400px;">
        <q-card-section>
          <h4>Update your plans</h4>
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
        <q-card-section>
          <q-input outlined stack-label label="Name" v-model="input.title" />
        </q-card-section>
        <q-card-section>
          <q-input outlined stack-label label="Amount" v-model.number="input.amount" />
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
          <q-btn color="primary" rounded style="width: 100px;" @click="remove()">Delete</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { ref } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import WeekBudget from './budget/WeekBudget.vue';

export default {
  name: 'Budget',

  components: {
    WeekBudget,
  },

  setup() {
    return {
      createForm: ref(false),
      editForm: ref(false),
    };
  },

  data() {
    return {
      itemsState: {},
      input: {
        budgetDate: '',
        amount: 0,
        title: '',
        description: '',
      },
    };
  },

  computed: {
    ...mapGetters([
      'budgetList',
    ]),

    budgetCurrentMonth() {
      return this.budgetList.filter((item) => (
        moment(item.budgetDate).month() === moment().month()
      ));
    },
  },

  methods: {
    ...mapActions([
      'createBudget',
      'updateBudget',
      'deleteBudget',
    ]),

    budgetItemClick(item) {
      this.input.id = item.id;
      this.input.budgetDate = item.budgetDate.substr(0, 10);
      this.input.title = item.title;
      this.input.amount = item.amount;
      this.input.description = item.description;
      this.editForm = true;
    },

    save() {
      const budget = {
        id: this.input.id,
        budgetDate: this.input.budgetDate,
        title: this.input.title,
        amount: this.input.amount,
        description: this.input.description,
      };
      this.createBudget(budget);
      this.createForm = false;
    },

    update() {
      const budget = {
        id: this.input.id,
        budgetDate: this.input.budgetDate,
        title: this.input.title,
        amount: this.input.amount,
        description: this.input.description,
      };
      this.updateBudget(budget);
      this.editForm = false;
    },

    remove() {
      this.deleteBudget(this.input.id);
      this.editForm = false;
    },
  },
};
</script>
<style scoped>
.monthly-card {
  width: 190px;
  height: 100px;
  font-size: 1.2em;
  display: flex;
  justify-content: center;
}
</style>
