<template>
  <div class="row justify-between">
    <h5>Monthly Budget</h5>
    <span class="text-subtitle2">Planned {{ monthSum }}</span>
    <q-btn round color="primary" label="+" @click="createForm = true"></q-btn>
  </div>
  <div
    class="row"
    v-for="(chunk, rowIndex) in chunked(groupedByCategory, 3)"
    :key="rowIndex">
    <div
      v-for="(category, colIndex) in chunk"
      class="col-4 align-center"
      :key="category.name">
      <q-card
        class="q-ma-sm monthly-card"
        @mouseover="hover = colIndex + rowIndex * 3"
        @mouseleave="hover = -1"
        :class="category.name === selectedCategoryName && selectedCategoryIndex >= 0
          ? 'bg-blue-grey-4 text-white' : ''"
        :flat="hover !== colIndex + rowIndex * 3"
        @click="categoryClick(category.name, colIndex, rowIndex)">
        <q-card-section>
          <span class="text-h6 overflow-hidden">
            {{ category.name }}
          </span>
        </q-card-section>
        <q-card-section>
          <div class="text-h4">
            {{ category.amount }}
          </div>
          <q-circular-progress
            show-value
            class="text-black q-ma-md"
            :value="getUsage(category).usagePercent"
            size="100px"
            :color="getUsage(category).usagePercent >= 100 ? 'red-5' : 'light-blue'"
            track-color="grey-2"
            thickness="0.1"
          >
          <span class="text-subtitle1">{{ getUsage(category).usageAmount }}</span>
          </q-circular-progress>
            <div>
            </div>
        </q-card-section>
      </q-card>
      <div
        class="arrow text-blue-grey-4"
        v-show="category.name === selectedCategoryName && selectedCategoryIndex >= 0">
      </div>
    </div>
    <div class="row justify-center" style="width: 100%;">
      <div class="row bg-blue-grey-4 justify-center sub-categories" v-show="rowIndex === row">
        <q-card
          v-for="budget in selectedCategoryItems"
          :key="budget.value[0].id"
          :class="budget.value.every((item) => item.isCompleted) ? 'bg-blue-grey-3': ''"
          flat
          bordered
          class="q-ma-lg monthly-card--sub">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold overflow-hidden">
              {{ budget.value[0].title }}
            </div>
            <div class="text-h6">
              {{ budget.value[0].amount }}
            </div>
          </q-card-section>
          <q-card-actions style="max-height: 40px;" align="around">
            <div v-if="budget.value.length > 1">
              <q-btn
                color="primary"
                rounded
                dense
                flat
                v-for="(item, index) in budget.value"
                :key="item.id"
                @click="budgetItemClick(item)"
                :label="index + 1" />
            </div>
            <div v-else>
              <q-btn
                color="primary"
                rounded
                dense
                no-caps
                flat
                @click="budgetItemClick(budget.value[0])"
                label="Edit" />
              <q-btn
                :color="budget.value.every((item) => item.isCompleted) ? 'negative': 'secondary'"
                rounded
                dense
                no-caps
                flat
                :label="budget.value.every((item) => item.isCompleted) ? 'Incomplete' : 'Complete'"
                @click=completeItems(budget.value) />
            </div>
            <div
              v-if="budget.value.every((item) => item.isCompleted)"
              class="absolute-right q-pt-sm q-pr-sm">
              <q-icon
                name="fas fa-check"
                color="green" />
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
  <q-dialog v-model="createForm">
    <AddForm :categories="categories" :createBudget="createBudget" />
  </q-dialog>
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
import AddForm from './forms/AddForm.vue';
import EditForm from './forms/EditForm.vue';

export default {
  name: 'Monthly Budget',

  inheritAttrs: false,

  components: {
    AddForm,
    EditForm,
  },

  setup() {
    return {
      createForm: ref(false),
      editForm: ref(false),
    };
  },

  props: {
    budgetItems: {
      type: Array,
      required: true,
    },

    categoryItems: {
      type: Array,
      required: true,
    },

    createBudget: {
      type: Function,
      required: true,
    },

    updateBudget: {
      type: Function,
      required: true,
    },

    deleteBudget: {
      type: Function,
      required: true,
    },

    budgetUsage: {
      type: Array,
      required: true,
    },

    updateStatusBudget: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      hover: -1,
      row: -1,
      column: -1,
      clicked: -1,
      selectedCategoryName: '',
      selectedBudget: {},
      selectedCategoryIndex: -1,
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
        arr.push({
          name: item[0],
          value: item[1],
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

      return groupedList;
    },

    selectedCategoryItems() {
      const filteredCategories = this.groupedByCategory.find((item) => (
        item.name === this.selectedCategoryName
      ));
      return filteredCategories?.value;
    },
  },

  methods: {
    chunked(items, len) {
      const chunks = [];
      let i = 0;
      const n = items.length;

      while (i < n) {
        chunks.push(items.slice(i, i += len));
      }

      return chunks;
    },

    getUsage(category) {
      if (this.budgetUsage.length > 0) {
        const usageAmount = this.budgetUsage.find((item) => (
          item.name === category.name
        )).amount.toFixed(2);
        const usagePercent = Math.floor((usageAmount * 100) / category.amount);
        return {
          usageAmount,
          usagePercent,
        };
      }
      return { usageAmount: 0, usagePercent: 0 };
    },

    categoryClick(categoryName, column, row) {
      this.selectedCategoryName = categoryName;
      this.row = row;
      this.column = column;

      const index = column + row * 3;

      if (this.selectedCategoryIndex === index) {
        this.selectedCategoryIndex = -1;
        this.selectedCategoryId = -1;
        this.row = -1;
        this.column = -1;
      } else {
        this.selectedCategoryIndex = index;
      }
    },

    budgetItemClick(item) {
      this.selectedBudget.id = item.id;
      this.selectedBudget.budgetDate = item.budgetDate.substr(0, 10);
      this.selectedBudget.title = item.title;
      this.selectedBudget.amount = item.amount;
      this.selectedBudget.categoryId = item.categoryId;
      this.selectedBudget.description = item.description;
      this.selectedBudget.isCompleted = item.isCompleted;
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
  },
};
</script>
<style scoped>
.monthly-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 200px;
  height: 250px;
  cursor: pointer;
  -webkit-user-select: none;
}

.monthly-card--sub {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 180px;
  height: 160px;
}

.arrow {
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 15px solid;
  margin: 0 70px;
  width: 50px;
}

.sub-categories {
  width: 100%;
  border-radius: 10px;
}
</style>
