import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'
import { Table } from '@/common/components/table'
import { Button } from '@/common/components/button'
import { Select } from '@/common/components/select'
import { Input } from '@/common/components/input'
import { useClickAway } from '@/common/hooks'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { FilterIcon } from '@/common/components/icons'
import { getContext } from '@/common/stores'

export const InteractDevice = () => {
  const [showInteractModal, setShowInteractModal] = useState(false)
  const [modalStyle, setModalStyle] = useState({})
  const [maskStyle, setMaskStyle] = useState({})
  const [showModalRef, setShowModalRef] = useState(null)
  const [dataSource, setDataSource] = useState([])
  const [modalData, setModalData] = useState({})
  const [areas, setAreas] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [initData, setInitData] = useState([])

  const context = getContext()

  const navigate = useNavigate()
  const tableRef = useRef(null)
  const modalRef = useRef(null)

  const onInteract = (event, record) => {
    setShowInteractModal(true)
    const rect = event.target.parentNode.parentNode.getBoundingClientRect()

    // 弹窗下方到视口的距离
    const distance = document.body.offsetHeight - rect.top - rect.height - 346
    if (distance < 0) {
      setModalStyle({
        bottom: document.body.offsetHeight - rect.top + 2,
        right: document.body.clientWidth - rect.right
      })
    }
    if (distance > 0) {
      setModalStyle({
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
    console.log(record, 'record')
    setShowModalRef(event.target)
    setModalData(record)
  }

  const onInteractSettings = () => {
    navigate('/interact-device/interact-settings', { state: { dev_id: modalData.dev_id } })
  }

  useClickAway(showModalRef, modalRef, () => { setShowInteractModal(false) })

  let colorFlag = 0 // 控制颜色变化的flag
  const changeBackground = (current) => {
    if (colorFlag === 0) {
      current.style.background = '#FFFFFF'
      colorFlag = 1
    } else {
      current.style.background = '#EFF2FC'
      colorFlag = 0
    }
  }

  const onClickButton = async (event, item) => {
    const current = event.target
    colorFlag = 0
    current.style.background = '#EFF2FC'
    const interval = setInterval(() => {
      changeBackground(current)
    }, 400)
    setTimeout(() => {
      clearInterval(interval)
    }, 2300)
    console.log(modalData, 'modalData')
    modalData.endpoints.forEach(async (i) => {
      if (item.ep_id === i.ep_id && i.type === 1) {
        const obj = {}
        obj.cmd = '02'
        obj.cmd_type = 0
        obj.dev_ep_id = item.src_ep_id
        obj.dev_id = item.src_dev_id
        obj.dev_type = item.src_dev_type

        const rpc = new JsonRpc('send_command_data')
        const result = await rpc.fetchData(obj)
      }
      if (item.ep_id === i.ep_id && [2, 3, 6, 8, 10, 12].includes(i.type)) {
        const obj = {}
        obj.dev_id = item.src_dev_id
        obj.dev_ep_id = item.src_ep_id
        const rpc = new JsonRpc('device_exec_binding_by_id')
        const result = await rpc.fetchData(obj)
      }
    })
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
        dataSource[dataIndex].area.area_id = value
        dataSource[dataIndex].area.name = name
      }
    })

    setDataSource([...dataSource])
  }

  const onDeviceNameInput = (value, record) => {
    dataSource.forEach((item, index) => {
      if (item.key == record.key) {
        dataSource[index].name = value
      }
    })
    setDataSource([...dataSource])
  }

  const onBitmapNumInput = (value, record) => {
    dataSource.forEach((item, index) => {
      if (item.key == record.key) {
        dataSource[index].position = value
      }
    })
    setDataSource([...dataSource])
  }

  const onEdit = () => {
    const init = JSON.parse(JSON.stringify(dataSource))
    setInitData([...init])
    setIsEdit(true)
  }

  const onCancelSave = () => {
    setDataSource([...initData])
    setIsEdit(false)
  }

  const onSave = async () => {
    const device_list = []
    dataSource.forEach((item) => {
      const obj = {}
      obj.dev_id = item.dev_id
      obj.name = item.name
      obj.data = item.data
      obj.position = item.position
      obj.area = { area_id: item.area.area_id }
      device_list.push(obj)
    })
    debugger
    const rpc = new JsonRpc('update_devices_detail')
    const result = await rpc.fetchData({ device_list })

    setIsEdit(false)
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

  const queryAllExecuteDeviceEpDetail = async () => {
    const rpc = new JsonRpc('query_all_not_execute_device_detail')
    const result = await rpc.fetchData()
    setDataSource(result.device_list)
  }

  useEffect(() => {
    queryAreas()
    queryAllExecuteDeviceEpDetail()
  }, [])

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
      width: 150,
      dataIndex: 'dev_id',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">设备类型</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('dev_type_name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'dev_type_name') }} />
        </div>
      ),
      width: 200,
      dataIndex: 'dev_type_name',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">设备名称（描述）</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'name') }} />
        </div>
      ),
      width: 200,
      dataIndex: 'name',
      render: (text, record, index) => {
        if (isEdit) {
          return <Input type="default" placeholder="输入设备名称" defaultValue={record.name} onChange={(value) => onDeviceNameInput(value, record)} />
        }
        if (!isEdit) {
          return <div>{record.name || '--'}</div>
        }
      },
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">所在空间</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('area_name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'area_name') }} />
        </div>
      ),
      width: 200,
      render: (text, record, index) => {
        if (isEdit || record.isCreate || record.isCopy) {
          return <Select type="default" placeholder="选择空间" options={areas} defaultValue={record.area.name} onChange={(value) => onSelectArea(record, value)} />
        }
        if (!isEdit && !record.isCreate && !record.isCopy) {
          return <div>{record.area.name || '--'}</div>
        }
      }
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">位图编号</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('position') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'position') }} />
        </div>
      ),
      width: 150,
      dataIndex: 'position',
      render: (text, record, index) => {
        return isEdit ? (
          <Input type="default" placeholder="输入位图编号" defaultValue={record.position} width="108px" onChange={(value) => { onBitmapNumInput(value, record) }} />
        ) : (
          <div>{record.position || '--'}</div>
        )
      }
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">功能</div>
        </div>
      ),
      width: 60,
      // dataIndex: 'operate',
      render: (text, record, index) => {
        if (record.interactive_show_bind_page) {
          return (
            <div className="table-row-remove" onClick={(event) => { onInteract(event, record) }}>交互</div>
          )
        }
      },
    },
  ]

  console.log(modalData, 'modalData')
  return (
    <div className={styles.interactDeviceWrapper}>
      <Table
        columns={columns}
        dataSource={dataSource}
        ref={tableRef}
        height="calc(100vh - 204px)"
      >
        {
          !isEdit && (
            <Button type="blueButton" text="编 辑" onClick={() => { onEdit() }} style={{ position: 'absolute', right: '64px', bottom: '16px', width: '64px' }} />
          )
        }
        {
          isEdit && (
            <Button type="whiteButton" text="取消保存" onClick={() => { onCancelSave() }} style={{ position: 'absolute', right: '168px', bottom: '16px' }} />
          )
        }
        {
          isEdit && (
            <Button type="blueButton" text="保存编辑" onClick={() => { onSave() }} style={{ position: 'absolute', right: '64px', bottom: '16px' }} />
          )
        }
      </Table>
      {
        showInteractModal && (
          <>
            <div className="mask" style={maskStyle} />
            <div className="interact-settings-modal-wrapper" style={modalStyle} ref={modalRef}>
              <div className="device-wrapper">
                <div className="top">
                  {
                    modalData.panel_button_infos && modalData.panel_button_infos.length > 0 && modalData.panel_button_infos.map((item) => {
                      console.log(item.button_position, 'item.button_position')
                      if (item.button_position === 1) {
                        return <div className="device1" key={item.button_position} onClick={(event) => { onClickButton(event, item) }}>{item.button_name}</div>
                      }
                    })
                  }
                  {
                    modalData.panel_button_infos && modalData.panel_button_infos.length > 0 && modalData.panel_button_infos.map((item) => {
                      if (item.button_position === 2) {
                        return <div className="device2" key={item.button_position} onClick={(event) => { onClickButton(event, item) }}>{item.button_name}</div>
                      }
                    })
                  }

                </div>
                <div className="bottom">
                  {
                    modalData.panel_button_infos && modalData.panel_button_infos.length > 0 && modalData.panel_button_infos.map((item) => {
                      if (item.button_position === 3) {
                        return <div className="device3" key={item.button_position} onClick={(event) => { onClickButton(event, item) }}>{item.button_name}</div>
                      }
                    })
                  }
                  {
                    modalData.panel_button_infos && modalData.panel_button_infos.length > 0 && modalData.panel_button_infos.map((item) => {
                      if (item.button_position === 4) {
                        return <div className="device4" key={item.button_position} onClick={(event) => { onClickButton(event, item) }}>{item.button_name}</div>
                      }
                    })
                  }
                </div>
              </div>
              <div className="device-wrapper">
                <div className="top">
                  {
                    modalData.panel_button_infos && modalData.panel_button_infos.length > 0 && modalData.panel_button_infos.map((item) => {
                      if (item.button_position === 5) {
                        return <div className="device1" key={item.button_position} onClick={(event) => { onClickButton(event, item) }}>{item.button_name}</div>
                      }
                    })
                  }
                  {
                    modalData.panel_button_infos && modalData.panel_button_infos.length > 0 && modalData.panel_button_infos.map((item) => {
                      if (item.button_position === 6) {
                        return <div className="device2" key={item.button_position} onClick={(event) => { onClickButton(event, item) }}>{item.button_name}</div>
                      }
                    })
                  }

                </div>
                <div className="bottom">
                  {
                    modalData.panel_button_infos && modalData.panel_button_infos.length > 0 && modalData.panel_button_infos.map((item) => {
                      if (item.button_position === 7) {
                        return <div className="device3" key={item.button_position} onClick={(event) => { onClickButton(event, item) }}>{item.button_name}</div>
                      }
                    })
                  }
                  {
                    modalData.panel_button_infos && modalData.panel_button_infos.length > 0 && modalData.panel_button_infos.map((item) => {
                      if (item.button_position === 8) {
                        return <div className="device4" key={item.button_position} onClick={(event) => { onClickButton(event, item) }}>{item.button_name}</div>
                      }
                    })
                  }
                </div>
              </div>
              <Button type="blueButton" text="设置交互" onClick={() => { onInteractSettings() }} style={{ position: 'absolute', right: '14px', bottom: '13px' }} />
            </div>
          </>
        )
      }
    </div>
  )
}
