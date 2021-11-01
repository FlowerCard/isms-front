<template>
  <div id="box">
      <h2 style="text-align: center">修改设备</h2>
      <el-form ref="form" :model="fromData" label-width="80px">

            <el-input v-model="fromData.mid" type="hidden"></el-input>

         <el-form-item label="设备名称">
            <el-input v-model="fromData.mname"  @change="existsName()"></el-input>
        </el-form-item>

         <el-form-item label="所属设备" > 
            <el-select v-model="fromData.typeId" >
                <el-option v-for="item in typeNames" :key="item.typeId" :value="item.typeId" :label="item.typeName"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="所属工地">
            <el-select v-model="fromData.workId" >
                <el-option v-for="item1 in workNames" :key="item1.workId" :value="item1.workId" :label="item1.workName"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="是否在线">
            <el-radio-group v-model="fromData.isOnline">
            <el-radio :label="0" value="0">在线</el-radio>
            <el-radio :label="1" value="1">下线</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="是否启用">
            <el-radio-group v-model="fromData.isEnable">
            <el-radio :label="0" value="0">启用</el-radio>
            <el-radio :label="1" value="1">停用</el-radio>
            </el-radio-group>
        </el-form-item>

        <!-- <el-form-item label="设备状态">
            <el-radio-group v-model="fromData.isDelete">
            <el-radio :label="0" value="0">正常</el-radio>
            <el-radio :label="1" value="1">注销</el-radio>
            </el-radio-group>
        </el-form-item> -->

        <el-form-item>
            <el-button type="primary" :disabled="disabled" @click="onSubmit">提交</el-button>
            <el-button @click="qx">取消</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    data() {
        return {
            fromData:{
                mid:this.$route.params.mid,
                cityId:0
            },
            disabled:false,
            typeNames:[],            
            workNames:[],
            uid:0
        }
    },
    created(){
    var myuser = this.$store.getters.getUser;  
    this.uid = myuser.uid;
  },
    mounted() {
          //防止刷新后数据丢失
        window.addEventListener('unload', this.saveState);

        const obj = this;
        obj.axios({
            method:"get",
            url:"http://localhost:8081/machine/findById/"+this.fromData.mid,
        }).then(function(respones){
            const ret = respones.data;
            if(ret.code==1){
                obj.fromData = ret.data
            }
        }),

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
        onSubmit(){
            const obj = this;
            this.axios({
                method:"put",
                url:"http://localhost:8081/machine/modifyMachine",
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
                obj.$router.push("/machine/machine-list")
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
        },
        saveState() {
        // 模块化后，调用 state 的代码修改为 this.$store.state.myuser
        sessionStorage.setItem('userState', JSON.stringify(this.$store.state.myuser));
        },
        qx(){
             this.$router.push("/machine/machine-list")
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