<template>
  <div>
    <div v-for="parent in parentCategories" :key="parent.id">
      <h2>
        {{ parent.name }}
      </h2>
      <div v-for="child in categoryByParent(parent.name)" :key="child.name">
        <span>
          {{ child.name }}
        </span>
      </div>
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
import {
  createCategory,
  getCategories,
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
    async initLoad() {
      this.categories = await getCategories();
    },
    async create() {
      await createCategory(
        this.input.name,
        this.input.parentName,
      );
    },
    categoryByParent(parentCategory) {
      return this.categories.filter((item) => item.parentName === parentCategory);
    },
  },
  computed: {
    parentCategories() {
      return this.categories.filter((item) => item.parentName === '');
    },
  },
  beforeMount() {
    this.initLoad();
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
</style>
