<template id="landing-page">
  <div id="probg">
    <img :src="bgimg">
    <div class="Circle-custom">
      <h1>{{project.name}}</h1>
      <span>
        <Icon type="ios-pin-outline" />{{project.place}}
      </span>
      <p>{{progress}}</p>
    </div>
  </div>
</template>
<script>
  const path = require('path')
  export default {
    name: 'landing-page',
    computed: {
      bgimg() {
        var bgimgpath = path.join(__static, '/bg.png')
        return bgimgpath
      },
      project() {
        return this.$store.state.modals.login.projectId
      },
      progress() {
        var pp = this.$store.state.modals.login.projectId.projectProgress
        if (pp === '开工' || pp === '003' || pp === '006') {
          return '在建'
        } else {
          return '未开工'
        }
      }
    }
  }

</script>
