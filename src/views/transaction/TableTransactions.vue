<template>
  <div class="q-pa-md">
    {{ dataArr }}
    <q-table dense bordered flat
      title="Treats"
      :rows="dataArr"
      :columns="columns"
      row-key="name"
      binary-state-sort
      separator="cell"
      :pagination="initialPagination"
      v-model="transactions"
    >
      <template v-slot:top>
        <q-btn rounded unelevated color="primary" label="+" @click="dataArr.push({})" />
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="account" :props="props">
            <q-select outlined label-stacked map-options emit-value dense
              :options="accountList"
              option-value="uuid"
              option-label="title"
              style="width: 200px;"
              v-model="props.row.account" />
          </q-td>
          <q-td key="category" :props="props">
            <q-btn color="primary" dense label="Choose..." no-caps>
              <q-menu>
                <q-list dense style="min-width: 100px">
                  <q-item v-for="category in parentCategories" clickable
                    :key="category.uuid">
                    <q-item-section>{{category.name}}</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-menu anchor="top end" self="top start">
                      <q-list>
                        <q-item
                          v-for="subCategory in getChildrenOfCategory(category)"
                          :key="subCategory.uuid"
                          dense
                          clickable
                          @click="chooseCategory(subCategory.uuid)"
                          v-close-popup
                        >
                          {{ props.row.category }}
                          <q-item-section>{{ subCategory.name }}</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
          <q-td key="date" :props="props">
            <q-input outlined stack-label dense
              type="date"
              v-model="props.row.date"
            />
          </q-td>
          <q-td key="amount" :props="props">
            <q-input type="number" dense autofocus v-model="props.row.amount" />
          </q-td>
          <q-td key="budget" :props="props">
            <q-select outlined dense label-stacked map-options emit-value
              :options="budgetPlan"
              option-value="id"
              option-label="title"
              style="width: 300px;"
              v-model="props.row.budget" />
          </q-td>
          <q-td key="currency" :props="props">
            <CurrencyDropdown dense hide-label
              :currencyList="currencyList"
              :availableRates="availableRates"
              :selectedDate="props.row.date"
              :getAvailableRates="getAvailableRates"
              :currencyListLoaded="!isRatesListLoading"
              @selectCurrency="props.row.currency = $event.uuid" />
          </q-td>
          <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td>
          <q-td key="iron" :props="props">{{ props.row.iron }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import { BudgetPlan, Category } from '@/types';
import CurrencyDropdown from '@/components/dropdown/CurrencyDropdown.vue';

interface BudgetItem {
  id: number,
  title: string,
  disable?: boolean,
}

const columns = [
  {
    name: 'account',
    align: 'center',
    label: 'Account',
    field: 'account',
    sortable: true,
  },
  {
    name: 'category',
    required: true,
    label: 'Category',
    align: 'left',
    field: (row: any) => row.category,
    format: (val: any) => `${val}`,
    sortable: true,
  },
  {
    name: 'date',
    align: 'center',
    label: 'Date',
    field: 'date',
    sortable: true,
  },
  {
    name: 'amount',
    align: 'center',
    label: 'Amount',
    field: 'amount',
    sortable: true,
  },
  {
    name: 'budget',
    align: 'center',
    label: 'Budget',
    field: 'budget',
    sortable: true,
  },
  {
    name: 'currency',
    align: 'center',
    label: 'Currency',
    field: 'currency',
    sortable: true,
  },
];

export default defineComponent({
  name: 'Transactions table view',

  components: {
    CurrencyDropdown,
  },

  setup() {
    return {
      columns,
      rows: ref([]),
      initialPagination: {
        rowsPerPage: 100,
      },
    };
  },

  data() {
    return {
      dataArr: [] as PropType<Array<Object>>,
    };
  },

  props: {
    user: { type: String, required: true },
  },

  computed: {
    ...mapGetters([
      'accountList',
      'categoryList',
      'currencyList',
      'transactionList',
      'availableRates',
      'budgetPlan',
      'isRatesListLoading',
    ]),

    selectedWeekBudget(): Array<any> {
      const incompletedItems = this.budgetPlan.filter((budget: BudgetPlan) => (
        !budget.isCompleted && budget.user === this.user
      ));

      const completedItems = this.budgetPlan.filter((budget: BudgetPlan) => (
        budget.isCompleted && budget.user === this.user
      ));

      const separator = { id: 0, title: '-----', disable: true };

      const items: Array<any> = [];

      items.push(...incompletedItems);
      items.push(separator as BudgetItem);
      items.push(...completedItems);

      return items;
    },

    parentCategories(): Array<Category> {
      return this.categoryList.filter(
        (item: Category) => (
          item.parent === null && item.type === 'EXP'
        ),
      );
    },
  },

  methods: {
    ...mapActions([
      'fetchTransactions',
      'getAvailableRates',
    ]),

    getChildrenOfCategory(category: Category): Array<Category> {
      return this.categoryList.filter((item: Category) => item.parent === category.uuid);
    },

    chooseCategory(uuid: string) {
      console.log(uuid);
    },
  },

  beforeMount() {
    this.fetchTransactions();
  },
});
</script>

<style scoped>
.input-cell {
  width: 100%;
  border: none;
}
table.editable-table {
  margin: auto;
}

table.editable-table td {
  vertical-align: middle;
}

.editable-table .data-cell {
  padding: 8px;
  vertical-align: middle;
}

.editable-table .custom-checkbox {
  width: 50px;
}

.name-col {
  width: 120px;
}

.department-col {
  width: 150px;
}

.age-col {
  width: 100px;
}

.date-col {
  width: 200px;
}

.is-active-col {
  width: 100px
}
</style>
