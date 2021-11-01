<template>
  <div id="box">
      <h2 style="text-align: center">修改设备类型名称</h2>
      <el-form ref="form" :model="fromData" label-width="120px">

            <el-input v-model="fromData.typeId" type="hidden"></el-input>

         <el-form-item label="设备类型名称">
            <el-input v-model="fromData.typeName"  @change="existsName()"></el-input>
        </el-form-item>

        <!-- <el-form-item label="设备类型状态">
            <el-radio-group v-model="fromData.isDelete">
            <el-radio :label="1" value="1">注销</el-radio>
            <el-radio :label="0" value="0">正常</el-radio>
            </el-radio-group>
        </el-form-item> -->

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
                typeId:this.$route.params.typeId,
                typeName:"",
                isDelete:""
            },
            disabled:false
        }
    },
    mounted() {
        const obj = this;
        obj.axios({
            method:"get",
            url:"http://localhost:8081/type/findById/"+this.fromData.typeId,
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
                url:"http://localhost:8081/type/modifyMachineType",
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
                obj.$router.push("/machine_type/machine_type-list")
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
    },
}
</script>

<style lang="scss" scoped>
#box {
  margin: auto;
  width: 600px;
}
</style>