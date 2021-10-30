<template>
  <div id="box">
      <h2 style="text-align: center">添加设备类型</h2>
      <el-form :model="fromData" status-icon :rules="rules" ref="fromData" label-width="100px" class="demo-fromData">

        <el-form-item label="类型名称" prop="typeName">
            <el-input type="text" v-model="fromData.typeName" autocomplete="off" @change="existsName()"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" :disabled="disabled" @click="submitForm('fromData')">提交</el-button>
            <el-button @click="resetForm('fromData')">重置</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        fromData: {
          typeName: ''        
        },
        disabled:false,
        rules: {
           typeName: [
            {required: true, message: '请输入设备类型名称', trigger: 'blur' }
          ],
      

        }
      };
    },
    methods: {
      submitForm(formName) {
           this.$refs[formName].validate((valid) => {
          if (valid) {
            const obj = this;
          this.axios({
              method:"post",
              url:"http://localhost:8081/type/addMachineType",
              data:this.fromData
          }).then(function(respones){
                const ret = respones.data;
                if(ret.code==1){
                    obj.$message({
                    message: '恭喜你，添加设备类型成功',
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });
          
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      existsName(){
        const obj = this;
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