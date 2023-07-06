import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './index.module.less'
import { Table } from '@/common/components/table'
import { Button } from '@/common/components/button'
import { Input } from '@/common/components/input'
import { Select } from '@/common/components/select'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { Modal } from '@/common/components/modal'

export const InteractSettings = () => {
  const [dataSource, setDataSource] = useState([])
  const [bindingInfoList, setBindingInfoList] = useState([])
  const [areas, setAreas] = useState([])
  const [bindTypes, setBindTypes] = useState([])
  const [bindObjs, setBindObjs] = useState([])
  const [bindCmds, setBindCmds] = useState([])
  const [notExecuteDeviceDetail, setNotExecuteDeviceDetail] = useState({})
  const [activeIndex, setActiveIndex] = useState(-1)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  const { state } = useLocation()

  const tableRef = useRef(null)

  const onConfirmModal = () => {
    setShowModal(false)
  }

  const onSaveEdit = async () => {
    setShowModal(true)
    setModalTitle('正在保存中，请等待')

    const params = {}
    const bindings = []
    dataSource.forEach((item) => {
      if (item.dst_addr_mode === -1 && item.button_name === '') return
      const obj = {}
      obj.button_position = item.button_position
      obj.button_name = item.button_name
      obj.bind_type = item.bind_type
      obj.bind_cmd = item.bind_cmd
      obj.src_dev_id = item.src_dev_id
      obj.src_ep_id = item.src_ep_id
      let bind_obj_value
      if (item.bind_obj_value !== undefined) {
        bind_obj_value = JSON.parse(item.bind_obj_value)
      }
      if (item.dst_addr_mode === 0) {
        obj.dst_addr_mode = 0
        obj.dst_dev_id = bind_obj_value?.dst_dev_id || item.dst_dev_id
        obj.dst_ep_id = bind_obj_value?.dst_ep_id || item.dst_ep_id
      }
      if (item.dst_addr_mode === 1) {
        obj.dst_addr_mode = 1
        obj.group_id = bind_obj_value?.group_id || item.group_id
      }
      if (item.dst_addr_mode === 2) {
        obj.dst_addr_mode = 2
        obj.group_id = bind_obj_value?.group_id || item.group_id
        obj.scene_id = bind_obj_value?.scene_id || item.scene_id
      }
      bindings.push(obj)
    })

    params.dev_id = notExecuteDeviceDetail.dev_id
    params.is_support_remap = notExecuteDeviceDetail.is_support_remap
    params.dev_relay_count = notExecuteDeviceDetail.relay_count
    params.dev_button_count = notExecuteDeviceDetail.button_count
    params.bindings = bindings
    const rpc = new JsonRpc('update_or_add_bindings_2')
    const result = await rpc.fetchData({ ...params })

    setModalTitle('保存成功')
  }

  const onNameInput = (value, record) => {
    record.button_name = value
    setDataSource([...dataSource])
  }

  const onSelectArea = (record, value) => {
    let name = ''
    areas.forEach((item) => {
      if (item.value === value) {
        name = item.label
      }
    })
    dataSource.forEach((dataItem, dataIndex) => {
      if (dataItem.key === record.key) {
        dataSource[dataIndex].button_area.area_id = value
        dataSource[dataIndex].button_area.name = name
      }
    })
    setDataSource([...dataSource])
  }

  const onSelectBindTypes = async (record, value) => {
    const obj = {}
    obj.area_id = record.button_area.area_id
    obj.bind_type = value
    obj.dev_type = record.src_dev_type
    const result = await queryDeviceBindInteractiveObjs(obj)
    const deviceBindInteractiveObjs = result.bind_interactive_objs

    const objs = []
    const cmds = []
    bindingInfoList.forEach((infoListItem) => {
      if (value === infoListItem.bind_type) {
        if (infoListItem.need_bind_cmds === true) {
          infoListItem.bind_cmd_list.forEach((cmdListItem) => {
            const obj = {}
            obj.label = cmdListItem.bind_cmd_name
            obj.value = cmdListItem.bind_cmd
            cmds.push(obj)
          })
        }
        if (infoListItem.need_bind_objs === true) {
          deviceBindInteractiveObjs.forEach((objItem) => {
            const obj = {}
            obj.label = objItem.name
            if (objItem.dst_addr_mode === 0) {
              obj.value = JSON.stringify({ dst_dev_id: objItem.dst_dev_id, dst_ep_id: objItem.dst_ep_id, dst_addr_mode: objItem.dst_addr_mode })
            }
            if (objItem.dst_addr_mode === 1) {
              obj.value = JSON.stringify({ group_id: objItem.group_id, dst_addr_mode: objItem.dst_addr_mode })
            }
            if (objItem.dst_addr_mode === 2) {
              obj.value = JSON.stringify({ group_id: objItem.group_id, scene_id: objItem.scene_id, dst_addr_mode: objItem.dst_addr_mode })
            }
            objs.push(obj)
          })
        }
      }
    })
    setBindObjs(objs)
    setBindCmds(cmds)

    bindTypes.forEach((item) => {
      if (item.value === value) {
        record.bind_type_name = item.label
        record.bind_type = value
      }
    })
  }

  const onSelectBindObjs = (record, value) => {
    bindObjs.forEach((item) => {
      if (item.value === value) {
        const bind_obj_value = JSON.parse(value)
        record.bind_obj_name = item.label
        record.bind_obj_value = value
        record.dst_addr_mode = bind_obj_value.dst_addr_mode
      }
    })
    setDataSource([...dataSource])
  }

  const onSelectBindCmds = (record, value) => {
    bindCmds.forEach((item) => {
      if (item.value === value) {
        record.bind_cmd_name = item.label
        record.bind_cmd = value
      }
    })
    setDataSource([...dataSource])
  }

  const onClickButton = (position) => {
    setActiveIndex(position - 1)
  }

  const getClassName = (record, index) => {
    let className = ''
    if (activeIndex === index) {
      className = styles.tableRowActive
    }
    return className
  }

  const onRowClick = (record, index) => {
    setActiveIndex(index)
  }

  const getBindingInfoList = async () => {
    const rpc = new JsonRpc('get_binding_info_list')
    const result = await rpc.fetchData()
    return result.binding_info_list
  }

  const queryDeviceBindInteractiveObjs = async (params) => {
    const rpc = new JsonRpc('query_device_bind_interactive_objs')
    const result = await rpc.fetchData({ ...params })
    return result
  }

  const queryAreas = async () => {
    const rpc = new JsonRpc('query_areas')
    const result = await rpc.fetchData()
    const arr = []
    result.areas.forEach((item) => {
      const obj = {}
      obj.label = item.name
      obj.value = item.area_id
      arr.push(obj)
    })
    setAreas([...arr])
  }

  const queryNotExecuteDeviceDetailByDevId = async () => {
    const rpc = new JsonRpc('query_not_execute_device_detail_by_dev_id')
    const result = await rpc.fetchData({ dev_id: state.dev_id })
    const bindingInfoLists = await getBindingInfoList()
    const infos = result.device_list[0].panel_button_infos
    infos.forEach((item, index) => {
      item.key = index
      item.orderNum = String(index + 1).padStart(3, '0')
    })

    infos.forEach((infoItem) => {
      const bindTypes = []

      infoItem.support_bind_types.forEach((typesItem) => {
        const obj = {}
        bindingInfoLists.forEach((listItem) => {
          if (listItem.bind_type === typesItem) {
            obj.value = listItem.bind_type
            obj.label = listItem.bind_type_name
          }
        })
        bindTypes.push(obj)
      })
      setBindTypes(bindTypes)
    })
    setBindingInfoList(bindingInfoLists)
    setDataSource(infos)
    setNotExecuteDeviceDetail(result.device_list[0])
  }

  useEffect(() => {
    queryNotExecuteDeviceDetailByDevId()
    queryAreas()
  }, [])

  const columns = [
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">序号</div>
        </div>
      ),
      dataIndex: 'orderNum',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">按键名称</div>
        </div>
      ),
      dataIndex: 'button_name',
      render: (text, record, index) => (
        <Input type="default" placeholder="输入按键名称" defaultValue={record.button_name} onChange={(value) => { onNameInput(value, record) }} />
      )
    },
    {
      title: () => (
        <div className="title-wrapper">
          <div className="title">目标空间</div>
        </div>
      ),
      dataIndex: 'button_area',
      render: (text, record, index) => (
        <Select options={areas} placeholder="目标空间" defaultValue={record.button_area.name} onChange={(value) => onSelectArea(record, value)} />
      )
    },
    {
      title: () => (
        <div className="title-wrapper">
          <div className="title">目标类型</div>
        </div>
      ),
      dataIndex: 'bind_type_name',
      render: (text, record, index) => (
        <Select options={bindTypes} placeholder="选择类型" defaultValue={record.bind_type_name} onChange={(value) => onSelectBindTypes(record, value)} />
      )
    },
    {
      title: () => (
        <div className="title-wrapper">
          <div className="title">控制目标</div>
        </div>
      ),
      dataIndex: 'bind_obj_name',
      render: (text, record, index) => (
        <Select options={bindObjs} placeholder="选择目标" defaultValue={record.bind_obj_name} onChange={(value) => onSelectBindObjs(record, value)} />
      )
    },
    {
      title: () => (
        <div className="title-wrapper">
          <div className="title">执行动作</div>
        </div>
      ),
      dataIndex: 'bind_cmd_name',
      render: (text, record, index) => (
        <Select options={bindCmds} placeholder="选择动作" defaultValue={record.bind_cmd_name} onChange={(value) => onSelectBindCmds(record, value)} />
      )
    },
  ]

  return (
    <div className={styles.interactSettingsWrapper}>
      <div className="interact-settings-header-wrapper">
        <div className="header-left-wrapper">
          <div className="interact-settings-card-wrapper">
            <div className="device-wrapper">
              <div className="top">
                {
                  dataSource && dataSource.length > 0 && dataSource.map((item) => {
                    if (item.button_position === 1) {
                      return <div className="device1" key={item.button_position} onClick={() => { onClickButton(item.button_position) }} style={{ color: activeIndex === (item.button_position - 1) ? '#2E6DEF' : '#58616D' }}>{item.button_name}</div>
                    }
                  })
                }
                {
                  dataSource && dataSource.length > 0 && dataSource.map((item) => {
                    if (item.button_position === 2) {
                      return <div className="device2" key={item.button_position} onClick={() => { onClickButton(item.button_position) }} style={{ color: activeIndex === (item.button_position - 1) ? '#2E6DEF' : '#58616D' }}>{item.button_name}</div>
                    }
                  })
                }

              </div>
              <div className="bottom">
                {
                  dataSource && dataSource.length > 0 && dataSource.map((item) => {
                    if (item.button_position === 3) {
                      return <div className="device3" key={item.button_position} onClick={() => { onClickButton(item.button_position) }} style={{ color: activeIndex === (item.button_position - 1) ? '#2E6DEF' : '#58616D' }}>{item.button_name}</div>
                    }
                  })
                }
                {
                  dataSource && dataSource.length > 0 && dataSource.map((item) => {
                    if (item.button_position === 4) {
                      return <div className="device4" key={item.button_position} onClick={() => { onClickButton(item.button_position) }} style={{ color: activeIndex === (item.button_position - 1) ? '#2E6DEF' : '#58616D' }}>{item.button_name}</div>
                    }
                  })
                }
              </div>
            </div>
            <div className="device-wrapper">
              <div className="top">
                {
                  dataSource && dataSource.length > 0 && dataSource.map((item) => {
                    if (item.button_position === 5) {
                      return <div className="device1" key={item.button_position} onClick={() => { onClickButton(item.button_position) }} style={{ color: activeIndex === (item.button_position - 1) ? '#2E6DEF' : '#58616D' }}>{item.button_name}</div>
                    }
                  })
                }
                {
                  dataSource && dataSource.length > 0 && dataSource.map((item) => {
                    if (item.button_position === 6) {
                      return <div className="device2" key={item.button_position} onClick={() => { onClickButton(item.button_position) }} style={{ color: activeIndex === (item.button_position - 1) ? '#2E6DEF' : '#58616D' }}>{item.button_name}</div>
                    }
                  })
                }

              </div>
              <div className="bottom">
                {
                  dataSource && dataSource.length > 0 && dataSource.map((item) => {
                    if (item.button_position === 7) {
                      return <div className="device3" key={item.button_position} onClick={() => { onClickButton(item.button_position) }} style={{ color: activeIndex === (item.button_position - 1) ? '#2E6DEF' : '#58616D' }}>{item.button_name}</div>
                    }
                  })
                }
                {
                  dataSource && dataSource.length > 0 && dataSource.map((item) => {
                    if (item.button_position === 8) {
                      return <div className="device4" key={item.button_position} onClick={() => { onClickButton(item.button_position) }} style={{ color: activeIndex === (item.button_position - 1) ? '#2E6DEF' : '#58616D' }}>{item.button_name}</div>
                    }
                  })
                }
              </div>
            </div>
          </div>
          <div className="device-info-wrapper-left">
            <div className="device-name-wrapper">
              <div className="device-name">设备名称</div>
              <div className="value">{notExecuteDeviceDetail.name}</div>
            </div>
            <div className="mac-wrapper">
              <div className="mac">MAC</div>
              <div className="value">{notExecuteDeviceDetail.dev_id}</div>
            </div>
            <div className="bitmap-num-wrapper">
              <div className="bitmap">位图编号</div>
              <div className="value">{notExecuteDeviceDetail.position}</div>
            </div>
          </div>
          <div className="device-info-wrapper-right">
            <div className="device-type-wrapper">
              <div className="device-type">设备类型</div>
              <div className="value">{notExecuteDeviceDetail.dev_type_name}</div>
            </div>
            <div className="located-space-wrapper">
              <div className="located-space">所在空间</div>
              <div className="value">{notExecuteDeviceDetail.position}</div>
            </div>
          </div>
        </div>
        <div className="button-wrapper">
          <Button type="goBackButton" />
          <Button type="blueButton" text="保存编辑" onClick={() => { onSaveEdit() }} />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        ref={tableRef}
        rowClassName={getClassName}
        height="calc(100vh - 270px)"
        onRow={(record, index) => {
          return {
            onClick: () => { onRowClick(record, index) }
          }
        }}
      />

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
