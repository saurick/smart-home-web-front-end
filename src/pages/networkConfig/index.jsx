import React, { useState, useRef, useEffect } from 'react'
import { CheckOutlined, LockOutlined } from '@ant-design/icons'
import { Switch } from 'antd'
import styles from './index.module.less'
import { Tabs } from '@/common/components/tabs'
import { Button } from '@/common/components/button'
import { Input } from '@/common/components/input'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { sleep } from '@/common/utils/util'
import { Select } from '@/common/components/select'
import { WifiIcon } from '@/common/components/icons'

let stopScan = false

export const NetworkConfig = () => {
  const [showWifiSettings, setShowWifiSettings] = useState(false)
  const [wifiList, setWifiList] = useState([])
  const [isWifiEnable, setIsWifiEnable] = useState(false)
  const [password, setPassword] = useState('')
  const [hasSelectedItem, setHasSelectedItem] = useState(false)
  const [wlanInfo, setWlanInfo] = useState({})
  const [ethInfo, setEthInfo] = useState({})
  const [selectedItem, setSelectedItem] = useState({})

  const wifiListRef = useRef()

  const scanWifi = async () => {
    for (let i = 0; i < 3; i++) {
      console.log(stopScan, 'stopScan')
      if (stopScan) break

      const rpc = new JsonRpc('scan_wifi')
      const result = await rpc.fetchData()
      const list = result.ap_list

      if (Array.isArray(result.ap_list) && result.ap_list.length > 0) {
        result.ap_list.forEach((item, index) => {
          if (item.associated) {
            const removeItem = list.splice(index, 1)
            list.unshift(removeItem[0])
            setHasSelectedItem(true)
          }
        })
        console.log(list, 'list111')
        setWifiList(list)
      }
      await sleep(5000)
    }

    const infoRpc = new JsonRpc('get_network_info')
    const infoResult = await infoRpc.fetchData()

    let wlan = []
    let eth = []
    infoResult.intfs.forEach((item) => {
      if (item.name === 'eth0') {
        eth = item
      }
      if (item.name === 'wlan0') {
        wlan = item
      }
    })

    setWlanInfo(wlan)
    setSelectedItem(wlan)
    setEthInfo(eth)
  }

  const onSwitchChange = async (checked) => {
    const rpc = new JsonRpc('enable_wifi')
    const result = await rpc.fetchData({ enable: checked })
    setIsWifiEnable(checked)

    if (checked) {
      stopScan = false
      scanWifi()
    }
  }

  const onSelectWifi = async (index) => {
    stopScan = true

    setHasSelectedItem(true)

    const selectItem = wifiList.splice(index, 1)
    console.log(selectItem, 'selectItem')
    if (selectItem[0].associated) {
      console.log(wlanInfo, 'wlanInfo')
      setSelectedItem(wlanInfo)
      setWifiList((wifiList) => [selectItem[0], ...wifiList])
    } else {
      let currentCheckedItem = {}
      wifiList.forEach((item, index) => {
        if (item.associated) {
          currentCheckedItem = wifiList.splice(index, 1)
        }
      })
      const obj = {}
      obj.name = 'wlan0'
      obj.type = 'dhcp'
      obj.ip = ''
      obj.mask = ''
      obj.gateway = ''
      obj.dns = ''
      obj.dns1 = ''
      setSelectedItem({ ...obj })
      if (JSON.stringify(currentCheckedItem) !== '{}') {
        setWifiList((wifiList) => [selectItem[0], currentCheckedItem[0], ...wifiList])
      } else {
        setWifiList((wifiList) => [selectItem[0], ...wifiList])
      }
    }

    setShowWifiSettings(true)
  }

  const onLockWifi = (event) => {

  }

  const onInputPassword = (value) => {
    setPassword(value)
  }

  const onWifiSelectChange = (value) => {
    setSelectedItem({ ...selectedItem, type: value })
  }

  const onInputIp = (value) => {
    setSelectedItem({ ...selectedItem, ip: value })
  }
  const onInputMask = (value) => {
    setSelectedItem({ ...selectedItem, mask: value })
  }
  const onInputGateway = (value) => {
    setSelectedItem({ ...selectedItem, gateway: value })
  }
  const onInputDns = (value) => {
    setSelectedItem({ ...selectedItem, dns: value })
  }

  const onWiredSelectChange = (value) => {
    setEthInfo({ ...ethInfo, type: value })
  }

  const onConfirmWlan = async () => {
    console.log(selectedItem, 'selectedItem')
    const pskObj = {}
    pskObj.psk = password
    pskObj.ssid = wifiList[0].ssid
    const connectRpc = new JsonRpc('connect_wifi')
    const connectResult = await connectRpc.fetchData({ ...pskObj })

    const infoObj = {}
    infoObj.name = selectedItem.name
    infoObj.type = selectedItem.type
    if (infoObj.type === 'static') {
      infoObj.ip = selectedItem.ip || ''
      infoObj.mask = selectedItem.mask || ''
      infoObj.gateway = selectedItem.gateway || ''
      infoObj.dns = selectedItem.dns || ''
      infoObj.dns1 = selectedItem.dns1 || ''
    }
    const networkInfoRpc = new JsonRpc('set_network_info')
    const networkInfoResult = await networkInfoRpc.fetchData({ ...infoObj })

    stopScan = false
    scanWifi()
  }

  const onInputEthIp = (value) => {
    setEthInfo({ ...ethInfo, ip: value })
  }
  const onInputEthMask = (value) => {
    setEthInfo({ ...ethInfo, mask: value })
  }
  const onInputEthGateway = (value) => {
    setEthInfo({ ...ethInfo, gateway: value })
  }
  const onInputEthDns = (value) => {
    setEthInfo({ ...ethInfo, dns: value })
  }

  const onConfirmEth = async () => {
    const infoObj = {}
    infoObj.name = ethInfo.name
    infoObj.type = ethInfo.type
    if (infoObj.type === 'static') {
      infoObj.ip = ethInfo.ip || ''
      infoObj.mask = ethInfo.mask || ''
      infoObj.gateway = ethInfo.gateway || ''
      infoObj.dns = ethInfo.dns || ''
      infoObj.dns1 = ethInfo.dns1 || ''
    }
    const networkInfoRpc = new JsonRpc('set_network_info')
    const networkInfoResult = await networkInfoRpc.fetchData({ ...infoObj })
    // setShowWifiSettings(false)
  }

  const getNetworkInfo = async () => {
    const rpc = new JsonRpc('get_network_info')
    const result = await rpc.fetchData()

    let wlan = []
    let eth = []
    result.intfs.forEach((item) => {
      if (item.name === 'eth0') {
        eth = item
      }
      if (item.name === 'wlan0') {
        wlan = item
      }
    })

    setIsWifiEnable(wlan.open)
    setWlanInfo(wlan)
    if (wlan.is_connect) {
      setSelectedItem(wlan)
    }
    setEthInfo(eth)
    if (wlan.open) {
      stopScan = false
      scanWifi()
    }
  }

  useEffect(() => {
    getNetworkInfo()
  }, [])

  useEffect(() => {
    console.log(wifiList, 'wifiList3')
  }, [wifiList])

  const items = [
    {
      label: '无线局域网',
      key: '1',
      children: 'Tab 1'
    },
    {
      label: '有线网络设置',
      key: '2',
      children: 'Tab 2'
    },
  ]

  items.forEach((item) => {
    if (item.key === '1') {
      item.children = (
        <div className="wlan-content-wrapper">
          <div className="wlan-select-wrapper">
            <div className="wlan-select-title">
              <div className="title">无线局域网</div>
              <Switch className="switch" checked={isWifiEnable} onChange={(checked) => { onSwitchChange(checked) }} />
            </div>
            {
              isWifiEnable && (
                <div className="list-wrapper" ref={wifiListRef}>
                  {
                    wifiList.map((item, index) => (
                      <div className="item-wrapper" key={item.bssid}>
                        <div className="icon-check-wrapper">
                          {
                            item.associated && (
                              (<CheckOutlined className="icon-check" />)
                            )
                          }
                        </div>
                        <div className="item-right-wrapper" onClick={() => { onSelectWifi(index) }} style={{ background: (index === 0 && hasSelectedItem) ? '#ECEFF8' : '#FFFFFF' }}>
                          <div className="wlan-wrapper">
                            <WifiIcon />
                            <div className="wlan-name">{item.ssid}</div>
                          </div>
                          <LockOutlined className="icon-lock" onClick={(event) => { onLockWifi(event) }} />
                        </div>
                      </div>
                    ))
                  }
                </div>
              )
            }
          </div>

          {
            showWifiSettings && (
              <div className="wlan-settings-wrapper">
                <div className="title">WIFI设置</div>
                <div className="type-password-wrapper">
                  <div className="password-left-wrapper">
                    <div className="red-star">*&nbsp;</div>
                    <div className="password">密码</div>
                  </div>
                  <Input type="default" placeholder="请输入WIFI密码" defaultValue={password} onChange={(value) => { onInputPassword(value) }} style={{ width: '315px', height: '32px' }} />
                </div>
                <div className="advanced-options">高级选项</div>
                <div className="select-mode-wrapper">
                  <div className="mode-left-wrapper">
                    <div className="red-star">*&nbsp;</div>
                    <div className="mode">模式</div>
                  </div>
                  <Select
                    width="315"
                    placeholder="选择模式"
                    defaultValue={selectedItem.type === 'static' ? '静态IP' : '动态IP'}
                    onChange={(value) => { onWifiSelectChange(value) }}
                    options={[
                      {
                        value: 'static',
                        label: '静态IP',
                      },
                      {
                        value: 'dhcp',
                        label: '动态IP',
                      }
                    ]}
                  />
                </div>
                {
                  selectedItem.type === 'static' && (
                    <div className="network-settings-wrapper">
                      <div className="type-ip-wrapper">
                        <div className="ip">IP地址</div>
                        <Input type="on-base-color" placeholder="请输入IP地址" defaultValue={selectedItem.ip} onChange={(value) => { onInputIp(value) }} />
                      </div>
                      <div className="type-subnet-mask-wrapper">
                        <div className="subnet-mask">子网掩码</div>
                        <Input type="on-base-color" placeholder="请输入子网掩码" defaultValue={selectedItem.mask} onChange={(value) => { onInputMask(value) }} />
                      </div>
                      <div className="type-gateway-wrapper">
                        <div className="gateway">网关</div>
                        <Input type="on-base-color" placeholder="请输入网关" defaultValue={selectedItem.gateway} onChange={(value) => { onInputGateway(value) }} />
                      </div>
                      <div className="type-dns-server-wrapper">
                        <div className="dns-server">DNS服务器</div>
                        <Input type="on-base-color" placeholder="请输入DNS服务器" defaultValue={selectedItem.dns} onChange={(value) => { onInputDns(value) }} />
                      </div>
                    </div>
                  )
                }
                <div className="confirm-button-wrapper">
                  <Button type="blueButton" text="确 定" onClick={() => { onConfirmWlan() }} style={{ width: '65px' }} />
                </div>
              </div>
            )
          }

        </div>
      )
    }
    if (item.key === '2') {
      item.children = (
        <div className="wired-network-settings-wrapper" style={{ width: ethInfo.type === 'static' ? '491px' : '361px' }}>
          <div className="title">有线网络设置</div>
          <div className="select-mode-wrapper">
            <div className="mode-left-wrapper">
              {/* <div className='red-star'>*&nbsp;</div> */}
              <div className="mode">模式</div>
            </div>
            <Select
              width="315"
              placeholder="选择模式"
              defaultValue={ethInfo.type === 'static' ? '静态IP' : '动态IP'}
              onChange={(value) => { onWiredSelectChange(value) }}
              options={[
                {
                  value: 'static',
                  label: '静态IP',
                },
                {
                  value: 'dhcp',
                  label: '动态IP',
                }
              ]}
            />
          </div>
          {
            ethInfo.type === 'static' && (
              <div className="network-settings-wrapper">
                <div className="type-ip-wrapper">
                  <div className="ip">IP地址</div>
                  <Input type="on-base-color" placeholder="请输入IP地址" defaultValue={ethInfo.ip} onChange={(value) => { onInputEthIp(value) }} />
                </div>
                <div className="type-subnet-mask-wrapper">
                  <div className="subnet-mask">子网掩码</div>
                  <Input type="on-base-color" placeholder="请输入子网掩码" defaultValue={ethInfo.mask} onChange={(value) => { onInputEthMask(value) }} />
                </div>
                <div className="type-gateway-wrapper">
                  <div className="gateway">网关</div>
                  <Input type="on-base-color" placeholder="请输入网关" defaultValue={ethInfo.gateway} onChange={(value) => { onInputEthGateway(value) }} />
                </div>
                <div className="type-dns-server-wrapper">
                  <div className="dns-server">DNS服务器</div>
                  <Input type="on-base-color" placeholder="请输入DNS服务器" defaultValue={ethInfo.dns} onChange={(value) => { onInputEthDns(value) }} />
                </div>
              </div>
            )
          }
          <div className="confirm-button-wrapper">
            <Button type="blueButton" text="确 定" onClick={() => { onConfirmEth() }} style={{ width: '65px' }} />
          </div>
        </div>
      )
    }
  })

  return (
    <div className={styles.networkConfigWrapper}>
      <Tabs type="card" items={items} />
    </div>
  )
}
