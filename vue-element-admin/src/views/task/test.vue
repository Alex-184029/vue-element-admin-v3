<template>
  <div class="engineering-table">
    <!-- excel导出按钮 -->
    <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handleDownload">
      Export Excel
    </el-button>
    <el-table
      :data="table_data"
      style="width: 100%"
      border
      :row-class-name="tableRowClassName"
    >
      <!-- 第一列：分类名称 -->
      <el-table-column prop="category" label="类型" width="120">
        <template #default="{ row }">
          <span v-if="row.isMainCategory" class="main-category">
            {{ row.category }}
          </span>
          <span v-else class="sub-category">
            {{ row.category }}
          </span>
        </template>
      </el-table-column>

      <!-- 第二列：指标 -->
      <el-table-column prop="major" label="指标" width="150">
        <template #default="{ row }">
          <span v-if="row.isMainCategory" class="main-category">
            {{ row.major }}
          </span>
          <span v-else class="sub-category">
            {{ row.major }}
          </span>
        </template>
      </el-table-column>

      <!-- 第三列：详细指标 -->
      <el-table-column prop="minor" label="详细指标" width="150">
        <template #default="{ row }">
          <span v-if="row.isMainCategory" class="main-category">
            {{ row.minor }}
          </span>
          <span v-else class="sub-category">
            {{ row.minor }}
          </span>
        </template>
      </el-table-column>

      <!-- 第四列：值 -->
      <el-table-column prop="value" label="值" width="120">
        <template #default="{ row }">
          <span v-if="row.isMainCategory" class="main-category">
            {{ row.value }}
          </span>
          <span v-else class="sub-category">
            {{ row.value }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "EngineeringTable",
  data() {
    return {
      bill: {
        "区域": {
          "整体户型面积/m²": 0,
          "房间区域面积/m²": 0,
          "房间数量": 0,
        },
        "结构图元": {
          "门": {
            "单开门": 0,
            "双开门": 0,
            "推拉门": 0,
          },
          "窗": 0, 
        },
        "功能图元": {
          "灯": 0,
          "开关": 0,
          "电器": 0,
        },
      },
      table_data: [],
      downloadLoading: false,
      autoWidth: true,
      bookType: 'xlsx',
      fileName: 'test',
    }
  },
  created() {
    this.doInit()
  },
  methods: {
    doInit() {
      this.table_data = this.convertBillToTableData(this.bill)
    },
    isPlainObject(obj) {
      return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
    },
    // 为行添加 className，便于样式控制
    tableRowClassName({ row }) {
      return row.isMainCategory ? "main-category-row" : "sub-category-row";
    },
    convertBillToTableData(bill) {
      let table_data = []
      if (bill == null) {
        return
      }
      Object.entries(bill).forEach(([category, value1]) => {
        table_data.push({
          category: category,
          major: "",
          minor: "",
          value: "",
          isMainCategory: true,
        })
        Object.entries(value1).forEach(([major, value2]) => {
          if (!this.isPlainObject(value2)) {
            table_data.push({
              category: "",
              major: major,
              minor: "",
              value: value2,
              isMainCategory: false,
            })
          } else {
            Object.entries(value2).forEach(([minor, value3]) => { 
              table_data.push({ 
                category: "",
                major: major,
                minor: minor,
                value: value3,
                isMainCategory: false,
              })
            })
          }
        })
      })
      return table_data
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['类型', '指标', '详细指标', '值']
        const filterVal = ['category', 'major', 'minor', 'value']
        const list = this.table_data
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.fileName,
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
  },
};
</script>

<style scoped>
.engineering-table {
  margin: 20px;
}

/* 主分类行样式 */
.main-category {
  font-weight: bold;
}

/* 子分类行样式 */
.sub-category {
  padding-left: 20px;
}

/* 表格行样式 */
:deep(.main-category-row) {
  background-color: #f5f7fa;
}

:deep(.sub-category-row) {
  background-color: #ffffff;
}
</style>