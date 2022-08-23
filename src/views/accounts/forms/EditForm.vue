<template>
  <q-card class="shadow-24" style="width: 400px;">
    <q-card-section class="row justify-center">
      <h5>Modify Account</h5>
    </q-card-section>
    <q-form>
      <input type="hidden" v-model="input.uuid" />
      <q-card-section horizontal class="justify-between">
        <q-card-section class="col">
          <q-input outlined stack-label label="Name of the account" v-model="input.title" />
        </q-card-section>
        <q-card-section class="col">
          <q-select outlined map-options
            option-value="uuid"
            option-label="username"
            v-model="input.user"
            :options="userList"
            label="User" />
        </q-card-section>
      </q-card-section>
      <q-card-section horizontal class="row">
        <q-card-section class="col">
          <q-select stack-label outlined
            :options="incomeCategories"
            map-options
            emit-value
            option-value="uuid"
            option-label="name"
            v-model="input.category"
            label="Assigned income category" />
        </q-card-section>
        <q-card-section class="col-4">
          <q-checkbox outlined stack-label label="Main Account" v-model="input.isMain" />
        </q-card-section>
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
        <q-btn color="primary" rounded style="width: 100px;" @click="update()">Save</q-btn>
        <q-btn
          color="negative"
          rounded
          style="width: 100px;"
          label="Remove"
          @click="remove(input.uuid)"
          />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Category, User, AccountEditForm } from '@/types';

export default defineComponent({
  name: 'Edit account form',

  emits: [
    'update',
    'remove',
  ],

  props: {
    account: { type: Object as PropType<AccountEditForm>, required: true },
    categoryList: { type: Array as PropType<Array<Category>>, required: true },
    userList: { type: Array as PropType<Array<User>>, required: true },
  },

  data() {
    console.log(this.account);
    return {
      input: {
        uuid: this.account.uuid,
        user: this.account.user,
        title: this.account.title,
        category: this.account.category,
        isMain: this.account.isMain,
        description: this.account.description,
      } as AccountEditForm,
    };
  },

  computed: {
    incomeCategories(): Category[] {
      return this.categoryList.filter((item: Category) => item.type === 'INC');
    },
  },

  methods: {
    update() {
      this.$emit('update', this.input);
    },

    remove(uuid: string) {
      this.$emit('remove', uuid);
    },
  },
});
</script>
