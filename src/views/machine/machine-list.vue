<template>
<div>
  <el-row :gutter="20">
    <el-col :span="6">
      <div class="grid-content bg-purple">
          <el-input style="width:70%;margin-left:5px;" v-model="fuzzy" placeholder="根据设备名称搜索"></el-input>
          <el-button style="margin-left:2px;" type="primary" icon="el-icon-search" @click="getList()">搜索</el-button>
      </div>
    </el-col>
    <el-col :span="6">
      所属设备：
        <el-select v-model="typeId" placeholder="请选择" @change="getList()">
          <el-option label="请选择" value=""></el-option>
           <el-option v-for="item in typeNames" :key="item.typeId" :value="item.typeId" :label="item.typeName"></el-option>
        </el-select>
    </el-col>
    <el-col :span="6">
      所属工地：
        <el-select v-model="workId" placeholder="请选择" @change="getList()">
          <el-option label="请选择" value=""></el-option>
            <el-option v-for="item1 in workNames" :key="item1.workId" :value="item1.workId" :label="item1.workName"></el-option>
        </el-select>
    </el-col>
  </el-row>

    <el-table
    :data="tableData"
    border
    style="width: 100%"
    :header-cell-style="{textAlign: 'center'}"
    :default-sort = "{prop: 'mid', order: 'null'}">

    <el-table-column
      prop="mid"
      label="编号"
      width="80 "
      align="center"
      sortable>
    </el-table-column>

    <el-table-column
      prop="mname"
      label="设备名称"
      width="150"
      align="center">
    </el-table-column>

    <el-table-column
      prop="machineType.typeName"
      label="所属设备"
      width="120"
      align="center">
    </el-table-column>

      <el-table-column
      prop="worksite.workName"
      label="所属工地"
      width="120"
      align="center">
    </el-table-column>

     <el-table-column
      prop="createDate"
      label="创建时间"
      width="120"
      align="center"
      sortable>
    </el-table-column>

    <el-table-column
      prop="updateDate"
      label="修改时间"
      width="200"
       align="center"
      sortable>
    </el-table-column>

      <el-table-column
      prop="isOnline"
      label="是否在线"
      width="100"
      align="center">
      <template slot-scope="scope">
          <span v-if="scope.row.isOnline == 0">在线</span>
          <span v-if="scope.row.isOnline == 1">下线</span>
        </template>
    </el-table-column>

    <el-table-column
      prop="isEnable"
      label="是否启用"
      width="80"
      align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isEnable == 0">启动</span>
          <span v-if="scope.row.isEnable == 1">停用</span>
        </template>
    </el-table-column>

      <el-table-column
      prop="isDelete"
      label="类型状态"
      width="80"
      align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isDelete == 0">正常</span>
          <span v-if="scope.row.isDelete == 1">删除</span>
        </template>
    </el-table-column>

    <el-table-column label="操作" align="center">
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
        fuzzy:'',
        typeId:'',
        workId:'',
        typeNames:[],            
        workNames:[],
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
      saveState() {
      // 模块化后，调用 state 的代码修改为 this.$store.state.myuser
          sessionStorage.setItem('userState', JSON.stringify(this.$store.state.myuser));
        },
        getList(){
            var obj = this;
            this.axios({
                method:"get",
                url:"http://localhost:8081/machine/findAll/"+this.uid+"/"+this.listQuery.page+"/"
                +this.listQuery.limit
                +"?fuzzy="+this.fuzzy +"&typeId="+this.typeId + "&workId="+this.workId
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
               url:"http://localhost:8081/machine/removeMachine/"+mid
           }).then(function(respones){
              const ret = respones.data;
              if(ret.code == 1){
                obj.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                obj.getList();
              }else{
                 obj.$message.error('删除失败,请稍后重试！');
              }
                
           })
        }).catch(() => {
          obj.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        },
        // FuzzyQuery(){
        //   alert(this.fuzzy)

        // }
    },


  }
</script>

