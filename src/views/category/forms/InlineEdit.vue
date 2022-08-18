<template>
  <div class="row">
    <div>
      <q-select
        v-show="category.parent"
        :options="parentCategories"
        style="width: 200px;"
        map-options
        emit-value
        option-label="name"
        option-value="uuid"
        v-model="selectedParentUuid"
      />
    </div>
    <div>
      <q-input outlined v-model="input.name" />
    </div>
    <div>
      <q-btn no-caps flat
        color="gray"
        icon="close"
        @click="cancel"
      />
      <q-btn flat no-caps
        color="positive"
        icon="check"
        @click="update"
      />
      <q-btn flat no-caps
        color="negative"
        icon="delete"
        @click="remove"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { Category } from '@/types';

export default defineComponent({
  name: 'Category inline edit',

  emits: [
    'cancel',
    'update',
    'remove',
  ],

  setup() {
    return {
      selectedParentUuid: ref(''),
    };
  },

  props: {
    parentCategories: { type: Array as PropType<Array<Category>>, required: true },
    category: { type: Object as PropType<Category>, required: true },
  },

  data() {
    return {
      input: {
        name: '',
      },
    };
  },

  methods: {
    cancel() {
      this.$emit('cancel');
    },

    update() {
      const payload = {
        name: this.input.name,
        parent: this.selectedParentUuid,
      };
      this.$emit('update', payload);
    },

    remove() {
      this.$emit('remove');
    },
  },

  mounted() {
    this.selectedParentUuid = this.category.parent;
    this.input.name = this.category.name;
  },
});
</script>
