<template>
  <div class="app-container" style="padding: 0; display: flex;">
    <div class="left" style="flex: 1; padding: 0; margin-left: 50px">
      <el-row :gutter="0" style="width: 100%; margin: 0;">
        <!-- 结果列表 -->
        <el-col :span="23" style="padding: 0;">
          <div style="display: flex; align-items: center; padding: 10px;">
            <label>任务名称： </label>
            <span style="margin-left: 25px; font-weight: bolder;">{{ task_info['task_name'] }}</span>
          </div>
          <div style="display: flex; align-items: center; padding: 10px;">
            <label>明细类型： </label>
            <span style="margin-left: 25px; font-weight: normal;">{{ task_type }}</span>
          </div>
          <!--
          <div style="display: flex; align-items: center; padding: 10px;">
            <label>图元统计结果：</label>
            <el-select v-model="recognitionType" style="width: 150px; margin-left: 20px;" @change="selectRecogType">
              <el-option v-for="item in selectOptions" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
          </div>
          -->

          <el-table :data="items" @row-click="handleRowClick" class="custom-table" border fit highlight-current-row>
            <el-table-column
              v-for="column in columns"
              :key="column.key"
              :prop="column.key"
              :label="column.label"
              :width="column.width"
              :align="column.align"
            >
              <template slot-scope="{ row }">
                <span class="custom-table-column">{{ row[column.key] }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="item_order" label="序号" width="80" align="center">
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
            </el-table-column> -->
            <!-- <el-table-column prop="probability" label="概率" width="80" align="center">
              <template slot-scope="{row}">
                <span class="custom-table-column">{{ row.probability }}</span>
              </template>
            </el-table-column> -->
          </el-table>
        </el-col>
      </el-row>
      <!-- excel导出按钮 -->
      <el-button :loading="downloadLoading" style="margin:20px 0 0 0;" type="primary" icon="el-icon-document" @click="handleDownload">
          导出Excel格式
      </el-button>
    </div>
    <div class="right" style="flex: 1; padding: 0;">
      <!-- 结果示意图 -->
      <el-col :span="24" style="padding: 0;">
        <div style="width: 100%; display: flex; justify-content: center; align-items: center; padding: 10px;">
          <!-- <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" class="custom-canvas"
            style="width: 100%; height: 100%;"></canvas> -->
            <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" class="custom-canvas" @wheel="handleWheel" @mousedown="startDrag" @mousemove="drag" @mouseup="endDrag" @mouseleave="endDrag"></canvas>
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
  width: 100%;
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
import { getServerUrl } from '@/utils'

import axios from 'axios'
export default {
  name: 'ResultComponent',
  props: ['user_id', 'task_id', 'task_type'],
  data() {
    return {
      selectOptions: [],
      // 画布缩放、平移参数
      scale: 1.0,
      image: new Image(),
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      offsetX: 0,
      offsetY: 0,
      // 最大最小缩放范围
      minScale: 0.1,
      maxScale: 10.0,
      canvasWidth: 600,
      canvasHeight: 480,

      select_index: 0,
      recognitionType: '',
      src0: '',
      src: '',
      items: [],
      items_int: [],
      items_poly: [],
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
      task_type: null,
      dwg_name: null,
      task_info: {},
      columns_rect: [
        { key: 'item_order', label: '序号', width: 80, align: 'center' },
        { key: 'item_type_text', label: '类型', width: 100, align: 'center' },
        { key: 'x1', label: 'x1', width: 110, align: 'center' },
        { key: 'y1', label: 'y1', width: 110, align: 'center' },
        { key: 'x2', label: 'x2', width: 110, align: 'center' },
        { key: 'y2', label: 'y2', width: 110, align: 'center' }
      ],
      columns_room: [
        { key: 'item_order', label: '序号', width: 80, align: 'center' },
        { key: 'item_type_text', label: '类型', width: 150, align: 'center' },
        { key: 'function', label: '功能', width: 150, align: 'center' },
        { key: 'area', label: '面积', width: 110, align: 'center' },
        { key: 'perimeter', label: '周长', width: 110, align: 'center' },
      ],
      columns: [],
      downloadLoading: false
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
    },
    taskType() {
      this.task_type = this.$route.params.task_type
      return this.$route.params.task_type
    },
  },
  created() { // 初始化函数
    this.doInit()
  },
  methods: {
    doInit() {
      console.log('Here is doInit.')
      const formData = new FormData()
      formData.append('task_id', this.task_id)
      axios.post(getServerUrl() + '/query_task', formData) // 根据task_id查询task信息
        .then(response => {
          this.task_info = response.data
          console.log('task info:', this.task_info['drawing_name'], 'task_type:', this.task_type)
          // 是否需要去校验task_type是否在数据库的task_type表中，在的话才能够继续
          this.recognitionType = this.task_type
          this.getTaskInfo3()
        }).catch(error => {
          console.error('Error in get drawing name:', error)
        })
    },
    getTaskInfo3() {
      console.log('Here is getTaskInfo3, recognitionType:', this.recognitionType)
      // 清空选中索引
      this.select_index = 0
      this.items = []
      // 修改表头类型
      if (this.recognitionType === 'Area') {
        this.columns = this.columns_room
      } else {
        this.columns = this.columns_rect
      }
      // 准备请求数据
      const formData1 = new FormData()
      formData1.append('task_id', this.task_info['task_id'])
      formData1.append('drawing_name', this.task_info['drawing_name'])
      formData1.append('task_type', this.recognitionType)
      // 获取显示图像
      axios.post(getServerUrl() + '/get-image', formData1, { responseType: 'arraybuffer' }).then(response => {
        // this.src = response.data.image;
        const blob = new Blob([response.data], { type: 'img_home/png' })
        this.src0 = URL.createObjectURL(blob)
        // 获取输出结果
        axios.post(getServerUrl() + '/get-item_list', formData1).then(response => {
          // 这里需要自行重新处理数据
          let data = response.data
          switch (this.recognitionType) {
            case 'Door':
              this.parseDoor(data);
              break;
            case 'Window':
              this.parseWindow(data);
              break;
            case 'Wall':
              this.parseWall(data);
              break;
            case 'Area':
              this.parseArea(data);
              break;
            default:
              console.log('Error: unknown task type.', this.recognitionType)
          }
          console.log('Parse data finish.')
          // 图像加载与绘制
          this.loadAndProcessImage()
        }).catch(error => {
          console.error('Error in get item list:', error)
        })
      }).catch(error => {
          console.error('Error in get image door:', error)
      })
    },
    handleShow(row) {
      console.log('here is handleShow')
      if (row === null) {     // 初始绘制
          this.drawImageAndRectangles2()
      } else {
        this.select_index = row.item_order
        this.drawImageAndRectangles2()
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
      // let imgWidth = this.canvasWidth, imgHeight = this.canvasHeight     // 这个尺寸和img标签style不一致
      let imgWidth = 1600, imgHeight = 1280
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
      if (this.recognitionType === 'Door') {
        switch (type) {
          case 1:
            return '单开门'
          case 2:
            return '双开门'
          case 3:
            return '推拉门'
          default:
            return '未知'
        }
      } else if (this.recognitionType === 'Window') {
        return '窗'
      } else if (this.recognitionType === 'Wall') {
        return '墙体'
      } else {
        return '其它'
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
    handleWheel2(event) {
      event.preventDefault();

      if (event.deltaY < 0) {
        this.scale = Math.min(this.scale * 1.1, this.maxScale); // 放大
      } else {
        this.scale = Math.max(this.scale / 1.1, this.minScale); // 缩小
      }

      this.drawImageAndRectangles2();

      // const canvas = this.$refs.canvas;
    },
    handleWheel(event) {
      event.preventDefault();
      // const canvas = this.$refs.canvas;
      const canvas = event.target;
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      if (event.deltaY < 0) {
        this.scale = Math.min(this.scale * 1.1, this.maxScale); // 放大
      } else {
        this.scale = Math.max(this.scale / 1.1, this.minScale); // 缩小
      }

      // 计算新的偏移量，使图片在鼠标位置保持不变
      this.offsetX -= (mouseX - this.offsetX) * this.scale;
      this.offsetY -= (mouseY - this.offsetY) * this.scale;

      this.drawImageAndRectangles2();

    },
    startDrag(event) {
      this.isDragging = true;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
    },
    drag(event) {
      if (this.isDragging) {
        const deltaX = event.clientX - this.dragStartX;
        const deltaY = event.clientY - this.dragStartY;

        this.offsetX += deltaX;
        this.offsetY += deltaY;

        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;

        this.drawImageAndRectangles2();
      }
    },
    endDrag() {
      this.isDragging = false;
    },
    drawImageAndRectangles2() {
      console.log('Here is drawImageAndRectangles2.')
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext("2d")

      this.image.onload = () => {      // 及时显示
        // 计算缩放后的图片尺寸
        const scaledWidth = this.image.width * this.scale
        const scaledHeight = this.image.height * this.scale

        // 计算边界
        const maxX = Math.max(0, scaledWidth - canvas.width)
        const maxY = Math.max(0, scaledHeight - canvas.height)
        // 限制偏移量
        this.offsetX = Math.min(Math.max(this.offsetX, -maxX), 0)
        this.offsetY = Math.min(Math.max(this.offsetY, -maxY), 0)

        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        ctx.drawImage(this.image, this.offsetX, this.offsetY, scaledWidth, scaledHeight)

        if (this.recognitionType === 'Window' || this.recognitionType === 'Door') {
          // 绘制矩形
          for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i]
            let x1 = item['x1'] * this.scale + this.offsetX
            let y1 = item['y1'] * this.scale + this.offsetY
            let x2 = item['x2'] * this.scale + this.offsetX
            let y2 = item['y2'] * this.scale + this.offsetY
            let item_type = item['item_type']
            if (i + 1 === this.select_index) {
              ctx.strokeStyle = "green"; // 设置矩形颜色
              ctx.lineWidth = 2.5; // 设置矩形线宽
            } else {
              if (item_type == 1) {
                ctx.strokeStyle = "red";     // 单开门
              } else if (item_type == 2) {
                ctx.strokeStyle = "blue";    // 双开门
              } else if (item_type == 3) {
                ctx.strokeStyle = "yellow";    // 推拉门
              } else {
                ctx.strokeStyle = "black";   // 未知情况
              }
              ctx.lineWidth = 2; // 设置矩形线宽
            }
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
          }
        } else if (this.recognitionType === 'Wall' || this.recognitionType === 'Area') {
          // 绘制多边形
          for (let i = 0; i < this.items_poly.length; i++) {
            let polygon = this.items_poly[i];
            let poly_type = polygon[polygon.length - 1]    // 末尾存放类型
            // console.log('poly type:', poly_type)
            ctx.beginPath();
            if (polygon.length > 2) {
              ctx.moveTo(polygon[0][0] * this.scale + this.offsetX, polygon[0][1] * this.scale + this.offsetY);
              for (let j = 1; j < polygon.length - 1; j++) {
                ctx.lineTo(polygon[j][0] * this.scale + this.offsetX, polygon[j][1] * this.scale + this.offsetY);
              }
              ctx.closePath();
            }
            if (i + 1 === this.select_index) {
              ctx.strokeStyle = "green"; // 设置选中多边形颜色
              ctx.lineWidth = 2.5; // 设置线宽
            } else {
              if (poly_type == 1) {
                ctx.strokeStyle = "red";     // 单开门
              } else if (poly_type == 2) {
                ctx.strokeStyle = "blue";    // 双开门
              } else if (poly_type == 3) {
                ctx.strokeStyle = "yellow";  // 推拉门
              } else {
                ctx.strokeStyle = "black";   // 未知情况
              }
              ctx.lineWidth = 2; // 设置线宽
            }
            ctx.stroke();
          }
        }
      }
      this.image.src = this.src0
      console.log('Here is finish drawImageAndRectangles2.')
    },
    getSelectOptions(task_type) {
      if (task_type === null || task_type === '')
        return
      if (task_type.includes('Area')) {
        this.selectOptions = [
          {
              key: 'Area',
              label: '房间识别'
          },
          {
              key: 'Door',
              label: '门识别'
          },
          {
              key: 'Window',
              label: '窗识别'
          },
          {
              key: 'Wall',
              label: '墙识别'
          }
        ]
        return
      }
      let task_arr = []
      if (task_type.includes(',')) {
        task_arr = task_type.split(',')
      } else {
        task_arr = [task_type]
      }
      this.selectOptions = []
      task_arr.forEach((item) => {
        switch (item) {
          case 'Door':
            this.selectOptions.push({
              key: 'Door',
              label: '门识别'
            })
            break
          case 'Window':
            this.selectOptions.push({
              key: 'Window',
              label: '窗识别'
            })
            break
          case 'Wall':
            this.selectOptions.push({
              key: 'Wall',
              label: '墙识别'
            })
            break
          case 'Area':
            this.selectOptions.push({
              key: 'Area',
              label: '房间识别'
            })
            break
          default:
            console.log('无效类型信息', item)
        }
      })
    },
    selectRecogType() {
      this.getTaskInfo3()
    },
    loadAndProcessImage() {
      const image = new Image()
      image.onload = () => {
          let w = image.width, h = image.height
          this.scale = Math.min(this.canvasWidth * 1. / w, this.canvasHeight * 1. / h)
          this.minScale = this.scale / 10.0
          this.maxScale = this.scale * 10.0
          console.log('image size:', w, h)
          console.log('scale:', this.scale, this.minScale, this.maxScale)
          this.handleShow(null)
      }
      image.src = this.src0
    },
    parseDoor(data) {
      console.log('data range:', data['range'])
      // 待赋值参数：box, items, total（后续分页可能会用到）
      let cnt = 1
      let items = []
      // 单开门
      let data_items = data['single_arc_doors']
      for (let i = 0; i < data_items.length; i++) {
        let item = {
          'item_order': cnt++,
          'item_type': 1,
          'item_type_text': this.displayType(1),
          'x1': data_items[i][0],
          'y1': data_items[i][1],
          'x2': data_items[i][2],
          'y2': data_items[i][3],
        }
        items.push(item)
      }
      // 双开门
      data_items = data['double_arc_doors']
      for (let i = 0; i < data_items.length; i++) {
        let item = {
          'item_order': cnt++,
          'item_type': 2,
          'item_type_text': this.displayType(2),
          'x1': data_items[i][0],
          'y1': data_items[i][1],
          'x2': data_items[i][2],
          'y2': data_items[i][3],
        }
        items.push(item)
      }
      // 推拉门
      data_items = data['slide_doors']
      for (let i = 0; i < data_items.length; i++) {
        let item = {
          'item_order': cnt++,
          'item_type': 3,
          'item_type_text': this.displayType(3),
          'x1': data_items[i][0],
          'y1': data_items[i][1],
          'x2': data_items[i][2],
          'y2': data_items[i][3],
        }
        items.push(item)
      }
      // 对象赋值
      this.box = data['range']
      // this.total = cnt - 1
      this.items = items
    },
    parseWindow(data) {
      // 待赋值参数：box, items, total（后续分页可能会用到）
      let cnt = 1
      let items = []
      // 多线窗
      let data_items = data['windows']
      for (let i = 0; i < data_items.length; i++) {
        let item = {
          'item_order': cnt++,
          'item_type': 1,
          'item_type_text': this.displayType(1),
          'x1': data_items[i][0],
          'y1': data_items[i][1],
          'x2': data_items[i][2],
          'y2': data_items[i][3],
        }
        items.push(item)
      }
      // 对象赋值
      this.box = data['range']
      this.total = cnt - 1
      this.items = items
    },
    parseWall(data) {
      // 待赋值参数：box, items, total（后续分页可能会用到）
      let cnt = 1
      let items = []
      let items_poly = []
      // 墙体多边形
      let data_items = data['walls']
      for (let i = 0; i < data_items.length; i++) {
        let bbox = this.getBoundingBox(data_items[i])
        let item = {
          'item_order': cnt++,
          'item_type': 1,
          'item_type_text': this.displayType(1),
          'x1': bbox[0],
          'y1': bbox[1],
          'x2': bbox[2],
          'y2': bbox[3],
        }
        items.push(item)
        let item_poly = data_items[i]
        item_poly.push(1)
        items_poly.push(item_poly)
      }
      // 对象赋值
      this.box = data['range']
      this.total = cnt - 1
      this.items = items
      this.items_poly = items_poly
    },
    parseArea(data) {
      // 待赋值参数：box, items, total（后续分页可能会用到）
      let cnt = 1
      let items = []
      let items_poly = []
      // 墙体多边形
      let data_items = data['rooms']
      for (let i = 0; i < data_items.length; i++) {
        let item = {
          'item_order': cnt++,
          'item_type': 1,
          'item_type_text': this.getRoomText(data_items[i]['labels']),
          'function': this.getRoomFunction(data_items[i]['function']),
          'area': data_items[i]['area'],
          'perimeter': data_items[i]['perimeter'],
        }
        items.push(item)
        let item_poly = data_items[i]['poly']
        item_poly.push(1)
        items_poly.push(item_poly)
      }
      // 对象赋值
      this.box = data['range']
      this.total = cnt - 1
      this.items = items
      this.items_poly = items_poly
    },
    getBoundingBox(polygon) {
      if (!Array.isArray(polygon) || polygon.length === 0) {
          return null;
      }

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (const [x, y] of polygon) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
      }

      return [
          minX, minY, maxX, maxY
      ];
    },
    getRoomText(labels) {
      if (labels.length === 0) {
        return 'default'
      }
      let room_text = labels[0]['text']
      for (let i = 1; i < labels.length; i++) {
        room_text += '-'
        room_text += labels[i]['text']
      }
      return room_text
    },
    getRoomFunction(labels) {
      if (labels.length === 0) {
        return 'default'
      }
      let room_text = labels[0]
      for (let i = 1; i < labels.length; i++) {
        room_text += '-'
        room_text += labels[i]
      }
      return room_text
    },
    handleDownload() {
      this.downloadLoading = true
      let tHeader = []
      let filterVal = []
      for (let i = 0; i < this.columns.length; i++) {
        tHeader.push(this.columns[i]['label'])
        filterVal.push(this.columns[i]['key'])
      }
      console.log('tHeader:', tHeader)
      console.log('filterVal:', filterVal)
      import('@/vendor/Export2Excel').then(excel => {
        const list = this.items
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '明细导出-' + this.getFileName(this.task_info['drawing_name']) + '-' + this.recognitionType,    // 不需要加后缀
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
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
