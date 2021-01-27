export default {
  computed: {
    requiredValidation () {
      return [val => !!val || 'Required']
    },
    emailValidation () {
      return [
        (v) => v ? /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(v) || 'Invalid Email Address' : true
      ]
    }
  }
}