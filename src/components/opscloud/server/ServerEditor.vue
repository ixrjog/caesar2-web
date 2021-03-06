<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="base">
        <el-form :model="server">
          <el-form-item label="名称" :label-width="labelWidth" required>
            <el-input v-model.trim="server.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="服务器类型" :label-width="labelWidth" required>
            <el-select v-model="server.serverType" placeholder="选择类型">
              <el-option
                v-for="item in serverTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务器组" :label-width="labelWidth" required>
            <el-select v-model.trim="server.serverGroupId" filterable clearable
                       remote reserve-keyword placeholder="搜索服务器组" :remote-method="getGroup" @clear="getGroup('')">
              <el-option
                v-for="item in serverGroupOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="环境" :label-width="labelWidth" required>
            <el-select v-model.trim="server.envType" clearable
                       remote reserve-keyword placeholder="选择环境" :remote-method="getEnv">
              <el-option
                v-for="item in envOptions"
                :key="item.envType"
                :label="item.envName"
                :value="item.envType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="系统类型" :label-width="labelWidth" required>
            <el-select v-model="server.osType" placeholder="选择类型">
              <el-option
                v-for="item in osTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效" :label-width="labelWidth" required>
            <el-select v-model="server.isActive" placeholder="选择">
              <el-option
                v-for="item in activeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区" :label-width="labelWidth">
            <el-input v-model.trim="server.area" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="公网ip" :label-width="labelWidth">
            <el-input v-model.trim="server.publicIp" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="私网ip" :label-width="labelWidth" required>
            <el-input v-model.trim="server.privateIp" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="序号" :label-width="labelWidth" required>
            <el-input v-model.number="server.serialNumber" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model.trim="server.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="账户配置" name="account" :disabled="server.id === ''">
        <server-account-transfer :serverId="server.id" ref="serverAccountTransfer"></server-account-transfer>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

// API
import { ADD_SERVER, UPDATE_SERVER } from '@/api/modules/server/server.api.js'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api.js'
import { QUERY_SERVER_GROUP_PAGE } from '@/api/modules/server/server.group.api.js'
import ServerAccountTransfer from './child/ServerAccountTransfer'

const serverTypeOptions = [{
  value: 0,
  label: '虚拟服务器'
}, {
  value: 1,
  label: '物理服务器'
}]

const osTypeOptions = [{
  value: 'Linux',
  label: 'Linux'
}, {
  value: 'Windows',
  label: 'Windows'
}, {
  value: 'MacOS',
  label: 'MacOS'
}]

export default {
  data () {
    return {
      activeName: 'base',
      serverTypeOptions: serverTypeOptions,
      labelWidth: '150px',
      envOptions: [],
      serverGroupOptions: [],
      server: '',
      osTypeOptions: osTypeOptions
    }
  },
  name: 'ServerEditor',
  props: ['formStatus', 'activeOptions'],
  components: {
    ServerAccountTransfer
  },
  mixins: [],
  mounted () {
    this.getEnv('')
    this.getGroup('')
  },
  methods: {
    getEnv (name) {
      const requestBody = {
        envName: name,
        page: 1,
        length: 20
      }
      QUERY_ENV_PAGE(requestBody)
        .then(res => {
          this.envOptions = res.body.data
        })
    },
    getGroup (name) {
      const requestBody = {
        name: name,
        serverGroupTypeId: '',
        page: 1,
        length: 10
      }
      QUERY_SERVER_GROUP_PAGE(requestBody)
        .then(res => {
          this.serverGroupOptions = res.body.data
        })
    },
    initData (server) {
      this.server = server
      this.activeName = 'base'
      this.getEnv()
      // 尝试选择匹配服务器组
      if (this.server.serverGroup === null || JSON.stringify(this.server.serverGroup) === '{}') {
        const queryName = this.server.name.replace(new RegExp('-[0-9]+$'), '')
        this.getGroup(queryName)
      } else {
        this.getGroup(this.server.serverGroup.name)
      }

      this.$nextTick(() => {
        const accountIds = this.server.accounts !== null ? this.server.accounts.map(e => e.id) : []
        this.$refs.serverAccountTransfer.init(accountIds)
      })
    },
    handlerUpdate (requestBody) {
      UPDATE_SERVER(requestBody)
        .then(res => {
          this.$message.success('保存成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handlerAdd (requestBody) {
      ADD_SERVER(requestBody)
        .then(res => {
          this.$message.success('新增成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handlerSave () {
      if (this.formStatus.operationType) {
        this.handlerAdd(this.server)
      } else {
        this.handlerUpdate(this.server)
        this.$refs.serverAccountTransfer.save()
      }
    }
  }
}
</script>
