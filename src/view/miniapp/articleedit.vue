<template>
  <div class="lin-container">
    <div class="lin-title">文章编辑</div>
    <div class="titleinput-container">
      <el-input class="titleinput" v-model="titleinput" placeholder="请输入标题"></el-input>
    </div>
    <div class="lin-wrap">
      <tinymce @change="change" upload_url="http://dev.lin.colorful3.com/cms/file/" :defaultContent="defaultContent" />
    </div>
    <div class="lin-wrap">
      <el-button type="primary" @click="updateCurrentArticleContent">保存草稿</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Tinymce from '@/component/base/tinymce'

export default {
  data() {
    return {
      titleinput: '',
      text: 'this is default content',
      defaultContent: '',
      content: '',
    }
  },
  mounted() {
    this.getCurrentArticleContent()
  },
  components: {
    Tinymce,
  },
  methods: {
    change(val) {
      this.content = val
    },
    getCurrentArticleContent() {
      axios
        .get('http://localhost:4001/v1/article/getartbyid', { params: { articleid: this.$route.query.articleid } })
        .then((resolve, reject) => {
          let article = resolve.data.result[0]
          this.titleinput = article.title
          this.defaultContent = article.content
        })
    },
    updateCurrentArticleContent() {
      let article = { content: this.content, articleid: parseInt(this.$route.query.articleid), title: this.titleinput }
      console.log(this.content)
      axios.post('http://localhost:4001/v1/article/updateart', article).then((resolve, reject) => {
        console.log(resolve)
        if (resolve.data.result[0] === 1) {
          this.$message.success(`保存成功`)
        } else {
          this.$message.success(`保存失败`)
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.titleinput-container {
  padding: 10px 20px 0px 20px;
}
</style>
