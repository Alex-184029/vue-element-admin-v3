<template>

  <div class="app-container" style="padding: 0; display: flex;">
    <div class="left" style="flex: 1; padding: 0;">
      <el-row :gutter="0" style="width: 100%; margin: 0;">
        <!-- 结果列表 -->
        <el-col :span="24" style="padding: 0;">
          <div style="display: flex; align-items: center; padding: 10px;">
            <label>图元统计结果：</label>
            <el-select v-model="recognitionType" placeholder="请选择识别类型" style="margin-left: 20px; width: 150px;">
              <el-option label="窗识别" value="windowRecognition"></el-option>
              <el-option label="门识别" value="doorRecognition"></el-option>
              <el-option label="墙识别" value="wallRecognition"></el-option>
            </el-select>
          </div>
          <el-table :data="items" @row-click="handleRowClick" class="custom-table" border fit highlight-current-row
            :max-height="clientHeight">
            <el-table-column prop="item_order" label="序号" width="80" align="center">
              <template slot-scope="{row}">
                <span class="custom-table-column">{{ row.item_order }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="item_type" label="类型" width="100" align="center">
              <template slot-scope="{row}">
                <span class="custom-table-column">{{ displayType(row.item_type) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="x1" label="x1" width="110" align="center">
              <template slot-scope="{row}">
                <span class="custom-table-column">{{ row.x1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="y1" label="y1" width="110" align="center">
              <template slot-scope="{row}">
                <span class="custom-table-column">{{ row.y1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="x2" label="x2" width="110" align="center">
              <template slot-scope="{row}">
                <span class="custom-table-column">{{ row.x2 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="y2" label="y2" width="110" align="center">
              <template slot-scope="{row}">
                <span class="custom-table-column">{{ row.y2 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="probability" label="概率" width="80" align="center">
              <template slot-scope="{row}">
                <span class="custom-table-column">{{ row.probability }}</span>
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
          <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" class="custom-canvas"
            style="width: 100%; height: 100%;"></canvas>
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


.custom-canvas {
  width: auto;
  height: 100%;
  border: none;
  background-color: #f0f0f0;
  border-radius: 10px;
}

.el-table{
  border-radius: 10px;
}

</style>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination


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
import axios from 'axios'
export default {
  name: 'ResultComponent',
  task_info: [],
  tmp_file_info: [],
  result_info: [],
  // name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  props: ['user_id', 'task_id'],
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {

      // new item
      canvasWidth: 600,
      canvasHeight: 480,
      src0: '',
      src: '',
      items: [],
      items_int: [],
      total: 0,
      box: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      // src:'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      task_id: null,
      user_id: null,
      dwg_name: null,
      consoleValue: '',
      area_cnt: 0,
      door_cnt: 0,
      window_cnt: 0,
      light_cnt: 0,
      switch_cnt: 0,
      socket_cnt: 0,
      howWidth: 8,
      tableKey: 0,
      list: null,
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
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
      downloadLoading: false,
      task_info: [],
      result_info: []
    }
  },





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
  created() { // 初始化函数
    // console.log('user_id:', this.user_id)
    // console.log('task_id:', this.task_id)
    // this.getTaskInfo();
    // this.initTaskInfo()
    this.getTaskInfo3()
  },
  methods: {

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
    initTaskInfo() {
      console.log('Here is initTaskInfo, task_id:', this.task_id)
      const arr = this.task_id.split('&&&')
      if (arr.length !== 2) {
        console.log('error to parse task_id:', this.task_id)
        return
      }
      this.task_id = arr[0]
      this.dwg_name = arr[1]
      this.dwg_name = this.getFileName(this.dwg_name) // 去除后缀
      console.log('task_id:', this.task_id)
      console.log('dwg_name:', this.dwg_name)
      this.task_info = { 'task_name': this.task_id }

      const formData = new FormData()
      formData.append('dwgname', this.dwg_name)
      axios.post('http://localhost:5000/recong_door3', formData).then(response => {
        const form = response.data
        console.log('form:', form)
        if (form['img_base64'] != null) {
          this.src = 'data:image/jpg;base64,' + form['img_base64'] // 箭头函数不会创建自己的this绑定，不必let that = this
        } else {
          console.log('获取结果失败')
        }
      }).catch(error => {
        console.error('There was an error:', error)
      })
    },
    getTaskInfo2() {
      console.log('Here is getTaskInfo2.')
      const formData = new FormData()
      formData.append('task_id', this.task_id)
      axios.post('http://localhost:5000/query_task', formData) // 根据task_id查询task信息
        .then(response => {
          this.task_info = response.data
          console.log('drawing name:', this.task_info['drawing_name'])

          const formData1 = new FormData()
          formData1.append('drawing_name', this.task_info['drawing_name'])
          // 获取显示图像
          axios.post('http://localhost:5000/get-image_door', formData1, { responseType: 'arraybuffer' }).then(response => {
            // this.src = response.data.image;
            const blob = new Blob([response.data], { type: 'img_home/png' })
            this.src = URL.createObjectURL(blob)
          })
          // 获取输出结果
          axios.post('http://localhost:5000/get-console', formData1).then(response => {
            this.consoleValue = response.data['console']
            console.log('consoleValue:', this.consoleValue)
          })
        })
        .catch(error => {
          console.error('There was an error:', error)
        })
    },
    getTaskInfo3() {
      console.log('Here is getTaskInfo3.')
      const formData = new FormData()
      formData.append('task_id', this.task_id)
      axios.post('http://localhost:5000/query_task', formData) // 根据task_id查询task信息
        .then(response => {
          this.task_info = response.data
          console.log('drawing name:', this.task_info['drawing_name'])

          const formData1 = new FormData()
          formData1.append('drawing_name', this.task_info['drawing_name'])
          // 获取显示图像
          axios.post('http://localhost:5000/get-image_door', formData1, { responseType: 'arraybuffer' }).then(response => {
            // this.src = response.data.image;
            const blob = new Blob([response.data], { type: 'img_home/png' })
            this.src0 = URL.createObjectURL(blob)
            // 获取输出结果
            axios.post('http://localhost:5000/get-item_list', formData1).then(response => {
              this.items = response.data['rects']
              this.box = response.data['box']
              this.total = response.data['total']
              console.log('items:', this.items)
              console.log('box:', this.box)
              console.log('total:', this.total)
              this.doMapRange()
              this.handleShow(null)
            }).catch(error => {
              console.error('Error in get item list:', error)
            })
          }).catch(error => {
            console.error('Error in get image door:', error)
          })
        }).catch(error => {
          console.error('Error in get drawing name:', error)
        })
    },
    getTaskInfo() {
      console.log('Here is getTaskInfo.')
      const formData = new FormData()
      formData.append('task_id', this.task_id)
      axios.post('http://localhost:5000/query_task', formData) // 根据task_id查询task信息
        .then(response => {
          this.task_info = response.data
          console.log('drawing name:', this.task_info['drawing_name'])

          const formData1 = new FormData()
          formData1.append('drawing_name', this.task_info['drawing_name'])
          axios.post('http://localhost:5000/get-image_home', formData1, { responseType: 'arraybuffer' }).then(response => {
            // this.src = response.data.image;
            const blob = new Blob([response.data], { type: 'img_home/png' })
            this.src = URL.createObjectURL(blob)
          })

          const formData2 = new FormData()
          formData2.append('drawing_name', this.task_info['drawing_name'])
          axios.post('http://localhost:5000/display_result', formData2).then(response => {
            this.result_info = response.data
            console.log(this.result_info)
            this.area_cnt = this.result_info['area_cnt']
            this.door_cnt = this.result_info['door_cnt']
            this.window_cnt = this.result_info['window_cnt']
            this.light_cnt = this.result_info['light_cnt']
            this.switch_cnt = this.result_info['switch_cnt']
            this.socket_cnt = this.result_info['socket_cnt']
            this.tableArr.forEach(item => {
              if (item.key === '区域') {
                item.value = this.area_cnt
              } else if (item.key === '门') {
                item.value = this.door_cnt
              } else if (item.key === '窗') {
                item.value = this.window_cnt
              } else if (item.key === '灯') {
                item.value = this.light_cnt
              } else if (item.key === '开关') {
                item.value = this.switch_cnt
              } else if (item.key === '插座') {
                item.value = this.socket_cnt
              }
            })
          }).catch(error => {
            console.error('There was an error:', error)
          })
        }).catch(error => {
          console.error('There was an error:', error)
        })
    },
    onChangepic() {
      const formData = new FormData()
      formData.append('drawing_name', this.task_info['drawing_name'])
      if (this.selectedvalue === '选项1') {
        axios.post('http://localhost:5000/get-image_area', formData, { responseType: 'arraybuffer' }).then(response => {
          const blob = new Blob([response.data], { type: 'img_area/png' })
          this.src = URL.createObjectURL(blob)
        })
      } else if (this.selectedvalue === '选项2') {
        axios.post('http://localhost:5000/get-image_door', formData, { responseType: 'arraybuffer' }).then(response => {
          const blob = new Blob([response.data], { type: 'img_door/png' })
          this.src = URL.createObjectURL(blob)
        })
      } else if (this.selectedvalue === '选项3') {
        axios.post('http://localhost:5000/get-image_window', formData, { responseType: 'arraybuffer' }).then(response => {
          const blob = new Blob([response.data], { type: 'img_window/png' })
          this.src = URL.createObjectURL(blob)
        })
      } else if (this.selectedvalue === '选项4') {
        axios.post('http://localhost:5000/get-image_light', formData, { responseType: 'arraybuffer' }).then(response => {
          const blob = new Blob([response.data], { type: 'img_light/png' })
          this.src = URL.createObjectURL(blob)
        })
      } else if (this.selectedvalue === '选项5') {
        axios.post('http://localhost:5000/get-image_switch', formData, { responseType: 'arraybuffer' }).then(response => {
          const blob = new Blob([response.data], { type: 'img_switch/png' })
          this.src = URL.createObjectURL(blob)
        })
      } else if (this.selectedvalue === '选项6') {
        axios.post('http://localhost:5000/get-image_socket', formData, { responseType: 'arraybuffer' }).then(response => {
          const blob = new Blob([response.data], { type: 'img_socket/png' })
          this.src = URL.createObjectURL(blob)
        })
      }
    },
    redirectToList() {
      this.$router.push(`/list/index`)
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
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
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    handleShow(row) {
      console.log('here is handleShow')
      if (row === null) {     // 初始绘制
        this.drawImageAndRectangles(-1)
      } else {
        let order = row.item_order
        this.drawImageAndRectangles(order)
      }
    },
    handleRowClick(row, column, event) {
      console.log('row:', row)
      this.handleShow(row)
    },
    drawImageAndRectangles(index) {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");

      const image = new Image();
      image.onload = () => {       // 图像加载后才会执行
        // 设置 Canvas 尺寸
        console.log('image load finish, size:', image.width, image.height)
        // this.canvasWidth = image.width;
        // this.canvasHeight = image.height;
        // canvas.width = this.canvasWidth
        // canvas.height = this.canvasHeight
        // image.width = this.canvasWidth
        // image.height = this.canvasHeight

        // 清除画布
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

        // 绘制 Base64 图像
        ctx.drawImage(image, 0, 0, this.canvasWidth, this.canvasHeight)

        // 绘制矩形
        for (let i = 0; i < this.items_int.length; i++) {
          let item = this.items_int[i]
          if (i + 1 === index) {
            ctx.beginPath();
            ctx.rect(Math.min(item[0], item[2]), Math.min(item[1], item[3]), Math.abs(item[2] - item[0]), Math.abs(item[3] - item[1]));
            ctx.strokeStyle = "green"; // 设置矩形颜色
            ctx.lineWidth = 2.5; // 设置矩形线宽
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.rect(Math.min(item[0], item[2]), Math.min(item[1], item[3]), Math.abs(item[2] - item[0]), Math.abs(item[3] - item[1]));
            console.log('type:', item[4])
            if (item[4] == 0) {
              ctx.strokeStyle = "red";     // 单开门
            } else if (item[4] == 1) {
              ctx.strokeStyle = "blue";  // 双开门
            } else {
              ctx.strokeStyle = "black";   // 未知情况
            }
            ctx.lineWidth = 2; // 设置矩形线宽
            ctx.stroke();
          }
        }
        // 绘制矩形
        // this.rectangles.forEach((rect) => {      // 另一种遍历方法
        //   ctx.beginPath();
        //   ctx.rect(rect.x, rect.y, rect.width, rect.height);
        //   ctx.strokeStyle = "red"; // 设置矩形颜色
        //   ctx.lineWidth = 2; // 设置矩形线宽
        //   ctx.stroke();
        // });
      };
      image.src = this.src0; // 设置图片的来源
    },
    doMapRange() {
      console.log('here is doMapRange')
      if (this.box == null || this.box.length != 4 || this.items.length == 0) {
        console.log('box or items is not correct', this.box, this.items)
        return
      }
      let imgWidth = this.canvasWidth, imgHeight = this.canvasHeight     // 这个尺寸和img标签style不一致
      let imgCenterX = imgWidth / 2
      let imgCenterY = imgHeight / 2
      let rangeWidth = this.box[2] - this.box[0];
      let rangeHeight = this.box[3] - this.box[1];
      let rangeCenterX = (this.box[2] + this.box[0]) / 2
      let rangeCenterY = (this.box[3] + this.box[1]) / 2
      let k1 = imgHeight * 1.0 / imgWidth, k2 = rangeHeight * 1.0 / rangeWidth
      let scale

      if (k1 > k2) {
        scale = imgWidth * 1.0 / rangeWidth
      }
      else {
        scale = imgHeight * 1.0 / rangeHeight
      }

      this.items_int = []      // 清空原有元素     
      let x1, y1, x2, y2, item, type
      for (let i = 0; i < this.items.length; i++) {
        item = this.items[i]
        x1 = Math.round(imgCenterX + (item.x1 - rangeCenterX) * scale)
        y1 = imgHeight - Math.round(imgCenterY + (item.y1 - rangeCenterY) * scale)
        x2 = Math.round(imgCenterX + (item.x2 - rangeCenterX) * scale)
        y2 = imgHeight - Math.round(imgCenterY + (item.y2 - rangeCenterY) * scale)
        type = Math.round(item.item_type)
        this.items_int.push([x1, y1, x2, y2, type])        // push添加到尾部，相当于append
      }
      // console.log('items_int:', this.items_int)
    },
    displayType(type) {
      switch (type) {
        case 1:
          return '双开门'
        case 0:
          return '单开门'
        default:
          return '未知'
      }
    }
  }
}
</script>