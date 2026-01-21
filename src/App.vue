<template>
  <div id="app" style="padding: 20px">
    <h1>选课报名系统</h1>

    <el-form :inline="true">
      <el-form-item label="学生ID">
        <el-input v-model.number="studentId" placeholder="请输入学生ID" style="width: 150px"></el-input>
      </el-form-item>
      <el-button type="primary" @click="loadData">加载数据</el-button>
    </el-form>

    <el-tabs v-model="activeTab">
      <!-- 所有课程 -->
      <el-tab-pane label="可选课程" name="courses">
        <el-table :data="allCourses" style="width: 100%">
          <el-table-column prop="name" label="课程名称"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  type="success"
                  @click="enroll(scope.row.id)"
                  :disabled="isEnrolled(scope.row.id)"
              >
                {{ isEnrolled(scope.row.id) ? '已报名' : '报名' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 已报名课程 -->
      <el-tab-pane label="我的课程" name="myCourses">
        <el-table :data="myCourses" style="width: 100%">
          <el-table-column prop="name" label="课程名称"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="cancel(scope.row.id)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      studentId: 1,
      activeTab: 'courses',
      allCourses: [],
      myCourses: []
    }
  },
  methods: {
    async loadData() {
      if (!this.studentId || this.studentId <= 0) {
        this.$message.error('请输入有效学生ID')
        return
      }
      await this.loadAllCourses()
      await this.loadMyCourses()
    },
    async loadAllCourses() {
      const res = await this.$http.get('/api/courses')
      this.allCourses = res.data
    },
    async loadMyCourses() {
      const res = await this.$http.get('/api/my-courses', {
        params: { studentId: this.studentId }
      })
      this.myCourses = res.data
    },
    isEnrolled(courseId) {
      return this.myCourses.some(c => c.id === courseId)
    },
    async enroll(courseId) {
      const res = await this.$http.post('/api/enroll', null, {
        params: { studentId: this.studentId, courseId }
      })
      if (res.data.success) {
        this.$message.success(res.data.message)
        this.loadData()
      } else {
        this.$message.error(res.data.message)
      }
    },
    async cancel(courseId) {
      const res = await this.$http.delete('/api/enroll', {
        params: { studentId: this.studentId, courseId }
      })
      if (res.data.success) {
        this.$message.success(res.data.message)
        this.loadData()
      } else {
        this.$message.error(res.data.message)
      }
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>