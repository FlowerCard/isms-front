<template>
  <div id="box">
    <h2 style="text-align: center">新增地区</h2>
    <el-form
      ref="cityInfo"
      :model="cityInfo"
      status-icon
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="地区名" prop="cityName">
        <el-input v-model="cityInfo.cityName" @change="existsName()" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled = "disabled"
          v-model="disabled"
          @click="submitForm('cityInfo')"
        >提交</el-button>
        <el-button @click="resetForm('cityInfo')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cityInfo: {
        cityName: null
      },
      disabled: false
    }
  },
  methods: {
    existsName() {
      var obj = this
      this.axios({
        method: 'get',
        url: 'http://localhost:8081/city/city/' + obj.cityInfo.cityName,
        data: obj.cityInfo
      }).then(function(res) {
        var flag  = res.data
        obj.disabled = !flag
        obj.$message.error('已存在，请更换名称')
      })
    },
    submitForm(formName) {
      var obj = this
      this.axios({
        method: 'POST',
        url: 'http://localhost:8081/city/city/',
        data: obj.cityInfo
      }).then(function(res) {
        var flag = res.data
        if (flag.code == 1) {
          obj.$message({
            message: flag.message,
            type: 'success'
          })
          obj.$router.push('/city/cityList')
        } else {
          obj.$message.error(flag.message)
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
#box {
  margin: auto;
  width: 600px;
}
</style>
