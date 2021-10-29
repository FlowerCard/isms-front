<template>
  <div id="box">
      <h2 style="text-align: center">添加设备</h2>
      <el-form :model="fromData" status-icon :rules="rules" ref="fromData" label-width="100px" class="demo-fromData">

        <el-form-item label="设备名称" prop="typeName">
            <el-input type="text" v-model="fromData.typeName" autocomplete="off" @change="existsName()"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" :disabled="disabled" @click="submitForm()">提交</el-button>
            <el-button @click="resetForm('fromData')">重置</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.fromData.checkPass !== '') {
            this.$refs.fromData.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.fromData.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        fromData: {
          typeName: ''        
        },
        disabled:false,
        rules: {
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
           username: [
            {required: true, message: '请输入设备名称', trigger: 'blur' }
          ],
          //  nickname: [
          //   {required: true, message: '请输入昵称', trigger: 'blur' }
          // ],
          //  telphone: [
          //   {required: true, message: '请输入电话', trigger: 'blur' }
          // ],
          //  address: [
          //   {required: true, message: '请输入地址', trigger: 'blur' }
          // ],
          //  isAdmin: [
          //   {required: true, message: '请选择用户身份', trigger: 'blur' }
          // ]


        }
      };
    },
    methods: {
      submitForm() {
          const obj = this;
          this.axios({
              method:"post",
              url:"http://localhost:8081/type/addMachineType",
              data:this.fromData
          }).then(function(respones){
                const ret = respones.data;
                if(ret.code==1){
                    obj.$message({
                    message: '恭喜你，添加设备成功',
                    type: 'success'
                });

                // 延时跳转
                setTimeout(function(){
                obj.$router.push("/machine_type/machine_type-list")
                },1000)
                }else{
                    obj.$message.error('呀~出现了意料之外的问题呢！');
                }
          })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      existsName(){
        const obj = this;
        console.log(obj.fromData.typeName);
        this.axios({
            method:"get",
            url:"http://localhost:8081/type/existsName/"+obj.fromData.typeName,
        }).then(function(respones){
            const ret = respones.data;
            if(ret.code == 1){
                //说明用户名存在
                obj.disabled = true;
                obj.$message.error('当前用户名不可用哦~请更换！');
            }else{
                obj.disabled = false;
            }
        })
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