export default {
    computed: {
        currentUser() {
            return 'sajeeth';
        },
    },
    methods: {
        getArrayObjFromObjList (objList) { // key-id, value-data => [{},{}]
            let keys = Object.keys(objList)
            let resultArray = []
            keys.forEach(key => {
                let obj = { ...{id: key}, ...objList[key]}
                resultArray.push(obj)
            })
            console.log(resultArray)
            return resultArray
        }
    },
};