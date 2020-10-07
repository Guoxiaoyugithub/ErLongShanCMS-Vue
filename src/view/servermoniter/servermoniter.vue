<template>
  <div class="tableContent">
      <!-- :data="tableData" -->
    <el-table :data="monterdata" stripe style="width: 100%">
      <el-table-column fixed prop="pid" label="进程ID" width="100"></el-table-column>
      <el-table-column prop="name" label="服务名称" width="200"></el-table-column>
      <el-table-column prop="pm_id" label="PMID" width="100"></el-table-column>
      <el-table-column prop="cpu" label="CPU占用" width="120"></el-table-column>
      <el-table-column prop="memory" label="内存占用" width="150"></el-table-column>
      <el-table-column label="服务状态" width="150">
        <template slot-scope="scope">
            <span style="margin-left: 10px" :class="'serverstatus server_' + scope.row.status">{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pm_uptime" label="更新时间" width="200"></el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="200"></el-table-column>
      <el-table-column label="操作" width="200">
          <el-button type="primary" size="mini">停止</el-button>
          <el-button type="danger" size="mini" >重启</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    components:{
        
    },
    data(){
        return {
            monterdata:[]
        }
    },
    computed:{

    },
    created(){
        this._getMoniterData()
    },
    methods:{
        _getMoniterData:function(){
            const that = this
            axios.get('https://miniapp.zb2l3.com/cms/v1/sysmoniter/serverlist',{

            }).then((res)=>{
                console.log(res.data)
                for (let i in res.data){
                    res.data[i].created_at = that._timestampToTime(res.data[i].created_at)
                    res.data[i].pm_uptime = that._timestampToTime(res.data[i].pm_uptime)
                }
                that.monterdata = res.data
            })
        },
        _timestampToTime:function(timestamp) {
            let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            let D = this.change(date.getDate()) + ' ';
            let h = this.change(date.getHours()) + ':';
            let m = this.change(date.getMinutes()) + ':';
            let s = this.change(date.getSeconds());
            return Y + M + D + h + m + s;
        },
        change:function(t) {
            if (t < 10) {
                return "0" + t;
            } else {
                return t;
            }
        }
    }
}
</script>

<style scoped>
    .tableContent{
        padding: 30px;
    }
    
    .serverstatus{
        font-weight: 600;
    }
    .server_online{
        color:rgb(38, 203, 162);
    }

    .server_stopped{
        color:rgb(117, 133, 162);
    }

    .server_errored{
        color:rgb(235, 127, 101);
    }

</style>