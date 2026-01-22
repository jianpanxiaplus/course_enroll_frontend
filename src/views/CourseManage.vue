<template>
  <div style="padding: 20px">
    <h2>课程管理</h2>

    <!-- 新增/编辑表单 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
      <el-form :model="form" label-width="120px" :rules="rules" ref="form">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="课程描述">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="课程名额" prop="maxCapacity">
          <el-input-number v-model="form.maxCapacity" :min="1" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item label="发布人姓名" prop="publisherName">
          <el-input v-model="form.publisherName"></el-input>
        </el-form-item>
        <el-form-item label="发布人手机号">
          <el-input v-model="form.publisherPhone"></el-input>
        </el-form-item>
        <el-form-item label="发布人工号/学号">
          <el-input v-model="form.publisherJobNumber"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-select v-model="form.publisherGrade" placeholder="请选择年级">
            <el-option
                v-for="grade in gradeOptions"
                :key="grade.value"
                :label="grade.label"
                :value="grade.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="form.publisherClass" placeholder="请选择班级">
            <el-option label="未分配" :value="0"/>
            <el-option
                v-for="n in 100"
                :key="n"
                :label="`${n}班`"
                :value="n.toString()"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCourse">保存</el-button>
      </span>
    </el-dialog>

    <!-- 操作按钮 -->
    <el-button type="primary" @click="openCreate">新增课程</el-button>
    <br/><br/>

    <!-- 课程列表 -->
    <el-table :data="courses" border style="width: 100%">
      <el-table-column prop="name" label="课程名称" width="180"></el-table-column>
      <el-table-column prop="description" label="课程内容描述" show-overflow-tooltip></el-table-column>
      <el-table-column prop="maxCapacity" label="课程名额" width="80"></el-table-column>
      <el-table-column prop="publisherName" label="发布人姓名" width="100"></el-table-column>
      <el-table-column prop="publisherPhone" label="发布人手机号" width="120"></el-table-column>
      <el-table-column prop="publisherJobNumber" label="发布人工号/学号" width="120"></el-table-column>
      <el-table-column prop="publisherGrade" label="年级" width="100"></el-table-column>
      <el-table-column prop="publisherClass" label="班级" width="120"></el-table-column>
      <el-table-column prop="createTime" label="发布时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="editCourse(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteCourse(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      courses: [],
      dialogVisible: false,
      form: {
        id: null,
        name: '',
        description: '',
        maxCapacity: 30,
        publisherName: '',
        publisherPhone: '',
        publisherJobNumber: '',
        publisherGrade: '',
        publisherClass: ''
      },
      rules: {
        name: [{required: true, message: '请输入课程名称', trigger: 'blur'}],
        description: [{required: true, message: '请输入课程内容描述', trigger: 'blur'}],
        maxCapacity: [{required: true, message: '请输入可报名名额', trigger: 'blur'}],
        publisherName: [{required: true, message: '请输入发布人姓名', trigger: 'blur'}]
      },
      gradeOptions: [
        {value: '0', label: '全年级'},
        {value: '1', label: '一年级'},
        {value: '2', label: '二年级'},
        {value: '3', label: '三年级'},
        {value: '4', label: '四年级'},
        {value: '5', label: '五年级'},
        {value: '6', label: '六年级'},
        {value: '7', label: '七年级'},
        {value: '8', label: '八年级'},
        {value: '9', label: '九年级'},
      ],
    }
  },
  computed: {
    dialogTitle() {
      return this.form.id ? '编辑课程' : '新增课程'
    }
  },
  filters: {
    formatDate(time) {
      if (!time) return ''
      const d = new Date(time)
      return d.getFullYear() + '-' +
          String(d.getMonth() + 1).padStart(2, '0') + '-' +
          String(d.getDate()).padStart(2, '0') + ' ' +
          String(d.getHours()).padStart(2, '0') + ':' +
          String(d.getMinutes()).padStart(2, '0')
    }
  },
  methods: {
    async loadCourses() {
      const res = await this.$http.get('/api/courses/list')
      this.courses = res.data.data
      this.courses.forEach(course => {
        course.publisherGrade = this.getGradeLabel(Number(course.publisherGrade))
        course.publisherClass = course.publisherClass === '0'? '全班级': course.publisherClass+'班'
      })
      console.log(this.courses)
    },
    openCreate() {
      this.form = {
        id: null,
        name: '',
        description: '',
        maxCapacity: 30,
        publisherName: '',
        publisherPhone: '',
        publisherJobNumber: '',
        publisherGrade: '',
        publisherClass: ''
      }
      this.dialogVisible = true
      this.$nextTick(() => this.$refs.form.clearValidate())
    },
    editCourse(row) {
      this.form = {...row}
      this.dialogVisible = true
      this.$nextTick(() => this.$refs.form.clearValidate())
    },
    async saveCourse() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        try {
          if (this.form.id) {
            await this.$http.put(`/api/courses/${this.form.id}`, this.form)
          } else {
            await this.$http.post('/api/courses', this.form)
          }
          this.$message.success('保存成功')
          this.dialogVisible = false
          this.loadCourses()
        } catch (err) {
          this.$message.error('操作失败')
        }
      })
    },
    async deleteCourse(id) {
      await this.$confirm('确定删除该课程？', '提示', {type: 'warning'})
      try {
        await this.$http.delete(`/api/courses/${id}`)
        this.$message.success('删除成功')
        this.loadCourses()
      } catch (err) {
        this.$message.error('删除失败')
      }
    },
    // 将数字 grade 转为中文标签
    getGradeLabel(gradeNum) {
      if (!gradeNum && gradeNum === 0) return '全年级';

      const labels = ['全年级', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级'];
      let label = labels[gradeNum];
      return label;
      // // 如果 gradeNum 在 0～6 范围内
      // if (gradeNum >= 0 && gradeNum < labels.length) {
      //   return labels[gradeNum];
      // }
      //
      // // 超出范围（比如初中/高中），可自定义逻辑
      // if (gradeNum === 7) return '初一';
      // if (gradeNum === 8) return '初二';
      // if (gradeNum === 9) return '初三';
      // if (gradeNum === 10) return '高一';
      // if (gradeNum === 11) return '高二';
      // if (gradeNum === 12) return '高三';

      // 默认 fallback
      // return `${gradeNum}年级`;
    }
  },
  mounted() {
    this.loadCourses()
  }
}
</script>