<template>
  <div class="row">
    <div class="vertical-middle">
      <slot name="title"></slot>
      <q-card class="q-pt-sm card">
        <div
          class="q-mx-sm item-block"
          v-for="item in items"
          :key="item.id"
          @click="editForm = true"
          dragable="true"
          @dragstart="$event">
            <span>{{ item.title }}</span>
            <span>{{ item.amount }}</span>
        </div>
        <q-card-section>
          Amount: {{ overallSum }}
        </q-card-section>
      </q-card>
    </div>
  </div>
  <q-dialog v-model="editForm">
    <EditForm />
  </q-dialog>
</template>
<script>
import { ref } from 'vue';
import EditForm from '@/views/budget/forms/EditForm.vue';

export default {
  name: 'PlannerCard',

  components: {
    EditForm,
  },

  setup() {
    return {
      editForm: ref(false),
    };
  },

  props: {
    items: { type: Array, required: true },
  },

  computed: {
    overallSum() {
      return this.items.reduce((acc, item) => item.amount + acc, 0);
    },
  },
};
</script>
<style scoped>
.card {
  min-width: 200px;
  min-height: 400px;
}

.item-block {
  display: flex;
  align-items: center;
  border-bottom: 1px solid;
  min-height: 40px;
  justify-content: space-between;
}
</style>
