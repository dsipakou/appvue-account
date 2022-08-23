<template>
  <q-card class="shadow-24" style="width: 400px;">
    <q-card-section>
      <h4>Create account</h4>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-select
        outlined
        map-options
        option-value="uuid"
        option-label="username"
        v-model="input.user"
        :options="userList"
        label="User" />
    </q-card-section>
    <q-card-section>
      <q-input outlined stack-label label="Name of the account" v-model="input.title" />
    </q-card-section>
    <q-card-section>
      <q-select stack-label
        :options="incomeCategories"
        map-options
        emit-value
        option-value="uuid"
        option-label="name"
        v-model="input.category"
        label="Assigned income category" />
    </q-card-section>
    <q-card-section>
      <q-checkbox outlined stack-label label="Main Account" v-model="input.isMain" />
    </q-card-section>
    <q-card-section>
      <q-input
        outlined
        stack-label
        type="textarea"
        label="Description"
        v-model="input.description" />
    </q-card-section>

    <q-card-actions align="center" class="action-buttons">
      <q-btn color="primary" rounded style="width: 100px;" @click="save()">Save</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Category, User, AccountSaveForm } from '@/types';

export default defineComponent({
  name: 'Add account form',

  emits: [
    'save',
  ],

  props: {
    categoryList: { type: Array as PropType<Array<Category>>, required: true },
    userList: { type: Array as PropType<Array<User>>, required: true },
  },

  data() {
    return {
      input: {
        user: this.userList.find((_, index) => index === 0),
        title: '',
        category: '',
        isMain: false,
        description: '',
      } as AccountSaveForm,
    };
  },

  methods: {
    save() {
      this.$emit('save', this.input);
    },
  },

  computed: {
    incomeCategories(): Category[] {
      return this.categoryList.filter((item: Category) => item.type === 'INC');
    },
  },
});
</script>
