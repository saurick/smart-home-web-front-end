import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'
import { Tabs } from '@/common/components/tabs'
import { SelectDevice } from './selectDevice'
import { SelectGroup } from './selectGroup'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { Button } from '@/common/components/button'
import { getContext } from '@/common/stores'

export const SceneAddDevice = () => {
  const [selectGroupData, setSelectGroupData] = useState([])
  const [selectDeviceData, setSelectDeviceData] = useState([])
  // const [toSelectGroupData, setToSelectGroupData] = useState([])
  const [toSelectDeviceData, setToSelectDeviceData] = useState([])
  // const [selectedGroupData, setSelectedGroupData] = useState([])
  const [selectedDeviceData, setSelectedDeviceData] = useState([])
  const [selectedGroupDeviceData, setSelectedGroupDeviceData] = useState([])

  const navigate = useNavigate()
  const context = getContext()

  const onSelectGroup = (value, selectData) => {
    console.log(value, 'value')
    const arr = []
    value.forEach((item) => {
      const { group_devices } = item
      group_devices.length > 0 && group_devices.forEach((devicesItem) => {
        arr.push(devicesItem)
      })
    })
    console.log(arr, 'arr111')
    setSelectedGroupDeviceData(arr)
    // setToSelectGroupData(selectData)
    // setSelectedGroupData(value)
  }
  const onSelectDevice = (value, selectData) => {
    console.log(value, 'value')
    setToSelectDeviceData(selectData)

    setSelectedDeviceData(value)
  }

  const onConfirm = () => {
    const arr = []
    selectDeviceData.forEach((item) => {
      let count = 0
      selectedGroupDeviceData.forEach((devicesItem) => {
        if (item.dev_id === devicesItem.dev_id && item.ep_id === devicesItem.ep_id) {
          count += 1
        }
      })
      selectedDeviceData.forEach((devicesItem) => {
        if (item.dev_id === devicesItem.dev_id && item.ep_id === devicesItem.ep_id) {
          count += 1
        }
      })
      if (count > 0) {
        arr.push(item)
      }
    })

    // arr = arr.concat(selectedDeviceData)
    context.dispatch({ type: 'scene-selected-actions', payload: arr })
    context.dispatch({ type: 'router-from', payload: 'scene-add-device' })
    console.log(arr, 'onConfirm')
    navigate(-1)
  }

  const onCancel = () => {
    context.dispatch({ type: 'router-from', payload: 'scene-add-device' })
    navigate(-1)
  }

  const queryAllGroupDetail = async () => {
    const rpc = new JsonRpc('query_all_group_detail')
    const result = await rpc.fetchData()
    const { group_list } = result
    setSelectGroupData(group_list)

    // const actions = JSON.parse(localStorage.getItem('sceneNormalActions'))
    // let arr = []
    // actions.forEach(actionsItem => {
    //   group_list.forEach(groupsItem => {
    //     if (actionsItem.group_id === groupsItem.group_id && !arr.includes(groupsItem.key)) {
    //       arr.push(groupsItem.key)
    //     }
    //   })

    // })
    // setToSelectGroupData(arr)

    // let _arr = []
    // arr.forEach(item => {
    //   _arr.push(group_list[item])
    // })
    // setSelectedGroupData(_arr)
  }

  const queryAllExecuteDeviceEpDetail = async () => {
    const rpc = new JsonRpc('query_all_execute_device_ep_detail')
    const result = await rpc.fetchData()
    const { device_ep_list } = result
    setSelectDeviceData(device_ep_list)

    const actions = JSON.parse(localStorage.getItem('sceneNormalActions'))
    console.log(actions, 'actions')
    const arr = []
    actions.forEach((actionsItem) => {
      device_ep_list.forEach((listItem) => {
        if (actionsItem.dev_id === listItem.dev_id && (actionsItem.ep === listItem.ep_id || actionsItem.ep_id === listItem.ep_id) && !arr.includes(listItem.key)) {
          arr.push(listItem.key)
        }
      })
    })
    setToSelectDeviceData(arr)

    const _arr = []
    arr.forEach((item) => {
      _arr.push(device_ep_list[item])
    })
    setSelectedDeviceData(_arr)
  }

  useEffect(() => {
    queryAllGroupDetail()
    queryAllExecuteDeviceEpDetail()
  }, [])

  const items = [
    {
      label: '设备选择',
      key: '1',
      children: 'Tab 2'
    },
    {
      label: '群组选择',
      key: '2',
      children: 'Tab 1'
    },
  ]

  items.forEach((item) => {
    if (item.key === '1') {
      item.children = (
        <SelectDevice
          dataSource={selectDeviceData}
          onSelect={onSelectDevice}
          toSelectDeviceData={toSelectDeviceData}
        />
      )
    }
    if (item.key === '2') {
      item.children = (
        <SelectGroup
          dataSource={selectGroupData}
          onSelect={onSelectGroup}
        // toSelectGroupData={toSelectGroupData}
        />
      )
    }
  })

  return (
    <div className={styles.sceneAddDevice}>
      <Tabs type="default" items={items} />
      <div className="footer-wrapper">
        <Button type="whiteButton" text="取 消" onClick={() => { onCancel() }} style={{ position: 'absolute', right: '152px', bottom: '16px', width: '65px' }} />
        <Button type="blueButton" text="确 定" onClick={() => { onConfirm() }} style={{ position: 'absolute', right: '64px', bottom: '16px', width: '65px' }} />
      </div>
    </div>
  )
}
