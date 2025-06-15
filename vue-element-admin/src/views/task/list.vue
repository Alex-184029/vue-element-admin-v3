<template>
<div class="dashboard-editor-container">
  <el-col class="panel-group">
    <!-- 头部，检索、排序 -->
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="标题" style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="类型" clearable class="filter-item" style="width: 130px; margin-left: 5px;" @change="handleFilter">
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px; margin-left: 5px;" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 40px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        上传新任务
      </el-button>
    </div>

    <!-- 任务列表显示 -->
    <el-row class="card-panel" v-for="(row, index) in form" :key="index">
      <el-col :span="6">
        <div class="card-panel-icon-wrapper icon-people">
          <!-- <svg-icon icon-class="peoples" class-name="card-panel-icon" /> -->
          <!-- <template slot-scope="row">
            <img class="card-panel-image" :src="row.img_src">
          </template> -->
          <img class="card-panel-image" :src="'data:image/jpg;base64,' + row.img_base64">
        </div>
      </el-col>
      <el-col :span="16">
        <div class="card-panel-description">
          <div class="card-panel-num">{{ row.task_name }}</div>
          <div class="card-panel-text">{{ row.task_id }}</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card-panel-time">{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</div>
      </el-col>
      <el-col :span="8">
        <!-- <div class="card-panel-status">{{ row.task_status }}</div> -->
        <el-tag :type="row.status | statusFilter" class="card-panel-status">{{ displayStatus(row.status) }}</el-tag>
      </el-col>
      <el-col :span="3">
        <div class="card-panel-button">
          <el-button type="success" size="medium" @click="handleShow(row)">
              查看
          </el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 分页器 -->
    <pagination class="panel-pagination" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"/>
  </el-col>
</div>
</template>

<script>

import { getServerUrl } from '@/utils'
import Pagination from '@/components/Pagination'
import axios from 'axios'

import pic1 from '@/assets/pics/1.png'
import pic2 from '@/assets/pics/2.png'
import pic3 from '@/assets/pics/3.png'
import pic4 from '@/assets/pics/4.png'

export default {
  name: 'TaskListComponent',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        sucess: 'success',
        processing: 'info',
        fail: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      src1: pic1,
      src2: pic2,
      src3: pic3,
      src4: pic4,
      task_info: {
        task_name: '图纸plan_2的门识别',
        task_id: '0553b76d-c21d-4d02-a273-fb713dda3459',
        task_status: '处理中',
        create_time: 'Fri Aug 02 2024 15:53:30'
      },

      form: [],
      total: 0,
      // listLoading: true,      // 参数没用到吧
      listQuery: {
        page: 1,
        limit: 10,
        title: '',
        type: 'All',
        sort: '-time'
      },
      sortOptions: [{ label: '时间降序', key: '-time' }, { label: '时间升序', key: '+time' }],
      typeOptions: [
        { key: 'All', label: '所有类型' },
        { key: 'Door', label: '门识别' },
        { key: 'Window', label: '窗识别' },
        { key: 'Other', label: '其它' }
      ],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    getList() {
      console.log('here is getList function')
      console.log('title:', this.listQuery.title, 'type:', this.listQuery.type, 'sort:', this.listQuery.sort)
      const formData = new FormData()
      formData.append('user_id', 1)     // 暂时使用默认用户
      formData.append('page', this.listQuery.page)
      formData.append('limit', this.listQuery.limit)
      formData.append('title', this.listQuery.title)
      formData.append('type', this.listQuery.type)
      formData.append('sort', this.listQuery.sort)
      axios.post(getServerUrl() + '/query_task_list3', formData)
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
          console.error('Error in getList:', error)
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      // console.log('here is getList function')
      // console.log('title:', this.listQuery.title)
      // console.log('type:', this.listQuery.type)
      // console.log('sort:', this.listQuery.sort)
      this.getList()
    },
    handleCreate() {
      console.log('Here is handleCreate function.')
      this.$router.push({path: `/task/create`})
    },
    handleShow(row) {
      console.log('here is handle show, task_id:', row.task_id)
      // this.$router.push({path: '/result', params: {user_id: 1, task_id: row.task_id}})
      // this.$router.push({path: `/result/${1}/${row.task_id}`})

      // 做判别，任务执行完毕才可查看
      const formData = new FormData()
      formData.append('task_id', row.task_id)
      axios.post(getServerUrl() + '/query_task', formData)     // 根据task_id查询task信息
        .then(response => {
          this.task_info = response.data
          console.log('task drawing name:', this.task_info['drawing_name'])
          console.log('task status:', this.task_info['status'])
          let status = this.task_info['status']
          if (status == 'sucess') {
            // this.$router.push({path: `/result/${1}/${row.task_id}`})
            this.$router.push({path: `/task/result/${1}/${row.task_id}`})
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
    handleDelete(row, index) {
      console.log('here is handle delete, task_id:', row.task_id)
      // this.$router.push({path: '/result', params: {user_id: 1, task_id: row.task_id}})
      // this.$router.push({path: `/result/${1}/${row.task_id}`})

      // 做判别，任务执行完毕才可查看
      const formData = new FormData()
      formData.append('task_id', row.task_id)
      axios.post(getServerUrl() + '/delete_task', formData)
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

<style lang="scss" scoped>
.panel-group {
  margin-top: 5px;
  padding: 15px;

  .card-panel-row {
    margin-bottom: 15px;
    padding: 15px;
  }

  .card-panel {
    // flex布局设置
    display: flex;
    justify-content: space-between;

    margin-bottom: 18px;

    height: 100px;
    width: 85%;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      // float: left;
      font-size: 48px;
    }
    
    .card-panel-image {
      width: 60px;
      height: 60px;
    }

    .card-panel-description {
      // float: right;
      font-weight: bold;
      margin-top: 28px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-top: 15px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
    .card-panel-time {
      margin-top: 45px;
      font-weight: bold;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 12px;
    }

    .card-panel-status {
      margin-top: 45px;
      font-weight: bold;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      margin-bottom: 12px;
    }

    .card-panel-button {
      margin-top: 38px;
      font-weight: bold;
      font-size: 20px;
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
.dashboard-editor-container {
  padding: 32px;
  // background-color: rgb(240, 242, 245);
  background: linear-gradient(to right, #e0f7fa, #f1f8e9);
  width: 100%;
  display: flex;
  flex-direction: column;
}
.panel-pagination {
  width: 85%;
}
.filter-container {
  margin-bottom: 25px;
}
</style>
