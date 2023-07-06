import React, { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import styles from './index.module.less'
import { JsonRpc } from '@/common/utils/jsonRpc'
import {
  SmartSpaceIcon,
  SmartDeviceIcon,
  OnlineDeviceIcon,
  GroupManageIcon,
  SceneConfigIcon,
  InteractDeviceIcon,
  AutoControlIcon,
  SmartGatewayIcon,
  NetworkConfigIcon,
  HostModeIcon,
  NetwortTopologyIcon,
  CloudServiceIcon,
  UserInfoIcon,
  LogoIcon,
  MenuExpandIcon
} from '@/common/components/icons'

export const selectedKeys = () => {
  const map = {
    '/': '/smart-space',
    'smart-space': '/smart-space',
    'space-detail': '/smart-space',
    'space-select-device': '/smart-space',
    'online-device': '/online-device',
    'group-manage': '/group-manage',
    'group-detail': '/group-manage',
    'group-select-device': '/group-manage',
    'scene-config': '/scene-config',
    'scene-normal': '/scene-config',
    'scene-time': '/scene-config',
    'scene-add-device': '/scene-config',
    'interact-device': '/interact-device',
    'interact-settings': '/interact-device',
    'auto-control': '/auto-control',
    'auto-control-detail': '/auto-control',
    'auto-control-select-action': '/auto-control',
    'auto-control-select-condition': '/auto-control',
    'network-config': '/network-config',
    'host-mode': '/host-mode',
    'network-topology': '/network-topology',
    'cloud-service': '/cloud-service',
    'cloud-service-import-config': '/cloud-service',
    'user-info': '/user-info'
  }
  const path = location.hash.split('/')
  let match = ''
  path.forEach((item) => {
    if (map[item] != undefined) {
      return match = map[item]
    }
  })
  return match
}

export const SideBar = ({ defalutChecked, currentChecked, ...props }) => {
  const navigate = useNavigate()
  const smartSpaceRef = useRef()
  const smartDeviceRef = useRef()
  const onlineDeviceRef = useRef()
  const groupManageRef = useRef()
  const sceneConfigRef = useRef()
  const interactDeviceRef = useRef()
  const autoControlRef = useRef()
  const smartGatewayRef = useRef()
  const networkConfigRef = useRef()
  const hostModeRef = useRef()
  const networkTopologyRef = useRef()
  const cloudServiceRef = useRef()
  const userInfoRef = useRef()

  const [collapsed, setCollapsed] = useState(false)
  const [isSmartDeviceExpand, setIsSmartDeviceExpand] = useState(true)
  const [isSmartGatewayExpand, setIsSmartGatewayExpand] = useState(true)
  const [activeItem, setActiveItem] = useState({})
  const [hoverItem, setHoverItem] = useState({})
  const [deviceOnlineCount, setDeviceOnlineCount] = useState({})
  const [showSmartDeviceCard, setShowSmartDeviceCard] = useState(false)
  const [showSmartGatewayCard, setShowSmartGatewayCard] = useState(false)

  const onActiveItem = (current) => {
    if (activeItem.style) {
      activeItem.style.background = '#212130'
    }
    current.style.background = '#2558BF'

    setActiveItem(current)

    if (smartDeviceRef.current.style.background === 'rgb(37, 88, 191)') {
      smartDeviceRef.current.style.background = '#212130'
    }
    if (smartGatewayRef.current.style.background === 'rgb(37, 88, 191)') {
      smartGatewayRef.current.style.background = '#212130'
    }
  }

  const onHoverItem = (current) => {
    console.log(current.innerText, 'current.innerText1')
    console.log(activeItem, 'activeItem.innerText11')
    console.log(hoverItem.innerText, 'hoverItem.innerText1')
    if (!collapsed) {
      if (current.innerText !== activeItem.innerText && hoverItem.innerText === activeItem.innerText) {
        current.style.background = '#424B5C'

        const { childNodes } = current
        childNodes.forEach((item) => {
          if (item.className === 'sider-title') {
            item.style.color = '#FFFFFF'
          }
        })
      }
      if (current.innerText !== activeItem.innerText && hoverItem.innerText !== activeItem.innerText) {
        if (hoverItem.style) {
          hoverItem.style.background = '#212130'

          const { childNodes } = current
          childNodes.forEach((item) => {
            if (item.className === 'sider-title') {
              item.style.color = '#B1B4BD'
            }
          })
        }

        const { childNodes } = current
        childNodes.forEach((item) => {
          if (item.className === 'sider-title') {
            item.style.color = '#FFFFFF'
          }
        })

        current.style.background = '#424B5C'
      }
    }

    if (collapsed) {
      if (current.style.background !== activeItem.style.background) {
        current.style.background = '#424B5C'
      }
    }

    setHoverItem(current)
  }

  const onLeaveItem = (current) => {
    console.log(current.innerText, 'current.innerText')
    console.log(activeItem, 'activeItem.innerText')
    console.log(hoverItem.innerText, 'hoverItem.innerText')
    if (!collapsed) {
      if (current.innerText === hoverItem.innerText && current.innerText !== activeItem.innerText) {
        const { childNodes } = current
        childNodes.forEach((item) => {
          if (item.className === 'sider-title') {
            item.style.color = '#B1B4BD'
          }

          if (
            current.innerText === '智能设备' &&
            (
              ['执行设备', '群组配置', '场景配置', '交互设备', '自动控制'].indexOf(activeItem.innerText) > -1 ||
              ['执行设备', '群组配置', '场景配置', '交互设备', '自动控制'].indexOf(activeItem.childNodes[0].innerHTML) > -1
            )
          ) {
            item.style.color = '#FFFFFF'
          }
          if (
            current.innerText === '智能网关' &&
            (
              ['网络配置', '主机模式'].indexOf(activeItem.innerText) > -1 ||
              ['网络配置', '主机模式'].indexOf(activeItem.childNodes[0].innerHTML) > -1
            )
          ) {
            item.style.color = '#FFFFFF'
          }
        })

        current.style.background = '#212130'
      }
    }
    if (collapsed) {
      if (current.style.background !== activeItem.style.background) {
        current.style.background = '#212130'
      }
    }
    setHoverItem({})
  }

  const onClickItem = (ref) => {
    onActiveItem(ref?.current)
  }
  const onMouseEnterItem = (ref, type) => {
    const current = ref?.current
    onHoverItem(current)

    if (type === 'smart-device') {
      setShowSmartDeviceCard(true)
    } else {
      console.log(type, 'type')
      setShowSmartDeviceCard(false)
    }

    if (type === 'smart-gateway') {
      setShowSmartGatewayCard(true)
    } else {
      setShowSmartGatewayCard(false)
    }
  }

  const onMouseLeaveItem = (ref) => {
    onLeaveItem(ref?.current)
  }

  const leaveSmartDeviceCard = () => {
    setShowSmartDeviceCard(false)
  }

  const leaveSmartGatewayCard = () => {
    setShowSmartGatewayCard(false)
  }

  const onClickSmartDevice = (event) => {
    if (!collapsed) {
      setIsSmartDeviceExpand(!isSmartDeviceExpand)
    }
    // const current = smartDeviceRef?.current
    // switchBackground(current)
  }
  const onClickSmartGateway = (event) => {
    if (!collapsed) {
      setIsSmartGatewayExpand(!isSmartGatewayExpand)
    }
    // const current = smartGatewayRef?.current
    // switchBackground(current)
  }

  const onClickCardItem = (event) => {
    const { target } = event
    const { childNodes } = target.parentNode

    childNodes.forEach((item) => {
      if (item.className === 'item') {
        item.style.background = '#FFFFFF'
      }
    })
    console.log(event, 'event')
    target.style.background = '#EAF0FF'

    // smartDeviceRef.current.style.color = '#FFFFFF'

    if (target.innerText === '执行设备') {
      console.log(target.innerText, 'target.innerText')
      onClickItem(onlineDeviceRef)

      smartDeviceRef.current.style.background = '#2558BF'
      navigate('/online-device')
    }
    if (target.innerText === '群组配置') {
      onClickItem(groupManageRef)

      smartDeviceRef.current.style.background = '#2558BF'
      navigate('/group-manage')
    }
    if (target.innerText === '场景配置') {
      onClickItem(sceneConfigRef)

      smartDeviceRef.current.style.background = '#2558BF'
      navigate('/scene-config')
    }
    if (target.innerText === '交互设备') {
      onClickItem(interactDeviceRef)

      smartDeviceRef.current.style.background = '#2558BF'
      navigate('/interact-device')
    }
    if (target.innerText === '自动控制') {
      onClickItem(autoControlRef)

      smartDeviceRef.current.style.background = '#2558BF'
      navigate('/auto-control')
    }

    if (target.innerText === '网络配置') {
      onClickItem(networkConfigRef)

      smartGatewayRef.current.style.background = '#2558BF'
      navigate('/network-config')
    }
    if (target.innerText === '主机模式') {
      onClickItem(hostModeRef)

      smartGatewayRef.current.style.background = '#2558BF'
      navigate('/host-mode')
    }
  }

  const onClickLogo = () => {
    onClickItem(smartSpaceRef)
  }

  const onClickUnfoldOutlined = () => {
    setCollapsed(false)

    const key = selectedKeys()
    const smartDeviceKeys = ['/online-device', '/group-manage', '/scene-config', '/interact-device', '/auto-control']
    if (smartDeviceKeys.includes(key)) {
      setIsSmartDeviceExpand(true)
    }
    const smartGatewayKeys = ['/network-config', '/host-mode']
    if (smartGatewayKeys.includes(key)) {
      setIsSmartGatewayExpand(true)
    }

    if (smartDeviceRef.current.style.background === 'rgb(37, 88, 191)') {
      smartDeviceRef.current.style.background = '#212130'
    }
    if (smartGatewayRef.current.style.background === 'rgb(37, 88, 191)') {
      smartGatewayRef.current.style.background = '#212130'
    }
  }
  const onClickFoldOutlined = () => {
    setCollapsed(true)

    if (
      !isSmartDeviceExpand &&
      (onlineDeviceRef.current.style.background === 'rgb(37, 88, 191)' ||
        groupManageRef.current.style.background === 'rgb(37, 88, 191)' ||
        sceneConfigRef.current.style.background === 'rgb(37, 88, 191)' ||
        interactDeviceRef.current.style.background === 'rgb(37, 88, 191)' ||
        autoControlRef.current.style.background === 'rgb(37, 88, 191)')
    ) {
      smartDeviceRef.current.style.background = 'rgb(37, 88, 191)'
    }

    if (
      !isSmartGatewayExpand &&
      (networkConfigRef.current.style.background === 'rgb(37, 88, 191)' ||
        hostModeRef.current.style.background === 'rgb(37, 88, 191)')
    ) {
      smartGatewayRef.current.style.background = 'rgb(37, 88, 191)'
    }
  }

  const getDeviceOnlineCount = async () => {
    const rpc = new JsonRpc('get_device_online_count')
    const result = await rpc.fetchData()
    console.log(result, 'getDeviceOnlineCount')
    setDeviceOnlineCount(result)
  }

  const handlePopState = () => {
    let current = {}
    const key = selectedKeys()
    key === '/smart-space' && (current = smartSpaceRef.current) && onClickItem(smartSpaceRef)
    key === '/online-device' && (current = onlineDeviceRef.current) && onClickItem(onlineDeviceRef)
    key === '/group-manage' && (current = groupManageRef.current) && onClickItem(groupManageRef)
    key === '/scene-config' && (current = sceneConfigRef.current) && onClickItem(sceneConfigRef)
    key === '/interact-device' && (current = interactDeviceRef.current) && onClickItem(interactDeviceRef)
    key === '/auto-control' && (current = autoControlRef.current) && onClickItem(autoControlRef)
    key === '/network-config' && (current = networkConfigRef.current) && onClickItem(networkConfigRef)
    key === '/host-mode' && (current = hostModeRef.current) && onClickItem(hostModeRef)
    key === '/network-topology' && (current = networkTopologyRef.current) && onClickItem(networkTopologyRef)
    key === '/cloud-service' && (current = cloudServiceRef.current) && onClickItem(cloudServiceRef)
    key === '/user-info' && (current = userInfoRef.current) && onClickItem(userInfoRef)

    //  把除开activeItem的item都变成非activeItem的背景色#212130
    if (current.parentNode.className === 'menu-wrapper') {
      current.parentNode.childNodes.forEach(item => {
        if (item !== current) {
          item.style.background = '#212130'
        }
        if (item.className === 'sub-menu-wrapper') {
          item.childNodes.forEach(item => {
            item.style.background = '#212130'
          })
        }
      })
    }
    if (current.parentNode.className === 'sub-menu-wrapper') {
      current.parentNode.childNodes.forEach(item => {
        if (item !== current) {
          item.style.background = '#212130'
        }
      })
      current.parentNode.parentNode.childNodes.forEach(item => {
        item.style.background = '#212130'
      })
      current.parentNode.parentNode.childNodes.forEach(item => {
        if (item.className === 'menu-item-wrapper') {
          item.style.background = '#212130'
        }
        if (item.className === 'sub-menu-wrapper') {
          item.childNodes.forEach(item => {
            if (item !== current) {
              item.style.background = '#212130'
            }
          })
        }
      })
    }
  }

  useEffect(() => {
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    const key = selectedKeys()
    key === '/smart-space' && onClickItem(smartSpaceRef)
    key === '/online-device' && onClickItem(onlineDeviceRef)
    key === '/group-manage' && onClickItem(groupManageRef)
    key === '/scene-config' && onClickItem(sceneConfigRef)
    key === '/interact-device' && onClickItem(interactDeviceRef)
    key === '/auto-control' && onClickItem(autoControlRef)
    key === '/network-config' && onClickItem(networkConfigRef)
    key === '/host-mode' && onClickItem(hostModeRef)
    key === '/network-topology' && onClickItem(networkTopologyRef)
    key === '/cloud-service' && onClickItem(cloudServiceRef)
    key === '/user-info' && onClickItem(userInfoRef)

    getDeviceOnlineCount()
  }, [])

  useEffect(() => {
    //  展开侧栏的时候，使选中的item的文字高亮
    if (!collapsed && activeItem.childNodes) {
      const itemChildNode = activeItem.childNodes[1]
      if (itemChildNode) {
        itemChildNode.style.color = '#FFFFFF'
      }
      const subItemChildNode = activeItem.childNodes[0]
      console.log(subItemChildNode, 'subItemChildNode')
      if (subItemChildNode) {
        subItemChildNode.style.color = '#FFFFFF'

        //  如果子item高亮，则使可以让其展开的父item的文字高亮
        if (['执行设备', '群组配置', '场景配置', '交互设备', '自动控制'].indexOf(subItemChildNode.innerHTML) > -1) {
          smartDeviceRef.current.childNodes[1].style.color = '#FFFFFF'
        }
        if (['网络配置', '主机模式'].indexOf(subItemChildNode.innerHTML) > -1) {
          smartGatewayRef.current.childNodes[1].style.color = '#FFFFFF'
        }
      }
    }
  }, [collapsed, isSmartDeviceExpand, isSmartGatewayExpand])

  return (
    <div className={styles.sideBarWrapper} style={props.style}>
      <div className="sider-bar-wrapper" style={{ width: collapsed && '60px' }}>
        <Link className={collapsed ? 'logo-collapse' : 'logo'} to="/smart-space" onClick={() => { onClickLogo() }}>
          {
            collapsed ? (
              <LogoIcon />
            ) : (
              <LogoIcon />
            )
          }
        </Link>
        <div className="menu-wrapper">
          <Link className="menu-item-wrapper" to="/smart-space" ref={smartSpaceRef} onClick={() => onClickItem(smartSpaceRef)} style={{ paddingLeft: collapsed && '0px' }} onMouseEnter={() => { onMouseEnterItem(smartSpaceRef) }} onMouseLeave={() => onMouseLeaveItem(smartSpaceRef)}>
            {
              (hoverItem.innerText === '智能空间' || activeItem.innerText === '智能空间' || (activeItem.childNodes && activeItem?.childNodes[1]?.childNodes[1]?.innerText === '智能空间')) ? (
                <SmartSpaceIcon stroke="#FFFFFF" />
              ) : (
                <SmartSpaceIcon stroke="#B1B4BD" />
              )
            }
            {
              !collapsed && (
                <div className="sider-title" style={{ color: activeItem.innerText === '智能空间' ? '#FFFFFF' : '#B1B4BD' }}>智能空间</div>
              )
            }
            {
              collapsed && (
                <div className="tag-wrapper">
                  <div className="triangle-left" />
                  <div className="tag">智能空间</div>
                </div>
              )
            }
          </Link>
          <div className="menu-item-wrapper" ref={smartDeviceRef} onClick={(event) => onClickSmartDevice(event)} style={{ paddingLeft: collapsed && '0px', height: (!collapsed || (collapsed && !isSmartDeviceExpand)) ? '42px' : '0' }} onMouseEnter={() => { onMouseEnterItem(smartDeviceRef, 'smart-device') }} onMouseLeave={() => onMouseLeaveItem(smartDeviceRef)}>
            {
              (!collapsed || (collapsed && !isSmartDeviceExpand)) && (
                (
                  hoverItem.innerText === '智能设备' ||
                  ['执行设备', '群组配置', '场景配置', '交互设备', '自动控制'].indexOf(activeItem.innerText) > -1 ||
                  (activeItem.childNodes && ['执行设备', '群组配置', '场景配置', '交互设备', '自动控制'].indexOf(activeItem?.childNodes[0]?.childNodes[1]?.innerText) > -1) ||
                  (activeItem.childNodes && ['执行设备', '群组配置', '场景配置', '交互设备', '自动控制'].indexOf(activeItem?.childNodes[1]?.childNodes[1]?.innerText) > -1) ||
                  (activeItem.childNodes && ['执行设备', '群组配置', '场景配置', '交互设备', '自动控制'].indexOf(activeItem?.childNodes[0]?.innerHTML) > -1)
                ) ? (
                  <SmartDeviceIcon stroke="#FFFFFF" />
                ) : (
                  <SmartDeviceIcon stroke="#B1B4BD" />
                )
              )
            }
            {
              !collapsed && (
                <div
                  className="sider-title"
                  style={{
                    color:
                      (
                        ['执行设备', '群组配置', '场景配置', '交互设备', '自动控制'].indexOf(activeItem.innerText) > -1 ||
                        (activeItem.childNodes && ['执行设备', '群组配置', '场景配置', '交互设备', '自动控制'].indexOf(activeItem?.childNodes[0]?.innerHTML)) > -1
                      ) ? '#FFFFFF' : '#B1B4BD'
                  }}
                >
                  智能设备
                </div>
              )
            }
            {
              (!isSmartDeviceExpand && !collapsed) && (
                <MenuExpandIcon className="menu-expand-icon" />
              )
            }
            {
              (isSmartDeviceExpand && !collapsed) && (
                <MenuExpandIcon className="menu-expand-icon" transform="rotate(270)" />
              )
            }
            {

              (collapsed && showSmartDeviceCard) && (
                <div className="sub-menu-card-wrapper" onMouseLeave={() => { leaveSmartDeviceCard() }}>
                  <div className="sider-title" style={{ color: activeItem.innerText === '用户信息' ? '#FFFFFF' : '#B1B4BD' }}>设备配置</div>
                  {
                    ['执行设备', '群组配置', '场景配置', '交互设备', '自动控制'].map((item) => {
                      return <div className="item" onClick={(event) => { onClickCardItem(event) }} key={item}>{item}</div>
                    })
                  }
                </div>
              )
            }
          </div>
          <div className="sub-menu-wrapper" style={{ height: isSmartDeviceExpand ? '210px' : '0' }}>
            <Link className="sub-menu-item" to="/online-device" ref={onlineDeviceRef} onClick={() => onClickItem(onlineDeviceRef)} style={{ paddingLeft: collapsed && '0px', height: isSmartDeviceExpand ? '42px' : '0' }} onMouseEnter={() => { onMouseEnterItem(onlineDeviceRef) }} onMouseLeave={() => onMouseLeaveItem(onlineDeviceRef)}>
              {
                (collapsed && isSmartDeviceExpand) && (
                  (hoverItem.innerText === '执行设备' || activeItem.innerText === '执行设备' || (activeItem.childNodes && activeItem?.childNodes[1]?.childNodes[1]?.innerText === '执行设备')) ? (
                    <OnlineDeviceIcon stroke="#FFFFFF" />
                  ) : (
                    <OnlineDeviceIcon stroke="#B1B4BD" />
                  )
                )
              }
              {
                !collapsed && (
                  <div className="sider-title" style={{ visibility: isSmartDeviceExpand ? 'visible' : 'hidden', color: activeItem.innerText === '执行设备' ? '#FFFFFF' : '#B1B4BD' }}>执行设备</div>
                )
              }
              {
                collapsed && (
                  <div className="tag-wrapper">
                    <div className="triangle-left" />
                    <div className="tag">执行设备</div>
                  </div>
                )
              }
            </Link>
            <Link className="sub-menu-item" to="/group-manage" ref={groupManageRef} onClick={() => onClickItem(groupManageRef)} style={{ paddingLeft: collapsed && '0px', height: isSmartDeviceExpand ? '42px' : '0' }} onMouseEnter={() => { onMouseEnterItem(groupManageRef) }} onMouseLeave={() => onMouseLeaveItem(groupManageRef)}>
              {
                (collapsed && isSmartDeviceExpand) && (
                  (hoverItem.innerText === '群组配置' || activeItem.innerText === '群组配置' || (activeItem.childNodes && activeItem?.childNodes[1]?.childNodes[1]?.innerText === '群组配置')) ? (
                    <GroupManageIcon stroke="#FFFFFF" />
                  ) : (
                    <GroupManageIcon stroke="#B1B4BD" />
                  )
                )
              }
              {
                !collapsed && (
                  <div className="sider-title" style={{ visibility: isSmartDeviceExpand ? 'visible' : 'hidden', color: activeItem.innerText === '群组配置' ? '#FFFFFF' : '#B1B4BD' }}>群组配置</div>
                )
              }
              {
                collapsed && (
                  <div className="tag-wrapper">
                    <div className="triangle-left" />
                    <div className="tag">群组配置</div>
                  </div>
                )
              }
            </Link>
            <Link className="sub-menu-item" to="/scene-config" ref={sceneConfigRef} onClick={() => onClickItem(sceneConfigRef)} style={{ paddingLeft: collapsed && '0px', height: isSmartDeviceExpand ? '42px' : '0' }} onMouseEnter={() => { onMouseEnterItem(sceneConfigRef) }} onMouseLeave={() => onMouseLeaveItem(sceneConfigRef)}>
              {
                (collapsed && isSmartDeviceExpand) && (
                  (hoverItem.innerText === '场景配置' || activeItem.innerText === '场景配置' || (activeItem.childNodes && activeItem?.childNodes[1]?.childNodes[1]?.innerText === '场景配置')) ? (
                    <SceneConfigIcon stroke="#FFFFFF" />
                  ) : (
                    <SceneConfigIcon stroke="#B1B4BD" />
                  )
                )
              }
              {
                !collapsed && (
                  <div className="sider-title" style={{ visibility: isSmartDeviceExpand ? 'visible' : 'hidden', color: activeItem.innerText === '场景配置' ? '#FFFFFF' : '#B1B4BD' }}>场景配置</div>
                )
              }
              {
                collapsed && (
                  <div className="tag-wrapper">
                    <div className="triangle-left" />
                    <div className="tag">场景配置</div>
                  </div>
                )
              }
            </Link>
            <Link className="sub-menu-item" to="/interact-device" ref={interactDeviceRef} onClick={() => onClickItem(interactDeviceRef)} style={{ paddingLeft: collapsed && '0px', height: isSmartDeviceExpand ? '42px' : '0' }} onMouseEnter={() => { onMouseEnterItem(interactDeviceRef) }} onMouseLeave={() => onMouseLeaveItem(interactDeviceRef)}>
              {
                (collapsed && isSmartDeviceExpand) && (
                  (hoverItem.innerText === '交互设备' || activeItem.innerText === '交互设备' || (activeItem.childNodes && activeItem?.childNodes[1]?.childNodes[1]?.innerText === '交互设备')) ? (
                    <InteractDeviceIcon stroke="#FFFFFF" />
                  ) : (
                    <InteractDeviceIcon stroke="#B1B4BD" />
                  )
                )
              }
              {
                !collapsed && (
                  <div className="sider-title" style={{ visibility: isSmartDeviceExpand ? 'visible' : 'hidden', color: activeItem.innerText === '交互设备' ? '#FFFFFF' : '#B1B4BD' }}>交互设备</div>
                )
              }
              {
                collapsed && (
                  <div className="tag-wrapper">
                    <div className="triangle-left" />
                    <div className="tag">交互设备</div>
                  </div>
                )
              }
            </Link>
            <Link className="sub-menu-item" to="/auto-control" ref={autoControlRef} onClick={() => onClickItem(autoControlRef)} style={{ paddingLeft: collapsed && '0px', height: isSmartDeviceExpand ? '42px' : '0' }} onMouseEnter={() => { onMouseEnterItem(autoControlRef) }} onMouseLeave={() => onMouseLeaveItem(autoControlRef)}>
              {
                (collapsed && isSmartDeviceExpand) && (
                  (hoverItem.innerText === '自动控制' || activeItem.innerText === '自动控制' || (activeItem.childNodes && activeItem?.childNodes[1]?.childNodes[1]?.innerText === '自动控制')) ? (
                    <AutoControlIcon stroke="#FFFFFF" />
                  ) : (
                    <AutoControlIcon stroke="#B1B4BD" />
                  )
                )
              }
              {
                !collapsed && (
                  <div className="sider-title" style={{ visibility: isSmartDeviceExpand ? 'visible' : 'hidden', color: activeItem.innerText === '自动控制' ? '#FFFFFF' : '#B1B4BD' }}>自动控制</div>
                )
              }
              {
                collapsed && (
                  <div className="tag-wrapper">
                    <div className="triangle-left" />
                    <div className="tag">自动控制</div>
                  </div>
                )
              }
            </Link>
          </div>
          <div className="menu-item-wrapper" ref={smartGatewayRef} onClick={(event) => onClickSmartGateway(event)} style={{ paddingLeft: collapsed && '0px', height: (!collapsed || (collapsed && !isSmartGatewayExpand)) ? '42px' : '0' }} onMouseEnter={() => { onMouseEnterItem(smartGatewayRef, 'smart-gateway') }} onMouseLeave={() => onMouseLeaveItem(smartGatewayRef)}>
            {
              (!collapsed || (collapsed && !isSmartGatewayExpand)) && (
                (
                  hoverItem.innerText === '智能网关' ||
                  ['网络配置', '主机模式'].indexOf(activeItem.innerText) > -1 ||
                  (activeItem.childNodes && ['网络配置', '主机模式'].indexOf(activeItem?.childNodes[0]?.childNodes[1]?.innerText) > -1) ||
                  (activeItem.childNodes && ['网络配置', '主机模式'].indexOf(activeItem?.childNodes[1]?.childNodes[1]?.innerText) > -1) ||
                  (activeItem.childNodes && ['网络配置', '主机模式'].indexOf(activeItem?.childNodes[0]?.innerHTML) > -1)
                ) ? (
                  <SmartGatewayIcon stroke="#FFFFFF" />
                ) : (
                  <SmartGatewayIcon stroke="#B1B4BD" />
                )
              )
            }
            {
              !collapsed && (
                <div
                  className="sider-title"
                  style={{
                    color:
                      (
                        ['网络配置', '主机模式'].indexOf(activeItem.innerText) > -1 ||
                        (activeItem.childNodes && ['网络配置', '主机模式'].indexOf(activeItem?.childNodes[0]?.innerHTML)) > -1
                      ) ? '#FFFFFF' : '#B1B4BD'
                  }}
                >
                  智能网关
                </div>
              )
            }
            {
              (collapsed && showSmartGatewayCard) && (
                <div className="sub-menu-card-wrapper" onMouseLeave={() => { leaveSmartGatewayCard() }}>
                  <div className="sider-title">智能网关</div>
                  {
                    ['网络配置', '主机模式'].map((item) => {
                      return <div className="item" onClick={(event) => { onClickCardItem(event) }} key={item}>{item}</div>
                    })
                  }
                </div>
              )
            }
            {
              (!isSmartGatewayExpand && !collapsed) && (
                <MenuExpandIcon className="menu-expand-icon" />
              )
            }
            {
              (isSmartGatewayExpand && !collapsed) && (
                <MenuExpandIcon className="menu-expand-icon" transform="rotate(270)" />
              )
            }
          </div>

          <div className="sub-menu-wrapper" style={{ height: isSmartGatewayExpand ? '84px' : '0' }}>
            <Link className="sub-menu-item" to="/network-config" ref={networkConfigRef} onClick={() => onClickItem(networkConfigRef)} style={{ paddingLeft: collapsed && '0px', height: isSmartGatewayExpand ? '42px' : '0' }} onMouseEnter={() => { onMouseEnterItem(networkConfigRef, 'network-config') }} onMouseLeave={() => onMouseLeaveItem(networkConfigRef)}>
              {
                (collapsed && isSmartGatewayExpand) && (
                  (hoverItem.innerText === '网络配置' || activeItem.innerText === '网络配置' || (activeItem.childNodes && activeItem?.childNodes[1]?.childNodes[1]?.innerText === '网络配置')) ? (
                    <NetworkConfigIcon stroke="#FFFFFF" />
                  ) : (
                    <NetworkConfigIcon stroke="#B1B4BD" />
                  )
                )
              }
              {
                !collapsed && (
                  <div className="sider-title" style={{ visibility: isSmartGatewayExpand ? 'visible' : 'hidden', color: activeItem.innerText === '网络配置' ? '#FFFFFF' : '#B1B4BD' }}>网络配置</div>
                )
              }
              {
                collapsed && (
                  <div className="tag-wrapper">
                    <div className="triangle-left" />
                    <div className="tag">网络配置</div>
                  </div>
                )
              }
            </Link>
            <Link className="sub-menu-item" to="/host-mode" ref={hostModeRef} onClick={() => onClickItem(hostModeRef)} style={{ paddingLeft: collapsed && '0px', height: isSmartGatewayExpand ? '42px' : '0' }} onMouseEnter={() => { onMouseEnterItem(hostModeRef) }} onMouseLeave={() => onMouseLeaveItem(hostModeRef)}>
              {
                (collapsed && isSmartGatewayExpand) && (
                  (hoverItem.innerText === '主机模式' || activeItem.innerText === '主机模式' || (activeItem.childNodes && activeItem?.childNodes[1]?.childNodes[1]?.innerText === '主机模式')) ? (
                    <HostModeIcon stroke="#FFFFFF" />
                  ) : (
                    <HostModeIcon stroke="#B1B4BD" />
                  )
                )
              }
              {
                !collapsed && (
                  <div className="sider-title" style={{ visibility: isSmartGatewayExpand ? 'visible' : 'hidden', color: activeItem.innerText === '主机模式' ? '#FFFFFF' : '#B1B4BD' }}>主机模式</div>
                )
              }
              {
                collapsed && (
                  <div className="tag-wrapper">
                    <div className="triangle-left" />
                    <div className="tag">主机模式</div>
                  </div>
                )
              }
            </Link>
          </div>

          <Link className="menu-item-wrapper" to="/network-topology" ref={networkTopologyRef} onClick={() => onClickItem(networkTopologyRef)} style={{ paddingLeft: collapsed && '0px' }} onMouseEnter={() => { onMouseEnterItem(networkTopologyRef) }} onMouseLeave={() => onMouseLeaveItem(networkTopologyRef)}>
            {
              (hoverItem.innerText === '网络拓扑' || activeItem.innerText === '网络拓扑' || (activeItem.childNodes && activeItem?.childNodes[1]?.childNodes[1]?.innerText === '网络拓扑')) ? (
                <NetwortTopologyIcon stroke="#FFFFFF" />
              ) : (
                <NetwortTopologyIcon stroke="#B1B4BD" />
              )
            }
            {
              !collapsed && (
                <div className="sider-title" style={{ color: activeItem.innerText === '网络拓扑' ? '#FFFFFF' : '#B1B4BD' }}>网络拓扑</div>
              )
            }
            {
              collapsed && (
                <div className="tag-wrapper">
                  <div className="triangle-left" />
                  <div className="tag">网络拓扑</div>
                </div>
              )
            }
          </Link>
          <Link className="menu-item-wrapper" to="/cloud-service" ref={cloudServiceRef} onClick={() => onClickItem(cloudServiceRef)} style={{ paddingLeft: collapsed && '0px' }} onMouseEnter={() => { onMouseEnterItem(cloudServiceRef) }} onMouseLeave={() => onMouseLeaveItem(cloudServiceRef)}>
            {
              (hoverItem.innerText === '云端服务' || activeItem.innerText === '云端服务' || (activeItem.childNodes && activeItem?.childNodes[1]?.childNodes[1]?.innerText === '云端服务')) ? (
                <CloudServiceIcon stroke="#FFFFFF" />
              ) : (
                <CloudServiceIcon stroke="#B1B4BD" />
              )
            }
            {
              !collapsed && (
                <div className="sider-title" style={{ color: activeItem.innerText === '云端服务' ? '#FFFFFF' : '#B1B4BD' }}>云端服务</div>
              )
            }
            {
              collapsed && (
                <div className="tag-wrapper">
                  <div className="triangle-left" />
                  <div className="tag">云端服务</div>
                </div>
              )
            }
          </Link>
          <Link className="menu-item-wrapper" to="/user-info" ref={userInfoRef} onClick={() => onClickItem(userInfoRef)} style={{ paddingLeft: collapsed && '0px' }} onMouseEnter={() => { onMouseEnterItem(userInfoRef) }} onMouseLeave={() => onMouseLeaveItem(userInfoRef)}>
            {
              (hoverItem.innerText === '用户信息' || activeItem.innerText === '用户信息' || (activeItem.childNodes && activeItem?.childNodes[1]?.childNodes[1]?.innerText === '用户信息')) ? (
                <UserInfoIcon stroke="#FFFFFF" />
              ) : (
                <UserInfoIcon stroke="#B1B4BD" />
              )
            }
            {
              !collapsed && (
                <div className="sider-title" style={{ color: activeItem.innerText === '用户信息' ? '#FFFFFF' : '#B1B4BD' }}>用户信息</div>
              )
            }
            {
              collapsed && (
                <div className="tag-wrapper">
                  <div className="triangle-left" />
                  <div className="tag">用户信息</div>
                </div>
              )
            }
          </Link>
        </div>
        <div className="sider-footer">
          {
            collapsed ? (
              <MenuUnfoldOutlined
                style={{ color: 'white', fontSize: '30px' }}
                className="trigger-button-collapsed"
                onClick={() => { onClickUnfoldOutlined() }}
              />
            ) : (
              <MenuFoldOutlined
                style={{ color: 'white', fontSize: '30px' }}
                className="trigger-button"
                onClick={() => { onClickFoldOutlined() }}
              />
            )
          }
          {
            !collapsed && (
              <div className="amount-wrapper">
                <div className="device-amount-wrapper">
                  <div className="name">设备数</div>
                  <div className="amount">{deviceOnlineCount.total_count}</div>
                </div>
                <div className="offline-amount-wrapper">
                  <div className="name">离线</div>
                  <div className="amount">{deviceOnlineCount.offline_count}</div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
