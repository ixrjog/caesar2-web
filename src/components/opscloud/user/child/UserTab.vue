<template>
  <div>
    <el-form :model="user">
      <el-form-item label="用户名" :label-width="labelWidth" required>
        <el-input v-model="user.username" placeholder="请输入内容" :disabled="!operationType"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="labelWidth" :required="operationType">
        <el-input v-model="user.password" clearable placeholder="请输入内容">
          <el-button slot="append" @click="handlerRandomWord"><i class="fa fa-key" aria-hidden="true"></i></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="显示名" :label-width="labelWidth" required>
        <el-input v-model="user.displayName" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="姓名" :label-width="labelWidth">
        <el-input v-model="user.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="电话" :label-width="labelWidth">
        <el-input v-model="user.phone" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="labelWidth" required>
        <el-input v-model="user.email" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="微信" :label-width="labelWidth">
        <el-input v-model="user.wechat" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="留言" :label-width="labelWidth">
        <el-input v-model="user.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { ADD_USER, UPDATE_USER } from '@/api/modules/user/user.api.js'
import tools from '@/libs/tools.js'

export default {
  name: 'UserTab',
  props: ['operationType'],
  data () {
    return {
      user: {},
      labelWidth: '150px'
    }
  },
  methods: {
    initData (user) {
      this.user = user
    },
    handlerRandomWord () {
      this.user.password = tools.randomWord(false, 20)
    },
    handlerUpdate (requestBody) {
      UPDATE_USER(requestBody)
        .then(res => {
          this.$message.success('保存成功!')
          this.$emit('close')
        })
    },
    handlerAdd (requestBody) {
      ADD_USER(requestBody)
        .then(res => {
          this.$message.success('新增成功!')
          this.$emit('close')
        })
    },
    save () {
      if (this.operationType) {
        this.handlerAdd(this.user)
      } else {
        this.handlerUpdate(this.user)
      }
    }
  }
}
</script>

<style scoped>

</style>
