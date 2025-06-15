<template>
  <!-- <div class="dashboard-container">
    <component :is="currentRole" />
  </div> -->
  <div>
    <div>
      <h1>
        建筑图纸自动理解系统
      </h1>
    </div>
    <!-- 尝试显示geojson数据 -->
    <div>
      <!-- Leaflet 地图 -->
      <l-map style="height: 600px; width: 100%;" :zoom="zoom" :center="center">
        <!-- 只显示 GeoJSON 数据 -->
        <l-geo-json :geojson="geojsonData" :options="geoJsonOptions" />
      </l-map>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet"
import { ref } from "vue"
import geojsonData from "@/assets/geojsons/plan_5.json" // 导入你的 GeoJSON 文件

export default {
  name: 'Dashboard',
  components: { 
    adminDashboard,
    editorDashboard,
    LMap,
    LGeoJson,
   },
  data() {
    return {
      currentRole: 'adminDashboard',
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  },
  setup() {
    console.log('here is setup function')
    const center = ref([11700, 8500]); // 地图中心坐标
    const zoom = ref(13); // 地图缩放级别

    // 你可以自定义 GeoJSON 数据的样式和交互选项
    const geoJsonOptions = ref({
      style: (feature) => {
        switch (feature.geometry.type) {
          case "LineString":
          case "MultiLineString":
            return { color: "blue", weight: 3 };
          case "Polygon":
          case "MultiPolygon":
            return { color: "green", weight: 2, fillOpacity: 0.5 };
          case "Point":
            return { color: "red", radius: 8 };
          default:
            return { color: "black" };
        }
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties && feature.properties.name) {
          layer.bindPopup(`<strong>${feature.properties.name}</strong>`);
        }
      },
    });

    return {
      center,
      zoom,
      geojsonData, // GeoJSON 数据
      geoJsonOptions, // 样式和交互选项
    };
  },
}
</script>

<style scoped>
/* 地图容器样式 */
#map {
  height: 600px;
  width: 100%;
}
</style>
