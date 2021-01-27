<template>
  <div>
    <form ref="cafeAllocationForm" class="my-6 pa-4">
      <v-row>
        <v-col cols="4">
          <v-select :items="orderedFoodList" item-text="tableNumber" v-model="cafeAllocationDetails.tableId" item-value="tableId" outlined dense label="Customer"></v-select>
        </v-col>
        <v-col cols="4">
          <v-select :items="employeeDetails" item-text="name" item-value="id" v-model="cafeAllocationDetails.employeeId" outlined dense label="Employee"></v-select>
        </v-col>
        <v-col cols="4">
          <v-btn class="mx-3" color="#EF5350" @click="allocateStaffForOrder">Save</v-btn>
        </v-col>
      </v-row>
    </form>
    <table-data :data="foodDetails"/>
  </div>
</template>

<script>
import TableData from '../../components/TableData.vue'
export default {
  components: { TableData },
  data () {
    return {
      cafeAllocationDetails: {},
      orderedFoodList : [],
      employeeDetails: [],
      foodDetails: {
        headers: [
          { text: 'Table Number', value: 'tableNumber' }, { text: 'Food', value: 'foodName' }, { text: 'Quantity', value: 'quantity' }, { text: 'Price', value: 'price' }, { text: 'Employee Name', value: 'empName' }, { text: 'Actions', value: 'actions'}
        ],
        list: [],
        actionsList:[{
            click: (item) => this.edit(item),
            icon:'mdi-pencil'
          },{
            click: (item) => this.del(item),
            icon:'mdi-delete'
          }]
      },
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    async getDetails(){
      let orderedDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/orderedFoodDetails.json')
      this.orderedFoodList = this.getArrayObjFromObjList(orderedDetails)
      let empDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/employeeDetails.json')
      this.employeeDetails = this.getArrayObjFromObjList(empDetails)
      let allocationDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/cafeOrderAllocation.json')
      for(let i in allocationDetails){
        allocationDetails[i].forEach(val =>{ this.foodDetails.list.push(val) })
      }
    },
    async allocateStaffForOrder(){
      let orderedDetails = {}
      let empDetails = {}
      this.orderedFoodList.forEach(val => {
        val.tableId === this.cafeAllocationDetails.tableId ?  orderedDetails = Object.assign({}, val): false
      })
      this.employeeDetails.forEach(val => {
        val.id === this.cafeAllocationDetails.employeeId ? empDetails = Object.assign({}, val) : false
      })
      let tableId = orderedDetails.tableId
      let tableNumber = orderedDetails.tableNumber
      delete orderedDetails.tableId
      delete orderedDetails.tableNumber
      delete orderedDetails.id
      for(let i in orderedDetails){
        orderedDetails[i].tableNumber = tableNumber
        orderedDetails[i].tableId = tableId
        orderedDetails[i].empName = empDetails.name
        orderedDetails[i].employeeId = empDetails.id
        this.foodDetails.list.push(orderedDetails[i])
      }
      await this.postDetailsToApi('https://traineesapi.firebaseio.com/cafeOrderAllocation.json',orderedDetails)
    }
  }
}
</script>

<style>

</style>