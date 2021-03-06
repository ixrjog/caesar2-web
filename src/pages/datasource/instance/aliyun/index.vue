<template>
  <d2-container>
    <h1>Aliyun实例管理</h1>
    <el-tabs v-model="activeName" v-if="instanceId !== null" @tab-click="handleClick">
      <el-tab-pane label="ECS" name="ecs">
        <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.ECS" :tableLayout="tableLayout.ecs"
                     ref="ecsTable">
          <template v-slot:extend>
            <el-table-column prop="properties" label="cpu">
              <template slot-scope="scope">
                <span>{{ scope.row.properties.cpu }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="properties" label="内存(GiB)">
              <template slot-scope="scope">
                <span>{{ scope.row.properties.memory }}</span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="Image" name="image">
        <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.ECS_IMAGE" :tableLayout="tableLayout.image"
                     ref="imageTable">
          <template v-slot:extend>
            <el-table-column label="操作系统" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.properties.oSName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="系统大小(GiB)">
              <template slot-scope="scope">
                <span>{{ scope.row.properties.size }}</span>
              </template>
            </el-table-column>
            <el-table-column label="描述" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.description }}</span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="VPC" name="vpc">
        <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.VPC" :tableLayout="tableLayout.vpc"
                     ref="vpcTable">
          <template v-slot:extend>
            <el-table-column label="安全组" width="450">
              <template slot-scope="scope">
                <div v-for="sg in getSecurityGroups(scope.row)" :key="sg.id" class="sgLabel">
                  <el-tag :type="sg.isActive?'success':'info'">{{ sg.name }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="交换机" width="350">
              <template slot-scope="scope">
                <el-tree :data="getVSwitches(scope.row)" accordion></el-tree>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="RAM用户" name="ramUser">
        <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.RAM_USER" :tableLayout="tableLayout.ramUser"
                     ref="ramUserTable">
          <template v-slot:extend>
            <el-table-column  label="手机">
              <template slot-scope="scope">
                <span>{{ scope.row.properties.mobilePhone }}</span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>
      <el-tab-pane label="RAM策略" name="ramPolicy">
        <asset-table :instanceId="instanceId" :assetType="assetType.ALIYUN.RAM_POLICY" :tableLayout="tableLayout.ramPolicy"
                     ref="ramPolicyTable">
          <template v-slot:extend>
            <el-table-column  label="描述">
              <template slot-scope="scope">
                <span>{{ scope.row.description }}</span>
              </template>
            </el-table-column>
          </template>
        </asset-table>
      </el-tab-pane>

    </el-tabs>
  </d2-container>
</template>

<script>

import AssetTable from '../../../../components/opscloud/datasource/asset/AssetTable'
import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type'

const treeObj = {
  label: '',
  children: []
}

const tableLayout = {
  ecs: {
    assetId: {
      alias: '实例ID'
    },
    name: {
      alias: '实例名称'
    },
    assetKey: {
      alias: '私网IP'
    },
    assetKey2: {
      alias: '公网IP',
      show: true
    },
    zone: {
      alias: '区',
      show: true
    }
  },
  image: {
    assetId: {
      alias: '镜像ID'
    },
    name: {
      alias: '镜像名称'
    },
    assetKey: {
      alias: '镜像id',
      show: false
    },
    assetKey2: {
      show: false
    },
    zone: {
      alias: '区',
      show: false
    }
  },
  vpc: {
    assetId: {
      alias: '实例ID'
    },
    name: {
      alias: '名称'
    },
    assetKey: {
      alias: '手机',
      show: false
    },
    assetKey2: {
      alias: '网段',
      show: true
    },
    zone: {
      alias: '区',
      show: false
    }
  },
  ramUser: {
    assetId: {
      alias: 'User ID'
    },
    name: {
      alias: '名称'
    },
    assetKey: {
      alias: '用户名',
      show: true
    },
    assetKey2: {
      alias: 'Email',
      show: true
    },
    zone: {
      alias: '区',
      show: false
    }
  },
  ramPolicy: {
    assetId: {
      alias: '策略名称'
    },
    name: {
      alias: '策略名称'
    },
    assetKey: {
      alias: '策略类型',
      show: true
    },
    assetKey2: {
      alias: '',
      show: false
    },
    zone: {
      alias: '区',
      show: false
    }
  }
}

export default {
  data () {
    return {
      activeName: 'ecs',
      instanceId: null,
      tableLayout: tableLayout,
      assetType: DsInstanceAssetType
    }
  },
  computed: {},
  mounted () {
    this.instanceId = this.$route.query.id
    this.init()
  },
  components: {
    AssetTable
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'ecs') {
        this.$refs.ecsTable.fetchData()
      }
      if (tab.name === 'image') {
        this.$refs.imageTable.fetchData()
      }
      if (tab.name === 'vpc') {
        this.$refs.vpcTable.fetchData()
      }
      if (tab.name === 'ramUser') {
        this.$refs.ramUserTable.fetchData()
      }
      if (tab.name === 'ramPolicy') {
        this.$refs.ramPolicyTable.fetchData()
      }
    },
    init () {
      this.$nextTick(() => {
        this.$refs.ecsTable.fetchData()
      })
    },
    getVSwitches (row) {
      const { V_SWITCH } = row.tree
      const map = new Map()
      for (const sw of V_SWITCH) {
        if (map.get(sw.zone) !== undefined && JSON.stringify(map.get(sw.zone)) !== '[]') {
          map.get(sw.zone).push(sw)
        } else {
          const list = []
          list.push(sw)
          map.set(sw.zone, list)
        }
      }
      const options = []
      for (const [key, value] of map.entries()) {
        const treeNode = Object.assign({}, treeObj)
        const children = []
        for (const item of value) {
          children.push({
            label: `${item.name} (${item.assetKey2})`
          })
        }
        treeNode.label = `${key} (${children.length})`
        treeNode.children = children
        options.push(treeNode)
      }
      return options
    },
    getSecurityGroups (row) {
      const { ECS_SG } = row.tree
      return ECS_SG
    }
  }
}
</script>

<style scoped>
.sgLabel {
  float: left;
  width: 50%;
}
</style>
