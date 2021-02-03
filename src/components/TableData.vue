<template>
  <div>
    <v-data-table
      :headers="data.headers"
      :items="data.list"
      class="elevation-1"
    >
    <template v-slot:[`item.actions`]="{ item }" v-if="$store.state.userDetails.role === 'Manager'">
      <v-btn icon v-for="(action, index) in data.actionsList" text
        @click="action.click(item)" :key="index">
        <v-icon>{{ action.icon }}</v-icon>
      </v-btn>
    </template>
     <template v-slot:[`item.rate`]="{ item }">
      {{ item.rate | moneySymbol }}
    </template>
    <template v-slot:[`item.image`]="{ item }">
      <img :src="item.image" alt="No image" width="40px">
    </template>
    <template v-slot:[`item.name`]="{ item }">
      {{ item.name | capitalize}}
    </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: ['data'],
}
</script>

<style>

</style>