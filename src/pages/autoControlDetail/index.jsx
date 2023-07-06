import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Checkbox, Switch } from 'antd'
import { EnvironmentOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons'
import styles from './index.module.less'
import { Table } from '@/common/components/table'
import { Button } from '@/common/components/button'
import { Input } from '@/common/components/input'
import { Select } from '@/common/components/select'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { getContext } from '@/common/stores'
import { DeleteConditionIcon, FilterIcon } from '@/common/components/icons'
import { findParentNodeByClassName } from '@/common/utils/util'
import { useClickAway } from '@/common/hooks'

const properties = [
  {
    cmd_type: 0,
    cmd_name: 'switch',
    mode: 'rw',
    common_control: 1,
    define: {
      type: 'enum',
      mapping: {
        0: '关',
        1: '开',
        2: '切换'
      },
      options: [
        {
          value: 0,
          label: '关'
        },
        {
          value: 1,
          label: '开'
        }
      ]
    }
  },
  {
    cmd_type: 61,
    cmd_name: 'time_delay',
    mode: 'rw',
    common_control: 1,
    define: {
      type: 'int',
      min: 0,
      max: 1000,
      start: 0,
      step: 1,
      scale: 10,
      unit: 'S'
    }
  }
]

export const AutoControlDetail = () => {
  const [showDropDown, setShowDropDown] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState({})
  const [isEditTitle, setIsEditTitle] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [selectData, setSelectData] = useState([])
  const [actions, setActions] = useState([])
  const [conditions, setConditions] = useState([])
  const [stateValues, setStateValues] = useState([])
  const [mainCondition, setMainCondition] = useState([{ label: '是', value: 1 }, { label: '否', value: 0 }])
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
  const [condtionOptions, setConditionOptions] = useState([{ label: '满足所有条件时', value: 1 }, { label: '满足任一条件时', value: 2 }])

  const { state } = useLocation()
  const context = getContext()
  const navigate = useNavigate()

  const tableRef = useRef(null)
  const dropdownRef = useRef()
  const showDropdownRef = useRef()

  const goToSelectCondition = () => {
    localStorage.setItem('autoControlDetailConditions', JSON.stringify(conditions))
    navigate('/auto-control/auto-control-detail/auto-control-select-condition')
  }
  const goToSelectAction = () => {
    localStorage.setItem('autoControlDetailActions', JSON.stringify(actions))
    navigate('/auto-control/auto-control-detail/auto-control-select-action')
  }

  const onEditTitle = () => {
    setIsEditTitle(true)
  }

  const onSaveTitle = () => {
    setIsEditTitle(false)
  }

  const onInputTitle = (value) => {
    dataSource.name = value
    setDataSource({ ...dataSource })
  }

  const onDropdown = (event) => {
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
  }

  const onSwitchChange = (item) => {
    console.log(item, 'item')
    if (item.on === 1) {
      item.on = 0
    } else {
      item.on = 1
    }
    setActions([...actions])
  }

  const onSelectAll = (event) => {
    if (selectData.length === actions.length && !event.target.checked) {
      setSelectData([])
    } else {
      actions.forEach((item, index) => {
        if (!selectData.includes(item.key)) {
          selectData.push(item.key)
        }
      })
      console.log(selectData, 'selectDataaa')
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

  const selectStateValues = (value, item) => {
    console.log(value, 'stateValueArr')
    let name = ''
    item.condition_types.forEach((typeItem) => {
      if (typeItem.state_type === value) {
        console.log(typeItem, 'typeItem')
        item.characters = typeItem.characters
        item.conditionValues = typeItem.condition_values
        name = typeItem.label
      }
    })
    item.state_type = value
    item.state_type_name = name
    item.character_name = ''
    item.alarm_name = ''
    setConditions([...conditions])
  }
  const selectCharacters = (value, item) => {
    item.character = value
    item.characters.forEach((conditionItem) => {
      if (conditionItem.value === value) {
        item.character_name = conditionItem.label
      }
    })
    setConditions([...conditions])
  }
  const selectConditionValues = (value, item) => {
    item.alarm = value
    item.conditionValues.forEach((conditionItem) => {
      if (conditionItem.value === value) {
        item.alarm_name = conditionItem.label
      }
    })
    setConditions([...conditions])
  }
  const selectMainCondition = (value, item) => {
    console.log(item, 'item')
    item.main_condition = value
    mainCondition.forEach((conditionItem) => {
      if (conditionItem.value === value) {
        item.main_condition_name = conditionItem.label
      }
    })
    setConditions([...conditions])
  }

  const onInputBrightnessOpenLevel = (value, item) => {
    console.log(value, 'value')
    console.log(item, 'item')
    item.brightness_open_level = value
    setActions([...actions])
  }

  const onInputOpenLevel = (value, item) => {
    item.open_level = value
    setActions([...actions])
  }

  const onInputBrightness = (value, item) => {
    item.brightness = value
    setActions([...actions])
  }

  const onInputCct = (value, item) => {
    item.cct = value
    setActions([...actions])
  }

  const onInputTargetTemp = (value, item) => {
    item.target_temp = value
    setActions([...actions])
  }

  const onInputAirMode = (value, item) => {
    item.air_mode = value
    setActions([...actions])
  }
  const onInputWindSpeed = (value, item) => {
    console.log(value, 'value')
    console.log(item, 'item')
    item.wind_speed = value
    setActions([...actions])
  }
  const onInputTimeDelay = (value, item) => {
    item.time_delay = value
    setActions([...actions])
  }

  const onInputR = (value, item) => {
    item.red = value
    setActions([...actions])
  }
  const onInputG = (value, item) => {
    item.green = value
    setActions([...actions])
  }
  const onInputB = (value, item) => {
    item.blue = value
    setActions([...actions])
  }
  const onInputW = (value, item) => {
    item.white = value
    setActions([...actions])
  }

  const onConfirmRGBW = () => {
    setShowDropDown(false)
  }

  const selectCondition = (value) => {
    dataSource.condition = value
    setDataSource({ ...dataSource })
  }

  const onDeleteCondition = (index) => {
    conditions.splice(index, 1)
    setConditions([...conditions])
  }

  const deleteDevice = async () => {
    console.log(actions, 'actions')
    selectData.forEach((item) => {
      actions.forEach((actionsItem, dataIndex) => {
        if (actionsItem.key == item) {
          actions.splice(dataIndex, 1)
        }
      })
    })

    setSelectData([])
    console.log(actions, 'actions1')
    setActions([...actions])
  }

  const onSaveEdit = async () => {
    const automation_list = []
    const obj = {}
    obj.automation_id = state.automation_id
    obj.area_id = state.area_id
    obj.name = dataSource.name
    obj.icon = dataSource.icon
    obj.active = dataSource.active
    obj.condition = dataSource.condition

    const conditionArr = []
    conditions.forEach((item) => {
      const conditionObj = {}
      conditionObj.type = item.type
      conditionObj.state_type = item.state_type
      conditionObj.main_condition = item.main_condition
      conditionObj.dev_id = item.dev_id
      conditionObj.ep = item.ep_id
      conditionObj.character = item.character
      conditionObj.alarm = item.alarm
      conditionArr.push(conditionObj)
    })
    obj.conditions = conditionArr

    const actionsCopy = JSON.parse(JSON.stringify(actions))
    actionsCopy.forEach((item) => {
      delete item.area
      delete item.dev_type
      delete item.dev_type_name
      delete item.key
      delete item.orderNum
      delete item.properties
      delete item.proto
      if (item.ep_id) {
        item.ep = JSON.parse(JSON.stringify(item.ep_id))
        delete item.ep_id
      }
      item.time_delay = Number(item.time_delay)
    })
    obj.actions = actionsCopy
    automation_list.push(obj)

    const rpc = new JsonRpc('strict_save_automations_detail')
    const result = await rpc.fetchData({ automation_list: [...automation_list] })
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

  const queryAutomationDetail = async () => {
    const rpc = new JsonRpc('query_automation_detail')
    const result = await rpc.fetchData({ automation_id: state.automation_id })
    setDataSource(result.automation_list[0])

    const action = result.automation_list[0].actions
    const newActions = action
    if (['auto-control-select-condition', 'auto-control-select-action'].includes(context.state.routerFrom)) {
      const { autoControlSelectedActions } = context.state
      console.log(autoControlSelectedActions, 'autoControlSelectedActions')
      if (autoControlSelectedActions && autoControlSelectedActions.length > 0) {
        autoControlSelectedActions.forEach((selectedItem) => {
          let count = 0
          newActions.forEach((newActionsItem) => {
            if (newActionsItem.dst_addr_mode === 0 && (selectedItem.dev_id === newActionsItem.dev_id && selectedItem.ep_id === newActionsItem.ep_id)) {
              count += 1
            }
            if (newActionsItem.dst_addr_mode === 1 && selectedItem.group_id === newActionsItem.group_id) {
              count += 1
            }
            if (newActionsItem.dst_addr_mode === 2 && selectedItem.scene_id === newActionsItem.scene_id) {
              count += 1
            }
          })
          if (count === 0) {
            newActions.push(selectedItem)
            console.log(count, 'count111')
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
      if (item.time_delay === undefined) {
        item.time_delay = 15
      }
      if (item.on === undefined && item.dst_addr_mode !== 2) {
        item.on = 0
      }

      if (item.dst_addr_mode === 1) {
        item.name = item.group_name
        item.properties = properties
      }
      if (item.dst_addr_mode === 2) {
        item.name = item.scene_name
        item.properties = properties
      }
    })
    console.log(newActions, 'newActions')
    setActions(newActions)

    const condition = result.automation_list[0].conditions
    const newConditions = condition
    if (['auto-control-select-condition', 'auto-control-select-action'].includes(context.state.routerFrom)) {
      const { autoControlSelectedConditions } = context.state
      console.log(autoControlSelectedConditions, 'autoControlSelectedConditions')
      if (autoControlSelectedConditions && autoControlSelectedConditions.length > 0) {
        autoControlSelectedConditions.forEach((selectedItem) => {
          let count = 0
          newConditions.forEach((newConditionsItem) => {
            if (selectedItem.ep_id === newConditionsItem.ep_id && selectedItem.dev_id === newConditionsItem.dev_id) {
              count += 1
            }
          })
          if (count === 0) {
            console.log(selectedItem, 'selectedItem')
            newConditions.push(selectedItem)
          }
        })
      }
      console.log(newConditions, 'newConditions11')
    }
    const stateValueArr = []
    newConditions.forEach((item, index) => {
      item.key = index
      item.orderNum = String(index + 1).padStart(3, '0')
      const arr = []
      item.condition_types.forEach((typesItem, typesIndex) => {
        const obj = {}
        obj.value = typesItem.state_type
        obj.label = typesItem.label
        arr.push(obj)

        if (item.state_type === typesItem.state_type) {
          item.state_type_name = typesItem.label
        }
        //  根据character从characters获取label并创建character_name
        typesItem.characters.forEach((charactersItem) => {
          if (charactersItem.value === item.character && typesItem.state_type === item.state_type) {
            item.character_name = charactersItem.label
          }
        })

        //  根据alarm从condition_values获取label并创建alarm_name
        typesItem.condition_values.forEach((valuesItem) => {
          if (valuesItem.value === item.alarm && typesItem.state_type === item.state_type) {
            item.alarm_name = valuesItem.label
          }
        })

        //  根据main_condition从mainCondition获取label并创建main_condition_name
        mainCondition.forEach((mainItem) => {
          if (mainItem.value === item.main_condition) {
            item.main_condition_name = mainItem.label
          }
        })

        //  选过来的这些值是undefined的话，从condition_types中取第一项作为默认值
        if (item.state_type === undefined && typesIndex === 0) {
          item.state_type_name = typesItem.label
          item.state_type = typesItem.state_type
        }
        if (item.character === undefined && typesIndex === 0) {
          item.character_name = typesItem.characters[0]?.label
          item.character = typesItem.characters[0]?.value
        }
        if (item.alarm === undefined && typesIndex === 0) {
          item.alarm_name = typesItem.condition_values[0]?.label
          item.alarm = typesItem.condition_values[0]?.value
        }
      })
      if (item.main_condition === undefined) {
        item.main_condition = 1
        item.main_condition_name = '是'
      }

      if (!item.type) {
        item.type = 0
      }

      stateValueArr.push(arr)
    })
    setStateValues(stateValueArr)
    console.log(stateValueArr, 'stateValueArr')
    console.log(newConditions, 'newConditions')
    setConditions([...newConditions])
  }

  useEffect(() => {
    queryAutomationDetail()
    return () => { context.dispatch({ type: 'router-from', payload: 'auto-control-detail' }) }
  }, [])

  const columns = [
    {
      title: () =>
      (
        actions.length > 0 && <Checkbox checked={selectData.length === actions.length} onChange={(event) => onSelectAll(event)} />
      ),
      render: (text, record, index) => {
        let isChecked = false
        selectData.forEach((item) => {
          if (item == record.key) {
            isChecked = true
          }
        })
        return <Checkbox checked={isChecked} onChange={(event) => onSelect(event, text, record, index)} />
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
      dataIndex: 'area',
      width: 120,
      render: (text, record, index) => {
        return (
          <div>{record.area?.name}</div>
        )
      }
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">名称</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'name') }} />
        </div>
      ),
      dataIndex: 'name',
      width: 150,
      render: (text, record, index) => (
        <div>{record.name}</div>
      )
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
      render: (text, record, index) => {
        if (record.dst_addr_mode === 0) {
          return <div>{record.dev_type_name}</div>
        }
      }
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">参数配置</div>
        </div>
      ),
      width: 400,
      align: 'right',
      // dataIndex: 'paramsSettings',
      render: (text, record, index) => {
        return (
          <div className="params-wrapper-edit">
            {
              actions.map((item, index) => {
                if (record.dev_id === item.dev_id && record.ep_id === item.ep_id && item.dst_addr_mode === 0) {
                  // if (record.action_id === item.action_id && item.dst_addr_mode === 0) {
                  if (item.dev_type === '1108' && item.ep_id === 1) {
                    return (
                      <React.Fragment key={index}>
                        {
                          item?.properties?.map((i) => {
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 3) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" isPercentage title="亮度" value={item.brightness} define={i?.define} onChange={(value) => { onInputBrightness(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                              if (i.cmd_type === 61) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                            }
                          })
                        }
                        {
                          item?.properties?.map((i) => {
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 0) {
                                return <Switch className="switch" checked={item.on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
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
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 8) {
                                return (
                                  <React.Fragment key={i.cmd_type}>
                                    <div className="rgb-outer-wrapper">
                                      <div className="rgb-wrapper" onClick={(event) => { onDropdown(event) }} ref={showDropdownRef}>
                                        <div className="value">RGBW&nbsp;<span>{item.red}</span>,&nbsp;<span>{item.green}</span>,&nbsp;<span>{item.blue}</span>,&nbsp;<span>{item.white}</span></div>
                                        <div className="arrow-bottom" />
                                      </div>
                                      {
                                        showDropDown && (
                                          <div className="dropdown-wrapper" style={dropdownStyle} ref={dropdownRef}>
                                            <Input type="increase-decrease-input" title="R" value={item.red} define={i?.define} onChange={(value) => { onInputR(value, item) }} style={{ marginBottom: '8px' }} />
                                            <Input type="increase-decrease-input" title="G" value={item.green} define={i?.define} onChange={(value) => { onInputG(value, item) }} style={{ marginBottom: '8px' }} />
                                            <Input type="increase-decrease-input" title="B" value={item.blue} define={i?.define} onChange={(value) => { onInputB(value, item) }} style={{ marginBottom: '8px' }} />
                                            <Input type="increase-decrease-input" title="W" value={item.white} define={i?.define} onChange={(value) => { onInputW(value, item) }} style={{ marginBottom: '8px' }} />
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
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="亮度" value={item.brightness} define={i?.define} onChange={(value) => { onInputBrightness(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                              if (i.cmd_type === 61) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                            }
                          })
                        }
                        {
                          item?.properties?.map((i) => {
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 0) {
                                return <Switch className="switch" checked={item.on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
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
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 2) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="开合度" value={item.open_level} define={i?.define} onChange={(value) => { onInputOpenLevel(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                              if (i.cmd_type === 61) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                            }
                          })
                        }
                        {
                          item?.properties?.map((i) => {
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 0) {
                                return <Switch className="switch" checked={item.on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
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
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 2) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="开合度" value={item.open_level} define={i?.define} onChange={(value) => { onInputOpenLevel(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                              if (i.cmd_type === 61) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                            }
                          })
                        }
                        {
                          item?.properties?.map((i) => {
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 0) {
                                return <Switch className="switch" checked={item.on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
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
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 29) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="透光度" value={item.brightness_open_level} define={i?.define} onChange={(value) => { onInputBrightnessOpenLevel(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                              if (i.cmd_type === 2) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="开合度" value={item.open_level} define={i?.define} onChange={(value) => { onInputOpenLevel(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                              if (i.cmd_type === 61) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                            }
                          })
                        }
                        {
                          item?.properties?.map((i) => {
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 0) {
                                return <Switch className="switch" checked={item.on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
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
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 3) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="亮度" value={item.brightness} define={i?.define} onChange={(value) => { onInputBrightness(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                              if (i.cmd_type === 4) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="色温" value={item.cct} define={i?.define} onChange={(value) => { onInputCct(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                              if (i.cmd_type === 61) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                            }
                          })
                        }
                        {
                          item?.properties?.map((i) => {
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 0) {
                                return <Switch className="switch" checked={item.on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
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
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 15) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="温度" value={item.target_temp} define={i?.define} onChange={(value) => { onInputTargetTemp(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                              if (i.cmd_type === 61) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                            }
                          })
                        }
                        {
                          item?.properties?.map((i) => {
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 0) {
                                return <Switch className="switch" checked={item.on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
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
                            if ([0, 1].includes(i.common_control)) {
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
                                  if (optionsItem.value === item.wind_speed) {
                                    label = optionsItem.label
                                  }
                                })
                                return <Select key={i.cmd_type} title="风速" options={options} defaultValue={label} define={i?.define} onChange={(value) => { onInputWindSpeed(value, item) }} style={{ marginLeft: '15px' }} width="90" />
                              }
                              if (i.cmd_type === 61) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                            }
                          })
                        }
                        {
                          item?.properties?.map((i) => {
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 0) {
                                return <Switch className="switch" checked={item.on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
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
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 15) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="温度" value={item.target_temp} define={i?.define} onChange={(value) => { onInputTargetTemp(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                              if (i.cmd_type === 14) {
                                let label = ''
                                airMode.forEach((optionsItem) => {
                                  if (optionsItem.value === item.air_mode) {
                                    label = optionsItem.label
                                  }
                                })
                                return <Select key={i.cmd_type} title="模式" options={airMode} defaultValue={label} onChange={(value) => { onInputAirMode(value, item) }} style={{ marginLeft: '15px' }} width="90" />
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
                                  if (optionsItem.value === item.wind_speed) {
                                    label = optionsItem.label
                                  }
                                })
                                return <Select key={i.cmd_type} title="风速" options={options} defaultValue={label} define={i?.define} onChange={(value) => { onInputWindSpeed(value, item) }} style={{ marginLeft: '15px' }} width="90" />
                              }
                              if (i.cmd_type === 61) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                            }
                          })
                        }
                        {
                          item?.properties?.map((i) => {
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 0) {
                                return <Switch className="switch" checked={item.on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
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
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 61) {
                                return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                              }
                            }
                          })
                        }
                        {
                          item?.properties?.map((i) => {
                            if ([0, 1].includes(i.common_control)) {
                              if (i.cmd_type === 0) {
                                return <Switch className="switch" checked={item.on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
                              }
                            }
                          })
                        }
                      </React.Fragment>
                    )
                  }
                } else if (record.scene_id === item.scene_id && item.dst_addr_mode === 2) {
                  return (
                    <React.Fragment key={index}>
                      {
                        item?.properties?.map((i) => {
                          if ([0, 1].includes(i.common_control)) {
                            if (i.cmd_type === 61) {
                              return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                            }
                          }
                        })
                      }
                    </React.Fragment>
                  )
                } else if (record.group_id === item.group_id && item.dst_addr_mode === 1) {
                  return (
                    <React.Fragment key={index}>
                      {
                        item?.properties?.map((i) => {
                          if ([0, 1].includes(i.common_control)) {
                            if (i.cmd_type === 61) {
                              return <Input key={i.cmd_type} type="increase-decrease-input" title="延时" value={item.time_delay} define={i?.define} onChange={(value) => { onInputTimeDelay(value, item) }} style={{ marginLeft: '15px' }} />
                            }
                          }
                        })
                      }
                      <Switch className="switch" checked={item.on === 1} onChange={() => { onSwitchChange(item) }} style={{ marginLeft: '15px' }} />
                    </React.Fragment>
                  )
                }
              })
            }

          </div>
        )
      },
    },
  ]

  return (
    <div className={styles.autoControlDetailWrapper}>
      <div className="auto-control-detail-header">
        <div className="title-wrapper">
          {
            isEditTitle ? (
              <Input type="default" placeholder="请输入名称" value={dataSource.name} onChange={(value) => { onInputTitle(value) }} />
            ) : (
              <div className="title">{dataSource.name}</div>
            )
          }
          {
            isEditTitle ? (
              <CheckOutlined className="complete-edit-icon" onClick={() => { onSaveTitle() }} />
            ) : (
              <EditOutlined className="edit-icon-wrapper" onClick={() => { onEditTitle() }} />
            )
          }
        </div>
        <Button type="goBackButton" />
      </div>
      <div className="header-condition-wrapper">
        <div className="trigger-condition-wrapper">
          <div className="left">
            <div className="trigger-condition">触发条件</div>
            <div className="description">触发条件最多添至5个设备</div>
          </div>
          <div className="right">
            <div className="condition-judgment-logic" style={{ marginRight: '12px' }}>条件判断逻辑</div>
            <Select

              options={condtionOptions}
              placeholder="满足所有条件时"
              defaultValue={dataSource.condition === 1 ? '满足所有条件时' : '满足任一条件时'}
              onChange={(value) => { selectCondition(value) }}
            />
            <Button type="blueButton" text="选择条件" style={{ marginLeft: '12px' }} onClick={() => { goToSelectCondition() }} />
          </div>
        </div>
        <div className="condition-wrapper">
          {
            conditions.map((item, index) => {
              return (
                <div key={index} className="condition-item-wrapper">
                  <div className="left">
                    <div className="located-space-wrapper">
                      <EnvironmentOutlined className="located-icon" />
                      <div className="located-space">{item.area.name}</div>
                    </div>
                    <div className="deivce-wrapper">
                      <div className="device">{item.name}</div>
                      <div className="num">{item.dev_id}</div>
                    </div>
                  </div>
                  <div className="right">
                    <Select options={stateValues[index]} placeholder="选择触发属性" defaultValue={item.state_type_name} onChange={(value) => { selectStateValues(value, item, index) }} style={{ marginLeft: '12px' }} width={'146'} />
                    <Select options={item.characters} placeholder="选择判定符" defaultValue={item.character_name || ''} onChange={(value) => { selectCharacters(value, item, index) }} style={{ marginLeft: '12px' }} width={'146'} />
                    <Select options={item.conditionValues} placeholder="选择触发条件" defaultValue={item.alarm_name || ''} onChange={(value) => { selectConditionValues(value, item, index) }} style={{ marginLeft: '12px' }} width={'146'} />
                    <Select options={mainCondition} placeholder="选择主条件" defaultValue={item.main_condition_name || ''} onChange={(value) => { selectMainCondition(value, item, index) }} style={{ marginLeft: '12px' }} width={'146'} />
                    <DeleteConditionIcon className="delete-icon" onClick={() => { onDeleteCondition(index) }} style={{ marginLeft: '23px' }} />
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className="header-action-wrapper">
        <div className="left">
          <div className="execute-action">执行动作</div>
          <div className="description">执行动作最多添至10组设备</div>
        </div>
        <Button type="blueButton" text="选择动作" onClick={() => { goToSelectAction() }} />
      </div>
      <Table
        columns={columns}
        dataSource={actions}
        ref={tableRef}
        height="calc(68vh - 241px)"
      >
        <Button type="blueButton" text="保存编辑" onClick={() => { onSaveEdit() }} style={{ position: 'absolute', right: '64px', bottom: '13px' }} />
        <Button type="whiteButton" text="删除动作" onClick={() => { deleteDevice() }} style={{ position: 'absolute', right: '168px', bottom: '13px' }} />
      </Table>
    </div>
  )
}
