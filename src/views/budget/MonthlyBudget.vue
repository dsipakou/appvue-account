<template>
  <div class="row justify-between">
    <h5>Monthly Budget</h5>
    <span class="text-subtitle2">Planned {{ monthSum }}</span>
    <q-btn round color="primary" label="+" @click="addBudgetClick()"></q-btn>
  </div>
  <div class="row"
    v-for="(chunk, rowIndex) in chunked(groupedByCategory)"
    :key="rowIndex">
    <div
      v-for="(category, colIndex) in chunk"
      class="col-4 align-center"
      :key="category.name">
      <MonthlyCard
        :category="category"
        :budgetUsage="budgetUsage"
        :selectedCategory="selectedCategory"
        :column="colIndex"
        :row="rowIndex"
        :groupedByCategory="groupedByCategory"
        @categoryClick="categoryClick($event)"
      />
      <div class="arrow text-blue-grey-4"
        v-show="category.name === selectedCategory.name && selectedCategory.index >= 0">
      </div>
    </div>
    <div class="row justify-center" style="width: 100%;">
      <template v-if="rowIndex === coords.row">
        <CategoryDetailsPanel
          :category="selectedCategory"
          :categoryItems="selectedCategoryItems"
          :updateStatus="updateStatusBudget"
          @budgetItemClick="editBudgetClick($event)" />
      </template>
    </div>
  </div>
  <q-dialog v-model="createForm">
    <AddForm
      :categories="categories"
      :createBudget="createBudget"
      :budget="budgetCopy"
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
</template>
<script>
import { ref } from 'vue';
import moment from 'moment';
import AddForm from './forms/AddForm.vue';
import EditForm from './forms/EditForm.vue';
import MonthlyCard from './components/MonthlyCard.vue';
import CategoryDetailsPanel from './components/CategoryDetailsPanel.vue';

const CHUNK_SIZE = 3;

export default {
  name: 'Monthly Budget',

  inheritAttrs: false,

  components: {
    AddForm,
    EditForm,
    MonthlyCard,
    CategoryDetailsPanel,
  },

  setup() {
    return {
      createForm: ref(false),
      editForm: ref(false),
    };
  },

  props: {
    budgetItems: { type: Array, required: true },
    categoryItems: { type: Array, required: true },
    createBudget: { type: Function, required: true },
    updateBudget: { type: Function, required: true },
    deleteBudget: { type: Function, required: true },
    budgetUsage: { type: Array, required: true },
    updateStatusBudget: { type: Function, required: true },
  },

  data() {
    return {
      coords: {
        row: -1,
        column: -1,
      },
      selectedCategory: {
        name: '',
        index: -1,
      },
      selectedBudget: {},
      budgetCopy: {},
    };
  },

  computed: {
    categories() {
      return this.categoryItems.filter((item) => item.isParent);
    },

    currentMonth() {
      return this.budgetItems.filter((item) => (
        moment(item.budgetDate).month() === moment().month()
      ));
    },

    monthSum() {
      return this.currentMonth.reduce((acc, item) => (
        acc + item.amount
      ), 0);
    },

    groupedByCategory() {
      const groupedMonth = this.currentMonth.reduce((acc, item) => {
        const arr = acc[item.title] || [];
        arr.push(item);
        acc[item.title] = arr;
        return acc;
      }, {});

      const categoryClass = {};
      Object.entries(groupedMonth).forEach((item) => {
        const { categoryId } = item[1][0];
        const categoryName = categoryId === null
          ? 'undefined'
          : this.categories.find((category) => category.id === categoryId).name;
        const arr = categoryClass[categoryName] || [];
        const sortedGroupedBudgets = item[1].sort((a, b) => {
          if (a.budgetDate < b.budgetDate) {
            return -1;
          }
          if (a.budgetDate > b.budgetDate) {
            return 1;
          }
          return 0;
        });
        arr.push({
          name: item[0],
          value: sortedGroupedBudgets,
          amount: item[1].reduce((acc, subItem) => acc + subItem.amount, 0),
        });
        categoryClass[categoryName] = arr;
      });

      const groupedList = [];
      Object.entries(categoryClass).forEach((item) => {
        const categoryItem = {
          name: item[0],
          value: item[1],
          amount: item[1].reduce((acc, subItem) => acc + subItem.amount, 0),
        };
        if (categoryItem.name === 'undefined') {
          groupedList.unshift(categoryItem);
        } else {
          groupedList.push(categoryItem);
        }
      });

      return groupedList.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    },

    selectedCategoryItems() {
      const category = this.groupedByCategory.find((item) => (
        item.name === this.selectedCategory.name
      ));
      const categoryWithModel = category.value.map((item) => (
        {
          ...item,
          size: item.value.length - 1,
        }
      ));
      return categoryWithModel;
    },
  },

  methods: {
    chunked(items) {
      const chunks = [];
      let i = 0;
      const n = items.length;

      while (i < n) {
        chunks.push(items.slice(i, i += CHUNK_SIZE));
      }

      return chunks;
    },

    addBudgetClick() {
      this.budgetCopy = {};
      this.createForm = true;
    },

    categoryClick(event) {
      const {
        categoryName,
        column,
        row,
      } = event;

      this.coords = {
        row,
        column,
      };
      const index = column + row * 3;

      if (this.selectedCategory.index === index) {
        this.selectedCategory = {
          name: '',
          index: -1,
        };
        this.coords = {
          row: -1,
          column: -1,
        };
      } else {
        this.selectedCategory = {
          name: categoryName,
          index,
        };
      }
    },

    editBudgetClick(budget) {
      this.selectedBudget = budget;
      this.editForm = true;
    },

    makeDuplicate(budget) {
      this.budgetCopy = budget;
      this.createForm = true;
    },
  },
};
</script>
<style scoped>
.arrow {
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 15px solid;
  margin: 0 70px;
  width: 50px;
}
</style>
