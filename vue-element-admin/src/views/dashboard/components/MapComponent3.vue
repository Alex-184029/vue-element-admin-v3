<template>
    <div id="map" class="map"></div>
  </template>
  
  <script>
  import * as maptalks from 'maptalks';
  
  export default {
    name: 'MapComponent3',
    mounted() {
      console.log('here is MapComponent3 mounted');
      this.initMap2();
    },
    methods: {
      initMap() {
        console.log('here is MapComponent3 initMap function');
        const map = new maptalks.Map('map', {
          center: [120.193803, 30.267756],
          zoom: 14,
          baseLayer: new maptalks.VectorLayer('base')
        });
  
        const geojsonData = {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "geometry": {
                "type": "LineString",
                "coordinates": [
                  [120.193803, 30.267756],
                  [120.194803, 30.268756]
                ]
              },
              "properties": {
                "name": "Line 1"
              }
            },
            {
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [120.195803, 30.269756]
              },
              "properties": {
                "name": "Point 1"
              }
            },
            {
              "type": "Feature",
              "geometry": {
                "type": "Polygon",
                "coordinates": [
                  [
                    [120.196803, 30.270756],
                    [120.197803, 30.271756],
                    [120.198803, 30.272756],
                    [120.196803, 30.270756]
                  ]
                ]
              },
              "properties": {
                "name": "Polygon 1"
              }
            }
          ]
        };
  
        const vectorLayer = new maptalks.VectorLayer('vector', geojsonData.features).addTo(map);
      },
      initMap2() {
        console.log('here is MapComponent3 initMap2 function');

        const crs = new maptalks.CRS('EPSG:3857');    // 定义平面直角坐标系
        const map = new maptalks.Map('map', {
          center: [11700, 8500],
          // center: [120, 30],
          zoom: 1,
          crs: crs,
          spatialReference: {
            projection: 'EPSG:3857',
            extent: [4900, 1600, 18600, 16400] // 设置画布的最大最小坐标值
          },
        });

        console.log('step1')
        const geojsonData = require('@/assets/geojsons/plan_5.json');
        console.log('name:', geojsonData.name);
        console.log('type:', geojsonData.type);
        console.log('features:', geojsonData.features[0]);
        let features = geojsonData.features;
        console.log('features length:', features.length)
        let features2 = this.filterFeatures(features);
        console.log('features2 length:', features2.length)
  
        const vectorLayer = new maptalks.VectorLayer('vector', features2).addTo(map);
        console.log('step2')
        // 调整视图以适应所有几何对象
        map.fitExtent(vectorLayer.getExtent());
        console.log('step3')
      },
      filterFeatures(features) {
        let ans = [];
        for (let i = 0; i < features.length; i++) {
          if (features[i].geometry != null && (features[i].geometry.type === 'LineString' || features[i].geometry.type === 'MultiLineString')) {
            ans.push(features[i]);
          }
        }
        return ans;
      }
    },
  };
  </script>
  
  <style scoped>
  .map {
    width: 100%;
    height: 100vh;
    background-color: rgb(213, 237, 241);
  }
  </style>