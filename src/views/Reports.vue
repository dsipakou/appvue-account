<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="header">
        Reports
      </div>
    </div>
    <q-markup-table
      :separator="separator"
      flat
      bordered
      dense>
      <thead>
        <tr>
          <th>Days</th>
          <th
            v-for="month in monthSequence"
            :key="month"
            class="text-left">
            {{ month }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          :key="dayNumber"
          v-for="dayNumber in daySequence"
          class="text-center">
          <td>{{ dayNumber }}</td>
          <td
            v-for="month in monthSequence"
            :key="month">
            {{ month }}
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: 'Reports',

  computed: {
    ...mapGetters([
      'categoryList',
    ]),

    mainCategories() {
      const categories = this.categoryList.filter((item) => (
        item.isParent
      ));
      return categories;
    },

    daySequence() {
      const numbers = [];
      for (let i = 1; i <= 31; i += 1) {
        numbers.push(i);
      }
      return numbers;
    },

    monthSequence() {
      const months = [];
      for (let i = 11; i >= 0; i -= 1) {
        months.push(`${moment().subtract(i, 'month').year()} / 
          ${moment().subtract(i, 'month').month() + 1}`);
      }
      return months;
    },
  },
};
</script>
