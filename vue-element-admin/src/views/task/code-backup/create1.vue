<template>
    <!-- <el-form-item style="margin-bottom: 40px;" label-width="70px" label="Summary:">
    <el-input v-model="postForm.content_short" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
    <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
  </el-form-item> -->
  <div class="components-container">
    <aside>
      Tips：新建图纸理解任务，需要填写相关信息，并上传DWG格式的CAD图纸文件。
    </aside>
    <span>图纸文件：</span>
    <el-upload
      class="upload-demo"
      drag 
      action="http://localhost:5000/dwg"
      :on-success="handleSuccess"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
    </el-upload>
    <br>
    <div>
      <span>任务类型：</span>
      <el-select v-model="taskType" @change="selectTaskType" placeholder="请选择" clearable style="width: 100px" class="filter-item">
        <el-option v-for="item in taskTypeOptions" :key="item" :label="item" :value="item"/>
      </el-select>
    </div>
    <br>
    <div>
      <span>任务名称：</span>
      <el-input v-model="taskName" placeholder="请输入任务名称"/>
    </div>
    <br>
    <el-button type="primary" @click="redirectToList">提交任务</el-button>
    <div>
      <MapComponent3 />
    </div>
  </div>
</template>

<script>
import Dropzone from '@/components/Dropzone'
import axios from 'axios';
import MapComponent3 from '../dashboard/components/MapComponent3.vue';

export default {
  name: 'DropzoneDemo',
  components: { Dropzone, MapComponent3 },
  data() {
    return {
      taskName: '',
      taskFileName: '',
      taskType: '',
      taskTypeOptions: [
        '门识别',
        '窗识别',
        '墙识别',
        '户型面积计算'
      ],
    }
  },
  methods: {
    selectTaskType() {
      console.log('here is selectTaskType')
      if (this.taskFileName === '' || this.taskType === '') {
        this.$notify({
          title: 'Error',
          message: '请先上传图纸文件',
          type: 'error',
          duration: 2000
        })
        return
      }
      let fileName = this.getFileNameWithoutExtension(this.taskFileName)
      this.taskName = '图纸' + fileName + '的' + this.taskType
      console.log('taskName:', this.taskName)
    },
    handleSuccess(response, file, fileList) {
      console.log('Here is handleSuccess,', file.name)
      this.taskFileName = file.name
    },
    redirectToList2() {
      // this.$router.push(`/list/index`)    // 重定向到任务列表界面，原始方法
      
      // 尝试修改为同步直接处理
      console.log('Upload task succeed.')

      console.log('task name:', this.taskName)
      console.log('task file name:', this.taskFileName)
      const formData = new FormData()
      formData.append('dwgname', this.taskFileName)
      console.log('formData:', formData)
      axios.post('http://localhost:5000/recong_door', formData)
      .then(response => {
        let form = response.data;
        console.log('form:', form)
        if (form['message'] == 'Recong door successful') {
          // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
          // this.$router.push(`/list/index`)
          this.$router.push({path: `/result/${1}/${this.taskName}&&&${this.taskFileName}`})
        } else {
          console.log('Login failed')
          alert('门解析失败！');
        }
      })
      .catch(error => {
        console.error('There was an error:', error);
      });
    },
    redirectToList() {     // 任务上传，上传后跳转到list页面
      console.log('Here is redirectToList.')
      const formData = new FormData()

      // 校验上传数据
      if (this.taskFileName === '') {
        this.$notify({
          title: 'Error',
          message: '任务提交前请先上传图纸文件',
          type: 'error',
          duration: 2000
        })
        return
      }
      if (this.taskType === '') {
        this.$notify({
          title: 'Error',
          message: '任务提交前请先选择任务类型',
          type: 'error',
          duration: 2000
        })
        return
      }
      if (this.taskName === '') {
        this.$notify({
          title: 'Error',
          message: '任务提交前请先确定任务名称',
          type: 'error',
          duration: 2000
        })
        return
      }

      // 上传任务请求
      formData.append('task_name', this.taskName);
      formData.append('task_type', this.taskType);
      formData.append('status', 'processing');     
      formData.append('create_time', new Date());
      formData.append('process_time', '0');
      formData.append('user_id', 1);           // user_id是写死的
      formData.append('drawing_name', this.taskFileName)
      axios.post('http://localhost:5000/submit_task', formData)
        .then(response => {
          this.form = response.data
          if (this.form['message'] == 'submit task successful') {
            console.log('success submit task')
            this.$notify({
              title: 'Success',
              message: '提交成功。',
              type: 'success',
              duration: 2000
            })
            this.$router.push(`/task/list`)    // 重定向到任务列表界面
          } else {
            this.$notify({
              title: 'Error',
              message: '提交失败，请重新提交任务。',
              type: 'error',
              duration: 2000
            })
          }
        })
        .catch(error => {
          console.error('There was an error:', error);
        })
    },
    dropzoneS(file) {
      console.log('Here is dropzoneS,', file)
      this.$message({ message: '上传成功', type: 'success' })
    },
    dropzoneR(file) {
      console.log('Here is dropzoneR,', file)
      this.$message({ message: '删除成功', type: 'success' })
    },
    getFileNameWithoutExtension(fileName) {
      var dotIndex = fileName.lastIndexOf('.');
      if (dotIndex === -1) {
          // 如果没有找到 '.', 则返回整个文件名
          return fileName;
      }
      return fileName.substring(0, dotIndex); // 截取从开头到 '.' 之前的字符串
    }
  }
}
</script>

<style scoped>
*{
  font-size: 24px;
}
.second-heading{
  padding-bottom: 15px;
}
.el-input{
  margin-top: 15px;
}

.upload-demo{
  margin-top: 15px;
}
.el-upload {
  width: 100%;
  height: 500px;
}
.el-upload .el-upload-dragger {
    width: 100%;
    height: 98%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
}
.el-icon-upload {
    font-size: 120px;     
    margin: 4px 0 2px;  
}
.el-upload__text{
  font-size: 24px;
}
.el-upload__tip{
  margin-top: 5px;
  line-height: 15px;
  font-size: 20px;;
}
</style>
