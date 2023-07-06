import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './index.module.less'
import { Table } from '@/common/components/table'
import { Button } from '@/common/components/button'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { getContext } from '@/common/stores'
import { FilterIcon } from '@/common/components/icons'

export const SpaceDetail = (props) => {
  const navigate = useNavigate()
  const tableRef = useRef(null)
  const context = getContext()
  const [dataSource, setDataSource] = useState([])
  const [deviceOnlineCount, setDeviceOnlineCount] = useState({})

  const { state } = useLocation()

  const goToSelectDevice = () => {
    navigate('/smart-space/space-detail/space-select-device', { state: { area_id: state.area_id } })
  }

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
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">操作</div>
        </div>
      ),
      // dataIndex: 'operate',
      render: (text, record, index) => <div className="table-row-remove" onClick={() => onRemoveDevice(index)}>移出</div>,
    },
  ]

  const onRemoveDevice = async (index) => {
    const list = dataSource
    list.forEach((item, i) => {
      if (index === i) {
        item.area = { ...item.area, area_id: 0 }
      }
    })
    const rpc = new JsonRpc('update_device_ep_detail')
    const result = await rpc.fetchData({ device_ep_list: list })

    console.log(result, 'onRemoveDevice')
    if (result.succeed) {
      dataSource.splice(index, 1)
    setDataSource([...dataSource])
    }
    // context.dispatch({ type: 'space-remove', payload: { index: index } })
  }

  const queryAllDevice = async () => {
    const rpc = new JsonRpc('query_all_device_ep_detail_by_area_id')
    const result = await rpc.fetchData({ area_id: state.area_id })
    console.log(result, 'queryAllDevice')
    const { device_ep_list } = result
    device_ep_list.forEach((item, index) => {
      item.orderNum = String(index + 1).padStart(3, '0')
    })
    setDataSource(device_ep_list)
    // context.dispatch({type: 'query-all-device', payload: result.device_ep_list})
  }

  // const getDeviceOnlineCount = async () => {
  //   const rpc = new JsonRpc('get_device_online_count')
  //   const result = await rpc.fetchData()
  //   console.log(result,'getDeviceOnlineCount')
  //   setDeviceOnlineCount(result)
  // }

  const getDeviceOnlineCountByAreaid = async () => {
    const rpc = new JsonRpc('get_device_online_count_by_area_id')
    const result = await rpc.fetchData({ area_id: state.area_id })
    console.log(result, 'getDeviceOnlineCount')
    setDeviceOnlineCount(result)
  }

  useEffect(() => {
    queryAllDevice()
    getDeviceOnlineCountByAreaid()
  }, [])

  return (
    <div className={styles.spaceDetailWrapper}>
      <div className="space-detail-header-wrapper">
        <div className="header-left-wrapper">
          <div className="name">总经理办公室</div>
          <div className="device-amount-wrapper">
            <div className="device-amount">设备数：</div>
            <div className="amount">{deviceOnlineCount.total_count}</div>
          </div>
          <div className="offline-amount-wrapper">
            <div className="offline-amount">离线数：</div>
            <div className="amount" onClick={() => { }}>{deviceOnlineCount.offline_count }</div>
          </div>
        </div>
        <Button type="goBackButton" />
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        ref={tableRef}
        height="calc(100vh - 238px)"
      >
        <Button type="blueButton" text="移入设备" onClick={() => { goToSelectDevice() }} style={{ position: 'fixed', right: '70px', bottom: '16px' }} />
      </Table>
    </div>
  )
}
