<template>
  <div class="task-container">
    <div class="task-card">
      <div class="task-header">任务上传</div>

      <div class="task-inputs">
        <label>任务类型：</label>
        <el-select
          v-model="taskType"
          @change="selectTaskType"
          placeholder="请选择任务类型"
          clearable
          class="task-select"
        >
          <el-option
            v-for="item in taskTypeOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>

      <div class="task-inputs">
        <label>任务名称：</label>
        <el-input
          v-model="taskName"
          placeholder="请输入任务名称"
          class="task-input"
        />
      </div>

      <div class="upload-section">
        <label>图纸文件：</label>
        <el-upload
          class="upload-demo"
          drag
          action="http://localhost:5000/dwg"
          :on-success="handleSuccess"
          @before-upload="handleBeforeUpload"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>

      <el-button class="submit-btn" @click="redirectToList">提交任务</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TaskUpload',
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
      if (this.taskFileName === '' || this.taskType === '') {
        this.$notify({
          title: 'Error',
          message: '请先上传图纸文件',
          type: 'error',
          duration: 2000
        });
        return;
      }
      const fileName = this.getFileNameWithoutExtension(this.taskFileName);
      this.taskName = `图纸${fileName}的${this.taskType}`;
    },
    handleSuccess(response, file) {
      this.taskFileName = file.name;
    },
    redirectToList() {
      if (!this.taskFileName || !this.taskType || !this.taskName) {
        this.$notify({
          title: 'Error',
          message: '请完整填写信息再提交任务',
          type: 'error',
          duration: 2000
        });
        return;
      }

      // 上传任务请求
      const formData = new FormData();
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
          console.error('There was an error:', error)
        })
    },
    getFileNameWithoutExtension(fileName) {
      const dotIndex = fileName.lastIndexOf('.')
      return dotIndex === -1 ? fileName : fileName.substring(0, dotIndex)
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box; /* 使用 border-box */
  font-family: Arial, sans-serif;
}

.task-container {
  display: flex;
  justify-content: center;     /* 水平居中 */
  align-items: top;            /* 垂直靠顶 */
  height: 100vh;
  background: linear-gradient(to right, #e0f7fa, #f1f8e9);
}

.task-card {
  width: 85%;
  height: 80vh;
  margin-top: 7vh;
  /* max-width: 80%; /* 设置最大宽度 */
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden; /* 隐藏溢出 */
}

.task-header {
  font-size: 28px;
  font-weight: bold;
  color: #4a4a4a;
  margin-bottom: 20px;
  text-align: center;
}

.task-inputs {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.task-select,
.task-input {
  width: 100%;
  margin-top: 8px;
}

.upload-section {
  margin-top: 15px;
}

.upload-demo {
  border: 2px dashed #cfd8dc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.upload-demo:hover {
  background-color: #f9fbe7;
  border-color: #81c784;
}

.el-icon-upload {
  font-size: 50px;
  color: #4db6ac;
}

.el-upload__text {
  font-size: 16px;
  color: #757575;
  margin-top: 10px;
}

.submit-btn {
  width: 100%;
  background-color: #4db6ac;
  color: #ffffff;
  font-weight: bold;
  font-size: 18px;
  margin-top: 25px;
  padding: 12px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #66bb6a;
}
</style>
