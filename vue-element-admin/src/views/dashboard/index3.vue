<template>
    <!-- <div class="dashboard-container">
      <component :is="currentRole" />
    </div> -->
    <div>
      <h1>
        建筑图纸自动理解系统
      </h1>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex'
  import adminDashboard from './admin'
  import editorDashboard from './editor'
  
  export default {
    name: 'Dashboard',
    components: { adminDashboard, editorDashboard },
    data() {
      return {
        currentRole: 'adminDashboard'
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
    }
  }
  </script>
  