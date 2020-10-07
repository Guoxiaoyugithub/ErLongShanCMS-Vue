<template>
  <div class="lin-container">
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
    }
  },
  mounted() {
    this._getBannerData()
  },
  methods: {
    _getBannerData() {
      axios.get('https://miniapp.zb2l3.com/user/v1/banner/getbanner', {}).then((resolve, reject) => {
        console.log(resolve.data)
      })
    },

  }
}
</script>

<style scoped>
</style>