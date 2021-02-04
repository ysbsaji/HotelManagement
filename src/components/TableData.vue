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
      <img :src="item.image" alt="No image" width="40px" @click="getIMageUrl(item)">
    </template>
    <template v-slot:[`item.status`]="{ item }">
      <p style="color: #29B6F6" v-if="item.status === 'Booked'"> <u v-for="(list, index) in data.bookedList" :key="index" @click="list.click(item)">{{ item.status }}</u> </p>
      <p v-else> {{ item.status }}</p>
    </template>
    <template v-slot:[`item.orderStages`]="{ item }">
      <p v-for="(list, index) in data.orderStagesList" :key="index" @click="list.click(item)">{{ item.orderStages }}<v-icon v-if="item.status === 'Booked'"> {{ list.icon }} </v-icon></p>
    </template>
    <template v-slot:[`item.isAssigned`]="{ item }">
      <v-row>
        <v-col v-if="item.status !== 'Free'" class="mt-3">
          <v-btn v-for="(list, index) in data.isAssignedList" :key="index" text>
            <p v-if="item.isAssigned">{{ item.isAssigned }} <v-icon  @click="list.click(item)" v-if="$store.state.userDetails.role === 'Manager'">mdi-check</v-icon></p>
            <v-icon v-else @click="list.click(item)">{{ list.icon }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>
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