<template>
  <div class="course-detail" v-if="course">
    <h2>{{ course.name }}</h2>

    <el-descriptions :column="1" border style="margin-top: 20px;">
      <el-descriptions-item label="年级">
        {{ getGradeLabel(course.publisherGrade) }}
      </el-descriptions-item>
      <el-descriptions-item label="班级">
        {{ getGradeLabel(course.publisherClass) }}
      </el-descriptions-item>
      <el-descriptions-item label="授课教师">
        {{ course.publisherName }}
      </el-descriptions-item>
      <el-descriptions-item label="课程简介">
        {{ course.description || '暂无介绍' }}
      </el-descriptions-item>
      <el-descriptions-item label="课程名额">
        {{ course.maxCapacity }} 人
      </el-descriptions-item>
    </el-descriptions>

    <div style="margin-top: 20px;">
      <el-button @click="$router.back()">返回列表</el-button>

      <!-- 如果未报名，可在此加报名按钮（可选） -->
      <el-button
          v-if="!hasEnrolled"
          type="primary"
          style="margin-left: 10px;"
          @click="handleEnrollFromDetail"
      >
        立即报名
      </el-button>
      <el-button
          v-else
          type="primary"
          style="margin-left: 10px;"
          disabled = true
      >
        已报名
      </el-button>
    </div>
  </div>

  <div v-else style="text-align: center; padding: 50px;">
    课程不存在或加载中...
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      course: null,
      hasEnrolled: false
    };
  },
  created() {
    this.loadCourse();
  },
  methods: {
    async loadCourse() {
      const courseId = this.$route.params.id;
      try {
        const res = await axios.get(`/api/courses/${courseId}`);
        this.course = res.data.data;
        this.hasEnrolled = this.course.enrolled;
      } catch (err) {
        this.$message.error('课程加载失败');
      }
    },

    getGradeLabel(num) {
      const map = {
        0: '全部年级',
        1: '一年级', 2: '二年级', 3: '三年级',
        4: '四年级', 5: '五年级', 6: '六年级',
        7: '七年级', 8: '八年级', 9: '九年级',
      };
      return map[num] || `${num}年级`;
    },

    // 可选：从详情页直接报名
    handleEnrollFromDetail() {
      this.$confirm(`确定要报名【${this.course.name}】吗？`, '确认报名', {
        type: 'warning'
      }).then(async () => {
        // const studentId = localStorage.getItem('studentId');
        const studentId = 1;
        await axios.post('/api/enroll/enroll', { studentId, courseId: this.course.id });
        this.hasEnrolled = true;
        this.$message.success('报名成功！');
      });
    }
  }
};
</script>

<style scoped>
.course-detail {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style>