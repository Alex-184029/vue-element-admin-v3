<template>

  <div class="components-container">
    <el-row :gutter="20" style="display: flex; justify-content: center; align-items: center; margin-bottom: 15px;"><h1 style="margin: 2px auto;">D装修工程</h1></el-row>
  <el-row :gutter="20">
    <!-- TODO:这里要修改路径 -->
  <!-- <el-row :span="12"><div class="grid-content bg-purple">
    <el-card class="box-card"><img class="pic-style" :src="src" ></el-card>
    
  
  </div></el-row> -->
  <el-card class="box-card"><img class="pic-style" :src="src" style="margin-left: 200px; width: 60%; height: 60%;"></el-card>
  <el-row :span="12" style="margin-bottom: 25px;">
    <el-card class="box-card" >
      
      <el-row style="margin-bottom: 25px;"><label class="second-heading">信息类型：</label>
        <el-select v-model="selectedvalue" placeholder="请选择要查看的信息" style="width: 200px; height: 36px;">
    <el-option
      v-for="item in datasoptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>

  <el-button style="margin-left: 15px; font-size: 18px;" type="primary" round @click="onChangepic">查看</el-button>
</el-row >
      

      <el-col :span="howWidth" v-for="(item, index) in tableArr" :key="index" style="font-size: 16px; font-family: 'Times New Roman'">
      <div class="box">
        <div class="content1">{{ item.key }}</div>
        <div class="content2">{{ item.value == "选项1" ? "待完善" : item.value }}</div>
      </div>
    </el-col>

</el-card>
    
  </el-row>
  
</el-row>

  </div>
</template>

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
import pic0 from '@/assets/pics/home.png';
import pic1 from '@/assets/pics/1.png';
import pic2 from '@/assets/pics/2.png';
import pic3 from '@/assets/pics/3.png';
import pic4 from '@/assets/pics/4.png';
// import pic5 from '@/assets/pics/5.png';
// import pic6 from '@/assets/pics/6.png';
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
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
      // src:'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      src: pic0, //TODO
      datasoptions: [{
          value: '选项1',
          label: '房间区域'
        }, {
          value: '选项2',
          label: '门'
        }, {
          value: '选项3',
          label: '窗'
        }, {
          value: '选项4',
          label: '灯'
        }, {
          value: '选项5',
          label: '插座'
        }, {
          value: '选项6',
          label: '开关'
        }
      ],
        selectedvalue:'',
      tableArr: [
        {
          key: "区域",
          value: "7",
        },
        {
          key: "门",
          value: "7",
        },
        {
          key: "窗",
          value: "5",
        },
        {
          key: "灯",
          value: "6",
        },
        {
          key: "开关",
          value: "7",
        },
        {
          key: "插座",
          value: "6",
        },

        // {
        //   key: "姓名",
        //   value: "孙悟空",
        // },
        // {
        //   key: "年龄",
        //   value: 500,
        // },
        // {
        //   key: "身高",
        //   value: "山一样高",
        // },
        // {
        //   key: "性别",
        //   value: "男",
        // },
        // {
        //   key: "住址",
        //   value: "花果山水帘洞",
        // },
        
      ],
      howWidth: 8,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
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
      downloadLoading: false
    }
  },
  created() {
    const user_id = this.$router.params.user_id
    console.log(user_id)
    // this.getList()
  },
  methods: {
    onChangepic(){
      if(this.selectedvalue=='选项1'){
        this.src = pic1
      } else if (this.selectedvalue=='选项2'){
        this.src = pic2
      } else if (this.selectedvalue=='选项3'){
        this.src = pic3
      } else if (this.selectedvalue=='选项4'){
        this.src = pic4
      } 
      // else if (this.selectedvalue=='选项5'){
      //   this.src = pic5
      // } else if (this.selectedvalue=='选项6'){
      //   this.src = pic6
      // } 
    },
    redirectToList() {
      this.$router.push(`/create/list`)
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
<style scoped>

*{
  font-size: 24px;
}
.pic-style{
 /* width:800px;
 height: 600px; */
 width:400px;
 height: 300px;
 object-fit: cover;
}

    .box-card{
      display: flex;
      justify-content: center;
      align-items: center;
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
      color: #000000;
      /* font-size: 2p */
    }
</style>