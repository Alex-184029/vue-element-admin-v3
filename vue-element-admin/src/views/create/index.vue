<template>
    <!-- <el-form-item style="margin-bottom: 40px;" label-width="70px" label="Summary:">
    <el-input v-model="postForm.content_short" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
    <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
  </el-form-item> -->


  <div class="components-container">

    <aside>
      Tips：新建图纸理解任务，需要填写相关信息，并上传DWG格式的CAD图纸文件。
    </aside>
    <br>
    <form>
      <label class="second-heading">任务名称：<br></label>
      
      <el-input v-model="input" placeholder="请输入任务名称"></el-input>

      <br>
    </form>
    <br>
    <!-- <label>图纸文件：</label>
    <div class="editor-container">
      <dropzone id="myVueDropzone" url="https://httpbin.org/post" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS" />
    </div> -->
    <label class="second-heading">图纸文件：<br></label>
    <el-upload
  class="upload-demo"
  drag
  action="https://jsonplaceholder.typicode.com/posts/"
  multiple>
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
</el-upload>
    <br>
    <el-button type="primary" @click="redirectToList">提交任务</el-button>
  </div>
</template>

<script>
import Dropzone from '@/components/Dropzone'

export default {
  name: 'DropzoneDemo',
  components: { Dropzone },
  data() {
    return {
      input: ''
    }
  },
  methods: {
    redirectToList() {
      // this.$router.push(`/list/index`)    // 重定向到任务列表界面，原始方法
      
      console.log('Here is redirectToList.')

      // 尝试修改为同步直接处理
      console.log('Upload task succeed.')

      axios.post('http://localhost:5000/recong_door', formData)
      .then(response => {
        this.form = response.data;
        if (this.form['message'] == 'Recong door successful') {
          // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
          this.$router.push(`/result/index`)
        } else {
          console.log('Login failed')
          alert('门解析失败！');
        }
      })
      .catch(error => {
        console.error('There was an error:', error);
      });
    },
    dropzoneS(file) {
      console.log('here is dropzoneS,', file)
      this.$message({ message: '上传成功', type: 'success' })
    },
    dropzoneR(file) {
      console.log(file)
      this.$message({ message: '删除成功', type: 'success' })
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
