<template>
    <!-- <el-form-item style="margin-bottom: 40px;" label-width="70px" label="Summary:">
    <el-input v-model="postForm.content_short" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
    <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
  </el-form-item> -->


  <div class="components-container">

    <el-form ref="form" :model="form" label-width="110px">
  <el-form-item label="模型名称：">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
  <el-form-item label="模型类型：">
    <el-select v-model="form.region" placeholder="请选择模型类型">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="存储路径：">
    <el-input v-model="form.phone"></el-input>
  </el-form-item>
  <el-form-item label="上传参数文件：">
    <el-upload
  class="upload-demo"
  drag
  action="https://jsonplaceholder.typicode.com/posts/"
  multiple>
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div class="el-upload__tip" slot="tip">tips：只能上传json文件</div>
</el-upload>
  </el-form-item>

  <el-form-item label="">
    <el-button type="primary" @click="redirectToList">开始训练</el-button>
  </el-form-item>

</el-form>

  </div>
</template>

<script>
export default {
    data() {
      return {
        form: {
          name: '',
          password: '',
          email: '',
          phone: '',

        }
      }
    },
    methods: {
    redirectToList() {
      this.$router.push(`/task/userinfo/index`)
    },
    onSubmit() {
        console.log('submit!');
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
