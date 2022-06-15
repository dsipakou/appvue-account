<template>
  <q-card class="shadow-24" style="width: 400px;">
    <q-card-section>
      <h4>Edit account</h4>
    </q-card-section>

    <q-separator />

    <q-form>
      <input type="hidden" v-model="input.uuid" />
      <q-card-section>
        <q-select outlined map-options
          option-value="uuid"
          option-label="username"
          v-model="input.user"
          :options="userList"
          label="User" /> </q-card-section>
      <q-card-section>
        <q-input outlined stack-label label="Source" v-model="input.source" />
      </q-card-section>
      <q-card-section>
        <q-input outlined stack-label label="Amount" v-model="input.amount" />
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
import { User, AccountEditForm } from '@/types';

export default defineComponent({
  name: 'Edit account form',

  emits: [
    'update',
    'remove',
  ],

  props: {
    account: { type: Object as PropType<AccountEditForm>, required: true },
    userList: { type: Array as PropType<Array<User>>, required: true },

  },

  data() {
    return {
      input: {
        uuid: this.account.uuid,
        user: this.account.user,
        source: this.account.source,
        amount: this.account.amount,
        isMain: this.account.isMain,
        description: this.account.description,
      } as AccountEditForm,
    };
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
