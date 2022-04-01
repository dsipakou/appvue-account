<template>
  <div>
    <q-btn rounded
      color="primary"
      class="btn-add fixed"
      icon="add"
      @click="createForm = true" />
    <div class="row col-12 relative-position">
      <div class="row col-12 justify-center vertical-middle">
        <div class="row"></div>
        <q-space />
        <div class="row budget-toggle">
          <q-tabs no-caps dense
            v-model="budgetType"
            indicator-color="transparent"
            active-class="budget-toggle-selected">
            <q-tab name="monthly" label="Monthly" />
            <q-tab name="weekly" label="Weekly" />
          </q-tabs>
        </div>
        <q-space />
        <div class="row float-right">
          <q-select map-options v-model="selectedMonth" :options="selectMonthOptions" />
        </div>
      </div>
      <MonthlyBudget
        v-show="budgetType === 'monthly'"
        :budgetUsage="budgetUsage"
        :budgetPlan="budgetPlan"
        :categoryItems="categoryList"
        :createBudget="createBudget"
        :updateBudget="updateBudget"
        :deleteBudget="deleteBudget"
        :selectedMonth="budgetSelectedMonth"
        :updateStatusBudget="updateStatusBudget"
        @budgetItemClick="budgetItemClick($event)"
        />
      <WeekBudget
        :budgetUsage="budgetUsage"
        :categoryItems="categoryList"
        v-show="budgetType === 'weekly'" />
    </div>
    <q-dialog v-model="createForm">
      <AddForm
        :categories="categories"
        :createBudget="createBudget"
        :budget="budgetCopy"
        @closeForm="addFormClosed"
        />
    </q-dialog>
    <q-dialog v-model="editForm">
      <EditForm
        :categories="categories"
        :item="selectedBudget"
        :updateBudget="updateBudget"
        :deleteBudget="deleteBudget"
        @duplicateClick="makeDuplicate($event)"
        @closeForm="editForm = false"
      />
    </q-dialog>
  </div>
</template>
<script>
import { computed, ref } from 'vue';
import { mapActions, mapGetters, useStore } from 'vuex';
import moment from 'moment';
import {
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfWeek,
  startOfMonth,
  format,
  min,
  max,
  subMonths,
} from 'date-fns';
import {
  DATE_FORMAT,
} from '@/utils/dateTimeUtils';
import WeekBudget from '@/views/budget/WeekBudget.vue';
import MonthlyBudget from '@/views/budget/MonthlyBudget.vue';
import AddForm from '@/views/budget/forms/AddForm.vue';
import EditForm from '@/views/budget/forms/EditForm.vue';

export default {
  name: 'Budget',

  components: {
    WeekBudget,
    MonthlyBudget,
    AddForm,
    EditForm,
  },

  setup() {
    const $store = useStore();
    const budgetType = computed({
      get: () => $store.state.budget.budgetToggle,
      set: (val) => {
        $store.commit('setBudgetToggle', val);
      },
    });
    const selectedMonth = computed({
      get: () => $store.state.budget.selectedMonth,
      set: (val) => {
        $store.commit('setBudgetMonth', val.value);
      },
    });
    return {
      createForm: ref(false),
      editForm: ref(false),
      budgetType,
      selectedMonth,
    };
  },

  data() {
    return {
      selectedBudget: {},
      budgetCopy: {},
    };
  },

  computed: {
    ...mapGetters([
      'budgetPlan',
      'budgetUsage',
      'budgetedTransactions',
      'categoryList',
      'budgetSelectedMonth',
      'selectedMonth',
    ]),

    categories() {
      return this.categoryList.filter((item) => item.isParent);
    },

    selectMonthOptions() {
      const options = [];
      for (let i = 0; i < 12; i += 1) {
        const month = startOfDay(subMonths(new Date(), i));
        options.push({
          label: format(month, 'yyyy / MMMM'),
          value: month,
        });
      }

      return options;
    },
  },

  methods: {
    ...mapActions([
      'fetchBudgetUsage',
      'fetchBudgetedTransactions',
      'fetchBudgetPlan',
      'createBudget',
      'updateBudget',
      'updateStatusBudget',
      'deleteBudget',
    ]),

    makeDuplicate(budget) {
      this.budgetCopy = budget;
      this.createForm = true;
    },

    budgetItemClick(item) {
      this.selectedBudget = item;
      this.editForm = true;
    },

    fetchAllBudget() {
      const startMonth = startOfMonth(new Date(this.selectedMonth));
      const endMonth = endOfMonth(new Date(this.selectedMonth));
      const endWeek = endOfWeek(new Date(this.selectedMonth), { weekStartsOn: 1 });
      const endCurrentWeek = endOfWeek(new Date(), { weekStartsOn: 1 });
      const startWeek = startOfWeek(new Date(this.selectedMonth), { weekStartsOn: 1 });
      const startCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
      const dateFrom = format(min([startMonth, startWeek, startCurrentWeek]), DATE_FORMAT);
      const dateTo = format(max([endMonth, endWeek, endCurrentWeek]), DATE_FORMAT);
      this.fetchBudgetUsage({ dateFrom, dateTo });
      this.fetchBudgetPlan({ dateFrom, dateTo });
      this.fetchBudgetedTransactions({
        sorting: 'added',
        dateFrom: moment().add(-moment().weekday(), 'days').format('YYYY-MM-DD'),
        dateTo: moment().add(6 - moment().weekday(), 'days').format('YYYY-MM-DD'),
      });
    },

    addFormClosed() {
      this.fetchAllBudget();
    },
  },

  beforeMount() {
    this.fetchAllBudget();
  },

  watch: {
    selectedMonth() {
      this.fetchAllBudget();
    },
  },
};
</script>
<style scoped>
.header {
  display: flex;
}

.header>h4 { margin-right: 20px;
}

.btn-add {
  width: 55px;
  height: 55px;
  right: 30px;
  bottom: 30px;
  z-index: 10;
}

.budget-toggle {
  max-width: 370px;
  margin: 30px 0;
  color: white;
  border-radius: 20px;
  background-color: #444444;
}

.budget-toggle-selected {
  border-radius: 20px;
  background-color: white;
  color: black;
  border: 4px solid #444444;
}

:deep(.q-tab__label) {
   font-size: 22px !important;
   line-height: 1.2em !important;
}
</style>
