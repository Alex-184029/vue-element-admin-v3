<template>
    <div>
      <ul>
        <li v-for="tf in temp_files" :key="tf.file_path">{{ tf.path }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'TempFileList',
    data() {
      return {
        temp_files: []
      };
    },
    created() {
      this.fetchTempFiles();
    },
    methods: {
      fetchTempFiles() {
        axios.get('http://localhost:5000/query_temp_file')
              .then(response => {
                this.temp_files = response.data;

              })
              .catch(error => {
                console.error('There was an error fetching the temp_files:', error);
              });
      }
    }
  };
  </script>