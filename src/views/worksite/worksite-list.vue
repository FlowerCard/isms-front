<template>
  <div>
    <el-row :gutter="20">
        <el-col :span="6">
            <div class="grid-content">
                <el-input
                    placeholder="请输入内容"
                    v-model="searchName"
                    style="width:300px;margin-left:10px"
                    clearable>
                </el-input>
                <el-button type="primary" icon="el-icon-search" @click="getList()">搜索</el-button>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="grid-content">
                工地地区：
                <el-select v-model="cityId" placeholder="请选择" @change="getList()">
                    <el-option label="请选择" value=""></el-option>
                    <el-option
                        v-for="item in options"
                        :key="item.cityId"
                        :label="item.cityName"
                        :value="item.cityId">
                    </el-option>
                </el-select>
            </div>
        </el-col>
        <!-- <el-col :span="6"><div class="grid-content bg-purple"></div></el-col> -->
        <!-- <el-col :span="6"><div class="grid-content bg-purple"></div></el-col> -->
    </el-row>
    <el-table :data="worksiteList" style="width: 100%" max-height="1000" :default-sort = "{prop: 'workId', order: 'null'}">
      <el-table-column fixed prop="workId" label="编号" width="150" sortable align="center" />
      <el-table-column prop="workName" label="工地名称" width="200" align="center" />
      <el-table-column prop="city.cityName" label="工地地区" width="200" align="center" />
      <el-table-column prop="createTime" label="开工时间" width="200" sortable align="center" />
      <el-table-column prop="updateTime" label="更新时间" width="220" sortable align="center" />
      <el-table-column prop="workAddr" label="工地地址" width="500" align="center" />
      <template v-if="isAdmin == 1">
        <el-table-column fixed="right" label="操作" width="200" align="center" >
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              @click="modifyUser(scope.row.workId)"
            >修改</el-button>
            <el-button
              type="danger"
              plain
              @click="removeUser(scope.row.workId)"
            >删除</el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      worksiteList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      uid:0,
      isAdmin:'',
      searchName: '',
      cityId: '',
      options: []
    }
  },
  created(){
    //关键！！！：从浏览器缓存中获取myuser对象中的id值
    var myuser = this.$store.getters.getUser;  
    this.uid = myuser.uid;
    this.isAdmin = myuser.isAdmin;

  },
  mounted() {
    //防止刷新后数据丢失
    window.addEventListener('unload', this.saveState);
    var obj = this
    this.axios({
      method: 'GET',
      url:
        'http://localhost:8081/worksite/worksites/' + obj.uid +
         "/" +
        obj.listQuery.page +
        '/' +
        obj.listQuery.limit + "?searchName=" + obj.searchName + "&cityId=" + obj.cityId
    }).then(function(res) {
      var result = res.data
      if (result.code == 1) {
        obj.worksiteList = result.data.list
        obj.total = result.data.total
      } else {
          alert(result.message)
      }
      
    })
    this.axios({
      method: 'GET',
      url: 'http://localhost:8081/city/cities'
    }).then(function(res) {
      var result = res.data
      if (result.code == 1) {
        obj.options = result.data
      } else {
          alert(result.message)
      }
      
    })
  },
  methods: {
    saveState() {
      // 模块化后，调用 state 的代码修改为 this.$store.state.myuser
      sessionStorage.setItem('userState', JSON.stringify(this.$store.state.myuser));
    },
    getList() {
      // 获取数据
      var obj = this
      this.axios({
        method: 'GET',
        url:
        'http://localhost:8081/worksite/worksites/' + obj.uid +
         "/" +
        obj.listQuery.page +
        '/' +
        obj.listQuery.limit + "?searchName=" + obj.searchName + "&cityId=" + obj.cityId
      }).then(function(res) {
        var result = res.data
        obj.worksiteList = result.data.list
        obj.total = result.data.total
      })
    },
    modifyUser(workId) {
      this.$router.push('/worksite/modifyWorksite/' + workId)
    },
    removeUser(workId) {
      var obj = this
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          obj.axios({
            method: 'delete',
            url: 'http://localhost:8081/worksite/' + workId
          }).then(function(response) {
            var result = response.data
            var flag = result.data
            if (flag) {
                obj.$message({
                message: result.message,
                type: 'success'
                })
                obj.getList()
            } else {
                obj.$message.error(result.message)
            }
          })
        })
        .catch(() => {
          obj.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
