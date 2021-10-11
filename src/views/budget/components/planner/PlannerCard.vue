<template>
  <div class="row">
    <div class="vertical-middle">
      <slot name="title"></slot>
      <q-card class="card">
        <q-card-section
          v-for="item in items"
          :key="item.id">
          <q-card flat bordered
            dragable="true"
            @dragstart="$event">
            <q-card-section dense>
              {{ item.title }}
            </q-card-section>
          </q-card>
        </q-card-section>
        <q-separator />
      </q-card>
    </div>
  </div>
  <div>
    body
  </div>
  <div>
    Card
  </div>
</template>
<script>
export default {
  name: 'PlannerCard',

  props: {
    items: { type: Array, required: true },
  },
};
</script>
<style scoped>
.card {
  min-width: 200px;
  min-height: 400px;
}
</style>
