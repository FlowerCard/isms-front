<template>
  <div id="box">
    <h2 style="text-align: center">修改地区信息</h2>
    <el-form
      ref="cityInfo"
      :model="cityInfo"
      :rules="rules"
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
        cityId: this.$route.params.cityId
      },
      disabled: false,
      rules: {
        cityName: [
          { required: true, message: "请输入地区名称", trigger: "change" },
        ],
      }
    }
  },
  mounted() {
    var obj = this
    this.axios({
      method: 'GET',
      url: 'http://localhost:8081/city/' + obj.cityInfo.cityId
    }).then(function(res) {
      var result = res.data
      obj.cityInfo = result.data
    })
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
        if (flag) {
          obj.disabled = false
        } else {
          obj.disabled = true
          obj.$message.error('已存在，请更换名称')
        }
      })
    },
    submitForm(formName) {
      var obj = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios({
            method: 'PUT',
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
        } else {
          return false;
        }
        
      });
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
