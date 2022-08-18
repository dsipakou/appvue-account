<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="header">
        <span>Your categories</span>
        <div>
          <q-btn rounded unelevated
            color="primary"
            icon="add"
            @click="add()">
            Add category
          </q-btn>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="row col-4">
        <q-expansion-item
          expand-separator
          icon="login"
          label="Income"
          caption="What was earned"
        >
          <q-tree
            :nodes="incomeTreeItems"
            label-key="name"
            node-key="uuid"
            v-model:selected="selectedCategoryUuid"
          />
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="logout"
          label="Expenses"
          caption="What was bought"
        >
          <q-tree
            :nodes="expenseTreeItems"
            label-key="name"
            node-key="uuid"
            v-model:selected="selectedCategoryUuid"
          />
        </q-expansion-item>
      </div>
      <div class="row col-8 q-mt-lg" style="align-items: start;">
        <div v-show="selectedCategoryUuid" class="row">
          <div v-if="!editMode" style="cursor: pointer;">
            <div v-show="currentCategory.parent"
              style="margin: 0 0 10px 40px;">
              <span
                class="q-px-md text-h4 shadow-1 text-bold"
                style="height: max-content;"
                @click="editMode=true"
              >
                {{ currentCategory.parent ? getCategory(currentCategory.parent).name : '' }}
              </span>
            </div>
            <div>
              <span
                class="q-px-md shadow-1 text-h5"
                style="height: max-content;"
                @click="editMode=true"
              >
                  {{ currentCategory.name }}
              </span>
            </div>
          </div>
          <div v-else>
            <InlineEdit
              :parentCategories="parentCategories"
              :category="currentCategory"
              @cancel="cancel"
              @remove="remove"
              @update="update($event)"
            />
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="createForm">
      <AddForm
        :parents="parents"
        :categoryList="categoryList"
        @createCategory="create($event)" />
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import AddForm from '@/views/category/forms/AddForm.vue';
import InlineEdit from '@/views/category/forms/InlineEdit.vue';

export default {
  name: 'CategoryList',

  components: {
    AddForm,
    InlineEdit,
  },

  setup() {
    return {
      createForm: ref(false),
      selectedCategoryUuid: ref(null),
      selectedParentUuid: ref(null),
    };
  },

  data() {
    return {
      categories: [],
      currentCategory: {},
      editMode: false,
      input: {
        name: '',
      },
    };
  },
  methods: {
    ...mapActions([
      'createCategory',
      'updateCategory',
      'deleteCategory',
    ]),

    add() {
      this.createForm = true;
    },

    cancel() {
      this.editMode = false;
      this.selectCategory(this.selectedCategoryUuid);
      if (this.currentCategory.parent) {
        this.selectedParentUuid = this.currentCategory.parent;
      }
    },

    create(event) {
      this.createCategory(event);
      this.createForm = false;
    },

    update(payload) {
      const category = {
        uuid: this.selectedCategoryUuid,
        name: payload.name,
        parent: payload.parent,
      };
      this.updateCategory(category);
      this.currentCategory = {
        ...this.currentCategory,
        name: payload.name,
        parent: payload.parent,
      };
      this.editMode = false;
    },

    remove() {
      this.deleteCategory(this.selectedCategoryUuid);
      this.selectedCategoryUuid = null;
      this.selectedParentUuid = null;
      this.editMode = false;
    },

    categoryByParent(parentUuid) {
      return this.categoryList.filter((item) => item.parent === parentUuid);
    },

    getCategory(uuid) {
      return this.categoryList.find((item) => item.uuid === uuid);
    },

    selectCategory(uuid) {
      if (uuid) {
        this.currentCategory = this.getCategory(uuid);
        this.selectedParentUuid = this.currentCategory.parent;
        this.input.name = this.currentCategory.name;
      } else {
        this.currentCategory = {};
        this.input.name = '';
        this.selectedParentUuid = '';
      }
    },
  },
  computed: {
    ...mapGetters([
      'categoryList',
    ]),

    treeItems() {
      return this.parentCategories.map((item) => {
        const children = this.categoryByParent(item.uuid);
        return {
          ...item,
          label: item.name,
          children,
        };
      });
    },

    incomeTreeItems() {
      return this.treeItems.filter((item) => item.type === 'INC');
    },

    expenseTreeItems() {
      return this.treeItems.filter((item) => item.type === 'EXP');
    },

    parentCategories() {
      return this.categoryList.filter((item) => (
        item.parent === null && !item.is_income
      )).sort((a, b) => {
        const left = a.name;
        const right = b.name;
        if (left < right) {
          return -1;
        }
        if (left > right) {
          return 1;
        }
        return 0;
      });
    },

    incomeParentCategories() {
      return this.parentCategories.filter((item) => item.type === 'INC');
    },

    expenseParentCategories() {
      return this.parentCategories.filter((item) => item.type === 'EXP');
    },

    parents() {
      return this.parentCategories.map((item) => {
        const obj = {};
        obj.label = item.name;
        obj.value = item.uuid;
        return obj;
      });
    },
  },

  watch: {
    selectedCategoryUuid() {
      this.editMode = false;
      this.selectCategory(this.selectedCategoryUuid);
      if (this.currentCategory.parent) {
        this.selectedParentUuid = this.currentCategory.parent;
      }
    },
  },
};
</script>
<style scoped>
h2 {
  font-size: 22px;
  font-weight: 800;
  text-decoration: underline;
}
.new-button {
  margin-top: 20px;
}

.categories-block--main {
  font-size: 20px;
  font-weight: 700;
}

.parent-card {
  display: flex;
  min-height: 100px;
  justify-content: left;
  padding-left: 20px;
  text-align: left;
  align-items: center;
}

.sub-card {
  display: flex;
  min-height: 80px;
  justify-content: left;
  padding-left: 30px;
  align-items: center;
  text-align: left;
  width: 100%;
  font-size: 14px;
}

.categories-block--child {
  display: flex;
  align-items: center;
  margin-left: 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  width: 100%;
}

.header span {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 800;
}
</style>
