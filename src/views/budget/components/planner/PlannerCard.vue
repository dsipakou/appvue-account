<template>
  <div class="row">
    <div class="vertical-middle">
      <slot name="title"></slot>
      <q-card class="q-pt-sm card">
        <div
          v-for="item in items"
          :key="item.id">
          <div class="q-mx-sm item-block"
            dragable="true"
            @dragstart="$event">
            <span>{{ item.title }}</span>
            <span>{{ item.amount }}</span>
          </div>
        </div>
        <q-card-section>
          Amount: {{ overallSum }}
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PlannerCard',

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
  border-top: 1px solid;
  min-height: 40px;
  justify-content: space-between;
}
</style>
