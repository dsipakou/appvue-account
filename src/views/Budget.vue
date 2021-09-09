<template>
  <div>
    <div class="q-pa-md">
      <div class="row q-mt-lg justify-center">
        <div class="col-8 q-px-md">
          <div class="row justify-between">
            <h5>Monthly Budget</h5>
            <span class="text-subtitle2">Planned {{ monthSum }}</span>
            <q-btn round color="primary" label="+" @click="createForm = true"></q-btn>
          </div>
          <div class="row">
            <q-card
              v-for="budget in budgetCurrentMonth"
              :key="budget[0].id"
              flat
              class="q-ma-sm monthly-card"
              >
              <q-card-section>
                <div class="text-h6 overflow-hidden">
                  {{ budget[0].title }}
                </div>
                <div class="text-subtitle2">
                  {{ budget[0].amount }}
                </div>
              </q-card-section>
              <q-card-actions class="align-bottom" align="around">
                <div v-if="budget.length > 1">
                  <q-btn
                    color="primary"
                    rounded
                    dense
                    flat
                    v-for="(item, index) in budget"
                    :key="item.id"
                    @click="budgetItemClick(item)"
                    :label="index + 1" />
                </div>
                <div v-else>
                  <q-btn
                    color="primary"
                    rounded
                    dense
                    flat
                    @click="budgetItemClick(budget[0])"
                    label="Edit" />
                </div>
                <div
                  v-if="budget.every((item) => item.isCompleted)"
                  class="absolute-right q-pt-sm q-pr-sm">
                  <q-btn
                    flat
                    dense
                    icon="fas fa-check"
                    color="green"
                    @click="completeItems(budget)" />
                </div>
                <div
                  class="absolute-right q-pt-sm q-pr-sm"
                  v-else>
                  <q-btn no-caps flat dense label="Done" @click="completeItems(budget)" />
                </div>
              </q-card-actions>
            </q-card>
          </div>
        </div>
        <WeekBudget class="col-4 q-px-md" />
      </div>
      <div>
        <q-date
          v-model="dateModel"
          ref="budgetCal"
          @update:model-value="dateSelected"
          />
      </div>
    </div>
    <q-dialog v-model="createForm">
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
            <q-input
              outlined
              type="date"
              stack-label
              label="Date"
              v-model="input.budgetDate"
              />
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
              style="width: 200px;"
              v-model="input.category" />
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
    </q-dialog>
    <q-dialog v-model="editForm">
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
            v-model="input.category" />
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
      dateModel: ref(''),
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
      'categoryList',
    ]),

    currentMonth() {
      return this.budgetList.filter((item) => (
        moment(item.budgetDate).month() === moment().month()
      ));
    },

    categories() {
      return this.categoryList.filter((item) => item.isParent);
    },

    monthSum() {
      return this.currentMonth.reduce((acc, item) => (
        acc + item.amount
      ), 0);
    },

    budgetCurrentMonth() {
      const groupedMonth = this.currentMonth.reduce((acc, item) => {
        const arr = acc[item.title] || [];
        arr.push(item);
        acc[item.title] = arr;
        return acc;
      }, {});

      return groupedMonth;
    },
  },

  methods: {
    ...mapActions([
      'createBudget',
      'updateBudget',
      'updateStatusBudget',
      'deleteBudget',
    ]),

    dateSelected(value) {
      // console.log(`${year}-${month}-${day}`);
      // const finalDate = moment(`${year}-${month}-${day}`, 'YYYY-M-D').format('YYYY-MM-DD');
      // console.log(finalDate);

      const selectedDate = moment(value, 'YYYY-MM-DD');
      const fromDate = selectedDate.add(-selectedDate.day(), 'days').format('YYYY/MM/DD');
      const toDate = selectedDate.add(6 - selectedDate.day(), 'days').format('YYYY/MM/DD');
      this.dateModel = {
        from: fromDate,
        to: toDate,
      };
    },

    budgetItemClick(item) {
      this.input.id = item.id;
      this.input.budgetDate = item.budgetDate.substr(0, 10);
      this.input.title = item.title;
      this.input.amount = item.amount;
      this.input.categoryId = item.categoryId;
      this.input.description = item.description;
      this.input.isCompleted = item.isCompleted;
      this.editForm = true;
    },

    completeItems(items) {
      items.forEach((item) => {
        const completedItem = {
          ...item,
          isCompleted: !item.isCompleted,
        };
        this.updateStatusBudget(completedItem);
      });
    },

    save() {
      const budget = {
        id: this.input.id,
        budgetDate: this.input.budgetDate,
        title: this.input.title,
        amount: this.input.amount,
        categoryId: this.input.category,
        description: this.input.description,
      };

      console.log(this.input);
      this.createBudget(budget);
      this.createForm = false;
    },

    update() {
      const budget = {
        id: this.input.id,
        budgetDate: this.input.budgetDate,
        title: this.input.title,
        amount: this.input.amount,
        categoryId: this.input.category,
        description: this.input.description,
        isCompleted: this.input.isCompleted,
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
  height: 150px;
  font-size: 1.2em;
  justify-content: center;
}
</style>
