<template>
  <div>
    <h3>Transaction list</h3>
    <div id="transactionList">
      <div v-for="transaction in transactions" :key="transaction.id">
        {{ transaction.amount }}
      </div>
    </div>
    <div id="transactionCreate">
      <form>
        <h3>Add transaction</h3>

        <div>
          <label>User</label>
        </div>
        <div>
          <label>Account</label>
        </div>
      </form>
    </div>
  </div>
</template>
