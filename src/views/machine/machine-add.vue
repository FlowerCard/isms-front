<template>
  <div id="box">
      <h2 style="text-align: center">添加设备</h2>
      <el-form :model="fromData" status-icon :rules="rules" ref="fromData" label-width="100px" class="demo-fromData">

        
        <el-form-item label="设备名称" prop="mname">
            <el-input v-model="fromData.mname" autocomplete="off" @change="existsName()"></el-input>
        </el-form-item>

         <el-form-item label="所属设备" prop="typeId"> 
            <el-select v-model="fromData.typeId" placeholder="请选择">
                <el-option v-for="item in typeNames" autocomplete="off" :key="item.typeId" :value="item.typeId" :label="item.typeName"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="所属工地" prop="workId">
            <el-select v-model="fromData.workId" placeholder="请选择">
                <el-option v-for="item1 in workNames" autocomplete="off" :key="item1.workId" :value="item1.workId" :label="item1.workName"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="是否在线" prop="isOnline">
            <el-radio-group v-model="fromData.isOnline" autocomplete="off">
            <el-radio :label="0" value="0">在线</el-radio>
            <el-radio :label="1" value="1">下线</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="是否启用" prop="isEnable">
            <el-radio-group v-model="fromData.isEnable" autocomplete="off">
            <el-radio :label="0" value="0">启用</el-radio>
            <el-radio :label="1" value="1">停用</el-radio>
            </el-radio-group>
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
        },
        disabled:false,
        rules: {
           mname: [
            {required: true, message: '请输入设备名称', trigger: 'blur' }
          ],
           typeId: [
            {required: true, message: '请选择设备类型', trigger: 'blur' }
          ],
           workId: [
            {required: true, message: '请输请选择所属工地', trigger: 'blur' }
          ],
           isOnline: [
            {required: true, message: '请选择是否在线', trigger: 'blur' }
          ],
           isEnable: [
            {required: true, message: '请选择是否启用', trigger: 'blur' }
          ]


        },
        typeNames:[],            
        workNames:[],
        
      };
    },
    mounted() {
      const obj = this;
       obj.axios({
            method:"get",
            url:"http://localhost:8081/machine/findTypeName",
        }).then(function(respones){
            const ret = respones.data;
            if(ret.code==1){
                obj.typeNames = ret.data
            }
        }),

        obj.axios({
            method:"get",
            url:"http://localhost:8081/machine/findWorksiteNames",
        }).then(function(respones){
            const ret = respones.data;
            if(ret.code==1){
                obj.workNames = ret.data
            }
        })
    },
    methods: {
      submitForm(formName) {
         this.$refs[formName].validate((valid) => {
          if (valid) {
              const obj = this;
          this.axios({
              method:"post",
              url:"http://localhost:8081/machine/addMachine",
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
                obj.$router.push("/machine/machine-list")
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
        console.log(obj.fromData.typeName);
        this.axios({
            method:"get",
            url:"http://localhost:8081/machine/existsName/"+obj.fromData.mname,
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