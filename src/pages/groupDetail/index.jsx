import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './index.module.less'
import { Table } from '@/common/components/table'
import { FilterIcon } from '@/common/components/icons'
import { Button } from '@/common/components/button'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { getContext } from '@/common/stores'

export const GroupDetail = () => {
  const navigate = useNavigate()
  const tableRef = useRef(null)

  const [dataSource, setDataSource] = useState([])
  const [groupDetail, setGroupDetail] = useState([])

  const { state } = useLocation()
  const context = getContext()

  const goBackGroup = () => {
    navigate(-1)
  }

  const addDevice = () => {
    navigate('/group-manage/group-detail/group-select-device', {
      state:
      {
        group_id: groupDetail.group_id,
        group_area_id: groupDetail.group_area_id,
        group_type: groupDetail.group_type,
        group_name: groupDetail.group_name,
      }
    })
  }

  const goBack = () => {
    navigate(-1)
  }

  const onRemove = async (index) => {
    let group_device_id = 0
    dataSource.forEach((item, i) => {
      if (index === i) {
        group_device_id = item.group_device_id
      }
    })
    const rpc = new JsonRpc('delete_group_device_by_id')
    const result = await rpc.fetchData({ group_device_id })
    if (result.succeed) {
      dataSource.splice(index, 1)
      setDataSource([...dataSource])
    }
    // context.dispatch({type: 'group-remove', payload: {index: index}})
  }

  const queryGroupDetail = async () => {
    const rpc = new JsonRpc('query_group_detail')
    const result = await rpc.fetchData({ group_id: state.group_id })
    setGroupDetail(result.group_list[0])

    const { group_devices } = result.group_list[0]
    group_devices.forEach((item, index) => {
      item.key = index
      item.orderNum = String(index + 1).padStart(3, '0')
    })
    setDataSource(group_devices)
  }

  useEffect(() => {
    queryGroupDetail()
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
          <FilterIcon stroke={context.state.filterActiveList.includes('dev_name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'dev_name') }} />
        </div>
      ),
      dataIndex: 'dev_type_name',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">设备名称</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'name') }} />
        </div>
      ),
      dataIndex: 'name',
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
      render: (text, record, index) => (
        <div>{record.area.name}</div>
      )
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">操作</div>
        </div>
      ),
      // dataIndex: 'operate',
      render: (text, record, index) => <div className="table-row-remove" onClick={() => { onRemove(index) }}>移出</div>,
    },
  ]

  return (
    <div className={styles.groupDetailWrapper}>
      <div className="group-detail-header">
        <div className="header-left-wrapper">
          <div className="title">群组设备</div>
          <div className="dividing-line" />
          <div className="group-name-wrapper">
            <div className="group-name">群组名称</div>
            <div className="value">{groupDetail.group_name}</div>
          </div>
          <div className="group-type-wrapper">
            <div className="group-type">群组类型</div>
            <div className="value">{groupDetail.group_type_name}</div>
          </div>
          <div className="located-space-wrapper">
            <div className="located-space">所在空间</div>
            <div className="value">{groupDetail.area && groupDetail.area.name}</div>
          </div>
          <div className="device-amount-wrapper">
            <div className="device-amount">设备数</div>
            <div className="amount">{groupDetail.device_count}</div>
          </div>
        </div>
        <Button type="goBackButton" />
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        ref={tableRef}
        height="calc(100vh - 270px)"
      >
        <Button type="whiteButton" text="编辑群组" onClick={() => { goBackGroup() }} style={{ position: 'absolute', right: '168px', bottom: '16px' }} />
        <Button type="blueButton" text="添加设备" onClick={() => { addDevice() }} style={{ position: 'absolute', right: '64px', bottom: '16px' }} />
      </Table>
    </div>
  )
}
