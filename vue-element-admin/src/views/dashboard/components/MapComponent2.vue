<template>
    <div ref="mapContainer" class="map-container"></div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue';
  import * as maptalks from 'maptalks';
  
  export default {
    name: 'MapComponent2',
    setup() {
      alert('here is setup for MapComponent2.');
      console.log('here is setup for MapComponent2.');
      const mapContainer = ref(null);
  
      onMounted(() => {
        // 创建一个没有底图的空白地图
        const map = new maptalks.Map(mapContainer.value, {
          center: [11700, 8500], // 初始中心坐标
          zoom: 0,         // 初始缩放级别
          baseLayer: null, // 不使用任何瓦片背景
          attribution: false, // 禁用版权信息
        });
  
        // 创建一个矢量图层
        // const vectorLayer = new maptalks.VectorLayer('vector').addTo(map);
        const vectorLayer = new maptalks.VectorLayer('vector', {
        style: {
          'lineColor': '#ff0000', // 线条颜色（红色）
          'lineWidth': 3,         // 线条宽度
          'polygonFill': '#00ff00', // 多边形填充颜色（绿色）
          'polygonOpacity': 0.5,   // 多边形透明度
          'symbol': {
            'markerType': 'ellipse',
            'markerFill': '#0000ff', // 圆形颜色（蓝色）
            'markerLineColor': '#ff0000', // 圆边框颜色
            'markerWidth': 10,       // 圆的大小
          }
        }
        }).addTo(map);
        console.log('step1');
  
        // 加载并解析GeoJSON数据
        fetch('@/assets/geojsons/plan_5.json') // 替换为你的GeoJSON文件路径
          .then((response) => response.json())
          .then((geojson) => {
            console.log('step2');
            console.log('geojson:', geojson);
            // 将GeoJSON数据转换为MapTalks图形
            const geometries = maptalks.GeoJSON.toGeometry(geojson);
            console.log('step3');
  
            // 将几何对象添加到矢量图层中
            vectorLayer.addGeometry(geometries);
            console.log('step4');
  
            // 调整视图以适应所有几何对象
            map.fitExtent(vectorLayer.getExtent());
            console.log('step5');
          });
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
    height: 100vh; /* 设置地图容器高度，使其全屏显示 */
    background-color: rgb(213, 237, 241); /* 设置背景为空白 */
  }
  </style>
  