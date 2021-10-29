<template>
<div>
    <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      prop="mid"
      label="mid"
      width="60">
    </el-table-column>
    <el-table-column
      prop="mname"
      label="设备名称"
      width="150">
    </el-table-column>

    <el-table-column
      prop="machineType.typeName"
      label="所属设备"
      width="120">
    </el-table-column>

      <el-table-column
      prop="worksite.workName"
      label="所属工地"
      width="120">
    </el-table-column>

     <el-table-column
      prop="createDate"
      label="创建时间"
      width="120">
    </el-table-column>

    <el-table-column
      prop="updateDate"
      label="修改时间"
      width="200">
    </el-table-column>

      <el-table-column
      prop="isOnline"
      label="是否在线"
      width="100">
      <template slot-scope="scope">
          <span v-if="scope.row.isOnline == 0">在线</span>
          <span v-if="scope.row.isOnline == 1">下线</span>
        </template>
    </el-table-column>

    <el-table-column
      prop="isEnable"
      label="是否启用"
      width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.isEnable == 0">启动</span>
          <span v-if="scope.row.isEnable == 1">停用</span>
        </template>
    </el-table-column>

      <el-table-column
      prop="isDelete"
      label="类型状态"
      width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.isDelete == 0">正常</span>
          <span v-if="scope.row.isDelete == 1">删除</span>
        </template>
    </el-table-column>

    <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button type="primary" plain @click="toUpdate(scope.row.mid)">修改</el-button>
            <el-button type="danger" plain @click="toDelete(scope.row.mid)">删除</el-button>
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
        uid:0,
        value:'0',
      }
    },
    created(){
    //关键！！！：从浏览器缓存中获取myuser对象中的id值
    var myuser = this.$store.getters.getUser;  
    this.uid = myuser.uid;
  },
    mounted() {
        this.getList();
        //防止刷新后数据丢失
      window.addEventListener('unload', this.saveState);
    },
    methods: {
      saveState() {
      // 模块化后，调用 state 的代码修改为 this.$store.state.myuser
          sessionStorage.setItem('userState', JSON.stringify(this.$store.state.myuser));
        },
        getList(){
            var obj = this;
            this.axios({
                method:"get",
                url:"http://localhost:8081/machine/findAll/"+this.uid+"/"+this.listQuery.page+"/"+this.listQuery.limit
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
        toUpdate(mid){
            this.$router.push("/machine/machine-update/"+mid)
        },
        toDelete(mid){
        const obj = this;
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.axios({
               method:"delete",
               url:"http://localhost:8081/type/removeMachineType/"+mid
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
        }
    },


  }
</script>