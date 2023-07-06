import React, { useEffect, useRef, useState, useCallback } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import debounce from 'lodash/debounce'
import styles from './index.module.less'
import { Table } from '@/common/components/table'
import { Button } from '@/common/components/button'
import { Select } from '@/common/components/select'
import { Modal } from '@/common/components/modal'
import { AirConditioningModal } from '@/common/components/airConditioningModal'
import { CasementCurtainModal } from '@/common/components/casementCurtainModal'
import { CorlorfulLightModal } from '@/common/components/corlorfulLightModal'
import { DreamCurtainModal } from '@/common/components/dreamCurtainModal'
import { FreshAirModal } from '@/common/components/freshAirModal'
import { MonochromeLightModal } from '@/common/components/monochromeLightModal'
import { RollerBlindModal } from '@/common/components/rollerBlindModal'
import { TwoColorLightingModal } from '@/common/components/twoColorLightingModal'
import { UnderfloorHeatingModal } from '@/common/components/underfloorHeatingModal'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { int2hex, hexToDecimal, isTypeString } from '@/common/utils/util'
import { getContext } from '@/common/stores'

import { DeviceOnlineIcon, DeviceOfflineIcon, FilterIcon } from '@/common/components/icons'

export const CloudServiceImportConfig = () => {
  const [showParamsSettings, setShowParamsSettings] = useState({})
  const [modalHeaderData, setModalHeaderData] = useState({})
  const [sliderModalStyle, setSliderModalStyle] = useState({})
  const [maskStyle, setMaskStyle] = useState({})
  const tableRef = useRef(null)
  const [showModalRef, setShowModalRef] = useState(null)
  const [dataSource, setDataSource] = useState([])
  const [isOnline, setIsOnline] = useState([])
  const [cmdData, setCmdData] = useState([])
  const [recordData, setRecordData] = useState({})
  const [positionOptions, setPositionOptions] = useState([])
  const [positionOptionsCopy, setPositionOptionsCopy] = useState([])
  const [bitmapCodeList, setBitmapCodeList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  const context = getContext()

  const [socketUrl, setSocketUrl] = useState((location.protocol === 'https:') ? 'wss://192.168.0.214:9090' : 'ws://192.168.0.214:9090')

  const { lastMessage, readyState } = useWebSocket(socketUrl, { rejectUnauthorized: false })
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  useEffect(() => {
    console.log(connectionStatus, 'connectionStatus')
    console.log(lastMessage?.data, 'lastMessage')
    if (lastMessage !== null && isTypeString(lastMessage.data)) {
      let data = {}
      try {
        data = JSON.parse(lastMessage.data)
      } catch (e) {
        console.log(e)
      }

      if (data.state_type === 0) {
        dataSource.forEach((item) => {
          if (item.dev_type === '0000' && item.ep_id === 2) {
            if (data.state_value === '00') {
              item.on = 0
            }
            if (data.state_value === '01') {
              item.on = 1
            }
          }
        })
        setDataSource([...dataSource])
      }
      if (data.dev_type === recordData.dev_type && data.ep_id === recordData.ep_id) {
        if (data.state_type === 1) {
          const arr = data.state_value.split('')
          recordData.motor = hexToDecimal(arr[0] + arr[1])
          recordData.open_level = hexToDecimal(arr[2] + arr[3])
        }
        if (data.state_type === 2) {
          const arr = data.state_value.split('')
          recordData.motor = hexToDecimal(arr[0] + arr[1])
          recordData.open_level = hexToDecimal(arr[2] + arr[3])
        }
        if (data.state_type === 3) {
          recordData.brightness = hexToDecimal(data.state_value)
        }
        if (data.state_type === 4) {
          recordData.cct = hexToDecimal(data.state_value)
        }
        if (data.state_type === 6) {
          const arr = data.state_value.split('')
          recordData.red = hexToDecimal(arr[0] + arr[1])
          recordData.green = hexToDecimal(arr[2] + arr[3])
          recordData.blue = hexToDecimal(arr[4] + arr[5])
          recordData.white = hexToDecimal(arr[6] + arr[7])
        }
        // if(data.state_type === 9) {
        //   recordData.green = hexToDecimal(data.state_value)
        // }
        // if(data.state_type === 10) {
        //   recordData.blue = hexToDecimal(data.state_value)
        // }
        // if(data.state_type === 11) {
        //   recordData.white = hexToDecimal(data.state_value)
        // }
        if (data.state_type === 14) {
          recordData.air_mode = hexToDecimal(data.state_value)
        }
        if (data.state_type === 15) {
          recordData.target_temp = hexToDecimal(data.state_value)
        }
        if (data.state_type === 17) {
          // data.state_value.replace(/0/g, '')
          recordData.wind_speed = hexToDecimal(data.state_value)
        }
        if (data.state_type === 28) {
          const arr = data.state_value.split('')
          recordData.brightness_motor = hexToDecimal(arr[0] + arr[1])
        }
        if (data.state_type === 29) {
          const arr = data.state_value.split('')
          console.log(arr[2] + arr[3], 'arr[2] + arr[3]')
          recordData.brightness_open_level = hexToDecimal(arr[2] + arr[3])
        }
        // if(data.state_type === 29) {
        //   recordData.brightness_level = hexToDecimal(data.state_value)
        // }
        // if(data.state_type === 29) {
        //   recordData.brightness_level = hexToDecimal(data.state_value)
        // }
      }

      console.log(recordData, 'recordData')
      setRecordData({ ...recordData })
    }
  }, [lastMessage, readyState])

  const onShowParamsSettings = (event, record, index) => {
    console.log(record, 'obj')
    const obj = {}
    obj.dev_type = record.dev_type
    obj.ep_id = record.ep_id
    setShowParamsSettings(obj)
    setModalHeaderData(dataSource[index])
    const { properties } = dataSource[index]
    setCmdData(properties)
    setRecordData(record)
    console.log(properties, 'properties')
    console.log(record, 'recordData')
    const rect = event.target.parentNode.parentNode.getBoundingClientRect()

    // 弹窗下方到视口的距离
    const distance = document.body.offsetHeight - rect.top - rect.height - 300
    if (distance < 0) {
      setSliderModalStyle({
        bottom: document.body.offsetHeight - rect.top + 2,
        right: document.body.clientWidth - rect.right
      })
    }
    if (distance > 0) {
      setSliderModalStyle({
        top: rect.top + rect.height + 2,
        right: document.body.clientWidth - rect.right
      })
    }
    console.log(rect, 'window.rect')
    setMaskStyle({
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      borderWidth: `${rect.top}px ${document.body.clientHeight}px ${document.body.clientHeight}px ${rect.left}px`,
    })
    setShowModalRef(event.target)
  }

  const onSelectPosition = (record, value) => {
    const recordCopy = JSON.parse(JSON.stringify(record))
    console.log(recordCopy, 'recordCopy')
    console.log(value, 'value111')
    if (value === '') {
      console.log(positionOptionsCopy, 'positionOptionsCopy')
      positionOptionsCopy.forEach((copyItem, copyIndex) => {
        if (copyItem.value === recordCopy.position) {
          console.log(copyItem.value, 'copyItem.value')
          setPositionOptions((positionOptions) => [copyItem, ...positionOptions])
        }
      })

      dataSource.forEach((dataItem, dataIndex) => {
        if (dataItem.key === record.key) {
          dataItem.name = '--'
          dataItem.area = {}
          dataItem.area.name = '--'
        }
      })
      setDataSource([...dataSource])
    }

    if (value !== '') {
      let count = 0
      positionOptions.forEach((optionsItem, optionsIndex) => {
        if (optionsItem.value === value) {
          if (recordCopy.position === '') {
            if (count === 1) return //  如果有重复的position，只删除一个
            count += 1
            positionOptions.splice(optionsIndex, 1)
            setPositionOptions([...positionOptions])
          }
          if (recordCopy.position !== '') {
            if (count === 1) return
            count += 1
            console.log(recordCopy.position, 'recordCopy.position')
            const arr = JSON.parse(JSON.stringify(positionOptions))
            const newItem = { label: recordCopy.position, value: recordCopy.position }
            arr.splice(optionsIndex, 1, newItem)
            setPositionOptions(arr)
          }
        }
      })

      bitmapCodeList.forEach((item) => {
        if (item.position === value) {
          record.name = item.name
          record.area.area_id = item.area.area_id
          record.area.name = item.area.name
        }
      })
    }

    dataSource.forEach((dataItem, dataIndex) => {
      if (dataItem.key === record.key) {
        dataItem.position = value
      }
    })

    setDataSource([...dataSource])
  }

  const onStartConfig = async () => {
    if (dataSource.length < bitmapCodeList.length) {
      setModalTitle('当前设备不全，需添加设备')
      setShowModal(true)
      return
    }

    const { length } = positionOptions
    if (length > 0) {
      setModalTitle('请继续选择剩余的位图编号')
      setShowModal(true)
      return
    }
    if (length === 0) {
      const obj = {}
      const configFileData = JSON.parse(localStorage.getItem('configFile'))
      obj.config = configFileData.config
      const bitmap_code_list = []

      dataSource.forEach((item) => {
        const obj = {}
        obj.dev_id = item.dev_id
        obj.ep_id = item.ep_id
        obj.position = item.position
        bitmap_code_list.push(obj)
      })
      obj.bitmap_code_list = bitmap_code_list

      const rpc = new JsonRpc('import_config')
      const result = await rpc.fetchData({ ...obj })
      if (result.succeed) {
        setModalTitle('配置成功')
        setShowModal(true)
      }
    }
  }

  const onComfirmModal = () => {
    setShowModal(false)
  }

  const sendCommandData = async (cmd, type, record, int2hexFlag = true) => {
    const obj = {}
    if (int2hexFlag) {
      obj.cmd = int2hex(cmd)
    } else {
      obj.cmd = cmd
    }

    obj.cmd_type = type
    obj.dev_ep_id = record.ep_id
    obj.dev_id = record.dev_id
    obj.dev_type = record.dev_type
    const rpc = new JsonRpc('send_command_data')
    const result = await rpc.fetchData(obj)
    console.log(result, 'sendCommandData')
    if (cmd === '00') {
      setIsOnline(false)
    }
    if (cmd === '01') {
      setIsOnline(true)
    }
  }

  const request = (cmd, cmd_type, record) => {
    sendCommandData(cmd, cmd_type, record)
  }
  const debounceRequest = useCallback(debounce(request, 500), [])

  const onSwitchDevice = (record) => {
    console.log('aaa')
    if (record.on === 1) {
      debounceRequest('00', 0, record)
    }

    if (record.on === 0) {
      debounceRequest('01', 0, record)
    }
  }

  const queryAllExecuteDeviceEpDetail = async () => {
    const rpc = new JsonRpc('query_all_device_ep_detail')
    const result = await rpc.fetchData()
    const { device_ep_list } = result
    console.log(result, 'queryAllExecuteDeviceEpDetail')
    const configFileData = JSON.parse(localStorage.getItem('configFile'))
    const { bitmap_code_list } = configFileData
    console.log(device_ep_list.length, '444')
    console.log(bitmap_code_list.length, '4444')
    if (device_ep_list.length < bitmap_code_list.length) {
      setModalTitle('当前设备不全，需添加设备')
      setShowModal(true)
    }
    const arr = []
    bitmap_code_list.forEach((item) => {
      const obj = {}
      obj.value = item.position
      obj.label = item.position

      arr.push(obj)
    })

    setPositionOptionsCopy(arr)
    setBitmapCodeList(bitmap_code_list)

    if (configFileData.gw_id === localStorage.getItem('gw_id')) {
      bitmap_code_list.forEach((deviceListItem) => {
        bitmap_code_list.forEach((bitmapListItem) => {
          if (deviceListItem.dev_id === bitmapListItem.dev_id && deviceListItem.ep_id === bitmapListItem.ep_id) {
            deviceListItem.name = bitmapListItem.name
            deviceListItem.area = bitmapListItem.area
            deviceListItem.position = bitmapListItem.position
          }
        })
      })

      const arrCopy = JSON.parse(JSON.stringify(arr))
      device_ep_list.forEach((deviceListItem) => {
        let count = 0
        arrCopy.forEach((item, index) => {
          if (deviceListItem.position === item.value) {
            if (count === 1) return //  如果有重复的position，只删除一个
            count += 1
            arrCopy.splice(index, 1)
          }
        })
      })

      setPositionOptions(arrCopy)
      setDataSource(device_ep_list)
    }

    if (configFileData.gw_id !== localStorage.getItem('gw_id')) {
      const list = JSON.parse(JSON.stringify(device_ep_list))
      list.forEach((item) => {
        item.name = '--'
        item.area = {}
        item.area.name = '--'
        item.position = ''
      })

      setPositionOptions(arr)
      setDataSource(list)
    }
  }

  useEffect(() => {
    queryAllExecuteDeviceEpDetail()
  }, [])

  useEffect(() => {
    console.log(positionOptionsCopy.length, 'positionOptions')
  }, [positionOptionsCopy])

  const columns = [
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">序号</div>
        </div>
      ),
      width: 60,
      dataIndex: 'orderNum',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">Mac</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('dev_id') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'dev_id') }} />
        </div>
      ),
      width: 200,
      dataIndex: 'dev_id',
      render: (text, record, index) => {
        return (
          <div className="online-device-mac">
            <div className={record.online ? 'online-circle' : 'offline-circle'} />
            <div className="mac">{record.dev_id}</div>
          </div>
        )
      }
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">设备类型</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('dev_type_name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'dev_type_name') }} />
        </div>
      ),
      width: 250,
      dataIndex: 'dev_type_name',
    },
    {
      title: () => (
        <div className="title-wrapper">
          <div className="title">设备名称（描述）</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'name') }} />
        </div>
      ),
      width: 250,
      // dataIndex: 'name',
      render: (text, record, index) => (
        <div>{record.name}</div>
      )
    },
    {
      title: () => (
        <div className="title-wrapper">
          <div className="title">所在空间</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('area_name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'area_name') }} />
        </div>
      ),
      width: 250,
      // dataIndex: 'area',
      render: (text, record, index) => (
        <div>{record.area.name}</div>
      )
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">位图编号</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('position') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'position') }} />
        </div>
      ),
      width: 250,
      // dataIndex: 'position',
      render: (text, record, index) => {
        return <Select
          options={positionOptions}
          allowClear
          placeholder="选择对应位图编号"
          defaultValue={record.position}
          width="108px"
          onChange={(value) => { onSelectPosition(record, value) }}
        />
      }
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">功能</div>
        </div>
      ),
      width: 100,
      render: (text, record, index) => {
        if (record.has_ctrl_page) {
          return <div className="params-active" onClick={(event) => { onShowParamsSettings(event, record, index) }}>参数</div>
        }
        if (!record.has_ctrl_page) {
          return <div className="params-disabled">参数</div>
        }
      }
    },
    {
      width: 60,
      render: (text, record, index) => {
        if (record.show_func_switch) {
          return record.on === 1 ? (
            <DeviceOnlineIcon className="switch-icon" onClick={() => { onSwitchDevice(record) }} />
          ) : (
            <DeviceOfflineIcon className="switch-icon" onClick={() => { onSwitchDevice(record) }} />
          )
        }
      }
    }
  ]

  const prop = {
    headerData: modalHeaderData,
    sliderModalStyles: sliderModalStyle,
    maskStyle,
    showModalRef,
    setShowParamsSettings,
    cmdData,
    sendCommandData,
    recordData,
    debounceRequest
  }

  return (
    <div className={styles.onlineDeviceWrapper}>
      <div className="cloud-service-import-config-title-wrapper">
        {/* <div>The WebSocket is currently {connectionStatus}</div> */}
        <Button type="goBackButton" />
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        ref={tableRef}
        height="calc(100vh - 254px)"
      >
        <Button type="blueButton" text="开始配置" onClick={() => { onStartConfig() }} style={{ position: 'absolute', right: '64px', bottom: '16px' }} />
      </Table>
      {
        (showParamsSettings.dev_type === '1108' && showParamsSettings.ep_id === 1) && (
          <MonochromeLightModal {...prop} />
        )
      }
      {
        (showParamsSettings.dev_type === '1110' && showParamsSettings.ep_id === 1) && (
          <CorlorfulLightModal {...prop} />
        )
      }
      {
        (showParamsSettings.dev_type === '1305' && showParamsSettings.ep_id === 1) && (
          <RollerBlindModal {...prop} />
        )
      }
      {
        (showParamsSettings.dev_type === '1304' && showParamsSettings.ep_id === 1) && (
          <CasementCurtainModal {...prop} />
        )
      }
      {
        (showParamsSettings.dev_type === '1324' && showParamsSettings.ep_id === 1) && (
          <DreamCurtainModal {...prop} />
        )
      }
      {
        (showParamsSettings.dev_type === '1109' && showParamsSettings.ep_id === 1) && (
          <TwoColorLightingModal {...prop} />
        )
      }
      {
        (
          (showParamsSettings.dev_type === '1308' && showParamsSettings.ep_id === 2) ||
          (showParamsSettings.dev_type === '1333' && showParamsSettings.ep_id === 2) ||
          (showParamsSettings.dev_type === '1311' && showParamsSettings.ep_id === 2) ||
          (showParamsSettings.dev_type === '1312' && showParamsSettings.ep_id === 2) ||
          (showParamsSettings.dev_type === '1341' && showParamsSettings.ep_id === 2)
        ) &&
        (
          <UnderfloorHeatingModal {...prop} />
        )
      }
      {
        (
          (showParamsSettings.dev_type === '1309' && showParamsSettings.ep_id === 1) ||
          (showParamsSettings.dev_type === '1332' && showParamsSettings.ep_id === 1) ||
          // (showParamsSettings.dev_type === '1330' && showParamsSettings.ep_id === 1) ||
          (showParamsSettings.dev_type === '1311' && showParamsSettings.ep_id === 1) ||
          (showParamsSettings.dev_type === '1312' && showParamsSettings.ep_id === 1) ||
          (showParamsSettings.dev_type === '1341' && showParamsSettings.ep_id === 1)
        ) &&
        (
          <FreshAirModal {...prop} />
        )
      }
      {
        (
          (showParamsSettings.dev_type === '1312' && showParamsSettings.ep_id === 3) ||
          (showParamsSettings.dev_type === '1341' && showParamsSettings.ep_id === 3) ||
          (showParamsSettings.dev_type === '1311' && showParamsSettings.ep_id === 3) ||
          (showParamsSettings.dev_type === '1342') ||
          (showParamsSettings.dev_type === '1306' && showParamsSettings.ep_id === 1) ||
          (showParamsSettings.dev_type === '1310' && showParamsSettings.ep_id === 3) ||
          (showParamsSettings.dev_type === '1330' && showParamsSettings.ep_id === 3) ||
          (showParamsSettings.dev_type === '1331' && showParamsSettings.ep_id === 3)
        ) &&
        (
          <AirConditioningModal {...prop} />
        )
      }

      <Modal showModal={showModal} title={modalTitle} buttonPosition="center">
        <Button type="blueButton" text="确 定" onClick={() => { onComfirmModal() }} style={{ width: '64px' }} />
      </Modal>
    </div>
  )
}
