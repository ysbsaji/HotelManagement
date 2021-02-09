export default {
  data() {
    return {
      btnLoading: false,
      saveBtn: true,
      saveBtn1: true,
      updateBtn1: false,
      updateBtn: false,
    }
  },
  methods: {
    getIMageUrl (item) {
      this.$store.dispatch('imgDialog', item)
    },
    getArrayObjFromObjList (objList) { // key-id, value-data => [{},{}]
      let keys = Object.keys(objList)
      let resultArray = []
      keys.forEach(key => {
        let obj = { ...{id: key}, ...objList[key]}
        resultArray.push(obj)
      })
      return resultArray
    },
    getDetailsFromApi (url) {
      let result = this.$http.get(url)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return error
      }) 
      return result 
    },
    postDetailsToApi(url, data){
      let result = this.$http.post(url, JSON.stringify(data))
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return error
      })
      return result
    },
    deleteDetailsFromApi(url){
      let result = this.$http.delete(url)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return error
      }) 
      return result
    },
    async updateDetailsToApi(url, data){
      delete data.id
      let result = await this.$http.put(url, JSON.stringify(data))
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return error
      })
      return result
    },
    getCookie(item){
      console.log(item);
      return item
    }
  },
  filters: {
    capitalize (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    moneySymbol (v) {
      return v + ' ' + '₹'
    },
  }
};