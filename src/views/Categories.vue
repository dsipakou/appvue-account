<template>
  <div class="container">
    <h3>Category list</h3>
    <div v-for="category in categories" :key="category.id">
      {{ category.name }}  ({{ category.parentName }})
    </div>
    <div id="categoryCreate">
      <h3>Add category</h3>
      <div class="va-table-responsive">
        <form>
          <table class="va-table">
            <tr>
              <td><label>Name</label></td>
              <td><input v-model="input.name" placeholder="Name" /></td>
            </tr>
            <tr>
              <td><label>Parent category</label></td>
              <td><input v-model="input.parentName" placeholder="Parent category" /></td>
            </tr>
            <tr>
              <td colspan="2">
                <button type="button" v-on:click="create()">Create category</button>
              </td>
            </tr>
          </table>
        </form>
      </div>
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
  },
  beforeMount() {
    this.initLoad();
  },
};
</script>
