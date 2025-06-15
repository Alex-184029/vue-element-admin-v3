<template>
    <!-- <el-form-item style="margin-bottom: 40px;" label-width="70px" label="Summary:">
    <el-input v-model="postForm.content_short" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
    <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
  </el-form-item> -->


  <div class="components-container">

    <el-form ref="form" :model="form" label-width="100px">
  <el-form-item label="用户名：">
    <el-input v-model="form.user_name"> </el-input>
  </el-form-item>
  <el-form-item label="用户密码：">
    <el-input v-model="form.password"></el-input>
  </el-form-item>
  <el-form-item label="电子邮箱：">
    <el-input v-model="form.email"></el-input>
  </el-form-item>
  <el-form-item label="联系方式：">
    <el-input v-model="form.phone_number"></el-input>
  </el-form-item>
  <el-form-item label="用户类型：">
    <el-tag type="info">普通用户</el-tag>
  </el-form-item>
  <el-form-item label="用户权限：">
    <el-tag type="success">读写</el-tag>
  </el-form-item>
  <el-form-item label="">
    <el-button type="primary" @click="onSubmit">修改</el-button>
  </el-form-item>

</el-form>

  </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
      return {
        form: []
      }
    },
    created() {
      this.getUserInfo();
    },
    methods: {
      getUserInfo() {
        const formData2 = new FormData();
        formData2.append('user_id', this.$userID);
        console.log('userinfo userID', this.$userID)
        axios.post('http://localhost:5000/query_user', formData2)
              .then(response => {
                this.form = response.data;
              })
              .catch(error => {
                console.error('There was an error:', error);
              });
      },
      onSubmit() {
        // this.$router.push(`/task/userinfo/index`)
        const formData3 = new FormData();
        formData3.append('user_id', this.$userID);
        formData3.append('user_name', this.form['user_name']);
        formData3.append('password', this.form['password']);
        formData3.append('email', this.form['email']);
        formData3.append('phone_number', this.form['phone_number']);

        axios.post('http://localhost:5000/modify_info', formData3)
          .then(response => {
            if (response.data['message'] == 'modify success') {
              alert('修改成功');
            }
          })
          .catch(error => {
            console.error('There was an error:', error);
          });
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
