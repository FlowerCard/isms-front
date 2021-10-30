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
    <el-table 
      :data="cityList" 
      style="width: 100%" 
      max-height="1000" 
      :header-cell-style="{textAlign: 'center'}"
      :default-sort = "{prop: 'cityId', order: 'null'}"
      >
      <el-table-column fixed prop="cityId" label="编号" width="400" sortable align="center" />
      <el-table-column prop="cityName" label="地区名称" width="600" align="center" />
      <template v-if="isAdmin == 1">
        <el-table-column fixed="right" label="操作" width="500" align="center" >
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              @click="modifyUser(scope.row.cityId)"
            >修改</el-button>
            <el-button
              type="danger"
              plain
              @click="removeUser(scope.row.cityId)"
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
      cityList: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      searchName: '',
      isAdmin:'',
      cityId: '',
      options: null
    }
  },
  created(){
    //关键！！！：从浏览器缓存中获取myuser对象中的id值
    var myuser = this.$store.getters.getUser;
    this.isAdmin = myuser.isAdmin;

  },
  mounted() {
    //防止刷新后数据丢失
    window.addEventListener('unload', this.saveState);
    var obj = this
    this.axios({
      method: 'GET',
      url:
        'http://localhost:8081/city/cities/' +
        obj.listQuery.page +
        '/' +
        obj.listQuery.limit + "?searchName=" + obj.searchName + "&cityId=" + obj.cityId
    }).then(function(res) {
      var result = res.data
      if (result.code == 1) {
        obj.cityList = result.data.list
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
    getList() {
      // 获取数据
      var obj = this
      this.axios({
        method: 'GET',
        url:
          'http://localhost:8081/city/cities/' +
          obj.listQuery.page +
          '/' +
          obj.listQuery.limit + "?searchName=" + obj.searchName + "&cityId=" + obj.cityId
      }).then(function(res) {
        var result = res.data
        obj.cityList = result.data.list
        obj.total = result.data.total
      })
    },
    modifyUser(cityId) {
      this.$router.push('/city/modifyCity/' + cityId)
    },
    removeUser(cityId) {
      var obj = this
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          obj.axios({
            method: 'delete',
            url: 'http://localhost:8081/city/city/' + cityId
          }).then(function(response) {
            var flag = response.data
            if (flag) {
                obj.$message({
                message: '删除成功',
                type: 'success'
                })
                obj.getList()
            } else {
                obj.$message.error('删除失败')
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
