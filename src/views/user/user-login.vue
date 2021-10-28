<template>
  <div style="width: 400px; margin: auto">
    <img src="" />
    <br />
    <h2>用户登录</h2>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="昵称">
        <el-input v-model="form.username"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="login()">登录</el-button>
        <el-button>注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      var obj = this;
      this.axios({
        method: "POST",
        url: "http://localhost:8081/user/login",
        data: obj.form,
      }).then(function (response) {
        var result = response.data;
        if (result.code == 1) {
        sessionStorage.setItem('isLogin', 'true');
        sessionStorage.setItem('userId', result.uid);
          // 成功消息提示
          obj.$message({
            message: result.message,
            type: "success",
          });

          // 延时跳转
         obj.$router.push('/');

        } else {
          obj.$message.error(result.message);
        }
      });
    },
  },
};
</script>

<style>
h2{
    text-align: center;
}
</style>