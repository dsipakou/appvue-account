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
      <div class="row col-8 q-mt-lg">
        <div v-show="selectedCategoryUuid" class="text-h4">
          <span class="q-px-md shadow-1 text-bold" v-show="currentCategory.parent">
            {{ currentCategory.parent ? getCategory(currentCategory.parent).name : '' }}
          </span>
          <span class="q-px-sm" v-show="currentCategory.parent">></span>
          <span
            class="q-px-md shadow-1"
            style="line-height: 2em;"
            v-if="!editMode"
            @click="editMode=true"
          >
              {{ currentCategory.name }}
          </span>
          <q-input v-else v-model="input.name"></q-input>
          <div
            v-show="editMode">
            <q-btn rounded no-caps unelevated
              color="negative"
              icon="delete"
              @click="removeCategory"
            >
              Delete
            </q-btn>
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
    <q-dialog v-model="updateForm">
      <q-card>
        <input type="hidden" v-model="input.uuid" />
        <q-card-section>
          <h4>
            {{ formTitle }}
          </h4>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input outlined stack-label label="Name" v-model="input.name" />
        </q-card-section>
        <q-card-section>
          <q-checkbox v-model="input.isParent" label="Parent category" />
        </q-card-section>
        <q-card-section>
          <q-select
            clearable
            outlined
            map-options
            v-model="input.parentName"
            :disable="input.isParent"
            :options="parents"
            label="Parent name" />
        </q-card-section>
        <q-card-actions align="center" class="action-buttons">
          <q-btn
            color="primary"
            rounded
            :disabled="!isAllowedToSave"
            style="width: 100px;"
            @click="update()">
            Save
          </q-btn>
          <q-btn
            color="negative"
            rounded
            style="width: 100px;"
            @click="remove()">
            Remove
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { ref } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import AddForm from '@/views/category/forms/AddForm.vue';

export default {
  name: 'CategoryList',

  components: {
    AddForm,
  },

  setup() {
    return {
      createForm: ref(false),
      updateForm: ref(false),
      selectedCategoryUuid: ref(null),
    };
  },

  data() {
    return {
      categories: [],
      showModal: false,
      currentCategory: {},
      formTitle: '',
      editMode: false,
      input: {
        name: '',
        parentUuid: null,
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

    create(event) {
      console.log(event);
      this.createCategory(event);
      this.createForm = false;
    },

    edit(category) {
      this.currentCategory = category;
      this.formTitle = category.name;
      this.input.uuid = category.uuid;
      this.input.name = category.name;
      this.input.parentUuid = category.parentUuid;
      this.updateForm = true;
    },

    update() {
      const category = {
        id: this.input.uuid,
        name: this.input.name,
        parent: this.input.parent,
        isIncome: false,
      };
      this.updateCategory(category);
      this.updateForm = false;
    },

    removeCategory() {
      this.deleteCategory(this.selectedCategoryUuid);
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
        this.input.name = this.currentCategory.name;
      } else {
        this.currentCategory = {};
        this.input.name = '';
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

    isAllowedToSave() {
      return (
        !this.categoryList.some((item) => (
          item.name === this.input.name
          && (item.parentUuid === this.input.parentUuid
            || item.parent === this.input.parent?.label)
          && item.isParent === this.input.isParent
        ))
        && !!this.input.parent
      );
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
