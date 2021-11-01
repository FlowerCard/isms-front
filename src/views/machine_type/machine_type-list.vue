<template>
<div>
  <el-row :gutter="20">
    <el-col :span="6">
      <span style="margin-left:5px;">所属设备：</span>
        <el-select  v-model="typeId" placeholder="请选择" @change="getList()">
          <el-option label="请选择" value=""></el-option>
           <el-option v-for="item in typeNames" :key="item.typeId" :value="item.typeId" :label="item.typeName"></el-option>
        </el-select>
    </el-col>
  </el-row>

    <el-table
    :data="tableData"

    style="width: 100%"
    :header-cell-style="{textAlign: 'center'}"
    :default-sort = "{prop: 'typeId', order: 'null'}">

    <el-table-column
      prop="typeId"
      label="编号"
      width="120"
      align="center"
      sortable>
    </el-table-column>

    <el-table-column
      prop="typeName"
      label="类型名称"
      width="600"
      align="center">
    </el-table-column>
      <!-- <el-table-column
      prop="password"
      label="密码"
      width="120">
    </el-table-column> -->

    <el-table-column
      prop="isDelete"
      label="类型状态"
      width="120"
      align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isDelete == 0">正常</span>
          <span v-if="scope.row.isDelete == 1">删除</span>
        </template>
    </el-table-column>

    <template v-if="isAdmin == 1">
      <el-table-column label="操作" align="center">
          <template slot-scope="scope">
              <el-button type="primary" plain @click="toUpdateUser(scope.row.typeId)">修改</el-button>
              <el-button type="danger" plain @click="deleteUser(scope.row.typeId)">删除</el-button>
        </template>
      </el-table-column>
    </template>

  </el-table>
            <pagination
    :total="total"
    :page.sync="listQuery.page"
    :limit.sync="listQuery.limit"
    @pagination="getList" />
</div>
  

</template>

<script>
import Pagination from '@/components/Pagination'
  export default {
        components: { Pagination },
    data() {
      return {
        tableData: [],
        total: 0,
        listQuery: {
            page: 1,
            limit: 10
        },
         typeNames:[], 
         typeId:''
      }
    },
    created(){
    var myuser = this.$store.getters.getUser;  
    this.isAdmin = myuser.isAdmin;
  },
    mounted() {
      window.addEventListener('unload', this.saveState);
        this.getList();
              const obj = this;

       obj.axios({
            method:"get",
            url:"http://localhost:8081/machine/findTypeName",
        }).then(function(respones){
            const ret = respones.data;
            if(ret.code==1){
                obj.typeNames = ret.data
            }
        })
    },
    methods: {
        getList(){
            var obj = this;
            this.axios({
                method:"get",
                url:"http://localhost:8081/type/findAll/"+this.listQuery.page+"/"+this.listQuery.limit+"?typeId="+this.typeId
            }).then(function(response){
                 var result = response.data;
                 if(result.code == 1){
                    obj.tableData = result.data.list;
                    obj.total = result.data.total;
                 }else{
                     console.log("请求数据失败")
                 }
    
            })
        },
        toUpdateUser(typeId){
            this.$router.push("/machine_type/machine_type-update/"+typeId)
        },
        deleteUser(typeId){
        const obj = this;
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.axios({
               method:"delete",
               url:"http://localhost:8081/type/removeMachineType/"+typeId
           }).then(function(respones){
              const ret = respones.data;
              if(ret.code == 1){
                obj.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                obj.getList();
              }else{
                 obj.$message.error('该类型存在关联项目,不能删除！');
              }
                
           })
        }).catch(() => {
          obj.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        },
      saveState() {
      // 模块化后，调用 state 的代码修改为 this.$store.state.myuser
      sessionStorage.setItem('userState', JSON.stringify(this.$store.state.myuser));
    }
    },


  }
</script>