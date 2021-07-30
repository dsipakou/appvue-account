<template>
  <div class="q-pa-md">
    <div class="categories-block" v-for="parent in parentCategories" :key="parent.id">
      <q-card flat>
        <div class="row justify-center">
          <div class="col-2 categories-block--main">
            <q-card bordered flat class="parent-card">
              {{ parent.name }}
              <q-separator color="white" />
              <q-action-button>
                <q-btn size="12px" flat icon="edit" />
                <q-btn size="12px" flat icon="delete" />
              </q-action-button>
            </q-card>
          </div>
        </div>
        <div class="row justify-center">
          <div
            class="col-2 categories-block--child"
            v-for="child in categoryByParent(parent.name)"
            :key="child.name">
            <q-card flat bordered class="sub-card">
              {{ child.name }}
              <q-separator color="white" />
              <q-action-button>
                <q-btn size="12px" flat icon="edit" />
                <q-btn size="12px" flat icon="delete" />
              </q-action-button>
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import {
  createCategory,
} from '../service';

export default {
  name: 'CategoryList',
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
