<template>
  <d2-container>
    <h1>个人详情</h1>
    <el-row :gutter="24" style="margin-bottom: 5px" v-if="user !== null">
      <el-col :span="8">
        <user-info :user="user"></user-info>
      </el-col>
      <el-col :span="16">
        <pubkey-info :user="user"></pubkey-info>
        <roles-info :roles="user.roles"></roles-info>
        <user-group-info :userId="user.id"></user-group-info>
        <server-group-info :userId="user.id"></server-group-info>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>

import UserInfo from '../../../components/opscloud/user/UserInfoCard'
import { GET_USER_DETAILS } from '@/api/modules/user/user.details.api.js'
import PubkeyInfo from '../../../components/opscloud/user/details/UserCredentialPubKeyInfoCard'
import RolesInfo from '../../../components/opscloud/user/details/UserRBACRolesInfoCard'
import ServerGroupInfo
  from '../../../components/opscloud/user/details/UserPermissionServerGroupInfoCard'
import UserGroupInfo from '../../../components/opscloud/user/details/UserPermissionGroupInfoCard'

export default {
  data () {
    return {
      user: null
    }
  },
  mounted () {
    this.fetchData()
  },
  components: {
    UserInfo,
    PubkeyInfo, // Ssh公钥
    RolesInfo,
    ServerGroupInfo,
    UserGroupInfo
  },
  methods: {
    fetchData () {
      GET_USER_DETAILS()
        .then(res => {
          this.user = res.body
        })
    }
  }
}
</script>

<style scoped>

</style>
