<template>
  <div id="box">
      <h2 style="text-align: center">修改用户</h2>
      <el-form ref="form" :model="fromData" label-width="80px">

            <el-input v-model="fromData.uid" type="hidden"></el-input>

         <el-form-item label="姓名">
            <el-input v-model="fromData.username"  @change="existsName()"></el-input>
        </el-form-item>
         <el-form-item label="密码">
            <el-input v-model="fromData.password" type="password"></el-input>
        </el-form-item>
         <!-- <el-form-item label="昵称">
            <el-input v-model="fromData.nickname"></el-input>
        </el-form-item>
         <el-form-item label="电话">
            <el-input v-model="fromData.telphone"></el-input>
        </el-form-item>
        <el-form-item label="地址">
            <el-input v-model="fromData.address"></el-input>
        </el-form-item> -->

        <el-form-item label="身份">
            <el-radio-group v-model="fromData.isAdmin">
            <el-radio :label="0" value="0">员工</el-radio>
            <el-radio :label="1" value="1">管理员</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="状态">
            <el-radio-group v-model="fromData.isDelete">
            <el-radio :label="1" value="1">注销</el-radio>
            <el-radio :label="0" value="0">正常</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" :disabled="disabled" @click="onSubmit">提交</el-button>
            <el-button>取消</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    data() {
        return {
            fromData:{
                uid:this.$route.params.uid,
                username:"",
                password:"",
                isAdmin:"",
                isDelete:"",
            },
            disabled:false
        }
    },
    mounted() {
        const obj = this;
        obj.axios({
            method:"get",
            url:"http://localhost:8081/user/findById/"+this.fromData.uid,
        }).then(function(respones){
            const ret = respones.data;
            if(ret.code==1){
                obj.fromData = ret.data
            }
        })
    },
    methods: {
        onSubmit(){
            const obj = this;
            this.axios({
                method:"put",
                url:"http://localhost:8081/user/modifyUser",
                data:this.fromData
            }).then(function(respones){
                const ret = respones.data;
                if(ret.code==1){
                    obj.$message({
                    message: '恭喜你，修改成功',
                    type: 'success'
                });

                // 延时跳转
                setTimeout(function(){
                obj.$router.push("/user/user-list")
                },1000)
                }else{
                    obj.$message.error('哎呀~出现了意料以外的问题呢~~');
                }
            })
        },
        existsName(){
              const obj = this;
            this.axios({
                method:"get",
                url:"http://localhost:8081/user/existsName/"+obj.fromData.username,
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
    },
}
</script>

<style lang="scss" scoped>
#box {
  margin: auto;
  width: 600px;
}
</style>