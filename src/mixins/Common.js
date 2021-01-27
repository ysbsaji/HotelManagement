export default {
  computed: {
    //
  },
  methods: {
    getArrayObjFromObjList (objList) { // key-id, value-data => [{},{}]
      let keys = Object.keys(objList)
      let resultArray = []
      keys.forEach(key => {
        let obj = { ...{id: key}, ...objList[key]}
        resultArray.push(obj)
      })
      return resultArray
    },
    getDetailsFromApi(url){
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
      console.log(result)
      return result
    },
  //   async getImageUrl(file){
  //     let result = null
  //     if(file){
  //       var reader = new FileReader();
  //       reader.addEventListener('load', (e) => {
  //         result = e.target.result
  //       })
  //       await reader.readAsDataURL(file)
  //     }
  //     console.log(reader.readyState)
  //     return result
  //   }
  },
};