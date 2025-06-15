<template>
    <div ref="mapContainer" class="map-container"></div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue';
  import 'ol/ol.css';  // 引入OpenLayers的CSS
  import { Map, View } from 'ol';
  import GeoJSON from 'ol/format/GeoJSON';
  import VectorSource from 'ol/source/Vector';
  import VectorLayer from 'ol/layer/Vector';
  import { Stroke, Style, Fill, Circle as CircleStyle } from 'ol/style';
  
  export default {
    name: 'MapComponent1',
    setup() {
      console.log('here is setup function for MapComponent1')
      const mapContainer = ref(null);
  
      onMounted(() => {
        // 定义矢量图层
        const vectorSource = new VectorSource({
          url: '@/assets/geojsons/plan_5.json',
          format: new GeoJSON(),
        });
  
        // 定义样式
        const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
            stroke: new Stroke({
              color: '#ffcc33', // 线条颜色
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.6)', // 填充颜色
            }),
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: '#ffcc33',
              }),
            }),
          }),
        });
  
        // 创建地图
        const map = new Map({
          target: mapContainer.value,
          layers: [vectorLayer], // 只加载矢量图层
          view: new View({
            center: [11700, 8500], // 设置中心坐标，使用投影坐标系 EPSG:3857
            zoom: 3,        // 初始缩放级别
          }),
        });
  
        // 禁用默认的瓦片背景，设置为空白
        map.getLayers().item(0).set('type', 'base'); // 不渲染底图
  
      });
  
      return {
        mapContainer,
      };
    },
  };
  </script>
  
  <style>
  .map-container {
    width: 100%;
    height: 100vh; /* 设置地图容器的高度，确保地图全屏显示 */
  }
  </style>
  