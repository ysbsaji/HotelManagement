export default {
  computed: {
    requiredValidation () {
      return [value => !!value || 'Required']
    },
    emailValidation () {
      return [
        (value) => !!value || 'Required',
        (value) => value ? /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(value) || 'Invalid Email Address' : true
      ]
    },
    passwordValidation() {
      return [
        value => !!value || "Required.",
        value => (value && value.length >= 8) || "Min 8 characters"
      ]
    }
  }
}