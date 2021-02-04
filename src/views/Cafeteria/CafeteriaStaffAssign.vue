<template>
  <div>
    <v-banner
      color="red"
      style="border-radius: 3px"
      class="my-3 ma-2"
    ><h3>Cafeteria Allocation Management</h3></v-banner>
    <h3 class="ml-3">Staff Assigned Tables</h3>
    <table-data :data="cafeDetails" class="my-3 pa-3"/>
    <v-dialog
     v-model="foodDetailDialog"
     width="500"
    >
      <v-card>
        <v-card-title>Food Details</v-card-title>
        <v-divider></v-divider>
        <v-card-text v-for="(item, index) in foodDetails" :key="index">
          <p><b>Food Name :</b> {{ item.foodName }}</p>
          <p><b>Rate :</b> {{ item.rate | moneySymbol }}</p>
          <p><b>Quantity :</b> {{ item.quantity }}</p>
          <p><b>Price :</b> {{ item.price | moneySymbol }}</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="foodDetailDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="isAssignDialog"
      width="500"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Assign Employee To Customer
        </v-card-title>
        <v-card-text class="mt-3">
          <v-select :items="employeeDetails" item-text="name" item-value="id" v-model="assignEmployee.employeeId" :rules="requiredValidation" outlined dense label="Employee"></v-select>
        </v-card-text>
        <v-divider></v-divider>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="confirmAssign()">Assign</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="orderStagesDialog"
      width="500"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Order Stages 
        </v-card-title>
        <v-card-text class="mt-3">
          <v-select :items="orderStages" item-text="name" item-value="id" v-model="assignEmployee.orderStages" :rules="requiredValidation" outlined dense label="Order Stages"></v-select>
        </v-card-text>
        <v-divider></v-divider>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="confirmAssign('orderStages')">Change</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TableData from '../../components/TableData.vue'
export default {
  components: { TableData },
  data () {
    return {
      orderStagesDialog: false,
      foodDetailDialog: false,
      foodDetails : [],
      isAssignDialog: false,
      assignEmployee: {},
      orderStages: ['Ordered', 'Got Ready', 'Deliverd', 'Table Free'],
      updateDetail: {},
      employeeDetails: [],
      cafeDetails: {
        headers: [
          { text: 'Table Number', value: 'tableNumber' }, { text: 'Total Chairs', value: 'totalChairs' }, { text: 'Status', value: 'status'}, { text: 'Is Assigned', value: 'isAssigned'}, { text: 'Order Stages', value: 'orderStages'}
        ],
        list: [],
        bookedList: [{
          click: (item) => this.bookedDetails(item),
          icon:'mdi-clipboard-account-outline'
        }],
        isAssignedList: [{
          click: (item) => this.assignEmpToCus(item),
          icon:'mdi-clipboard-account-outline'
        }],
        orderStagesList: [{
          click: (item) => this.changeOrderStages(item),
          icon:'mdi-chart-timeline-variant'
        }]
      }
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    async getDetails () {
      let tableDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/cafeteriaDetails.json')
      if (tableDetails) this.cafeDetails.list = this.getArrayObjFromObjList(tableDetails)
      this.cafeDetails.list.forEach(async (val)=> {
        if (val.bookingStatus) {
          if (val.orderStages) {
            if (val.orderStages === 'Table Free') val.bookingStatus = false, val.orderStages = '', await this.updateDetailsToApi('https://traineesapi.firebaseio.com/cafeteriaDetails/' + val.id + '.json', val)
          }
        }
        val.bookingStatus ? val.status = 'Booked' : val.status = 'Free'
      })
      let empDetails = await this.getDetailsFromApi('https://traineesapi.firebaseio.com/employeeDetails.json')
      if (empDetails) this.employeeDetails = this.getArrayObjFromObjList(empDetails)
    },
    bookedDetails (details) {
      this.foodDetails = details.fooddetails
      this.foodDetailDialog = true
    },
    assignEmpToCus (details) {
      this.updateDetail = details
      this.isAssignDialog = true
    },
    async confirmAssign (item) {
      if (item !== 'orderStages') {
        this.isAssignDialog = false
        this.employeeDetails.forEach(val => { if (val.id === this.assignEmployee.employeeId) this.updateDetail.isAssigned = val.name })
        await  this.updateDetailsToApi('https://traineesapi.firebaseio.com/cafeteriaDetails/' + this.updateDetail.id + '.json', this.updateDetail)
      }else {
        this.orderStagesDialog = false
        this.updateDetail.orderStages = this.assignEmployee.orderStages
        await  this.updateDetailsToApi('https://traineesapi.firebaseio.com/cafeteriaDetails/' + this.updateDetail.id + '.json', this.updateDetail)
      }
      await this.getDetails()
    },
    changeOrderStages (details) {
      this.updateDetail = details
      this.orderStagesDialog = true
    }
  },
}
</script>

<style>

</style>