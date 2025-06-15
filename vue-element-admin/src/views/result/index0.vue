<template>
  <div class="result-container">
    <el-row :gutter="20" style="display: flex; justify-content: center; align-items: center; margin-bottom: 40px; margin-top: 25px"><h1 style="margin: 2px auto;">{{ task_info['task_name'] }}</h1></el-row>
    <el-row :gutter="20">
      <!-- 结果示意图 -->
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <!-- <img v-if="src" :src="src" class="pic-style"> -->
            <!-- Canvas 用来显示图片并绘制矩形 -->
            <!-- <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" class="custom-canvas"></canvas> -->
            <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" class="custom-canvas" @wheel="handleWheel" @mousedown="startDrag" @mousemove="drag" @mouseup="endDrag" @mouseleave="endDrag"></canvas>
          </el-card>
        </div>
      </el-col>

      <!-- 结果列表 -->
      <el-col :span="13">
        <el-card class="box-card2">
        <div class="row-result">
          <label>图元统计结果：</label>
        </div>
        <el-table
          :data="items"
          @row-click="handleRowClick"
          class="custom-table"
          border
          fit
          highlight-current-row>
          <el-table-column
              prop="item_order"
              label="序号"
              width="80"
              align="center">
              <template slot-scope="{row}">
                <span class="custom-table-column">{{ row.item_order }}</span>
              </template>
          </el-table-column>
          <el-table-column
              prop="item_type"
              label="类型"
              width="100"
              align="center">
              <template slot-scope="{row}">
                <span class="custom-table-column">{{ displayType(row.item_type) }}</span>
              </template>
          </el-table-column>
          <el-table-column
              prop="x1"
              label="x1"
              width="110"
              align="center">
              <template slot-scope="{row}">
              <span class="custom-table-column">{{ row.x1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="y1"
              label="y1"
              width="110"
              align="center">
              <template slot-scope="{row}">
              <span class="custom-table-column">{{ row.y1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="x2"
              label="x2"
              width="110"
              align="center">
              <template slot-scope="{row}">
              <span class="custom-table-column">{{ row.x2 }}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="y2"
              label="y2"
              width="110"
              align="center">
              <template slot-scope="{row}">
              <span class="custom-table-column">{{ row.y2 }}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="probability"
              label="概率"
              width="80"
              align="center">
              <template slot-scope="{row}">
              <span class="custom-table-column">{{ row.probability }}</span>
            </template>
          </el-table-column>
          <!--
          <el-table-column
              prop="operate"
              label="操作"
              width="120"
              align="center">
              <template slot-scope="{row,$index}">
              <el-button type="primary" size="mini" @click="handleShow(row)" class="custom-table-column">
                查看
              </el-button>
            </template>
          </el-table-column>
          -->
        </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import axios from 'axios'
export default {
  name: 'ResultComponent',
  task_info: [],
  tmp_file_info: [],
  result_info: [],
  // name: 'ComplexTable',
  components: { },
  props: ['user_id', 'task_id'],
  data() {
    return {
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
      src0: '',
      src: '',
      items: [],
      items_int: [],
      total: 0,
      box: [],
      task_id: null,
      user_id: null,
      dwg_name: null,
      list: null,
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
          console.log('task info:', this.task_info['drawing_name'], this.task_info['task_type'])

          const formData1 = new FormData()
          formData1.append('drawing_name', this.task_info['drawing_name'])
          formData1.append('task_type', this.task_info['task_type'])
          // 获取显示图像
          axios.post('http://localhost:5000/get-image', formData1, { responseType: 'arraybuffer' }).then(response => {
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
              this.image.src = this.src0;
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
    handleShow(row) {
      console.log('here is handleShow')
      if (row === null) {     // 初始绘制
        this.drawImageAndRectangles2(-1)
      } else {
        let order = row.item_order
        this.drawImageAndRectangles2(order)
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
      let imgWidth = 1600, imgHeight = 1280     // 这个尺寸和img标签style不一致
      let imgCenterX = imgWidth / 2
      let imgCenterY = imgHeight / 2
      let rangeWidth = this.box[2] - this.box[0];
      let rangeHeight = this.box[3] - this.box[1];
      let rangeCenterX = (this.box[2] + this.box[0]) / 2
      let rangeCenterY = (this.box[3] + this.box[1]) / 2
      let k1 = imgHeight * 1.0 / imgWidth, k2 = rangeHeight * 1.0 / rangeWidth
      let scale

      if (k1 > k2)
      {
          scale = imgWidth * 1.0 / rangeWidth
      }
      else
      {
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
      if (this.task_info['task_type'] === 'Door') {
        switch (type) {
          case 1:
            return '双开门'
          case 0:
            return '单开门'
          default:
            return '未知'
        }
      } else if (this.task_info['task_type'] === 'Window') {
        return '窗'
      } else {
        return '其它'
      }
    },
    drawImage() {
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 计算缩放后的图片尺寸
      const scaledWidth = this.image.width * this.scale;
      const scaledHeight = this.image.height * this.scale;

      // 计算边界
      const maxX = Math.max(0, scaledWidth - canvas.width);
      const maxY = Math.max(0, scaledHeight - canvas.height);

      // 限制偏移量
      this.offsetX = Math.min(Math.max(this.offsetX, -maxX), 0);
      this.offsetY = Math.min(Math.max(this.offsetY, -maxY), 0);

      // 绘制图片
      ctx.drawImage(this.image, this.offsetX, this.offsetY, scaledWidth, scaledHeight);
    },
    handleWheel(event) {
      event.preventDefault();

      if (event.deltaY < 0) {
        this.scale = Math.min(this.scale * 1.1, this.maxScale); // 放大
      } else {
        this.scale = Math.max(this.scale / 1.1, this.minScale); // 缩小
      }

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
    drawImageAndRectangles2(index) {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 计算缩放后的图片尺寸
      const scaledWidth = this.image.width * this.scale;
      const scaledHeight = this.image.height * this.scale;

      // 计算边界
      const maxX = Math.max(0, scaledWidth - canvas.width);
      const maxY = Math.max(0, scaledHeight - canvas.height);
      // 限制偏移量
      this.offsetX = Math.min(Math.max(this.offsetX, -maxX), 0);
      this.offsetY = Math.min(Math.max(this.offsetY, -maxY), 0);
      
      // 绘制图片
      ctx.drawImage(this.image, this.offsetX, this.offsetY, scaledWidth, scaledHeight);

      // 绘制矩形框，需要先做范围内判断吗
      for (let i = 0; i < this.items_int.length; i++) {
        let item = this.items_int[i]
        if (i + 1 === index) {
          ctx.strokeStyle = "green"; // 设置矩形颜色
          ctx.lineWidth = 2.5; // 设置矩形线宽
          let x1 = item[0] * this.scale + this.offsetX
          let y1 = item[1] * this.scale + this.offsetY
          let x2 = item[2] * this.scale + this.offsetX
          let y2 = item[3] * this.scale + this.offsetY
          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
        } else {
          if (item[4] == 0) {
            ctx.strokeStyle = "red";     // 单开门
          } else if (item[4] == 1) {
            ctx.strokeStyle = "blue";  // 双开门
          } else {
            ctx.strokeStyle = "black";   // 未知情况
          }
          ctx.lineWidth = 2; // 设置矩形线宽
          let x1 = item[0] * this.scale + this.offsetX
          let y1 = item[1] * this.scale + this.offsetY
          let x2 = item[2] * this.scale + this.offsetX
          let y2 = item[3] * this.scale + this.offsetY
          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
        }
      }
      this.image.src = this.src0; // 设置图片的来源
    },
    drawImageAndRectangles3(index) {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      
      // 计算缩放后的图片尺寸
      const scaledWidth = this.image.width * this.scale;
      const scaledHeight = this.image.height * this.scale;

      // 计算边界
      const maxX = Math.max(0, scaledWidth - canvas.width);
      const maxY = Math.max(0, scaledHeight - canvas.height);
      // 限制偏移量
      this.offsetX = Math.min(Math.max(this.offsetX, -maxX), 0);
      this.offsetY = Math.min(Math.max(this.offsetY, -maxY), 0);

      this.image.onload = () => {       // 图像加载后才会执行
        // 设置 Canvas 尺寸
        // console.log('image load finish, size:', image.width, image.height)
        // this.canvasWidth = image.width;
        // this.canvasHeight = image.height;
        // canvas.width = this.canvasWidth
        // canvas.height = this.canvasHeight
        // image.width = this.canvasWidth
        // image.height = this.canvasHeight

        // 清除画布
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

        // 绘制 Base64 图像
        // ctx.drawImage(image, 0, 0, this.canvasWidth, this.canvasHeight)
        ctx.drawImage(this.image, this.offsetX, this.offsetY, scaledWidth, scaledHeight);
        
        // 绘制矩形框，需要先做范围内判断吗
        for (let i = 0; i < this.items_int.length; i++) {
          let item = this.items_int[i]
          if (i + 1 === index) {
            ctx.strokeStyle = "green"; // 设置矩形颜色
            ctx.lineWidth = 2.5; // 设置矩形线宽
            let x1 = item[0] * this.scale + this.offsetX
            let y1 = item[1] * this.scale + this.offsetY
            let x2 = item[2] * this.scale + this.offsetX
            let y2 = item[3] * this.scale + this.offsetY
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
          } else {
            if (item[4] == 0) {
              ctx.strokeStyle = "red";     // 单开门
            } else if (item[4] == 1) {
              ctx.strokeStyle = "blue";  // 双开门
            } else {
              ctx.strokeStyle = "black";   // 未知情况
            }
            ctx.lineWidth = 2; // 设置矩形线宽
            let x1 = item[0] * this.scale + this.offsetX
            let y1 = item[1] * this.scale + this.offsetY
            let x2 = item[2] * this.scale + this.offsetX
            let y2 = item[3] * this.scale + this.offsetY
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
          }
        }
      };
      // this.image.src = this.src0; // 设置图片的来源
    }
  }
}
</script>
<style scoped>

/* *{
  font-size: 24px;
} */
/* .components-container {
  
} */
/* body {
  background-color: rgb(135,206,250);
} */

.result-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
}
.pic-style{
  width:800px;
  height: 600px;
  object-fit: cover;
}
.box-card{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 30px;
}
.box-card2{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 30px;
}
.box {
  width: 100%;
  height: 40px;
  display: flex;
  border-left: 1px solid #e9e9e9;
  border-top: 1px solid #e9e9e9;
}
.box .content1 {
  width: 40%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #fafafa;
  border-right: 1px solid #e9e9e9;
  border-bottom: 1px solid #e9e9e9;
  color: #333;
  /* font-size: 14px; */
}
.box .content2 {
  width: 60%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #fff;
  border-right: 1px solid #e9e9e9;
  border-bottom: 1px solid #e9e9e9;
  color: #b0b0b2;
  /* font-size: 2p */
}
.console-style {
  font-size: 16px;
  font-family: 'Arial', sans-serif;
  line-height: 1.5;
}
.row-result {
  width: 800px;
  height: auto;
  margin-bottom: 10px;
  margin-left: 20px;
}
.table-class {
  font-size: 10px; 
  width: 100%;
}
.custom-table {
  font-size: 16px; /* 设置表格字体大小 */
  width: 100%;
  margin-left: 20px;
}
.custom-table-column {
  font-size: 17px; /* 设置表格单元格字体大小 */
}
.custom-canvas {
  border: 1px solid #000; /* 给 Canvas 添加边框，便于观察 */
}
</style>
