<template>
  <div class="app-container">
    <el-table
      :data="form"
      style="width: 100%"
      fit
      highlight-current-row>
      <el-table-column
          prop="task_id"
          label="任务ID"
          width="360"
          align="center">
          <template slot-scope="{row}">
          <span>{{ row.task_id }}</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="create_time"
          label="提交时间"
          width="250"
          align="center">
          <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="task_name"
          label="任务名称"
          width="300"
          align="center">
          <template slot-scope="{row}">
          <span>{{ row.task_name }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column
          prop="status"
          label="状态"
          width="100"
          align="center">
          <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ displayStatus(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="operate"
          label="操作"
          width="230"
          align="center">
          <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleShow(row)">
            查看
          </el-button>
          <!--      根据老师提示，去掉删除按钮选项
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
          -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import axios from 'axios';
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        sucess: 'success',
        processing: 'info',
        fail: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      form: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['已完成', '处理中', '处理失败'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: '已完成'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList0() {
      this.listLoading = true

      const formData = new FormData();
      formData.append('user_id', 1);
      axios.post('http://localhost:5000/query_task_list', formData)
        .then(response => {
          this.form = response.data;
          console.log(this.form)
        })
        .catch(error => {
          console.error('There was an error:', error);
        });
    },
    getList() {
      this.listLoading = true

      const formData = new FormData()
      formData.append('user_id', 1)
      formData.append('page', this.listQuery.page)
      formData.append('limit', this.listQuery.limit)
      axios.post('http://localhost:5000/query_task_list2', formData)
        .then(response => {
          console.log('response:', response.data)
          this.form = response.data['form']
          console.log(response.data['form'])
          console.log(response.data['total'])
          console.log(this.form)
          this.total = response.data['total']
          console.log('form:', this.form)
          console.log('total:', this.total)
        })
        .catch(error => {
          console.error('There was an error:', error);
        });
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: '已完成',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleShow(row) {
      console.log('here is handle show, task_id:', row.task_id)
      // this.$router.push({path: '/result', params: {user_id: 1, task_id: row.task_id}})
      // this.$router.push({path: `/result/${1}/${row.task_id}`})

      // 做判别，任务执行完毕才可查看
      const formData = new FormData()
      formData.append('task_id', row.task_id)
      axios.post('http://localhost:5000/query_task', formData)     // 根据task_id查询task信息
        .then(response => {
          this.task_info = response.data
          console.log('task drawing name:', this.task_info['drawing_name'])
          console.log('task status:', this.task_info['status'])
          let status = this.task_info['status']
          if (status == 'sucess') {
            this.$router.push({path: `/result/${1}/${row.task_id}`})
          } else if (status == 'fail') {
            this.$notify({
              title: 'Error',
              message: '任务执行失败，请重新提交任务。',
              type: 'error',
              duration: 2000
            })
          } else if (status == 'processing') {
            this.$notify({
              title: 'Error',
              message: '任务未完成，请继续等待。',
              type: 'error',
              duration: 2000
            })
          } else {
            this.$notify({
              title: 'Error',
              message: '任务状态未知，请继续等待。',
              type: 'error',
              duration: 2000
            })
          }
        })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      console.log('here is handle delete, task_id:', row.task_id)
      // this.$router.push({path: '/result', params: {user_id: 1, task_id: row.task_id}})
      // this.$router.push({path: `/result/${1}/${row.task_id}`})

      // 做判别，任务执行完毕才可查看
      const formData = new FormData()
      formData.append('task_id', row.task_id)
      axios.post('http://localhost:5000/delete_task', formData)
        .then(response => {
          let msg = response.data['message']
          console.log('delete task msg:', msg)
          if (msg == 'delete succeed') {
            this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
            })
            window.location.reload()
          } else {
            this.$notify({
              title: 'Error',
              message: '删除失败。',
              type: 'error',
              duration: 2000
            })
          }
        })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    displayStatus(status) {
      switch (status) {
        case 'sucess':
          return '成功'
        case 'fail':
          return '失败'
        case 'processing':
          return '处理中'
        default:
          return '未知'
      }
    }
  }
}
</script>
