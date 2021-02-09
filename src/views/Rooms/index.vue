<template>
  <div>
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<script>
export default {
  // mounted () {
  //   console.log(this.$route);
  // }
}
</script>

<style>

</style>