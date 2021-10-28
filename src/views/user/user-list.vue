<template>
<div>
    <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="uid"
      label="uid"
      width="120">
    </el-table-column>
    <el-table-column
      prop="username"
      label="姓名"
      width="600">
    </el-table-column>
      <!-- <el-table-column
      prop="password"
      label="密码"
      width="120">
    </el-table-column> -->
    
    <el-table-column
      prop="isAdmin"
      label="身份"
      width="120">
      <template slot-scope="scope">
          <span v-if="scope.row.isAdmin == 0">员工</span>
          <span v-if="scope.row.isAdmin == 1">管理员</span>
        </template>
    </el-table-column>
        <el-table-column
      prop="isDelete"
      label="用户状态"
      width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.isDelete == 0">正常</span>
          <span v-if="scope.row.isDelete == 1">删除</span>
        </template>
    </el-table-column>
    <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button type="primary" plain @click="toUpdateUser(scope.row.uid)">修改</el-button>
            <el-button type="danger" plain @click="deleteUser(scope.row.uid)">删除</el-button>
       </template>
    </el-table-column>

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
        }
      }
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList(){
            var obj = this;
            this.axios({
                method:"get",
                url:"http://localhost:8081/user/findAll/"+this.listQuery.page+"/"+this.listQuery.limit
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
        toUpdateUser(uid){
            this.$router.push("/user/update-user/"+uid)
        },
        deleteUser(uid){
        const obj = this;
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.axios({
               method:"delete",
               url:"http://localhost:8081/user/removeUserById/"+uid
           }).then(function(respones){
                obj.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                obj.getList();
           })
        }).catch(() => {
          obj.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        }
    },


  }
</script>