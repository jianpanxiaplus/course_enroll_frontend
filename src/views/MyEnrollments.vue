<template>
  <div class="my-enrollments">
    <h2>我的报名课程</h2>

    <el-table :data="enrollments" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="courseName" label="课程名称" width="180"></el-table-column>

      <el-table-column label="年级" width="100">
        <template #default="scope">
          {{ getGradeLabel(scope.row.publisherGrade) }}
        </template>
      </el-table-column>
      <el-table-column label="班级" width="100">
        <template #default="scope">
          {{ scope.row.publisherClass === 0 ? '全部班': scope.row.publisherClass + '班'}}
        </template>
      </el-table-column>

      <el-table-column prop="publisherName" label="授课教师" width="120"></el-table-column>
      <el-table-column prop="description" label="课程简介"></el-table-column>

      <el-table-column label="报名时间" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.enrollTime) }}
        </template>
      </el-table-column>

      <!-- 可选：取消报名 -->
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="danger" size="small" @click="cancelEnroll(scope.row.enrollmentId)">
            取消报名
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="enrollments.length === 0" style="text-align: center; margin-top: 40px; color: #999;">
      暂无报名记录
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      enrollments: []
    };
  },
  created() {
    this.loadMyEnrollments();
  },
  methods: {
    async loadMyEnrollments() {
      // const studentId = localStorage.getItem('studentId');
      const studentId = 1;
      if (!studentId) {
        this.$message.warning('未绑定学生');
        return;
      }

      try {
        const res = await axios.get('/api/enroll/myEnrollments', {
          params: { studentId }
        });
        this.enrollments = res.data.data;
      } catch (err) {
        this.$message.error('加载报名记录失败');
      }
    },

    async cancelEnroll(enrollmentId) {
      try {
        await this.$confirm('确定要取消报名吗？', '提示', {
          type: 'warning'
        });

        await axios.delete(`/api/enroll/${enrollmentId}`);
        this.$message.success('已取消报名');
        this.loadMyEnrollments(); // 刷新列表
      } catch (err) {
        if (err !== 'cancel') {
          this.$message.error('取消失败');
        }
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

    formatDate(timeStr) {
      if (!timeStr) return '';
      const date = new Date(timeStr);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.my-enrollments {
  padding: 20px;
}
</style>