<template>
  <div class="tableSample">
    <div class="header">
      <div class="header-left">
        <p class="title">文章分类及模块</p>
      </div>
    </div>
    <div style="padding: 20px">
      <el-row :gutter="20">
        <el-col :span="9" style="min-height: 500px">
          <div style="width: 100%; min-height: 500px; background: #eef4f9">
            <div class="header">
              <div class="header-left">
                <p class="title">添加分类</p>
              </div>
            </div>
            <div style="padding: 10px">
              <span style="display: block; margin-bottom: 5px">名称：</span>
              <el-input v-model="input_name" placeholder="请输入分类名称"></el-input>
            </div>
            <div style="padding: 10px">
              <span style="display: block; margin-bottom: 5px">别名：</span>
              <el-input v-model="input_slugname" placeholder="请输入分类别名"></el-input>
            </div>
            <div style="padding: 10px">
              <span style="display: block; margin-bottom: 5px">上级目录：</span>
              <el-select v-model="input_parentid" placeholder="请选择上级目录" style="width: 100%">
                <el-option
                  v-for="item in parentid_list"
                  :key="item.categoryid"
                  :label="item.categoryid + ' ' + item.name + ' (' + item.slugname + ')'"
                  :value="item.categoryid"
                ></el-option>
              </el-select>
            </div>
            <div style="padding: 10px">
              <span style="display: block; margin-bottom: 5px">描述：</span>
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="请输入内容"
                v-model="textarea_desc"
              ></el-input>
            </div>
            <div style="padding: 20px">
              <el-button type="primary" @click="addNewCategory" v-if="!isUpdataStatus">新增</el-button>
              <el-button type="primary" @click="updateCategory" v-if="isUpdataStatus">保存</el-button>
              <el-button type="primary" @click="clearInputOption" v-if="isUpdataStatus">取消</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="15" style="min-height: 500px">
          <div class="grid-content bg-purple">
            <div style="width: 100%; min-height: 500px; background: #eef4f9">
              <div class="header">
                <div class="header-left">
                  <p class="title">分类列表</p>
                </div>
              </div>
              <el-table :data="categoryTableData" style="width: 100%">
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="slugname" label="别名"></el-table-column>
                <el-table-column prop="parentid" label="上级" width="100">
                  <template slot-scope="scope" prop="categoryMapData">
                    {{
                      categoryMapData[scope.row.parentid] === undefined ? '' : categoryMapData[scope.row.parentid].name
                    }}
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="描述">
                  <template slot-scope="scope">
                    <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{
                      scope.row.description
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="postCount" label="文章数" width="80"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <span
                      ><span @click="editCategory(scope.row.categoryid)">编辑</span> |
                      <span @click="deleteCategory(scope.row.categoryid)">移除</span></span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import LinSearch from '@/component/base/search/lin-search'

export default {
  components: {
    LinSearch,
  },
  data() {
    return {
      categoryTableData: [{}],
      categoryMapData: { name: '' },
      input_categoryid: 0,
      input_name: '',
      input_slugname: '',
      input_parentid: '',
      textarea_desc: '',
      parentid_list: [],
      isUpdataStatus: false,
    }
  },
  mounted() {
    this._getCategoriesList()
  },
  methods: {
    _getCategoryMapData() {
      return this.categoryMapData
    },
    _getCategoriesList() {
      axios.get('http://localhost:4001/v1/category/getallcate', {}).then((resolve, reject) => {
        this.categoryTableData = resolve.data.result
        let categoryMapData = {}
        let parentid_list = [{ categoryid: 0, name: '无父级分类', slugname: 'TOP' }]
        categoryMapData[0] = { categoryid: 0, name: '无父级分类', slugname: 'TOP' }
        for (let i in resolve.data.result) {
          parentid_list.push({
            categoryid: resolve.data.result[i].categoryid,
            name: resolve.data.result[i].name,
            slugname: resolve.data.result[i].slugname,
          })
          categoryMapData[resolve.data.result[i].categoryid] = resolve.data.result[i]
        }
        this.parentid_list = parentid_list
        this.categoryMapData = categoryMapData
      })
    },
    addNewCategory() {
      let category = {
        name: this.input_name,
        slugname: this.input_slugname,
        parentid: this.input_parentid,
        description: this.textarea_desc,
      }
      axios.post('http://localhost:4001/v1/category/addcate', category).then((resolve, reject) => {
        if (typeof resolve.data.result.categoryid === 'number') {
          this.$message.success(`新增文章分类成功`)
          this.clearInputOption()
          this._getCategoriesList()
        } else {
          this.$message.error('新增文章分类失败')
        }
      })
    },
    updateCategory() {
      let category = {
        categoryid: this.input_categoryid,
        name: this.input_name,
        slugname: this.input_slugname,
        parentid: this.input_parentid,
        description: this.textarea_desc,
      }
      axios.post('http://localhost:4001/v1/category/updatecate', category).then((resolve, reject) => {
        if (resolve.data.result[0] === 1) {
          this.$message.success(`文章分类修改成功`)
          this.clearInputOption()
          this._getCategoriesList()
        } else {
          this.$message.error('文章分类修改失败')
        }
      })
    },
    deleteCategory(categoryid) {
      axios.get('http://localhost:4001/v1/category/delcate', { params: { categoryid } }).then((resolve, reject) => {
        if (resolve.data.result === 1) {
          this.$message.success(`文章分类删除成功`)
          this._getCategoriesList()
        } else {
          this.$message.error('文章分类删除失败')
        }
      })
    },
    editCategory(categoryid) {
      let categoryinfo = this.categoryMapData[categoryid]
      this.input_categoryid = categoryid
      this.input_name = categoryinfo.name
      this.input_slugname = categoryinfo.slugname
      this.input_parentid = categoryinfo.parentid
      this.textarea_desc = categoryinfo.description
      this.isUpdataStatus = true
    },
    clearInputOption() {
      this.input_name = ''
      this.input_slugname = ''
      this.input_parentid = ''
      this.textarea_desc = ''
      this.isUpdataStatus = false
    },
  },
}
</script>

<style lang="scss" scoped>
.tableSample {
  padding: 0 0 30px;
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
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