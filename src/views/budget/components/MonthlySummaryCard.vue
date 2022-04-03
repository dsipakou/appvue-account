<template>
  <q-card rounded flat
    class="main-card"
  >
  <div class="row col-12">
    <div class="row col-6 content">
      <div class="row justify-end data-container content-planned">
        <div class="column planned-values-container">
          <div class="planned-number">
            {{ plannedUsage }}
          </div>
          <div class="planned-text">
            Planned
          </div>
        </div>
        <div class="row planned-bar self-end"></div>
      </div>
    </div>
    <div class="row col-6 content">
      <div class="row data-container">
        <div class="row actual-bar self-end"></div>
        <div class="column actual-values-container">
          <div class="actual-number">
            {{ actualUsage }}
          </div>
          <div class="actual-text">
            Actual
          </div>
        </div>
      </div>
    </div>
  </div>
  </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Monthly Summary Card',

  props: {
    planned: { type: Number, required: true },
    actual: { type: Number, required: true },
  },

  computed: {
    plannedUsage(): string {
      return new Intl.NumberFormat('en-US', {
        maximumFractinoDigits: 2,
        minimumFractionDigits: 2,
      }).format(this.planned);
    },

    actualUsage(): string {
      return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(this.actual);
    },
  },
});
</script>
<style scoped>
.main-card {
  width: 300px;
  height: 54px;
  background-color: #666666;
}

.content {
  color: white;
}

.content-planned {
  border-right: 1px solid white;
}

.planned-values-container {
  margin-right: 13px;
}

.planned-number {
  display: flex;
  justify-content: end;
  font-size: 20px;
}

.planned-text {
  font-size: 12px;
  display: flex;
  justify-content: end;
}

.actual-values-container {
  margin-left: 13px;
}

.actual-number {
  font-size: 20px;
  font-weight: bold;
}

.actual-text {
  font-size: 12px;
  font-weight: bold;
}

.data-container {
  line-height: 1.5em;
  margin-top: 7px;
}

.planned-bar {
  height: 22px;
  max-width: 12px;
  background-color: #FFD600;
  margin-right: 5px;
}

.actual-bar {
  height: 40px;
  max-width: 12px;
  background-color: #FFD600;
  margin-left: 5px;
}
</style>
