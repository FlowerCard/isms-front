<template>
  <div class="dashboard-container">
    <div class="dashboard-text">uid: {{ uid }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      uid:0
    }
  },
    created(){

    //关键！！！：从浏览器缓存中获取myuser对象中的id值
    var myuser = this.$store.getters.getUser;  
    this.uid = myuser.uid;
    console.log("store:"+this.uid);


  },
  mounted() {
    //防止刷新后数据丢失
    window.addEventListener('unload', this.saveState);
    
  },
  methods: {
    saveState() {
      // 模块化后，调用 state 的代码修改为 this.$store.state.myuser
      sessionStorage.setItem('userState', JSON.stringify(this.$store.state.myuser));
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
