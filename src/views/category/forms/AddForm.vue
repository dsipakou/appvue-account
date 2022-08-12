<template>
  <q-card>
    <q-card-section>
      <h4>
        Create a category
      </h4>
    {{ input }}
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
        emit-value
        v-model="input.parent"
        :disable="input.isParent"
        :options="parents"
        label="Parent name" />
    </q-card-section>
    <q-card-section>
      <q-select
        outlined
        emit-value
        map-options
        v-model="input.type"
        :options="typeOptions"
        label="Category type"
        />
    </q-card-section>
    <q-card-actions align="center" class="action-buttons">
      <q-btn
        color="primary"
        rounded
        style="width: 100px;"
        @click="create()">
        Save
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Category } from '@/types';

interface internalData {
  name: string,
  parent: string,
  isParent: boolean,
  type: string,
}

export default defineComponent({
  name: 'Add category form',

  emits: [
    'createCategory',
  ],

  props: {
    categoryList: { type: Array as PropType<Array<Category>>, required: true },
    parents: { type: Array as PropType<Array<Category>>, required: true },
  },

  setup() {
    return {
      typeOptions: [
        { label: 'Income', value: 'INC' },
        { label: 'Expense', value: 'EXP' },
      ],
    };
  },

  data() {
    return {
      input: {
        name: '',
        parent: '',
        isParent: false,
        type: 'EXP',
      } as internalData,
    };
  },

  methods: {
    create() {
      const category = {
        name: this.input.name,
        parent: this.input.isParent ? null : this.input.parent,
        type: this.input.type,
      };
      this.$emit('createCategory', category);
    },
  },
});
</script>
