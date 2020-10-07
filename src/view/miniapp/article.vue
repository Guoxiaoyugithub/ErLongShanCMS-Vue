<template>
  <div class="tableSample">
    <div class="header">
      <div class="header-left">
        <p class="title">所有文章</p>
      </div>
    </div>

    <div class="tableSelection">
      文章状态：
      <el-select
        size="medium"
        v-model="valueArticleStatus"
        multiple
        clearable
        placeholder="请选择文章状态"
        class="selection"
      >
        <el-option
          v-for="item in articleStatusMap"
          :key="item.index"
          :label="item"
          :value="item"
        ></el-option> </el-select
      >所属模块：
      <el-select
        size="medium"
        v-model="valueArticleModule"
        multiple
        clearable
        placeholder="请选择所属模块"
        class="selection"
      >
        <el-option v-for="item in articleModuleMap" :key="item.index" :label="item" :value="item"></el-option>
      </el-select>
      <el-button type="primary" @click="handleArticleSearchBtn">查询</el-button>
      <el-button type="info" @click="handleResetArticleSearchBtn">重置</el-button>
      <el-button type="primary" @click="handleCreateNewArticleBtn">新建文章</el-button>
    </div>
    <div class="table-main">
      <el-table :data="tableData.content">
        <el-table-column prop="title" label="标题" width="200">
          <template slot-scope="scope">
            <span style="color: rgb(69, 119, 255); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{
              scope.row.title
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px" :class="'serverstatus server_' + scope.row.status">{{
              scope.row.status
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="categoryid" label="模块及分类" width="200"></el-table-column>
        <el-table-column prop="tags" label="标签" width="200"></el-table-column>
        <el-table-column label="评论" width="100">
          <template>
            <span
              style="
                display: block;
                min-width: 20px;
                height: 20px;
                background: rgb(235, 127, 101);
                border-radius: 50px;
                padding: 0 2px;
              "
            >
              <span
                style="
                  display: block;
                  min-width: 14px;
                  margin: 0 auto;
                  text-align: center;
                  font-size: 14px;
                  color: white;
                "
              >
                <!-- {{ scope.row.commentCount }} -->
                0
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="visits" label="阅读" width="100">
          <template slot-scope="scope">
            <span
              style="
                display: block;
                min-width: 20px;
                height: 20px;
                background: rgb(115, 160, 250);
                border-radius: 50px;
                padding: 0 2px;
              "
            >
              <span
                style="
                  display: block;
                  min-width: 14px;
                  margin: 0 auto;
                  text-align: center;
                  font-size: 14px;
                  color: white;
                "
              >
                {{ scope.row.visits }}
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="发布时间" width="190"></el-table-column>
        <el-table-column label="操作" width="100" prop="articleid">
          <template slot-scope="scope">
            <span
              ><router-link :to="{ path: '/miniapp/articleedit', query: { articleid: scope.row.articleid } }"
                >编辑</router-link
              >
              | <a>设置</a></span
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <!-- <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :background="true"
          :page-size="10"
          :current-page="1"
          v-if="true"
          layout="prev, pager, next, jumper"
          :total="50"
        ></el-pagination>
      </div> -->
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
      valueArticleStatus: '',
      valueArticleModule: '',
      articleStatusMap: {},
      articleModuleMap: {},
      articleStatus: {
        DRAFT: '草稿',
        PUBLISHED: '已发布',
      },
      tableData: {
        content: [],
        pages: 1,
        total: 5,
        page: 0,
        rpp: 10,
        hasNext: false,
        hasPrevious: false,
        isFirst: true,
        isLast: true,
        isEmpty: false,
        hasContent: true,
      },
    }
  },
  mounted() {
    this._getArticleList()
  },
  methods: {
    _getArticleList() {
      axios.get('http://localhost:4001/v1/article/getallart', {}).then((resolve, reject) => {
        this.tableData.content = resolve.data.result
      })
    },
    handleArticleSearchBtn() {},
    handleResetArticleSearchBtn() {},
    handleCreateNewArticleBtn() {
      let article = {
        title: '新建文章',
        editorType: '',
        status: -1,
        categoryid: 0,
        visits: 0,
        likes: 0,
      }
      axios.post('http://localhost:4001/v1/article/addart', article).then((resolve, reject) => {
        console.log(resolve)
        if (typeof resolve.data.result.articleid === 'number') {
          this.$message.success(`新增文章成功`)
        } else {
          this.$message.error('新增文章失败')
        }
        this._getArticleList()
      })
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