<template>
<div>
  <el-row :gutter="20">
    <el-col :span="6">
      <div class="grid-content bg-purple">
          <el-input style="width:70%;margin-left:5px;" v-model="fuzzy" placeholder="根据用户名称搜索"></el-input>
          <el-button style="margin-left:2px;" type="primary" icon="el-icon-search" @click="getList()">搜索</el-button>
      </div>
    </el-col>
    <el-col :span="6">
      <span>身份:</span>
        <el-select v-model="uid" placeholder="请选择" @change="getList()">
          <el-option label="请选择" value=""></el-option>
           <el-option v-for="item in typeNames" :key="item.uid" :value="item.uid" :label="item.label"></el-option>
        </el-select>
    </el-col>
  </el-row>

    <el-table
    :data="tableData"
    :header-cell-style="{textAlign: 'center'}"
    :default-sort = "{prop: 'uid', order: 'null'}"
    border
    style="width: 100%">

    <el-table-column
    sortable
    align="center"
      prop="uid"
      label="编号"
      width="120">
    </el-table-column>

    <el-table-column
    align="center"
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
    align="center"
      prop="isAdmin"
      label="身份"
      width="120">
      <template slot-scope="scope">
          <span v-if="scope.row.isAdmin == 0">员工</span>
          <span v-if="scope.row.isAdmin == 1">管理员</span>
        </template>
    </el-table-column>

        <el-table-column
        align="center"
      prop="isDelete"
      label="用户状态"
      width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.isDelete == 0">正常</span>
          <span v-if="scope.row.isDelete == 1">删除</span>
        </template>
    </el-table-column>
    
    <el-table-column label="操作" align="center">
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
        },
        uid:'',
        fuzzy:'',
        typeNames:[
          {
            uid: '0',
            label: '员工'
          },
          {
            uid: '1',
            label: '管理员'
          }
          ]
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
                +"?fuzzy="+this.fuzzy+"&uid="+this.uid
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