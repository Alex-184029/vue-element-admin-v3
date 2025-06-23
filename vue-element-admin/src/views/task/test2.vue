<template>
  <div class="engineering-info">
    <h2>图纸 xxx 的工程量信息统计</h2>

    <!-- 区域面积 -->
    <el-table :data="areaData" border style="width: 100%" :show-header="false">
      <el-table-column prop="label" width="200" />
      <el-table-column>
        <template #default="scope">
          {{ item[scope.row.key] }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 结构图元：门 -->
    <h3 style="margin-top: 20px;">结构图元 - 门</h3>
    <el-table :data="doorData" border style="width: 100%" :show-header="false">
      <el-table-column prop="label" width="200" />
      <el-table-column>
        <template #default="scope">
          {{ item[scope.row.key] }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 结构图元：窗 -->
    <h3 style="margin-top: 20px;">结构图元 - 窗</h3>
    <el-table :data="windowData" border style="width: 100%" :show-header="false">
      <el-table-column prop="label" width="200" />
      <el-table-column>
        <template #default="scope">
          {{ item[scope.row.key] }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 功能图元 -->
    <h3 style="margin-top: 20px;">功能图元</h3>
    <el-table :data="functionData" border style="width: 100%" :show-header="false">
      <el-table-column prop="label" width="200" />
      <el-table-column>
        <template #default="scope">
          {{ item[scope.row.key] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: {
        total_area: 120.5,
        room_area: 85.2,
        room_num: 5,
        door_single_num: 3,
        door_double_num: 1,
        door_slide_num: 2,
        window_num: 4,
        light_num: 10,
        switch_num: 6,
        electric_num: 3,
      },
      areaData: [
        { label: '整体户型面积/m²', key: 'total_area' },
        { label: '房间区域面积/m²', key: 'room_area' },
        { label: '房间数量', key: 'room_num' },
      ],
      doorData: [
        { label: '单开门数量', key: 'door_single_num' },
        { label: '双开门数量', key: 'door_double_num' },
        { label: '推拉门数量', key: 'door_slide_num' },
      ],
      windowData: [
        { label: '窗数量', key: 'window_num' },
      ],
      functionData: [
        { label: '灯数量', key: 'light_num' },
        { label: '开关数量', key: 'switch_num' },
        { label: '电器数量', key: 'electric_num' },
      ]
    }
  }
}
</script>

<style scoped>
.engineering-info {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
}
</style>
