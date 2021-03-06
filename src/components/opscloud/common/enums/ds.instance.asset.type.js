const DsInstanceAssetType = Object.freeze({
  LDAP: {
    USER: 'USER',
    GROUP: 'GROUP'
  },
  GITLAB: {
    GITLAB_USER: 'GITLAB_USER',
    GITLAB_SSHKEY: 'GITLAB_SSHKEY',
    GITLAB_PROJECT: 'GITLAB_PROJECT',
    GITLAB_GROUP: 'GITLAB_GROUP'
  },
  ALIYUN: {
    ECS: 'ECS',
    VPC: 'VPC',
    V_SWITCH: 'V_SWITCH',
    ECS_IMAGE: 'ECS_IMAGE',
    ECS_SG: 'ECS_SG',
    RAM_USER: 'RAM_USER',
    RAM_POLICY: 'RAM_POLICY'
  },
  KUBERNETES: {
    KUBERNETES_NAMESPACE: 'KUBERNETES_NAMESPACE',
    KUBERNETES_DEPLOYMENT: 'KUBERNETES_DEPLOYMENT',
    KUBERNETES_POD: 'KUBERNETES_POD'
  },
  ZABBIX: {
    ZABBIX_USER: 'ZABBIX_USER',
    ZABBIX_USER_GROUP: 'ZABBIX_USER_GROUP',
    ZABBIX_HOST: 'ZABBIX_HOST',
    ZABBIX_HOST_GROUP: 'ZABBIX_HOST_GROUP',
    ZABBIX_TEMPLATE: 'ZABBIX_TEMPLATE',
    ZABBIX_TRIGGER: 'ZABBIX_TRIGGER'
  },
  JENKINS: {
    JENKINS_COMPUTER: 'JENKINS_COMPUTER'
  }
})

export default DsInstanceAssetType
