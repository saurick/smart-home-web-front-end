import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Checkbox, Switch } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'
import styles from './index.module.less'
import { Table } from '@/common/components/table'
import { FilterIcon } from '@/common/components/icons'
import { Button } from '@/common/components/button'
import { Input } from '@/common/components/input'
import { Select } from '@/common/components/select'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { getContext } from '@/common/stores'
import { findParentNodeByClassName } from '@/common/utils/util'
import { useClickAway } from '@/common/hooks'
import { Modal } from '@/common/components/modal'

export const SceneNormal = () => {
  const [isBatchSettings, setIsBatchSettings] = useState(false)
  const [showDropDown, setShowDropDown] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState({})
  const [sceneData, setSceneData] = useState({})
  const [actions, setActions] = useState([])
  const [selectData, setSelectData] = useState([])
  const [deviceCount, setDeviceCount] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [windSpeed2, setWindSpeed2] = useState([
    { label: '低', value: 1 },
    { label: '高', value: 3 },
  ])
  const [windSpeed3, setWindSpeed3] = useState([
    { label: '低', value: 1 },
    { label: '中', value: 2 },
    { label: '高', value: 3 },
  ])
  const [windSpeed5, setWindSpeed5] = useState([
    { label: '低', value: 1 },
    { label: '中低', value: 2 },
    { label: '中', value: 3 },
    { label: '中高', value: 4 },
    { label: '高', value: 5 },
  ])
  const [airMode, setAirMode] = useState([
    { label: '送风', value: 1 },
    { label: '制冷', value: 2 },
    { label: '制热', value: 3 },
    { label: '除湿', value: 4 },
  ])

  const { state } = useLocation()
  const context = getContext()
  const navigate = useNavigate()
  const location = useLocation()

  const tableRef = useRef(null)
  const dropdownRef = useRef()
  const showDropdownRef = useRef()

  const goToAddDevice = () => {
    localStorage.setItem('sceneNormalActions', JSON.stringify(actions))
    navigate('/scene-config/scene-normal/scene-add-device')
  }

  const onDropdown = (event, record, index) => {
    event.stopPropagation()

    if (showDropDown === false) {
      showDropdownRef.current.style.border = '1px solid #2558BF'
    }
    if (showDropDown === true) {
      showDropdownRef.current.style.border = 'none'
    }

    const node = findParentNodeByClassName(event.target, 'rgb-wrapper')
    const rect = node.getBoundingClientRect()
    const distance = document.body.offsetHeight - rect.top - rect.height - 238
    if (distance < 0) {
      setDropdownStyle({
        bottom: document.body.offsetHeight - rect.top + 7
      })
    }
    if (distance > 0) {
      setDropdownStyle({
        top: rect.top + rect.height + 7
      })
    }
    setShowDropDown(!showDropDown)

    sceneData.forEach((item, i) => {
      if (item.isDropDown && index != i) {
        sceneData[i].isDropDown = false
      }
    })
    record.isDropDown = !record.isDropDown
  }

  const onSelectAll = () => {
    if (selectData.length === actions.length) {
      setSelectData([])
    } else {
      actions.forEach((item, index) => {
        if (!selectData.includes(item.key)) {
          selectData.push(item.key)
        }
      })

      setSelectData(selectData)
    }
    setActions([...actions])
  }

  const onSelect = (event, text, record, index) => {
    if (selectData.includes(record.key)) {
      console.log(selectData.indexOf(record.key), '111')
      selectData.splice(selectData.indexOf(record.key), 1)
      console.log(selectData, 'selectData')
      setSelectData(selectData)
    } else {
      setSelectData([...selectData, record.key])
    }
    setActions([...actions])
  }

  const onSwitchChange = (item) => {
    if (!isBatchSettings) {
      if (item.timelines[0].on === 1) {
        item.timelines[0].on = 0
      } else {
        item.timelines[0].on = 1
      }
    }
    if (isBatchSettings) {
      const filteredTableData = tableRef?.current?.tableData
      let firstItemSwitch = 0
      filteredTableData.forEach((dataItem, dataIndex) => {
        actions.forEach((actionsItem) => {
          if (dataItem.dev_id === actionsItem.dev_id && dataItem.ep_id === actionsItem.ep_id) {
            if (dataIndex === 0) {
              if (actionsItem.timelines[0].on === 1) {
                actionsItem.timelines[0].on = 0
                firstItemSwitch = 0
              } else {
                actionsItem.timelines[0].on = 1
                firstItemSwitch = 1
              }
            } else {
              actionsItem.timelines[0].on = firstItemSwitch
            }
          }
        })
      })
    }
    setActions([...actions])
  }

  const onInputBrightnessOpenLevel = (value, item) => {
    if (!isBatchSettings) {
      item.timelines[0].brightness_open_level = value
    }
    if (isBatchSettings) {
      const filteredTableData = tableRef?.current?.tableData
      filteredTableData.forEach((dataItem) => {
        actions.forEach((actionsItem) => {
          if (dataItem.dev_id === actionsItem.dev_id && dataItem.ep_id === actionsItem.ep_id) {
            actionsItem.timelines[0].brightness_open_level = value
          }
        })
      })
    }
    setActions([...actions])
  }

  const onInputOpenLevel = (value, item) => {
    if (!isBatchSettings) {
      item.timelines[0].open_level = value
    }
    if (isBatchSettings) {
      const filteredTableData = tableRef?.current?.tableData
      filteredTableData.forEach((dataItem) => {
        actions.forEach((actionsItem) => {
          if (dataItem.dev_id === actionsItem.dev_id && dataItem.ep_id === actionsItem.ep_id) {
            actionsItem.timelines[0].open_level = value
          }
        })
      })
    }
    setActions([...actions])
  }

  const onInputBrightness = (value, item) => {
    if (!isBatchSettings) {
      item.timelines[0].brightness = value
    }
    if (isBatchSettings) {
      const filteredTableData = tableRef?.current?.tableData
      filteredTableData.forEach((dataItem) => {
        actions.forEach((actionsItem) => {
          if (dataItem.dev_id === actionsItem.dev_id && dataItem.ep_id === actionsItem.ep_id) {
            actionsItem.timelines[0].brightness = value
          }
        })
      })
    }
    console.log(actions, 'actions')
    setActions([...actions])
  }

  const onInputCct = (value, item) => {
    if (!isBatchSettings) {
      item.timelines[0].cct = value
    }
    if (isBatchSettings) {
      const filteredTableData = tableRef?.current?.tableData
      filteredTableData.forEach((dataItem) => {
        actions.forEach((actionsItem) => {
          if (dataItem.dev_id === actionsItem.dev_id && dataItem.ep_id === actionsItem.ep_id) {
            actionsItem.timelines[0].cct = value
          }
        })
      })
    }
    setActions([...actions])
  }

  const onInputTargetTemp = (value, item) => {
    if (!isBatchSettings) {
      item.timelines[0].target_temp = value
    }
    if (isBatchSettings) {
      const filteredTableData = tableRef?.current?.tableData
      filteredTableData.forEach((dataItem) => {
        actions.forEach((actionsItem) => {
          if (dataItem.dev_id === actionsItem.dev_id && dataItem.ep_id === actionsItem.ep_id) {
            actionsItem.timelines[0].target_temp = value
          }
        })
      })
    }
    setActions([...actions])
  }

  const onInputAirMode = (value, item) => {
    if (!isBatchSettings) {
      item.timelines[0].air_mode = value
    }
    if (isBatchSettings) {
      const filteredTableData = tableRef?.current?.tableData
      filteredTableData.forEach((dataItem) => {
        actions.forEach((actionsItem) => {
          if (dataItem.dev_id === actionsItem.dev_id && dataItem.ep_id === actionsItem.ep_id) {
            actionsItem.timelines[0].air_mode = value
          }
        })
      })
    }
    setActions([...actions])
  }
  const onInputWindSpeed = (value, item) => {
    if (!isBatchSettings) {
      item.timelines[0].wind_speed = value
    }
    if (isBatchSettings) {
      const filteredTableData = tableRef?.current?.tableData
      filteredTableData.forEach((dataItem) => {
        actions.forEach((actionsItem) => {
          if (dataItem.dev_id === actionsItem.dev_id && dataItem.ep_id === actionsItem.ep_id) {
            actionsItem.timelines[0].wind_speed = value
          }
        })
      })
    }
    setActions([...actions])
  }
  const onInputTimeDelay = (value, item) => {
    if (!isBatchSettings) {
      item.timelines[0].time_delay = value
    }
    if (isBatchSettings) {
      const filteredTableData = tableRef?.current?.tableData
      filteredTableData.forEach((dataItem) => {
        actions.forEach((actionsItem) => {
          if (dataItem.dev_id === actionsItem.dev_id && dataItem.ep_id === actionsItem.ep_id) {
            actionsItem.timelines[0].time_delay = value
          }
        })
      })
    }
    setActions([...actions])
  }

  const onInputR = (value, item) => {
    if (!isBatchSettings) {
      item.timelines[0].red = value
    }
    if (isBatchSettings) {
      const filteredTableData = tableRef?.current?.tableData
      filteredTableData.forEach((dataItem) => {
        actions.forEach((actionsItem) => {
          if (dataItem.dev_id === actionsItem.dev_id && dataItem.ep_id === actionsItem.ep_id) {
            actionsItem.timelines[0].red = value
          }
        })
      })
    }
    setActions([...actions])
  }
  const onInputG = (value, item) => {
    if (!isBatchSettings) {
      item.timelines[0].green = value
    }
    if (isBatchSettings) {
      const filteredTableData = tableRef?.current?.tableData
      filteredTableData.forEach((dataItem) => {
        actions.forEach((actionsItem) => {
          if (dataItem.dev_id === actionsItem.dev_id && dataItem.ep_id === actionsItem.ep_id) {
            actionsItem.timelines[0].green = value
          }
        })
      })
    }
    setActions([...actions])
  }
  const onInputB = (value, item) => {
    if (!isBatchSettings) {
      item.timelines[0].blue = value
    }
    if (isBatchSettings) {
      const filteredTableData = tableRef?.current?.tableData
      filteredTableData.forEach((dataItem) => {
        actions.forEach((actionsItem) => {
          if (dataItem.dev_id === actionsItem.dev_id && dataItem.ep_id === actionsItem.ep_id) {
            actionsItem.timelines[0].blue = value
          }
        })
      })
    }
    setActions([...actions])
  }
  const onInputW = (value, item) => {
    if (!isBatchSettings) {
      item.timelines[0].white = value
    }
    if (isBatchSettings) {
      const filteredTableData = tableRef?.current?.tableData
      filteredTableData.forEach((dataItem) => {
        actions.forEach((actionsItem) => {
          if (dataItem.dev_id === actionsItem.dev_id && dataItem.ep_id === actionsItem.ep_id) {
            actionsItem.timelines[0].white = value
          }
        })
      })
    }
    setActions([...actions])
  }
  const onConfirmRGBW = () => {
    setShowDropDown(false)
  }

  const onDeleteDeivce = () => {
    selectData.forEach((item) => {
      actions.forEach((dataItem, dataIndex) => {
        if (dataItem.key == item) {
          actions.splice(dataIndex, 1)
        }
      })
    })
    setSelectData([])
    setActions([...actions])
  }

  const batchChangeRowsStyle = () => {
    const tableBodyNode = tableRef?.current?.antdTableRef.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1]
    console.log(tableBodyNode, 'tableBodyNode')
    tableBodyNode.childNodes.forEach((item, index) => {
      if (index !== 1) {
        console.log(item.childNodes)
        item.style.background = '#F6F6F9'
        item.style.pointerEvents = 'none'
        item.style.color = '#959CA5'
      }
      if (index === 1) {
        item.style.background = '#FFFFFF'
        item.style.pointerEvents = 'unset'
        item.style.color = '#34363C'
      }
    })
  }

  const batchResetRowsStyle = () => {
    const tableBodyNode = tableRef?.current?.antdTableRef.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1]
    tableBodyNode.childNodes.forEach((item, index) => {
      if (index !== 1) {
        item.style.background = '#FFFFFF'
        item.style.pointerEvents = 'unset'
        item.style.color = '#34363C'
      }
    })
  }

  const onSaveBatchSetttings = async () => {
    setShowModal(true)
    setModalTitle('正在保存中，请等待')

    const scene_list = []

    const obj = {}
    obj.scene_id = sceneData.scene_id
    obj.group_id = sceneData.group_id
    obj.scene_name = sceneData.scene_name
    obj.fade_time = Number(sceneData.fade_time)
    obj.type = sceneData.type
    obj.invisible = sceneData.invisible
    obj.loop = sceneData.loop
    obj.cycle = sceneData.cycle

    const actionsArr = []
    actions.forEach((item) => {
      const actionsObj = {}
      actionsObj.action_id = item.action_id
      actionsObj.dev_id = item.dev_id
      actionsObj.ep = item.ep_id

      actionsObj.timelines = item.timelines
      actionsArr.push(actionsObj)
    })
    obj.actions = actionsArr
    scene_list.push(obj)

    const rpc = new JsonRpc('strict_save_scenes_detail_ex2')
    const result = await rpc.fetchData({ scene_list })
    batchResetRowsStyle()
    setActions([...actions])
    setIsBatchSettings(false)
    setModalTitle('保存成功')
  }

  const onBatchSetttings = () => {
    batchChangeRowsStyle()
    actions.forEach((dataItem, dataIndex) => {
      if (dataIndex !== 0) {
        dataItem.isSwitchChecked = false
        dataItem.isDropDown = false
      }
    })

    setIsBatchSettings(true)
  }

  const onCancelBatchSetttings = () => {
    batchResetRowsStyle()
    setIsBatchSettings(false)
  }

  const onConfirmModal = () => {
    setShowModal(false)
  }

  const onLightingGradientsInput = (value) => {
    sceneData.fade_time = value
    setSceneData({ ...sceneData })
  }

  useClickAway(showDropdownRef, dropdownRef, () => {
    setShowDropDown(false)
    showDropdownRef.current.style.border = 'none'
  })
  useClickAway(showDropdownRef, showDropdownRef, () => {
    if (showDropDown === false) {
      showDropdownRef.current.style.border = 'none'
    }
  })

  const queryScene = async () => {
    const rpc = new JsonRpc('query_scene_detail_by_scene_id_ex2')
    const result = await rpc.fetchData({ scene_id: state.scene_id })
    setSceneData(result.scene_list[0])

    const action = result.scene_list[0]?.actions
    const newActions = action
    console.log(location, 'state')
    if (context.state.routerFrom === 'scene-add-device') {
      const { sceneSelectedActions } = context.state
      console.log(sceneSelectedActions, 'sceneSelectedActions')
      if (sceneSelectedActions && sceneSelectedActions.length > 0) {
        sceneSelectedActions.forEach((selectedItem) => {
          let count = 0
          newActions.forEach((newActionsItem) => {
            if (selectedItem.dev_id === newActionsItem.dev_id && selectedItem.ep_id === newActionsItem.ep_id) {
              count += 1
            }
          })
          if (count === 0) {
            newActions.push(selectedItem)
          }
        })
      }
    }
    newActions.forEach((item, index) => {
      item.key = index
      item.orderNum = String(index + 1).padStart(3, '0')

      if (item.action_id === undefined) {
        item.action_id = -1
      }
      if (item.timelines === undefined) {
        item.timelines = []
        const obj = {}

        if (item.dev_type === '1108' && item.ep_id === 1) {
          obj.brightness = item.brightness
        }
        if (item.dev_type === '1110' && item.ep_id === 1) {
          obj.red = item.red
          obj.green = item.green
          obj.blue = item.blue
          obj.white = item.white
          obj.brightness = item.brightness
        }
        if (item.dev_type === '1305' && item.ep_id === 1) {
          obj.open_level = item.open_level
        }
        if (item.dev_type === '1304' && item.ep_id === 1) {
          obj.open_level = item.open_level
        }
        if (item.dev_type === '1324' && item.ep_id === 1) {
          obj.brightness_open_level = item.brightness_open_level
          obj.open_level = item.open_level
        }
        if (item.dev_type === '1109' && item.ep_id === 1) {
          obj.brightness = item.brightness
          obj.cct = item.cct
        }
        if (item.dev_type === '1304' && item.ep_id === 1) {
          obj.open_level = item.open_level
        }
        if (
          (item.dev_type === '1308' && item.ep_id === 2) ||
          (item.dev_type === '1333' && item.ep_id === 2) ||
          (item.dev_type === '1311' && item.ep_id === 2) ||
          (item.dev_type === '1312' && item.ep_id === 2) ||
          (item.dev_type === '1341' && item.ep_id === 2)
        ) {
          obj.target_temp = item.target_temp
        }
        if (
          (item.dev_type === '1309' && item.ep_id === 1) ||
          (item.dev_type === '1332' && item.ep_id === 1) ||
          (item.dev_type === '1311' && item.ep_id === 1) ||
          (item.dev_type === '1312' && item.ep_id === 1) ||
          (item.dev_type === '1341' && item.ep_id === 1)
        ) {
          obj.wind_speed = item.wind_speed
        }
        if (
          (item.dev_type === '1312' && item.ep_id === 3) ||
          (item.dev_type === '1341' && item.ep_id === 3) ||
          (item.dev_type === '1311' && item.ep_id === 3) ||
          (item.dev_type === '1342') ||
          (item.dev_type === '1306' && item.ep_id === 1) ||
          (item.dev_type === '1310' && item.ep_id === 3) ||
          (item.dev_type === '1330' && item.ep_id === 3) ||
          (item.dev_type === '1331' && item.ep_id === 3)
        ) {
          obj.target_temp = item.target_temp
          obj.air_mode = item.air_mode
          obj.wind_speed = item.wind_speed
        }
        obj.on = item.on
        obj.fade_time = 15
        obj.loop = 0
        obj.time_delay = 15
        obj.time = 0
        obj.wave = 0

        item.timelines.push(obj)
      }
    })
    console.log(newActions, 'newActions')
    setActions(newActions)
  }

  const getAllDeviceCount = async () => {
    const rpc = new JsonRpc('get_all_device_count')
    const result = await rpc.fetchData()
    setDeviceCount(result.count)
  }

  useEffect(() => {
    queryScene()
    getAllDeviceCount()
    return () => { context.dispatch({ type: 'router-from', payload: 'scene-normal' }) }
  }, [])

  useEffect(() => {
    if (isBatchSettings) {
      batchChangeRowsStyle()
    }
  }, [tableRef?.current?.tableData])

  const columns = [
    {
      title: () =>
      (
        (!isBatchSettings && actions.length > 0) && <Checkbox checked={actions.length === selectData.length} onChange={() => onSelectAll()} />
      ),
      render: (text, record, index) => {
        if (!isBatchSettings) {
          let isChecked = false
          selectData.forEach((item) => {
            if (item == record.key) {
              isChecked = true
            }
          })
          return <Checkbox checked={isChecked} onChange={(event) => onSelect(event, text, record, index)} />
        }
      },
      width: 60
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">序号</div>
        </div>
      ),
      dataIndex: 'orderNum',
      width: 60
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">所在空间</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('area_name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'area_name') }} />
        </div>
      ),
      width: 120,
      dataIndex: 'area',
      render: (text, record, index) => (
        <div className="name">{record.area?.name}</div>
      )
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">名称</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'name') }} />
        </div>
      ),
      width: 150,
      dataIndex: 'name',
      render: (text, record, index) => {
        if (record.dst_addr_mode === 1) {
          return <div>{record.group_name}</div>
        }
          return <div>{record.name}</div>
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
      width: 150,
      dataIndex: 'dev_type_name',
      render: (text, record, index) => {
        return (
          <div className="scene-normal-name-wrapper">
            <div className="name">{record.dev_type_name}</div>
            {/* <div className="num">{record.dev_id}</div> */}
          </div>
        )
      }
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          {
            isBatchSettings ? (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="title">操作</div>
                <Button type="blueButton" text="退出批量" onClick={() => { onCancelBatchSetttings() }} />
              </div>
            ) : (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '4px' }}>
                <div className="title">参数</div>
                <Button type="whiteButton" text="批量设置" onClick={() => { onBatchSetttings() }} style={{ marginRight: '4px' }} />
              </div>
            )
          }
        </div>
      ),
      width: 400,
      align: 'right',
      render: (text, record, index) => {
        return (
          <div className="params-wrapper-edit">
            {
                actions.map((item, index) => {
                  if (item.dev_id && item.ep_id && record.dev_id === item.dev_id && record.ep_id === item.ep_id) {
                    if (item.dev_type === '1108' && item.ep_id === 1) {
                      return (
                        <React.Fragment key={index}>
                          {
                            item?.properties?.map((i) => {
                              if ([1, 2].includes(i.common_control)) {
                                if (i.cmd_type === 3) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="亮度" value={item.timelines[0].brightness} define={i?.define} onChange={(value) => { onInputBrightness(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                                if (i.cmd_type === 61) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.timelines[0].time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                          {
                            item?.properties?.map((i) => {
                              if ([0, 1].includes(i.common_control)) {
                                if (i.cmd_type === 0) {
                                  return <Switch className="switch" checked={item.timelines[0].on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                        </React.Fragment>
                      )
                    }
                    if (item.dev_type === '1110' && item.ep_id === 1) {
                      return (
                        <React.Fragment key={index}>
                          {
                            item?.properties?.map((i) => {
                              if ([1, 2].includes(i.common_control)) {
                                if (i.cmd_type === 8) {
                                  return (
                                    <React.Fragment key={i.cmd_type}>
                                      <div className="rgb-outer-wrapper">
                                        <div className="rgb-wrapper" onClick={(event) => { onDropdown(event, record, index) }} ref={showDropdownRef}>
                                          <div className="value">RGBW&nbsp;<span>{item.timelines[0].red}</span>,&nbsp;<span>{item.timelines[0].green}</span>,&nbsp;<span>{item.timelines[0].blue}</span>,&nbsp;<span>{item.timelines[0].white}</span></div>
                                          <div className="arrow-bottom" />
                                        </div>
                                        {
                                          showDropDown && (
                                            <div className="dropdown-wrapper" style={dropdownStyle} ref={dropdownRef}>
                                              <Input type="increase-decrease-input" title="R" value={item.timelines[0].red} define={i?.define} onChange={(value) => { onInputR(value, item) }} style={{ marginBottom: '8px' }} />
                                              <Input type="increase-decrease-input" title="G" value={item.timelines[0].green} define={i?.define} onChange={(value) => { onInputG(value, item) }} style={{ marginBottom: '8px' }} />
                                              <Input type="increase-decrease-input" title="B" value={item.timelines[0].blue} define={i?.define} onChange={(value) => { onInputB(value, item) }} style={{ marginBottom: '8px' }} />
                                              <Input type="increase-decrease-input" title="W" value={item.timelines[0].white} define={i?.define} onChange={(value) => { onInputW(value, item) }} style={{ marginBottom: '8px' }} />
                                              <div className="confirm-button" onClick={() => { onConfirmRGBW() }}>
                                                <div className="text">确定</div>
                                              </div>
                                            </div>
                                          )
                                        }
                                      </div>
                                    </React.Fragment>
                                  )
                                }
                                if (i.cmd_type === 3) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="亮度" value={item.timelines[0].brightness} define={i?.define} onChange={(value) => { onInputBrightness(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                                if (i.cmd_type === 61) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.timelines[0].time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                          {
                            item?.properties?.map((i) => {
                              if ([0, 1].includes(i.common_control)) {
                                if (i.cmd_type === 0) {
                                  return <Switch className="switch" checked={item.timelines[0].on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                        </React.Fragment>
                      )
                    }
                    if (item.dev_type === '1305' && item.ep_id === 1) {
                      return (
                        <React.Fragment key={index}>
                          {
                            item?.properties?.map((i) => {
                              if ([1, 2].includes(i.common_control)) {
                                if (i.cmd_type === 2) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="开合度" value={item.timelines[0].open_level} define={i?.define} onChange={(value) => { onInputOpenLevel(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                                if (i.cmd_type === 61) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.timelines[0].time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                          {
                            item?.properties?.map((i) => {
                              if ([0, 1].includes(i.common_control)) {
                                if (i.cmd_type === 0) {
                                  return <Switch className="switch" checked={item.timelines[0].on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                        </React.Fragment>
                      )
                    }
                    if (item.dev_type === '1304' && item.ep_id === 1) {
                      return (
                        <React.Fragment key={index}>
                          {
                            item?.properties?.map((i) => {
                              if ([1, 2].includes(i.common_control)) {
                                if (i.cmd_type === 2) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="开合度" value={item.timelines[0].open_level} define={i?.define} onChange={(value) => { onInputOpenLevel(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                                if (i.cmd_type === 61) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.timelines[0].time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                          {
                            item?.properties?.map((i) => {
                              if ([0, 1].includes(i.common_control)) {
                                if (i.cmd_type === 0) {
                                  return <Switch className="switch" checked={item.timelines[0].on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                        </React.Fragment>
                      )
                    }
                    if (item.dev_type === '1324' && item.ep_id === 1) {
                      return (
                        <React.Fragment key={index}>
                          {

                            item?.properties?.map((i) => {
                              if ([1, 2].includes(i.common_control)) {
                                if (i.cmd_type === 29) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="透光度" value={item.timelines[0].brightness_open_level} define={i?.define} onChange={(value) => { onInputBrightnessOpenLevel(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                                if (i.cmd_type === 2) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="开合度" value={item.timelines[0].open_level} define={i?.define} onChange={(value) => { onInputOpenLevel(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                                if (i.cmd_type === 61) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.timelines[0].time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                          {
                            item?.properties?.map((i) => {
                              if ([0, 1].includes(i.common_control)) {
                                if (i.cmd_type === 0) {
                                  return <Switch className="switch" checked={item.timelines[0].on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                        </React.Fragment>
                      )
                    }
                    if (item.dev_type === '1109' && item.ep_id === 1) {
                      return (
                        <React.Fragment key={index}>
                          {
                            item?.properties?.map((i) => {
                              if ([1, 2].includes(i.common_control)) {
                                if (i.cmd_type === 3) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="亮度" value={item.timelines[0].brightness} define={i?.define} onChange={(value) => { onInputBrightness(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                                if (i.cmd_type === 4) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="色温" value={item.timelines[0].cct} define={i?.define} onChange={(value) => { onInputCct(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                                if (i.cmd_type === 61) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.timelines[0].time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                          {
                            item?.properties?.map((i) => {
                              if ([0, 1].includes(i.common_control)) {
                                if (i.cmd_type === 0) {
                                  return <Switch className="switch" checked={item.timelines[0].on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                        </React.Fragment>
                      )
                    }
                    if (
                      (item.dev_type === '1308' && item.ep_id === 2) ||
                      (item.dev_type === '1333' && item.ep_id === 2) ||
                      (item.dev_type === '1311' && item.ep_id === 2) ||
                      (item.dev_type === '1312' && item.ep_id === 2) ||
                      (item.dev_type === '1341' && item.ep_id === 2)
                    ) {
                      return (
                        <React.Fragment key={index}>
                          {
                            item?.properties?.map((i) => {
                              if ([1, 2].includes(i.common_control)) {
                                if (i.cmd_type === 15) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="温度" value={item.timelines[0].target_temp} define={i?.define} onChange={(value) => { onInputTargetTemp(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                                if (i.cmd_type === 61) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.timelines[0].time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                          {
                            item?.properties?.map((i) => {
                              if ([0, 1].includes(i.common_control)) {
                                if (i.cmd_type === 0) {
                                  return <Switch className="switch" checked={item.timelines[0].on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                        </React.Fragment>
                      )
                    }
                    if (
                      (item.dev_type === '1309' && item.ep_id === 1) ||
                      (item.dev_type === '1332' && item.ep_id === 1) ||

                      (item.dev_type === '1311' && item.ep_id === 1) ||
                      (item.dev_type === '1312' && item.ep_id === 1) ||
                      (item.dev_type === '1341' && item.ep_id === 1)
                    ) {
                      return (
                        <React.Fragment key={index}>
                          {
                            item?.properties?.map((i) => {
                              if ([1, 2].includes(i.common_control)) {
                                if (i.cmd_type === 17) {
                                  let options = []
                                  let label = ''
                                  if (Object.keys(i.define.mapping).length === 2) {
                                    options = windSpeed2
                                  }
                                  if (Object.keys(i.define.mapping).length === 3) {
                                    options = windSpeed3
                                  }
                                  if (Object.keys(i.define.mapping).length === 5) {
                                    options = windSpeed5
                                  }
                                  options.forEach((optionsItem) => {
                                    if (optionsItem.value === item.timelines[0].wind_speed) {
                                      label = optionsItem.label
                                    }
                                  })
                                  return <Select key={i.cmd_type} type="increase-decrease-input" title="风速" options={options} defaultValue={label} onChange={(value) => { onInputWindSpeed(value, item) }} style={{ marginLeft: '15px' }} width="90" />
                                }
                                if (i.cmd_type === 61) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.timelines[0].time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                          {
                            item?.properties?.map((i) => {
                              if ([0, 1].includes(i.common_control)) {
                                if (i.cmd_type === 0) {
                                  return <Switch className="switch" checked={item.timelines[0].on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                        </React.Fragment>
                      )
                    }
                    if (
                      (item.dev_type === '1312' && item.ep_id === 3) ||
                      (item.dev_type === '1341' && item.ep_id === 3) ||
                      (item.dev_type === '1311' && item.ep_id === 3) ||
                      (item.dev_type === '1342') ||
                      (item.dev_type === '1306' && item.ep_id === 1) ||
                      (item.dev_type === '1310' && item.ep_id === 3) ||
                      (item.dev_type === '1330' && item.ep_id === 3) ||
                      (item.dev_type === '1331' && item.ep_id === 3)
                    ) {
                      return (
                        <React.Fragment key={index}>
                          {
                            item?.properties?.map((i) => {
                              if ([1, 2].includes(i.common_control)) {
                                if (i.cmd_type === 15) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="温度" value={item.timelines[0].target_temp} define={i?.define} onChange={(value) => { onInputTargetTemp(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                                if (i.cmd_type === 14) {
                                  let label = ''
                                  airMode.forEach((optionsItem) => {
                                    if (optionsItem.value === item.timelines[0].air_mode) {
                                      label = optionsItem.label
                                    }
                                  })
                                  return <Select key={i.cmd_type} type="increase-decrease-input" title="模式" options={airMode} defaultValue={label} onChange={(value) => { onInputAirMode(value, item) }} style={{ marginLeft: '15px' }} width="90" />
                                }
                                if (i.cmd_type === 17) {
                                  let options = []
                                  let label = ''
                                  if (Object.keys(i.define.mapping).length === 2) {
                                    options = windSpeed2
                                  }
                                  if (Object.keys(i.define.mapping).length === 3) {
                                    options = windSpeed3
                                  }
                                  if (Object.keys(i.define.mapping).length === 5) {
                                    options = windSpeed5
                                  }
                                  options.forEach((optionsItem) => {
                                    if (optionsItem.value === item.timelines[0].wind_speed) {
                                      label = optionsItem.label
                                    }
                                  })
                                  return <Select key={i.cmd_type} type="increase-decrease-input" title="风速" options={options} defaultValue={label} onChange={(value) => { onInputWindSpeed(value, item) }} style={{ marginLeft: '15px' }} width="90" />
                                }
                                if (i.cmd_type === 61) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.timelines[0].time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                          {
                            item?.properties?.map((i) => {
                              if ([0, 1].includes(i.common_control)) {
                                if (i.cmd_type === 0) {
                                  return <Switch className="switch" checked={item.timelines[0].on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                        </React.Fragment>
                      )
                    }
                    if (
                      (item.dev_type === '1330' && item.ep_id === 1) ||
                      (item.dev_type === '0000' && item.ep_id >= 2 <= 4) ||
                      (item.dev_type === '1101' && item.ep_id >= 1 <= 1) ||
                      (item.dev_type === '1102' && item.ep_id >= 1 <= 2) ||
                      (item.dev_type === '1103' && item.ep_id >= 1 <= 3) ||
                      (item.dev_type === '1104' && item.ep_id >= 1 <= 4) ||
                      (item.dev_type === '1106' && item.ep_id >= 1 <= 2) ||
                      (item.dev_type === '1107' && item.ep_id >= 1 <= 1) ||
                      (item.dev_type === '2001' && item.ep_id >= 1 <= 1) ||
                      (item.dev_type === '2002' && item.ep_id >= 1 <= 2) ||
                      (item.dev_type === '2003' && item.ep_id >= 1 <= 3) ||
                      (item.dev_type === '2004' && item.ep_id >= 1 <= 4) ||
                      (item.dev_type === '2011' && item.ep_id >= 1 <= 1) ||
                      (item.dev_type === '2012' && item.ep_id >= 1 <= 2) ||
                      (item.dev_type === '2013' && item.ep_id >= 1 <= 3) ||
                      (item.dev_type === '2014' && item.ep_id >= 1 <= 4) ||
                      (item.dev_type === '2016' && item.ep_id >= 1 <= 1) ||
                      (item.dev_type === '2017' && item.ep_id >= 1 <= 2) ||
                      (item.dev_type === '2018' && item.ep_id >= 1 <= 3) ||
                      (item.dev_type === '2019' && item.ep_id >= 1 <= 4) ||
                      (item.dev_type === '2101' && item.ep_id >= 1 <= 1) ||
                      (item.dev_type === '2102' && item.ep_id >= 1 <= 2) ||
                      (item.dev_type === '2103' && item.ep_id >= 1 <= 3) ||
                      (item.dev_type === '2104' && item.ep_id >= 1 <= 4) ||
                      (item.dev_type === '2111' && item.ep_id >= 1 <= 1) ||
                      (item.dev_type === '2112' && item.ep_id >= 1 <= 2) ||
                      (item.dev_type === '2113' && item.ep_id >= 1 <= 3) ||
                      (item.dev_type === '2114' && item.ep_id >= 1 <= 4) ||
                      (item.dev_type === '2116' && item.ep_id >= 1 <= 1) ||
                      (item.dev_type === '2117' && item.ep_id >= 1 <= 2) ||
                      (item.dev_type === '2118' && item.ep_id >= 1 <= 3) ||
                      (item.dev_type === '2119' && item.ep_id >= 1 <= 4) ||
                      (item.dev_type === '100100' && item.ep_id >= 1 <= 1) ||
                      (item.dev_type === '110101' && item.ep_id >= 1 <= 1) ||
                      (item.dev_type === '110100' && item.ep_id >= 1 <= 1) ||
                      (item.dev_type === '110200' && item.ep_id >= 1 <= 2) ||
                      (item.dev_type === '110300' && item.ep_id >= 1 <= 3) ||
                      (item.dev_type === '110400' && item.ep_id >= 1 <= 4) ||
                      (item.dev_type === '131301' && item.ep_id >= 1 <= 1) ||
                      (item.dev_type === '131302' && item.ep_id >= 1 <= 2) ||
                      (item.dev_type === '131303' && item.ep_id >= 1 <= 3) ||
                      (item.dev_type === '131304' && item.ep_id >= 1 <= 4)
                    ) {
                      return (
                        <React.Fragment key={index}>
                          {
                            item?.properties?.map((i) => {
                              if ([1, 2].includes(i.common_control)) {
                                if (i.cmd_type === 61) {
                                  return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.timelines[0].time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                          {
                            item?.properties?.map((i) => {
                              if ([0, 1].includes(i.common_control)) {
                                if (i.cmd_type === 0) {
                                  return <Switch className="switch" checked={item.timelines[0].on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
                                }
                              }
                            })
                          }
                        </React.Fragment>
                      )
                    }
                  }
                })
              }

          </div>
        )
      }
    },
  ]

  return (
    <div className={styles.sceneNormalWrapper}>
      <div className="scene-normal-header">
        <div className="header-left-wrapper">
          <div className="location-wrapper">
            <EnvironmentOutlined className="icon" />
            <div className="location">{sceneData.area?.name}</div>
          </div>
          <div className="title">{sceneData.scene_name}</div>
          <div className="device-amount-wrapper">
            <div className="device-amount">设备数</div>
            <div className="amount">{deviceCount}</div>
          </div>
          <div className="lighting-gradients-wrapper">
            <div className="lighting-gradients">照明渐变（s）:</div>
            <Input type="default" value={sceneData.fade_time} onChange={(value) => { onLightingGradientsInput(value) }} width="77px" />
          </div>
        </div>
        <Button type="goBackButton" />
      </div>
      <Table
        columns={columns}
        dataSource={actions}
        ref={tableRef}
        height="calc(100vh - 270px)"
      >
        <Button type="whiteButton" text="保存设置" onClick={() => { onSaveBatchSetttings() }} style={{ position: 'absolute', right: '272px', bottom: '16px' }} />
        <Button type="whiteButton" text="删除设备" disabled={isBatchSettings} onClick={() => { onDeleteDeivce() }} style={{ position: 'absolute', right: '168px', bottom: '16px' }} />
        <Button type="blueButton" text="添加设备" disabled={isBatchSettings} onClick={() => { goToAddDevice() }} style={{ position: 'absolute', right: '64px', bottom: '16px' }} />
      </Table>

      <Modal showModal={showModal} icon={modalTitle === '保存成功' ? 'successful' : 'tip'} title={modalTitle} titlePosition="center" buttonPosition="center">
        {
          modalTitle === '保存成功' && (
            <Button type="blueButton" text="确 定" onClick={() => { onConfirmModal() }} style={{ width: '64px' }} />
          )
        }
      </Modal>
    </div>
  )
}
