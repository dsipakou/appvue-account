<template>
  <div class="row">
    <h4>Income report</h4>
  </div>
  <div class="row">
    <q-markup-table>
      <thead>
        <tr>
          <td>Title</td>
          <td>
            <q-select label="Income for" dense outlined
              map-options
              emit-value
              :options="users"
              v-model="selectedUser"
            />
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>asdf</td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Income report component',

  data() {
    return {
      users: [
        { label: 'All', value: 'all' },
        { label: 'Kate', value: 'kate' },
        { label: 'Denis', value: 'denis' },
      ],
      selectedUser: null,
    };
  },
});
</script>
