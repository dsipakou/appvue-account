<template>
  <div class="q-pa-md">
    <div class="categories-block" v-for="parent in parentCategories" :key="parent.id">
      <q-card flat>
        <div class="row justify-left">
          <div class="col-2 categories-block--main">
            <q-card
              v-ripple
              class="q-hoverable cursor-pointer parent-card"
              bordered
              flat
              @click="edit(parent)">
              {{ parent.name }}
              <q-separator color="white" />
            </q-card>
          </div>
          <div
            class="col-2 categories-block--child"
            v-for="child in categoryByParent(parent.name)"
            :key="child.name">
            <q-card flat bordered class="sub-card" @click="edit(child)">
              {{ child.name }}
              <q-separator color="white" />
            </q-card>
          </div>
        </div>
      </q-card>
    </div>
    <div id="categoryCreate">
      <va-button type="button" v-on:click="showModal = true" class="new-button">New</va-button>
      <va-modal size="medium" v-model="showModal" hide-default-actions>
      <h3>New category</h3>
      <div class="va-table-responsive">
        <form>
          <table class="va-table">
            <tr>
              <td><label>Name</label></td>
              <td><input v-model="input.name" placeholder="Name" /></td>
            </tr>
            <tr>
              <td><label>Parent category</label></td>
              <td>
                <select v-model="input.parentName">
                  <option disabled value="">No parent</option>
                  <option
                    v-for="category in parentCategories"
                    v-bind:value="category.name"
                    :key="category.id">{{category.name}}
                  </option>
                </select>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <button type="button" v-on:click="create()">Create category</button>
              </td>
            </tr>
          </table>
        </form>
      </div>
      </va-modal>
    </div>
    <q-dialog v-model="updateForm">
      <q-card>
        <q-card-section>
          Editing {{ input.name || input.parentName }}
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { ref } from 'vue';
import { mapGetters } from 'vuex';
import {
  createCategory,
} from '../service';

export default {
  name: 'CategoryList',
  setup() {
    return {
      updateForm: ref(false),
    };
  },

  data() {
    return {
      categories: [],
      showModal: false,
      input: {
        name: '',
        parentName: '',
      },
    };
  },
  methods: {
    async create() {
      await createCategory(
        this.input.name,
        this.input.parentName,
      );
    },

    edit(category) {
      this.input.name = category.name;
      this.input.parentName = category.parentName;
      this.updateForm = true;
    },

    categoryByParent(parentCategory) {
      return this.categoryList.filter((item) => item.parentName === parentCategory);
    },
  },
  computed: {
    ...mapGetters([
      'categoryList',
    ]),

    parentCategories() {
      return this.categoryList.filter((item) => item.parentName === '');
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

.categories-block {
  margin: 10px 0;
}

.categories-block--main {
  font-size: 20px;
  margin: 10px 0;
  font-weight: 700;
}

.parent-card {
  padding-top: 20px;
}

.sub-card {
  padding-top: 10px;
  font-size: 12px;
}

.categories-block--child {
  margin: 10px;
}
</style>
