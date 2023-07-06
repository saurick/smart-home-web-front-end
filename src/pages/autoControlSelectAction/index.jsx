import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'
import { Tabs } from '@/common/components/tabs'
import { SelectDevice } from './selectDevice'
import { SelectGroup } from './selectGroup'
import { SelectScene } from './selectScene'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { Button } from '@/common/components/button'
import { getContext } from '@/common/stores'

export const AutoControlSelectAction = () => {
  const [selectSceneData, setSelectSceneData] = useState([])
  const [selectGroupData, setSelectGroupData] = useState([])
  const [selectDeviceData, setSelectDeviceData] = useState([])
  const [toSelectSceneData, setToSelectSceneData] = useState([])
  const [toSelectGroupData, setToSelectGroupData] = useState([])
  const [toSelectDeviceData, setToSelectDeviceData] = useState([])
  const [selectedSceneData, setSelectedSceneData] = useState([])
  const [selectedGroupData, setSelectedGroupData] = useState([])
  const [selectedDeviceData, setSelectedDeviceData] = useState([])

  const navigate = useNavigate()
  const context = getContext()

  const onSelectScene = (value, selectData) => {
    console.log(value, 'value')
    console.log(selectData, 'value1')
    setToSelectSceneData(selectData)
    setSelectedSceneData(value)
  }
  const onSelectGroup = (value, selectData) => {
    console.log(value, 'value')
    setToSelectGroupData(selectData)
    setSelectedGroupData(value)
  }
  const onSelectDevice = (value, selectData) => {
    console.log(value, 'value')
    setToSelectDeviceData(selectData)
    setSelectedDeviceData(value)
  }

  const onConfirm = () => {
    console.log(selectedSceneData, 'selectedSceneData')
    selectedSceneData.forEach((item) => {
      item.dst_addr_mode = 2
    })
    selectedGroupData.forEach((item) => {
      item.dst_addr_mode = 1
    })
    selectedDeviceData.forEach((item) => {
      item.dst_addr_mode = 0
    })
    let arr = []
    arr = arr.concat(selectedSceneData, selectedGroupData, selectedDeviceData)
    context.dispatch({ type: 'auto-control-selected-actions', payload: arr })
    context.dispatch({ type: 'router-from', payload: 'auto-control-select-action' })
    console.log(arr, 'onConfirm')
    navigate(-1)
  }

  const onCancel = () => {
    context.dispatch({ type: 'router-from', payload: 'auto-control-select-action' })
    navigate(-1)
  }

  const queryAllScene = async () => {
    const rpc = new JsonRpc('query_all_scene_detail')
    const result = await rpc.fetchData()
    const { scene_list } = result
    setSelectSceneData(scene_list)

    const actions = JSON.parse(localStorage.getItem('autoControlDetailActions'))
    const arr = []
    actions.forEach((actionsItem) => {
      scene_list.forEach((scenesItem) => {
        if (actionsItem.scene_id === scenesItem.scene_id && !arr.includes(scenesItem.key)) {
          arr.push(scenesItem.key)
        }
      })
    })
    setToSelectSceneData(arr)

    const _arr = []
    arr.forEach((item) => {
      _arr.push(scene_list[item])
    })
    setSelectedSceneData(_arr)
  }
  const queryAllGroup = async () => {
    const rpc = new JsonRpc('query_all_group')
    const result = await rpc.fetchData()
    const { groups } = result
    setSelectGroupData(groups)

    const actions = JSON.parse(localStorage.getItem('autoControlDetailActions'))
    const arr = []
    actions.forEach((actionsItem) => {
      groups.forEach((groupsItem) => {
        if (actionsItem.group_id === groupsItem.group_id && !arr.includes(groupsItem.key)) {
          arr.push(groupsItem.key)
        }
      })
    })
    setToSelectGroupData(arr)

    const _arr = []
    arr.forEach((item) => {
      _arr.push(groups[item])
    })
    setSelectedGroupData(_arr)
  }
  const queryAllExecuteDeviceEpDetail = async () => {
    const rpc = new JsonRpc('query_all_execute_device_ep_detail')
    const result = await rpc.fetchData()
    const { device_ep_list } = result
    setSelectDeviceData(device_ep_list)

    const actions = JSON.parse(localStorage.getItem('autoControlDetailActions'))
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
    queryAllScene()
    queryAllGroup()
    queryAllExecuteDeviceEpDetail()
  }, [])

  const items = [
    {
      label: '场景选择',
      key: '1',
      children: 'Tab 1'
    },
    {
      label: '群组选择',
      key: '2',
      children: 'Tab 2'
    },
    {
      label: '设备选择',
      key: '3',
      children: 'Tab 3'
    },
  ]

  items.forEach((item) => {
    if (item.key === '1') {
      item.children = (
        <SelectScene
          dataSource={selectSceneData}
          onSelect={onSelectScene}
          toSelectSceneData={toSelectSceneData}
        />
      )
    }
    if (item.key === '2') {
      item.children = (
        <SelectGroup
          dataSource={selectGroupData}
          onSelect={onSelectGroup}
          toSelectGroupData={toSelectGroupData}
        />
      )
    }
    if (item.key === '3') {
      item.children = (
        <SelectDevice
          dataSource={selectDeviceData}
          onSelect={onSelectDevice}
          toSelectDeviceData={toSelectDeviceData}
        />
      )
    }
  })

  return (
    <div className={styles.autoControlSelectActionWrapper}>
      <Tabs type="default" items={items} />
      <div className="footer-wrapper">
        <Button type="whiteButton" text="取 消" onClick={() => { onCancel() }} style={{ position: 'absolute', right: '152px', bottom: '16px', width: '65px' }} />
        <Button type="blueButton" text="确 定" onClick={() => { onConfirm() }} style={{ position: 'absolute', right: '64px', bottom: '16px', width: '65px' }} />
      </div>
    </div>
  )
}
