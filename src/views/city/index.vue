<template>
  <div>
    <el-table :data="cityList" style="width: 100%" max-height="1000">
      <el-table-column fixed prop="cityId" label="编号" width="150" />
      <el-table-column prop="cityName" label="地区名称" width="600" />
      <el-table-column fixed="right" label="操作" width="500">
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
      }
    }
  },
  mounted() {
    var obj = this
    this.axios({
      method: 'GET',
      url:
        'http://localhost:8081/city/cities/' +
        obj.listQuery.page +
        '/' +
        obj.listQuery.limit
    }).then(function(res) {
      var result = res.data
      if (result.code == 1) {
        obj.cityList = result.data.list
        obj.total = result.data.total
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
          obj.listQuery.limit
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
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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
