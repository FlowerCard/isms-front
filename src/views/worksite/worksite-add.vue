<template>
  <div id="box">
    <h2 style="text-align: center">新增工地</h2>
    <el-form
      ref="worksiteInfo"
      :model="worksiteInfo"
      status-icon
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="工地名"
        prop="workName"
      >
        <el-input
          v-model="worksiteInfo.workName"
          @change="existsName()"
          type="text"
          sutocomplete="off"
        />
      </el-form-item>
      <el-form-item label="工地地区" prop="cityId">
        <el-select v-model="worksiteInfo.cityId" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.cityId"
            :label="item.cityName"
            :value="item.cityId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工作地址" prop="workAddr">
        <el-input
          v-model="worksiteInfo.workAddr"
          type="text"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="disabled"
          v-model="disabled"
          @click="submitForm('worksiteInfo')"
          >提交</el-button
        >
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
        workName: '',
        cityId: '',
        workAddr: '',
        uId: '',
      },
      disabled: false,
      rules: {
        workName: [
          { required: true, message: "请输入工地名称", trigger: "blur" },
        ],
        cityId: [
          { required: true, message: "请选择工地地区", trigger: "change" },
        ],
        workAddr: [
          { required: true, message: "请输入工作地址", trigger: "change" },
        ]
      },
    };
  },
  created() {
    //关键！！！：从浏览器缓存中获取myuser对象中的id值
    var myuser = this.$store.getters.getUser;
    this.worksiteInfo.uid = myuser.uid;
    console.log("store:" + this.uid);
  },
  mounted() {
    //防止刷新后数据丢失
    window.addEventListener("unload", this.saveState);
    var obj = this;
    this.axios({
      method: "GET",
      url: "http://localhost:8081/city/cities",
    }).then(function (res) {
      var result = res.data;
      if (result.code == 1) {
        obj.options = result.data;
      } else {
        alert(result.message);
      }
    });
  },
  methods: {
    existsName() {
      var obj = this;
      this.axios({
        method: "get",
        url:
          "http://localhost:8081/worksite/worksite/" +
          obj.worksiteInfo.workName,
        data: obj.cityInfo,
      }).then(function (res) {
        var flag = res.data;
        obj.disabled = !flag;
        if (!flag) {
          obj.$message.error("已存在，请更换名称");
        }
      });
    },
    submitForm(formName) {
      var obj = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.axios({
            method: "POST",
            url: "http://localhost:8081/worksite/worksite/",
            data: obj.worksiteInfo,
          }).then(function (res) {
            var flag = res.data;
            if (flag.code == 1) {
              obj.$message({
                message: flag.message,
                type: "success",
              });
              obj.$router.push("/worksite/worksiteList");
            } else {
              obj.$message.error(flag.message);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
#box {
  margin: auto;
  width: 600px;
}
</style>
