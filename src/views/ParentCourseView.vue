<template>
  <div class="parent-course-page">
    <h2>可报名课程列表</h2>
    <div style="text-align: right; margin-bottom: 20px;">
      <el-button type="primary" @click="goToMyEnrollments">
        查看我的报名
      </el-button>
    </div>
    <!-- 课程表格 -->
    <el-table :data="courses" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="name" label="课程名称" width="180"></el-table-column>
      <el-table-column prop="description" label="课程简介" show-overflow-tooltip></el-table-column>
      <el-table-column prop="schoolTime" label="上课时间" width="180"></el-table-column>
      <el-table-column prop="maxCapacity" label="总名额" width="100"></el-table-column>
      <el-table-column prop="remainingCapacity" label="剩余名额" width="100"></el-table-column>

      <el-table-column label="年级" width="180">
        <template #default="scope">
          {{ getGradeLabel(scope.row.publisherGrade.toString()) }}
        </template>
      </el-table-column>
      <el-table-column label="班级" width="180">
        <template #default="scope">
          {{ scope.row.publisherClass == 0 ? '全部班' : scope.row.publisherClass + '班' }}
        </template>
      </el-table-column>

      <!--      <el-table-column prop="teacher" label="授课教师" width="120"></el-table-column>-->

      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button
              type="primary"
              size="small"
              @click="handleEnroll(scope.row)"
              :disabled="scope.row.enrolled"
          >
            {{ scope.row.enrolled ? '已报名' : '立即报名' }}
          </el-button>
          <el-button
              type="primary"
              size="small"
              @click="viewDetail(scope.row.id)"
          >
            查看详情
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 报名成功提示 -->
    <el-dialog title="报名成功" :visible.sync="showSuccessDialog" width="30%">
      <span>您已成功报名课程！</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showSuccessDialog = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      courses: [],
      showSuccessDialog: false
    };
  },
  created() {
    this.fetchCourses();
  },
  methods: {
    // 获取课程列表
    async fetchCourses() {
      try {
        const res = await axios.get('/api/courses/list');
        this.courses = res.data.data
      } catch (err) {
        this.$message.error('加载课程失败');
        console.error(err);
      }
    },

    // 年级数字转中文
    getGradeLabel(num) {
      const map = {
        0: '全部年级',
        1: '一年级', 2: '二年级', 3: '三年级',
        4: '四年级', 5: '五年级', 6: '六年级',
        7: '七年级', 8: '八年级', 9: '九年级',
      };
      return map[num] || `${num}年级`;
    },
    // 报名课程
    async handleEnroll(course) {
      console.log('course', course)
      // const studentId = localStorage.getItem('studentId'); // 假设家长已绑定学生
      const studentId = 1;
      if (!studentId) {
        this.$message.warning('请先绑定学生信息');
        return;
      }
      // 弹出确认框
      this.$confirm(`确定要报名【${course.name}】课程吗？`, '确认报名', {
        confirmButtonText: '确定报名',
        cancelButtonText: '再想想',
        type: 'warning',
        center: true
      }).then(async () => {
        // 用户点击了“确定”
        try {
          await axios.post('/api/enroll/enroll', {
            studentId: studentId,
            courseId: course.id
          });

          // 更新前端状态
          course.enrolled = true;

          this.$message.success('报名成功！');

          this.fetchCourses();
          this.showSuccessDialog = true;
        } catch (err) {
          this.$message.error('报名失败，请重试');
          console.error(err);
        }
      }).catch(() => {
        // 用户点击“取消”或关闭弹窗
        this.$message.info('已取消报名');
      });
    },
    goToMyEnrollments() {
      this.$router.push('/myEnrollments');
    },
    viewDetail(courseId) {
      this.$router.push(`/course/detail/${courseId}`);
    }
  }
};
</script>

<style scoped>
.parent-course-page {
  padding: 20px;
}
</style>