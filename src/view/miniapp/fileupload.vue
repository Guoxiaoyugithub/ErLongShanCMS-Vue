<template>
  <div class="lin-container" style="position:relative">
    <div class="lin-title">图片上传</div>
    <div style="width:calc(100% - 370px);margin-top:40px">
      <el-form label-width="40px">
        <el-form-item>
          <upload-imgs
            ref="uploadEle2"
            v-on:parentFun="parentFun"
            v-on:uploadFinal="uploadFinal"
            :value="initData"
            :auto-upload="false"
            :rules="rules"
            :multiple="true"
          />
          <div>
            <el-button @click="getValue('uploadEle2')">上传图片</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="imginforlist">
      <el-card shadow="hover" v-for="item in imgInforList" v-bind:key="item.index">
        <div class="item text">文件名：{{item.name}}</div>
        <div class="item text">文件大小：{{item.size}}</div>
        <div class="item text">远程地址：{{ item.remoteUrl }}</div>
      </el-card>
    </div>
  </div>
</template>

<script>
import UploadImgs from '@/component/base/upload-image'
/** 生成随机字符串 */
function createId() {
  return Math.random().toString(36).substring(2)
}
export default {
  name: 'ImgsUploadStage1',
  components: {
    UploadImgs,
  },
  data() {
    return {
      remoteName: 'remoteFucAsync',
      remoteNameObj: {
        remoteFucAsync: this.remoteFucAsync,
        remoteFuc: this.remoteFuc,
        remoteFucSuccessAsync: this.remoteFucSuccessAsync,
        remoteFucSuccess: this.remoteFucSuccess,
      },
      fit: 'cover',
      rules: {
        minWidth: 100,
        minHeight: 100,
        maxSize: 5,
      },
      rules2: {
        minWidth: 100,
        maxWidth: 2000,
        allowAnimated: 1,
      },
      initData: [
        // {
        //   id: '123',
        //   display:
        //     'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        //   src:
        //     'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        //   imgId: '12381900',
        // }
      ],
      imgInforList: [],
    }
  },
  // 计算属性设置
  computed: {
    // imgList:this.$refs['uploadEle2']
  },
  // 数据变更监听
  watch: {},
  mounted() {},
  // 当页面使用路由参数时, 参数部分变化触发的动作在本函数中操作
  // https://router.vuejs.org/zh/guide/advanced/navigation-guards.htmll#组件内的守卫
  // beforeRouteUpdate(to, from, next) {
  //   // this.name = to.params.name
  //   // this.init()
  //   // next()
  // },
  methods: {
    async beforeFuc() {
      this.$message.error('进入自定义校验函数, 并返回false终止上传')
      return false
    },
    async getValue(name) {
      console.log(await this.$refs[name].getValue())
    },
    parentFun(value) {
      let res = {}
      for (let key in value) {
        res[value[key].id] = value[key]
      }
      console.log(res)
      this.imgInforList = res
    },
    uploadFinal(value) {
      if (value['uploadinfo']['statusCode'] === 200) {
        // vue监听不到对象属性的变化，所以使用$set方法
        this.$set(this.imgInforList[value.id], 'remoteUrl', value.uploadinfo.Location)
      }
      console.log(this.imgInforList)
    },
    doClear() {
      this.$refs.uploadEle9.clear()
    },
    remoteFucAsync() {
      return Promise.resolve(false)
    },
    remoteFuc(file, cb) {
      setTimeout(() => {
        cb(false)
      }, 3000)
    },
    remoteFucSuccessAsync() {
      return Promise.resolve({
        id: createId,
        url: 'http://dev.koa.7yue.pro/assets/2019/06/30/abc823a9-5ef4-48e1-bdf6-dd4f0ab92482.jpg',
      })
    },
    remoteFucSuccess(file, cb) {
      setTimeout(() => {
        cb({
          id: createId,
          url: 'http://dev.koa.7yue.pro/assets/2019/06/30/abc823a9-5ef4-48e1-bdf6-dd4f0ab92482.jpg',
        })
      }, 3000)
    },
  },
}
</script>

<style scoped>
.imginforlist {
  width: 370px;
  height: 500px;
  position: absolute;
  right: 0;
  top: 60px;
}

.imginforlist .item {
  padding: 8px 0;
}

.imginforlist .text {
  font-size: 14px;
}
</style>