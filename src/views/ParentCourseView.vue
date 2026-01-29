<template>
  <div class="parent-course-page">
    <h2>可报名课程列表</h2>


    <!-- 筛选表单 -->
    <el-form :inline="true" :model="searchForm" @submit.prevent>
      <el-form-item label="课程名称">
        <el-input v-model="searchForm.name" placeholder="请输入课程名" clearable />
      </el-form-item>
      <el-form-item label="上课时间">
        <el-input v-model="searchForm.schoolTime" placeholder="请输入上课时间" clearable />
      </el-form-item>
      <el-form-item label="年级">
        <el-select v-model="searchForm.publisherGrade" placeholder="请选择年级" clearable style="width: 130px">
          <el-option label="一年级" value="1" />
          <el-option label="二年级" value="2" />
          <el-option label="三年级" value="3" />
          <el-option label="四年级" value="4" />
          <el-option label="五年级" value="5" />
          <el-option label="六年级" value="6" />
          <el-option label="七年级" value="7" />
          <el-option label="八年级" value="8" />
          <el-option label="九年级" value="9" />
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="searchForm.publisherClass" placeholder="请输入班级" clearable style="width: 130px">
          <el-option
              v-for="n in 100"
              :key="n"
              :label="`${n}班`"
              :value="n"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchCourses">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
        <el-button type="primary" @click="goToMyEnrollments">
          查看我的报名
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 课程表格 -->
    <el-table :data="courses" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="name" label="课程名称" width="180"></el-table-column>
      <el-table-column prop="description" label="课程简介" show-overflow-tooltip></el-table-column>
      <el-table-column prop="schoolTime" label="上课时间" width="180"></el-table-column>
      <el-table-column prop="maxCapacity" label="总人数" width="100"></el-table-column>
      <el-table-column prop="remainingCapacity" label="可报名人数" width="100"></el-table-column>

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
      searchForm : {
        name: '',
        schoolTime: '',
        publisherGrade: '',
        publisherClass: '',
      },
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
        const res = await axios.post('/api/courses/available',this.searchForm);
        this.courses = res.data.data
      } catch (err) {
        this.$message.error('加载课程失败');
        console.error(err);
      }
    },

    resetSearch() {
      this.searchForm = { name: '', publisherGrade: '', publisherClass: '' }
      this.fetchCourses()
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