<template>
  <div id="box">
    <h2 style="text-align: center">修改地区信息</h2>
    <el-form
      ref="worksiteInfo"
      :model="worksiteInfo"
      status-icon
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="工地名称" prop="workName">
        <el-input v-model="worksiteInfo.workName" @change="existsName()" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item label="工地地区" prop="cityId">
        <el-select v-model="worksiteInfo.cityId" placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.cityId"
                :label="item.cityName"
                :value="item.cityId">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工作地址" prop="workAddr">
        <el-input v-model="worksiteInfo.workAddr" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled = "disabled"
          @click="submitForm('worksiteInfo')"
        >提交</el-button>
        <el-button @click="resetForm('worksiteInfo')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: null,
      worksiteInfo: {
        workId: this.$route.params.workId
      },
      disabled: false
    }
  },
  mounted() {
    var obj = this
    this.axios({
        method: 'GET',
        url: 'http://localhost:8081/worksite/' + obj.worksiteInfo.workId
    }).then(function(res) {
        var result = res.data
        obj.worksiteInfo = result.data
    })
    this.axios({
      method: 'GET',
      url: 'http://localhost:8081/city/cities'
    }).then(function(res) {
      var result = res.data
      if (result.code == 1) {
        obj.options = result.data
      } else {
          alert(result.message)
      }
      
    })
  },
  methods: {
      existsName() {
      var obj = this
      this.axios({
        method: 'get',
        url: 'http://localhost:8081/worksite/worksite/' + obj.worksiteInfo.workName
      }).then(function(res) {
        var flag  = res.data
        if (flag == 1) {
          obj.disabled = !obj.disabled
          obj.$message.error('已存在，请更换名称')
        } else if (flag == 0) {
          obj.disabled = !obj.disabled
        }
      })
    },
    submitForm(formName) {
      var obj = this
      this.axios({
        method: 'PUT',
        url: 'http://localhost:8081/worksite/worksite',
        data: obj.worksiteInfo
      }).then(function(res) {
        var flag = res.data
        if (flag.code == 1) {
          obj.$message({
            message: flag.message,
            type: 'success'
          })
          obj.$router.push('/worksite/worksiteList')
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
