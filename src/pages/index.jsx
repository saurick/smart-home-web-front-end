import React, { useEffect, useState, useCallback } from 'react'
import { Route, Routes } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { Layout } from 'antd'
import styles from './index.module.less'
import { SideBar } from '@/common/components/sideBar'
import { Toast } from '@/common/components/toast'

import { SmartSpace } from '@/pages/smartSpace'
import { SpaceDetail } from '@/pages/spaceDetail'
import { SpaceSelectDevice } from '@/pages/spaceSelectDevice'
import { OnlineDevice } from '@/pages/onlineDevice'
import { GroupManage } from '@/pages/groupManage'
import { GroupDetail } from '@/pages/groupDetail'
import { GroupSelectDevice } from '@/pages/groupSelectDevice'
import { SceneConfig } from '@/pages/sceneConfig'
import { SceneNormal } from '@/pages/sceneNormal'
import { SceneTime } from '@/pages/sceneTime'
import { SceneAddDevice } from '@/pages/sceneAddDevice'
import { InteractDevice } from '@/pages/interactDevice'
import { InteractSettings } from '@/pages/interactSettings'
import { AutoControl } from '@/pages/autoControl'
import { AutoControlDetail } from '@/pages/autoControlDetail'
import { AutoControlSelectAction } from '@/pages/autoControlSelectAction'
import { AutoControlSelectCondition } from '@/pages/autoControlSelectCondition'
import { NetworkConfig } from '@/pages/networkConfig'
import { HostMode } from '@/pages/hostMode'
import { NetworkTopology } from '@/pages/networkTopology'
import { CloudService } from '@/pages/cloudService'
import { CloudServiceImportConfig } from '@/pages/cloudServiceImportConfig'
import { UserInfo } from '@/pages/userInfo'
import { BlankPage } from '@/pages/blankPage'
import { JsonRpc } from '../common/utils/jsonRpc'
import {
  HeaderNetworkOpenIcon,
  HeaderRefreshIcon,
  HeaderDeviceIcon,
  HeaderOnlineIcon,
  HeaderNetworkIcon,
  HeaderOfflineIcon,
  HeaderCloudIcon
} from '@/common/components/icons'
import { findParentNodeByClassName } from '@/common/utils/util'

const { Header, Content } = Layout

const Index = () => {
  const [headerNetworkState, setHeaderNetworkState] = useState(false)
  const [headerRefreshState, setHeaderRefreshState] = useState(false)
  const [iconDegree, setIconDegree] = useState(360)
  const [isKeepingRotate, setIsKeepingRotate] = useState(false)
  const [networkInterval, setNetworkInterval] = useState(null)
  const [isConnectInternet, setIsConnectInternet] = useState(false)
  const [showNetworkOpenTip, setShowNetworkOpenTip] = useState(false)
  const [toastProps, setToastProps] = useState({})

  const navigate = useNavigate()

  const headerNetworkEnter = () => {
    setHeaderNetworkState(true)
    setShowNetworkOpenTip(true)
  }
  const headerNetworkLeave = () => {
    setHeaderNetworkState(false)
    setShowNetworkOpenTip(false)
  }

  const headerRefreshEnter = () => {
    setHeaderRefreshState(true)
  }
  const headerRefreshLeave = () => {
    setHeaderRefreshState(false)
  }

  const keepRotate = (node) => {
    let degree = 0
    const interval = setInterval(() => {
      degree += 360
      node.style.transform = `rotate(${String(degree)}deg)`
    }, 250)
    setNetworkInterval(interval)
  }

  const StopRotate = (node) => {
    clearInterval(networkInterval)
  }

  const headerNetworkClick = async (event) => {
    const node = findParentNodeByClassName(event.target, 'header-network-icon-wrapper')
    if (!isKeepingRotate) {
      setIsKeepingRotate(true)
      const result = await enabledJoinGateway()
      if (result.succeed) {
        keepRotate(node)
        setToastProps({
          showToast: true,
          type: 'successful',
          content: '已打开组网'
        })
      }
    }
    if (isKeepingRotate) {
      const result = await disabledJoinGateway()
      if (result.succeed) {
        setToastProps({
          showToast: true,
          type: 'successful',
          content: '已关闭组网'
        })
        setIsKeepingRotate(false)
        StopRotate(node)
      }
      if (!result.succeed) {
        setToastProps({
          showToast: true,
          type: 'warning',
          content: '组网打开失败，请检查网络！'
        })
      }
    }
  }

  const headerRefreshClick = (event) => {
    const node = findParentNodeByClassName(event.target, 'header-refresh-icon-wrapper')
    setIconDegree(iconDegree + 360)
    node.style.transform = `rotate(${String(iconDegree)}deg)`
    navigate('blank-page')
  }

  const onClickHeaderTitle = () => {
    // navigate(location.pathname)
  }

  const mapHeaderTitle = {
    'smart-space': '智能空间',
    'space-detail': '空间详情',
    'space-select-device': '选择设备',
    'online-device': '执行设备',
    'group-manage': '群组管理',
    'group-detail': '群组详情',
    'group-select-device': '选择设备',
    'scene-config': '场景配置',
    'scene-normal': '普通场景',
    'scene-time': '时光场景',
    'scene-add-device': '选择设备',
    'interact-device': '交互设备',
    'interact-settings': '交互设置',
    'auto-control': '自动化',
    'auto-control-detail': '自动化详情',
    'auto-control-select-action': '选择动作',
    'auto-control-select-condition': '选择条件',
    'network-config': '网络配置',
    'host-mode': '主机模式',
    'network-topology': '网络拓扑',
    'cloud-service': '云端服务',
    'cloud-service-import-config': '导入配置',
    'user-info': '用户信息'
  }

  const getPathArray = () => {
    const path = location.pathname.split('/')
    path.shift()
    return path
  }

  const keepAlive = async () => {
    const rpc = new JsonRpc('alive')
    const result = await rpc.fetchData({}, true)
    if (result.message === 'Access denied') {
      navigate('/')
    }
  }

  const enabledJoinGateway = async () => {
    const rpc = new JsonRpc('enabled_join_gateway')
    const result = await rpc.fetchData({ duration: 255 })
    return result
  }

  const disabledJoinGateway = async () => {
    const rpc = new JsonRpc('disabled_join_gateway')
    const result = await rpc.fetchData()
    return result
  }

  const getLocalGwInfo = async () => {
    const rpc = new JsonRpc('get_local_gw_info')
    const result = await rpc.fetchData()
    localStorage.setItem('gw_id', result.gw_id)
  }

  const checkConnectInternet = async () => {
    const rpc = new JsonRpc('is_connect_internet')
    const result = await rpc.fetchData()
    setIsConnectInternet(result.connect_internet)
  }

  useEffect(() => {
    getLocalGwInfo()
    checkConnectInternet()
    const timer = setInterval(() => {
      keepAlive()
    }, 1000 * 30)
    return () => clearInterval(timer)
  }, [])

  //  刷新页面，重置json rpc的id
  const resetJsonRpcId = (event) => {
    event.preventDefault()
    localStorage.setItem('id', 0)
  }
  useEffect(() => {
    window.addEventListener('beforeunload', resetJsonRpcId)
    return () => {
      window.removeEventListener('beforeunload', resetJsonRpcId)
    }
  }, [])

  return (
    <div className={styles.pageOuterClass}>
      <SideBar />
      <Layout>
        <Header className="header-wrapper">
          <div className="header-left-wrapper">
            {
              getPathArray().length > 0 && getPathArray().map((item, index) => {
                return getPathArray().length - 1 != index ?
                  (
                    <React.Fragment key={item}>
                      <div className="header-title-previous" key={item} onClick={() => { onClickHeaderTitle() }}>
                        {mapHeaderTitle[item]}
                      </div>
                      <div className="arrow" />
                    </React.Fragment>
                  ) : (
                    <div className="header-title-current" key={item} onClick={() => { onClickHeaderTitle() }}>
                      {mapHeaderTitle[item]}
                    </div>
                  )
              })
            }
          </div>
          <div className="header-right-wrapper">
            <div className="header-network-status-wrapper">
              <HeaderDeviceIcon />
              <HeaderOnlineIcon />
              <HeaderNetworkIcon />
              {
                isConnectInternet ? (
                  <HeaderOnlineIcon />
                ) : (
                  <HeaderOfflineIcon />
                )
              }
              <HeaderCloudIcon />
            </div>
            <div className="header-right-dividing-line" />
            <div className="header-action-wrapper">
              <div className={headerNetworkState ? 'header-network-hover' : 'header-network-default'}>
                <div
                  className="header-network-icon-wrapper"
                  onMouseEnter={() => { headerNetworkEnter() }}
                  onMouseLeave={() => { headerNetworkLeave() }}
                  onClick={(event) => { headerNetworkClick(event) }}
                >
                  <HeaderNetworkOpenIcon />
                </div>
              </div>
              {
                showNetworkOpenTip && (
                  <div className="header-network-open-tip">打开组网</div>
                )
              }
              <div className={headerRefreshState ? 'header-refresh-hover' : 'header-refresh-default'}>
                <div
                  className="header-refresh-icon-wrapper"
                  onMouseEnter={() => { headerRefreshEnter() }}
                  onMouseLeave={() => { headerRefreshLeave() }}
                  onClick={(event) => { headerRefreshClick(event) }}
                >
                  <HeaderRefreshIcon />
                </div>
              </div>
            </div>
          </div>
        </Header>

        <Content className="content-wrapper">
          <Routes>
            <Route exact path="smart-space" element={<SmartSpace />} />

            <Route exact path="smart-space/space-detail" element={<SpaceDetail />} />
            <Route exact path="smart-space/space-detail/space-select-device" element={<SpaceSelectDevice />} />

            <Route exact path="online-device" element={<OnlineDevice />} />

            <Route exact path="group-manage" element={<GroupManage />} />
            <Route exact path="group-manage/group-detail" element={<GroupDetail />} />
            <Route exact path="group-manage/group-detail/group-select-device" element={<GroupSelectDevice />} />

            <Route exact path="scene-config" element={<SceneConfig />} />
            <Route exact path="scene-config/scene-normal" element={<SceneNormal />} />
            <Route exact path="scene-config/scene-time" element={<SceneTime />} />
            <Route exact path="scene-config/scene-normal/scene-add-device" element={<SceneAddDevice />} />

            <Route exact path="interact-device" element={<InteractDevice />} />
            <Route exact path="interact-device/interact-settings" element={<InteractSettings />} />

            <Route exact path="auto-control" element={<AutoControl />} />
            <Route exact path="auto-control/auto-control-detail" element={<AutoControlDetail />} />
            <Route exact path="auto-control/auto-control-detail/auto-control-select-action" element={<AutoControlSelectAction />} />
            <Route exact path="auto-control/auto-control-detail/auto-control-select-condition" element={<AutoControlSelectCondition />} />

            <Route exact path="network-config" element={<NetworkConfig />} />
            <Route exact path="host-mode" element={<HostMode />} />
            <Route exact path="network-topology" element={<NetworkTopology />} />
            <Route exact path="cloud-service" element={<CloudService />} />
            <Route exact path="cloud-service/cloud-service-import-config" element={<CloudServiceImportConfig />} />
            <Route exact path="user-info" element={<UserInfo />} />

            <Route exact path="blank-page" element={<BlankPage />} />
          </Routes>
        </Content>
      </Layout>
      {/* </Layout> */}

      <Toast toastProps={toastProps} />
    </div>
  )
}

export default Index
