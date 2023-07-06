import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Checkbox } from 'antd'
import styles from './index.module.less'
import { Table } from '@/common/components/table'
import { FilterIcon } from '@/common/components/icons'
import { Button } from '@/common/components/button'
import { getContext } from '@/common/stores'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { Modal } from '@/common/components/modal'

export const GroupSelectDevice = () => {
  const [dataSource, setDataSource] = useState([])
  const [selectData, setSelectData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  const { state } = useLocation()
  const context = getContext()
  const navigate = useNavigate()

  const tableRef = useRef(null)

  const onConfirmModal = () => {
    setShowModal(false)
    navigate(-1)
  }

  const onCancel = () => {
    navigate(-1)
  }

  const onConfirm = async () => {
    setShowModal(true)
    setModalTitle('正在保存中，请等待')

    const group_list = []
    const groupObj = {}
    groupObj.group_id = state.group_id
    groupObj.group_area_id = state.group_area_id
    groupObj.group_type = state.group_type
    groupObj.group_name = state.group_name
    groupObj.group_devices = []
    console.log(dataSource, 'dataSource')
    console.log(selectData, 'selectData')
    dataSource.forEach((item, index) => {
      const deviceObj = {}
      if (selectData.includes(index)) {
        deviceObj.dev_id = item.dev_id
        deviceObj.ep = item.ep_id
        groupObj.group_devices.push(deviceObj)
        // item.key = String(context.state.groupConfigData.length + 1 + index)
      }
    })
    group_list.push(groupObj)

    const rpc = new JsonRpc('strict_save_groups_detail')
    const result = await rpc.fetchData({ group_list })

    setModalTitle('保存成功')
  }

  const onSelectAll = (event) => {
    if (selectData.length === dataSource.length && !event.target.checked) {
      setSelectData([])
    } else {
      dataSource.forEach((item, index) => {
        if (!selectData.includes(item.key)) {
          selectData.push(item.key)
        }
      })
      console.log(selectData, 'selectDataaa')
      setSelectData(selectData)
    }
    setDataSource([...dataSource])
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
    setDataSource([...dataSource])
  }

  const queryAllExecuteDeviceEpDetailByGroupType = async () => {
    const rpc = new JsonRpc('query_all_execute_device_ep_detail_by_group_type')
    const result = await rpc.fetchData({ group_type: state.group_type })
    setDataSource(result.device_ep_list)
  }

  useEffect(() => {
    queryAllExecuteDeviceEpDetailByGroupType()
  }, [])

  const columns = [
    {
      title: () =>
      (
        <Checkbox checked={selectData.length === dataSource.length} onChange={(event) => onSelectAll(event)} />
      ),
      render: (text, record, index) => {
        let isChecked = false
        selectData.forEach((item) => {
          if (item == record.key) {
            isChecked = true
          }
        })
        return <Checkbox checked={isChecked} onChange={(event) => onSelect(event, text, record, index)} />
      }
    },
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
          <div className="title">Mac</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('dev_id') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'dev_id') }} />
        </div>
      ),
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
      dataIndex: 'name',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">位图编号</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('position') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'position') }} />
        </div>
      ),
      dataIndex: 'position',
    },
  ]

  return (
    <div className={styles.groupSelectDeviceWraper}>
      <Table
        columns={columns}
        dataSource={dataSource}
        ref={tableRef}
        height="calc(100vh - 204px)"
      >
        <Button type="whiteButton" text="取 消" onClick={() => { onCancel() }} style={{ position: 'absolute', right: '152px', bottom: '16px', width: '65px' }} />
        <Button type="blueButton" text="确 定" onClick={() => { onConfirm() }} style={{ position: 'absolute', right: '64px', bottom: '16px', width: '65px' }} />
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
