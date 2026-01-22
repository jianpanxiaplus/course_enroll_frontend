<template>
  <div style="display: flex; height: 100vh">
    <!-- 侧边栏 -->
    <el-menu
        :default-active="$route.path"
        router
        style="width: 200px"
    >
      <el-menu-item index="/home/courses">
        <span>课程管理</span>
      </el-menu-item>
      <!-- 可添加其他菜单项 -->
    </el-menu>

    <!-- 主内容区 -->
    <div style="flex: 1; overflow: auto">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>