<template>
<div class="dashboard-editor-container">
  <el-col class="panel-group">
    <el-row class="card-panel">
      <el-col :span="6">
        <div class="card-panel-icon-wrapper icon-people">
          <!-- <svg-icon icon-class="peoples" class-name="card-panel-icon" /> -->
          <img class="card-panel-image" :src="src1">
        </div>
      </el-col>
      <el-col :span="16">
        <div class="card-panel-description">
          <div class="card-panel-num">
            {{ task_info.task_name }}
          </div>
          <div class="card-panel-text">{{task_info.task_id}}</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card-panel-time">{{ task_info.create_time }}</div>
      </el-col>
      <el-col :span="8">
        <div class="card-panel-status">{{ task_info.task_status }}</div>
      </el-col>
      <el-col :span="3">
        <div class="card-panel-button">
          <el-button type="primary" size="medium">
              查看
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row class="card-panel-row">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <!-- <svg-icon icon-class="message" class-name="card-panel-icon" /> -->
          <img class="card-panel-image" :src="src2">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Messages
          </div>
          <div class="card-panel-num">81212</div>
        </div>
      </div>
    </el-row>
    <el-row class="card-panel-row">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <!-- <svg-icon icon-class="money" class-name="card-panel-icon" /> -->
          <img class="card-panel-image" :src="src3">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Purchases
          </div>
          <div class="card-panel-num">9280</div>
        </div>
      </div>
    </el-row>
    <el-row class="card-panel-row">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <!-- <svg-icon icon-class="shopping" class-name="card-panel-icon" /> -->
          <img class="card-panel-image" :src="src4">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Shoppings
          </div>
          <div class="card-panel-num">13600</div>
        </div>
      </div>
    </el-row>
  </el-col>
</div>
</template>

<script>

import pic1 from '@/assets/pics/1.png';
import pic2 from '@/assets/pics/2.png';
import pic3 from '@/assets/pics/3.png';
import pic4 from '@/assets/pics/4.png';

export default {
  components: {
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
      }
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-row {
    margin-bottom: 15px;
    padding: 15px;
  }

  .card-panel {
    // flex布局设置
    display: flex;
    justify-content: space-between;

    height: 108px;
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
        margin-top: 12px;
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
  background-color: rgb(240, 242, 245);
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
