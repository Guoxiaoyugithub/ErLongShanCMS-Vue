<template>
  <!-- 列表页面 -->
  <div class="tableSample">
    <div class="header">
      <div class="header-left">
        <p class="title">系统课表库</p>
      </div>
      <div class="header-right">
        <lin-search @query="onQueryChange" placeholder="请输入" />
      </div>
    </div>
    <div class="tableSelection">
      <el-select
        size="medium"
        v-model="valueSelectYearrange"
        multiple
        clearable
        placeholder="请选择学年"
        class="selection"
      >
        <el-option v-for="item in yearRangeMap" :key="item.index" :label="item" :value="item"></el-option>
      </el-select>
      <el-select
        size="medium"
        v-model="valueSelectSemester"
        multiple
        clearable
        placeholder="请选择学期"
        class="selection"
      >
        <el-option v-for="item in semesterMap" :key="item.index" :label="item" :value="item"></el-option>
      </el-select>
      <el-select
        size="medium"
        v-model="valueSelectGrade"
        multiple
        clearable
        placeholder="请选择年级"
        class="selection"
      >
        <el-option v-for="item in gradeMap" :key="item.index" :label="item" :value="item"></el-option>
      </el-select>
      <el-select
        size="medium"
        v-model="valueSelectCollege"
        multiple
        collapse-tags
        clearable
        placeholder="请选择学院"
        class="selection"
      >
        <el-option v-for="item in collegeMap" :key="item.index" :label="item" :value="item"></el-option>
      </el-select>
      <el-button type="primary" @click="handleCurriculumSearchBtn">查询</el-button>
    </div>
    <div class="table-main">
      <el-table :data="tableCurriculumData">
        <el-table-column prop="_id" label="ID" width="220"></el-table-column>
        <el-table-column prop="yearRange" label="学年" width="150"></el-table-column>
        <el-table-column prop="semester" label="学期" width="100"></el-table-column>
        <el-table-column prop="grade" label="年级" width="130"></el-table-column>
        <el-table-column prop="college" label="学院" width="180"></el-table-column>
        <el-table-column prop="class_id" label="班级" width="180"></el-table-column>
        <el-table-column prop="teachingScheme" label="专业" width="220"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination" v-if="!searchKeyword">
        <el-pagination
          @current-change="handleCurrentChange"
          :background="true"
          :page-size="pageCount"
          :current-page="currentPage"
          v-if="refreshPagination"
          layout="prev, pager, next, jumper"
          :total="total_nums"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios'
import LinSearch from '@/component/base/search/lin-search'
import { tableColumn } from '../../plugin/lin-cms-ui/view/table/data.js'
import movie from '../../plugin/lin-cms-ui/model/movie.js'

export default {
  components: {
    LinSearch,
  },
  data() {
    return {
      tableData: [],
      tableCurriculumData: [],
      loading: false,
      Hidden: true, // 默认隐藏自定义排序列
      searchKeyword: '',
      // 下拉菜单选项相关
      valueSelectYearrange: [],
      valueSelectSemester: [],
      valueSelectGrade: [],
      valueSelectCollege: [],
      yearRangeMap: [],
      semesterMap: [],
      gradeMap: [],
      collegeMap: [],
      // 定制列相关
      checkList: [],
      filterTableColumn: [],
      // 分页相关
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      total_nums: 180, // 分组内的用户总数
      // 固定列相关
      dialogTableVisible: false,
      fixedLeftList: [],
      fixedRightList: [],
      value: '',
      // 单元格编辑相关
      editRow: 0,
      showTooltip: true,
    }
  },
  computed: {},
  created() {
    // 获取数据
    this._getCurriculumData((this.currentPage - 1) * this.pageCount, this.pageCount)
    this._getCurriculumDropDown()
    this.tableColumn = tableColumn
    // 操作栏
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]
    // 定制列
    this.tempCheckList = tableColumn.map(v => v.label).slice()
    this.checkList = tableColumn.map(v => v.label)
    this.filterTableColumn = tableColumn.filter(v => this.checkList.indexOf(v.label) > -1)
  },
  methods: {
    // 获取数据

    _getCurriculumData(skip, limit, query = { yearRange: [], Semester: [], Grade: [], College: [] }) {
      const that = this
      query = JSON.stringify(query).replace(/"([a-zA-Z]*?)":/g, '$1:')
      const res = axios
        .get('https://miniapp.zb2l3.com/curriculum', {
          params: {
            query: `query{
            getSysCurriculumPagination(skip: ${skip}, limit: ${limit},query: ${query}) {
              _id,yearRange,semester,grade,college,class_id,teachingScheme
            }
            getSysCurriculumCount(query: ${query}){
              resultCount
            }
          }`,
          },
        })
        .then(res => {
          that.total_nums = Math.ceil(res.data.data.getSysCurriculumCount[0].resultCount)
          that.tableCurriculumData = [...res.data.data.getSysCurriculumPagination]
        })
    },
    _getCurriculumDropDown() {
      const that = this
      const res = axios
        .get('https://miniapp.zb2l3.com/curriculum', {
          params: {
            query: `query{
              yearRangeMap:getSysCurriculumFieldMap(field:"yearRange"){
                fieldMapArray
              }
              semesterMap:getSysCurriculumFieldMap(field:"semester"){
                fieldMapArray
              }
              gradeMap:getSysCurriculumFieldMap(field:"grade"){
                fieldMapArray
              }
              collegeMap:getSysCurriculumFieldMap(field:"college"){
                fieldMapArray
              }
          }`,
          },
        })
        .then(res => {
          let result = res.data.data
          let key = Object.keys(result)
          for (let temp in result) {
            that[temp] = result[temp][0]['fieldMapArray']
          }
        })
    },
    handleCurriculumSearchBtn() {
      let valueSelectYearrange = this.valueSelectYearrange
      let valueSelectSemester = this.valueSelectSemester
      let valueSelectGrade = this.valueSelectGrade
      let valueSelectCollege = this.valueSelectCollege
      console.log(valueSelectYearrange, valueSelectSemester, valueSelectGrade, valueSelectCollege)
      if (
        valueSelectYearrange === [] &&
        valueSelectSemester === [] &&
        valueSelectGrade === [] &&
        valueSelectCollege === []
      ) {
        return
      } else {
        this._getCurriculumData(1, 10, {
          yearRange: valueSelectYearrange,
          Semester: valueSelectSemester,
          Grade: valueSelectGrade,
          College: valueSelectCollege,
        })
      }
    },
    dropDownItemClick(item) {
      console.log(item)
    },

    rowClick(val) {
      console.log(val)
    },

    // 定制列
    handleChange() {
      this.filterTableColumn = tableColumn.filter(v => this.checkList.indexOf(v.label) > -1)
    },
    showRowOperateModal() {},

    // 变更排序
    handleSort(val, rowData) {
      console.log('rowData', rowData)
      this.$message({
        type: 'success',
        message: `排序已更改为：${val}`,
      })
    },

    // 推荐
    handleRecommend(val, rowData) {
      this.loading = true
      console.log(val, rowData)
      if (val) {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '推荐成功',
          })
        }, 1000)
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '取消推荐',
          })
        }, 1000)
      }
    },

    expandChange(row, expandedRows) {
      console.log(row, expandedRows)
    },

    // 单元格编辑
    handleCellEdit(row) {
      row.editFlag = true // eslint-disable-line
      this.$set(this.filterTableColumn[7], 'width', 200)
      this.tempEditRemark = row.remark
      this.editRow++
    },
    handleCellSave(row) {
      row.editFlag = false // eslint-disable-line
      setTimeout(() => {
        this.editRow--
        this.$message({
          type: 'success',
          message: '修改成功',
        })
      }, 1000)
    },
    handleCellCancel(row) {
      row.editFlag = false // eslint-disable-line
      console.log(this.tempEditRemark)
      row.remark = this.tempEditRemark // eslint-disable-line
      this.editRow--
    },

    // 切换分页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      this._getCurriculumData((this.currentPage - 1) * this.pageCount, this.pageCount, {
        yearRange: this.valueSelectYearrange,
        Semester: this.valueSelectSemester,
        Grade: this.valueSelectGrade,
        College: this.valueSelectCollege,
      })
      this.loading = false
    },

    // 操作列
    buttonMethods(func, index, row) {
      const self = this
      const { methods } = this.$options
      methods[func](self, index, row)
    },
    handleEdit(self, index, row) {
      self.handleCellEdit(row)
      console.log(index, row)
    },
    handleDelete(self, index, val) {
      console.log(val)
      self
        .$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(async () => {
          self.loading = true // eslint-disable-line
          setTimeout(() => {
            self.tableData.splice(index, 1)
            self.loading = false // eslint-disable-line
          }, 1000)
        })
    },

    // 搜索
    onQueryChange(query) {
      this.searchKeyword = query.trim()
      if (!query) {
        this._getTableData(0, 20)
        return
      }
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.tableData = movie.getDataByQuery(this.searchKeyword)
      }, 1000)
    },
  },

  watch: {
    // 监听固定列变化
    fixedLeftList() {
      this.filterTableColumn.map((item, index) => {
        if (this.fixedLeftList.indexOf(item.label) > -1) {
          this.$set(this.filterTableColumn[index], 'fixed', 'left')
        } else if (this.fixedRightList.indexOf(item.label) === -1) {
          this.$set(this.filterTableColumn[index], 'fixed', false)
        }
        return ''
      })
      console.log(this.filterTableColumn)
    },
    fixedRightList() {
      this.filterTableColumn.map((item, index) => {
        if (this.fixedRightList.indexOf(item.label) > -1) {
          this.$set(this.filterTableColumn[index], 'fixed', 'right')
        } else if (this.fixedLeftList.indexOf(item.label) === -1) {
          this.$set(this.filterTableColumn[index], 'fixed', false)
        }
        return ''
      })
      console.log(this.filterTableColumn)
    },
    editRow() {
      if (this.filterTableColumn[7]) {
        this.editRow === 0 // eslint-disable-line
          ? this.$set(this.filterTableColumn[7], 'width', 200) // eslint-disable-line
          : null // eslint-disable-line
      }
      return ''
    },
  },
}
</script>

<style lang="scss" scoped>
.tableSample {
  padding: 0 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    border-bottom: 1px solid #dae1ed;

    .header-left {
      float: left;

      .title {
        height: 59px;
        line-height: 59px;
        color: $parent-title-color;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .header-right {
      float: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .tableSelection {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 30px;
    margin-top: 20px;

    .selection {
      margin-right: 20px;
    }
  }

  .table-main {
    padding: 0 30px;
    margin-top: 30px;
  }

  .top-operate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    margin-top: 30px;
  }

  .sort-input {
    width: 50px;
    background: none;
    justify-content: space-around;
  }

  .table-edit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .content {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .cell-icon {
      cursor: pointer;
      color: #3963bc;
      font-size: 16px;
    }

    .cell-icon-edit {
      display: flex;
      margin-left: 20px;
      width: 50px;
      justify-content: space-between;

      .cell-cancel {
        cursor: pointer;
        color: #3963bc;
        font-size: 16px;
      }

      .cell-save {
        cursor: pointer;
        color: #3963bc;
        font-size: 16px;
        margin-right: -20px;
      }
    }
  }

  .m-20 {
    margin-bottom: 10px;
    margin-top: 5px;
  }

  .summary {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;

    img {
      width: 135px;
      height: 200px;
    }

    .demo-table-expand {
      font-size: 0;
      margin-left: 30px;
      display: flex;
      flex-direction: column;

      label {
        width: 90px;
        color: #99a9bf;
      }

      .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        display: flex;
        flex-direction: row;
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
