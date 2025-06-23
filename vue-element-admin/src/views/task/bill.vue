<template>
  <div class="app-container" style="padding: 0; display: flex;">
    <div class="left" style="flex: 1; padding: 0;">
      <el-row :gutter="0" style="width: 100%; margin: 0;">
        <!-- 结果列表 -->
        <el-col :span="23" style="padding: 0;">
          <div style="display: flex; align-items: center; padding: 10px;">
            <label>任务名称： </label>
            <span style="margin-left: 50px; font-weight: bolder;">{{ task_info['task_name'] }}</span>
          </div>
          <div style="display: flex; align-items: center; padding: 10px;">
            <label>图纸 xxx 的工程量清单</label>
          </div>
          <!-- excel导出按钮 -->
           <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handleDownload">
              Export Excel
            </el-button>
          <!-- 清单表格 -->
          <el-table
            :data="table_data"
            style="width: 100%"
            border
            :row-class-name="tableRowClassName"
            @row-click="handleRowClick"
          >
            <!-- 第一列：分类名称 -->
            <el-table-column prop="category" label="类型" width="120">
              <template #default="{ row }">
                <span v-if="row.isMainCategory" class="main-category">
                  {{ row.category }}
                </span>
                <span v-else class="sub-category">
                  {{ row.category }}
                </span>
              </template>
            </el-table-column>

            <!-- 第二列：指标 -->
            <el-table-column prop="major" label="指标" width="150">
              <template #default="{ row }">
                <span v-if="row.isMainCategory" class="main-category">
                  {{ row.major }}
                </span>
                <span v-else class="sub-category">
                  {{ row.major }}
                </span>
              </template>
            </el-table-column>

            <!-- 第三列：详细指标 -->
            <el-table-column prop="minor" label="详细指标" width="150">
              <template #default="{ row }">
                <span v-if="row.isMainCategory" class="main-category">
                  {{ row.minor }}
                </span>
                <span v-else class="sub-category">
                  {{ row.minor }}
                </span>
              </template>
            </el-table-column>

            <!-- 第四列：值 -->
            <el-table-column prop="value" label="值" width="120">
              <template #default="{ row }">
                <span v-if="row.isMainCategory" class="main-category">
                  {{ row.value }}
                </span>
                <span v-else class="sub-category">
                  {{ row.value }}
                </span>
              </template>
            </el-table-column>
          </el-table>

        </el-col>
      </el-row>
    </div>
    <div class="right" style="flex: 1; padding: 0;">
      <!-- 结果示意图 -->
      <el-col :span="24" style="padding: 0;">
        <div style="width: 100%; display: flex; justify-content: center; align-items: center; padding: 10px;">
            <img :src="img_src" alt="示例图片" class="custom-image">
        </div>
      </el-col>
    </div>
  </div>
</template>

<style scoped>
.left {
  overflow: auto;
  flex: 1;
  float: left;
  width: 100%;
  height: 100%;
  word-wrap: break-word;
}

.right {
  overflow: auto;
  flex: 1;
  float: right;
  position: relative;
  width: 100%;
  height: 100%;
}

.app-container {
  display: flex;
  justify-content: space-between;
  height: 100vh;
  background: linear-gradient(to right, #e0f7fa, #f1f8e9);
}

.custom-image {
  width: 600px;
  height: 480px;
  border: none;
  background-color: #f0f0f0;
  border-radius: 10px;
}

.el-table{
  border-radius: 10px;
}

.engineering-table {
  margin: 20px;
}

/* 主分类行样式 */
.main-category {
  font-weight: bold;
}

/* 子分类行样式 */
.sub-category {
  padding-left: 20px;
}

/* 表格行样式 */
:deep(.main-category-row) {
  background-color: #f5f7fa;
}

:deep(.sub-category-row) {
  background-color: #ffffff;
}
</style>


<script>
import { getServerUrl } from '@/utils'
import img_tmp from '@/assets/pics/tmp.jpg'
import axios from 'axios'

export default {
  name: 'BillComponent',
  props: ['user_id', 'task_id'],
  computed: {
    // 使用计算属性来访问路由参数
    userId() {
      this.user_id = this.$route.params.user_id
      return this.$route.params.user_id
    },
    taskId() {
      this.task_id = this.$route.params.task_id
      return this.$route.params.task_id
    }
  },
  data() {
    return {
      user_id: '',
      task_id: '',
      img_src_tmp: img_tmp,
      img_src: '',
      bill_tmp: {
        "区域": {
          "整体户型面积/m²": 0,
          "房间区域面积/m²": 0,
          "房间数量": 0,
        },
        "结构图元": {
          "门": {
            "单开门": 0,
            "双开门": 0,
            "推拉门": 0,
          },
          "窗": 0, 
        },
        "功能图元": {
          "灯": 0,
          "开关": 0,
          "电器": 0,
        },
      },
      bill: {},
      table_data: [],
      downloadLoading: false,
      autoWidth: true,
      bookType: 'xlsx',
    }
  },
  created() { // 初始化函数
    this.doInit()
  },
  methods: {
    doInit() {
      console.log('Here is bill doInit.')
      // this.table_data = this.convertBillToTableData(this.bill)
      const formData = new FormData()
      formData.append('task_id', this.task_id)
      axios.post(getServerUrl() + '/query_task', formData) // 根据task_id查询task信息
        .then(response => {
          this.task_info = response.data
          console.log('task info:', this.task_info['drawing_name'], this.task_info['task_type'])
          this.getTaskInfo3()
        }).catch(error => {
          console.error('Error in get drawing name:', error)
        })
    },
    getTaskInfo3() {
      console.log('Here is getTaskInfo3.')
      // 准备请求数据
      const formData1 = new FormData()
      formData1.append('task_id', this.task_info['task_id'])
      formData1.append('drawing_name', this.task_info['drawing_name'])
      // 获取显示图像
      axios.post(getServerUrl() + '/get-image', formData1, { responseType: 'arraybuffer' }).then(response => {
        const blob = new Blob([response.data], { type: 'img_home/png' })
        this.img_src = URL.createObjectURL(blob)
        // 获取输出结果
        axios.post(getServerUrl() + '/get-bill', formData1).then(response => {
          let data = response.data
          this.bill = data
          this.table_data = this.convertBillToTableData(this.bill)
        }).catch(error => {
          console.error('Error in get bill:', error)
        })
      }).catch(error => {
          console.error('Error in get image:', error)
      })
    },
    isPlainObject(obj) {
      return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
    },
    // 为行添加 className，便于样式控制
    tableRowClassName({ row }) {
      return row.isMainCategory ? "main-category-row" : "sub-category-row";
    },
    convertBillToTableData(bill) {
      let table_data = []
      if (bill == null) {
        return
      }
      Object.entries(bill).forEach(([category, value1]) => {
        table_data.push({
          category: category,
          major: "",
          minor: "",
          value: "",
          isMainCategory: true,
        })
        Object.entries(value1).forEach(([major, value2]) => {
          if (!this.isPlainObject(value2)) {
            table_data.push({
              category: "",
              major: major,
              minor: "",
              value: value2,
              isMainCategory: false,
            })
          } else {
            Object.entries(value2).forEach(([minor, value3]) => { 
              table_data.push({ 
                category: "",
                major: major,
                minor: minor,
                value: value3,
                isMainCategory: false,
              })
            })
          }
        })
      })
      return table_data
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['类型', '指标', '详细指标', '值']
        const filterVal = ['category', 'major', 'minor', 'value']
        const list = this.table_data
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '工程量清单导出-' + this.task_name,    // 不需要加后缀
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    handleRowClick(row, column, event) {
      console.log('row:', row)    // 序号从0开始
      let major = table_data[row]['major']
      let task_type = ''
      if (major === '') {
      } else if (major.includes('房间') || major.includes('区域') || major.includes('户型')) {
        task_type = 'Area'
      } else if (major.includes('门')) {
        task_type = 'Door'
      } else if (major.includes('窗')) {
        task_type = 'Window'
      } else if (major.includes('灯')) {
        task_type = 'Legend-Light'
      } else if (major.includes('给排水')) {
        task_type = 'Legend-Water'
      } else {
        this.$notify({
          title: 'Error',
          message: '出现未知的major选项 ' + major,
          type: 'error',
          duration: 2000
        })
      }
      if (task_type !== '') {
        this.$router.push({path: `/task/result/${1}/${row.task_id}/${task_type}`})
      }
    },
    getFileName(fileName) {
      // 查找最后一个"."的位置
      const dotIndex = fileName.lastIndexOf('.')
      // 如果没有找到"." 或者 "." 是在第一个位置（这通常意味着文件名本身就是扩展名，比如 ".txt" 文件）
      if (dotIndex === -1 || dotIndex === 0) {
        return fileName
      }
      // 获取无后缀的文件名
      const name = fileName.substring(0, dotIndex)
      return name
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
  }
}
</script>
