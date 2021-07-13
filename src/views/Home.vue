<template>
  <div>
    <h1>Home page here</h1>
    <div v-for="user in users" :key="user.email">
      {{ user.id }}. {{user.name}} ({{ user.email }})
    </div>
  </div>
</template>

<script>
import { getUsers } from '@/service';

export default {
  name: 'Home',
  data() {
    return {
      users: [],
    };
  },
  methods: {
    async loadUsers() {
      this.users = await getUsers();
    },
  },
  beforeMount() {
    this.loadUsers();
  },
};
</script>
