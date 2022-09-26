<template>
  <div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab
        color="primary"
        position="bottom-right"
        icon="add"
        @click="createForm = true"
      />
    </q-page-sticky>
    <q-page-sticky position="bottom-right" :offset="[18, 88]">
      <q-btn fab
        color="primary"
        icon="call_split"
        @click="duplicateForm = true"
      />
    </q-page-sticky>
    <div class="row col-12 relative-position">
      <div class="row col-12 justify-center vertical-middle">
        <div class="row col-4 justify-center items-center">
          <BudgetSummaryCard
            :planned="budgetType === 'monthly' ? plannedMonth : plannedWeekly"
            :spent="budgetType === 'monthly' ? spentMonth : spentWeekly"
          >
            <template v-slot:header>
              {{ budgetType.charAt(0).toUpperCase() + budgetType.slice(1) }} summary
            </template>
          </BudgetSummaryCard>
        </div>
        <div class="row col-3 budget-toggle">
          <q-tabs no-caps dense
            v-model="budgetType"
            indicator-color="transparent"
            active-class="budget-toggle-selected">
            <q-tab name="monthly" label="Monthly" />
            <q-tab name="weekly" label="Weekly" />
          </q-tabs>
        </div>
        <div class="row col-2 items-center q-px-lg">
          <q-select map-options emit-value
            option-value="uuid"
            option-label="username"
            label="User"
            :options="userOptions"
            v-model="selectedUser"
            />
        </div>
        <div class="row col-3 justify-end items-center">
          <q-select map-options
            v-model="selectedMonth"
            label="Period"
            :options="budgetType === 'monthly' ? selectMonthOptions : selectWeekOptions"
            class="periodDropdown"
          />
        </div>
      </div>
      <MonthlyBudget
        v-show="budgetType === 'monthly'"
        :activeUser="activeUser"
        :defaultCurrency="defaultCurrency"
        :userList="userList"
        :budgetUsage="budgetUsage"
        :budgetArchive="budgetArchive"
        :categoryItems="categoryList"
        :createBudget="createBudget"
        :updateBudget="updateBudget"
        :deleteBudget="deleteBudget"
        :selectedMonth="selectedMonth"
        :updateStatusBudget="updateStatusBudget"
        :fetchBudgetArchive="fetchBudgetArchive"
        @budgetItemClick="budgetItemClick($event)"
        />
      <WeekBudget
        :activeUser="activeUser"
        :weeklyUsage="weeklyUsage"
        :categoryItems="categoryList"
        :selectedDay="selectedMonth"
        :updateStatusBudget="updateStatusBudget"
        @budgetItemClick="budgetItemClick($event)"
        v-show="budgetType === 'weekly'"
      />
    </div>
    <q-dialog v-model="createForm">
      <AddForm
        :users="userList"
        :activeUser="activeUser"
        :categories="categories"
        :currencyList="currencyList"
        :createBudget="createBudget"
        :budget="budgetCopy"
        @closeForm="addFormClosed"
        />
    </q-dialog>
    <q-dialog v-model="editForm">
      <EditForm
        :users="userList"
        :categories="categories"
        :currencyList="currencyList"
        :item="selectedBudget"
        :updateBudget="updateBudget"
        :deleteBudget="deleteBudget"
        @duplicateClick="makeDuplicate($event)"
        @closeForm="editForm = false"
      />
    </q-dialog>
    <q-dialog
      v-model="duplicateForm"
      @hide="clearDuplicatedItems">
      <DuplicateForm
        :getDuplicateCandidates="getDuplicateBudgetCandidates"
        :duplicatedItems="budgetDuplicatedItems"
        :duplicateBudget="duplicateBudget"
        :isLoading="isBudgetListLoading"/>
    </q-dialog>
  </div>
</template>
<script>
import { computed, ref } from 'vue';
import { mapActions, mapGetters, useStore } from 'vuex';
import {
  endOfMonth,
  endOfWeek,
  startOfWeek,
  startOfMonth,
  isSameMonth,
  isSameWeek,
  format,
  subMonths,
  subWeeks,
} from 'date-fns';
import {
  DATE_FORMAT,
} from '@/utils/dateTimeUtils';
import WeekBudget from '@/views/budget/WeekBudget.vue';
import MonthlyBudget from '@/views/budget/MonthlyBudget.vue';
import AddForm from '@/views/budget/forms/AddForm.vue';
import EditForm from '@/views/budget/forms/EditForm.vue';
import DuplicateForm from '@/views/budget/forms/DuplicateForm.vue';
import BudgetSummaryCard from '@/views/budget/components/BudgetSummaryCard.vue';

export default {
  name: 'Budget',

  components: {
    WeekBudget,
    MonthlyBudget,
    AddForm,
    EditForm,
    DuplicateForm,
    BudgetSummaryCard,
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
      get: () => startOfWeek($store.state.budget.selectedMonth, { weekStartsOn: 1 }),
      set: (val) => {
        $store.commit('setBudgetMonth', val.value);
      },
    });
    return {
      createForm: ref(false),
      editForm: ref(false),
      duplicateForm: ref(false),
      selectedUser: ref(''),
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
      'budgetUsage',
      'weeklyUsage',
      'budgetedTransactions',
      'categoryList',
      'currencyList',
      'userList',
      'budgetSelectedMonth',
      'selectedMonth',
      'budgetArchive',
      'budgetDuplicatedItems',
      'isBudgetListLoading',
      'activeUser',
      'defaultCurrency',
    ]),

    categories() {
      return this.categoryList.filter((item) => !item.parent && item.type !== 'INC');
    },

    selectMonthOptions() {
      const options = [];
      for (let i = -1; i < 12; i += 1) {
        const month = startOfWeek(subMonths(new Date(), i), { weekStartsOn: 1 });
        let label = format(month, 'MMMM yyyy');
        if (i === 0) label += ' (current)';
        options.push({
          label,
          value: month,
        });
      }

      return options;
    },

    selectWeekOptions() {
      const options = [];
      for (let i = -1; i < 20; i += 1) {
        const day = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });
        const from = startOfWeek(day, { weekStartsOn: 1 });
        const to = endOfWeek(day, { weekStartsOn: 1 });
        const label = i === 0
          ? 'Current week'
          : `${format(from, 'dd-MMM-yyyy')} - ${format(to, 'dd-MMM-yyyy')}`;
        options.push({
          label,
          value: day,
        });
      }

      return options;
    },

    userOptions() {
      return [{ uuid: '', username: 'All' }, ...this.userList];
    },

    plannedMonth() {
      return this.budgetUsage.reduce((acc, item) => acc + item.planned, 0) || 0;
    },

    spentMonth() {
      if (this.defaultCurrency !== '') {
        return this.budgetUsage.reduce(
          (acc, item) => acc + item.spentInCurrencies[this.defaultCurrency], 0,
        );
      }
      return this.budgetUsage.reduce(
        (acc, item) => acc + item.spentInBaseCurrency, 0,
      ) || 0;
    },

    plannedWeekly() {
      return this.weeklyUsage.reduce((acc, item) => acc + item.planned, 0);
    },

    spentWeekly() {
      return this.weeklyUsage.reduce((acc, item) => acc + item.spentInBaseCurrency, 0);
    },

    actualSum() {
      let func = isSameWeek;
      let options = { weekStartsOn: 1 };
      if (this.budgetType === 'monthly') {
        func = isSameMonth;
        options = {};
      }
      return this.budgetUsage.reduce((acc, item) => {
        if (func(new Date(this.selectedMonth), new Date(item.budgetDate), options)) {
          const currentUsage = item.spentInBaseCurrency || 0;
          return acc + currentUsage;
        }
        return acc;
      }, 0);
    },
  },

  methods: {
    ...mapActions([
      'fetchMonthlyUsage',
      'fetchWeeklyUsage',
      'fetchBudgetedTransactions',
      'fetchBudgetArchive',
      'fetchCurrencies',
      'createBudget',
      'updateBudget',
      'updateStatusBudget',
      'deleteBudget',
      'duplicateBudget',
      'clearDuplicatedItems',
      'getDuplicateBudgetCandidates',
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
      const startWeek = startOfWeek(new Date(this.selectedMonth), { weekStartsOn: 1 });
      let monthPayload = {
        dateFrom: format(startMonth, DATE_FORMAT),
        dateTo: format(endMonth, DATE_FORMAT),
      };
      if (this.selectedUser) {
        monthPayload = {
          ...monthPayload,
          user: this.selectedUser,
        };
      }
      this.fetchMonthlyUsage(monthPayload);
      let weekPayload = {
        dateFrom: format(startWeek, DATE_FORMAT),
        dateTo: format(endWeek, DATE_FORMAT),
      };
      if (this.selectedUser) {
        weekPayload = {
          ...weekPayload,
          user: this.selectedUser,
        };
      }
      this.fetchWeeklyUsage(weekPayload);
    },

    addFormClosed() {
      this.fetchAllBudget();
    },
  },

  beforeMount() {
    this.fetchAllBudget();
    this.fetchCurrencies();
  },

  watch: {
    selectedMonth() {
      this.fetchAllBudget();
    },
    selectedUser() {
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

.budget-toggle {
  max-width: 310px;
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

.periodDropdown {
  max-width: 300px;
}

:deep(.q-tab__label) {
  font-size: 22px !important;
  line-height: 1.2em !important;
}
</style>
