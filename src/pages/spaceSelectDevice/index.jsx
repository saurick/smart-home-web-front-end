import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Checkbox } from 'antd'
import styles from './index.module.less'
import { Table } from '@/common/components/table'
import { Button } from '@/common/components/button'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { getContext } from '@/common/stores'
import { FilterIcon } from '@/common/components/icons'

export const SpaceSelectDevice = (props) => {
  const navigate = useNavigate()
  const tableRef = useRef()
  const [selectData, setSelectData] = useState([])
  const [dataSource, setDataSource] = useState([])

  const context = getContext()

  const { state } = useLocation()

  const onCancel = () => {
    navigate(-1)
  }
  const onConfirm = async () => {
    const device_ep_list = []
    selectData.forEach((item) => {
      const obj = {}
      obj.dev_id = dataSource[item].dev_id
      obj.ep_id = dataSource[item].ep_id
      obj.type = dataSource[item].type
      obj.name = dataSource[item].name
      obj.position = dataSource[item].position
      obj.area = { area_id: state.area_id }

      device_ep_list.push(obj)
    })
    const rpc = new JsonRpc('update_device_ep_detail')
    const result = await rpc.fetchData({ device_ep_list })
    navigate(-1)
  }

  const onSelectAll = (event) => {
    if (selectData.length === dataSource.length) {
      setSelectData([])
    } else {
      dataSource.forEach((item, index) => {
        if (!selectData.includes(dataSource[item].key)) {
          selectData.push(dataSource[item].key)
        }
      })
      setSelectData([...selectData])
    }
  }

  const onSelect = (event, text, record, index) => {
    if (selectData.includes(record.key)) {
      console.log(selectData.indexOf(record.key), '111')
      selectData.splice(selectData.indexOf(record.key), 1)
      setSelectData(selectData)
    } else {
      setSelectData([...selectData, record.key])
    }
  }

  const queryAllDevice = async () => {
    const rpc = new JsonRpc('query_all_device_ep_detail_by_area_id')
    const result = await rpc.fetchData({ area_id: 0 })
    setDataSource(result.device_ep_list)
  }

  useEffect(() => {
    queryAllDevice()
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

    <div className={styles.spaceSelectDeviceWrapper}>
      <Table
        columns={columns}
        dataSource={dataSource}
        ref={tableRef}
        height="calc(100vh - 204px)"
      >
        <Button type="whiteButton" text="取 消" onClick={() => { onCancel() }} style={{ position: 'absolute', right: '152px', bottom: '16px', width: '65px' }} />
        <Button type="blueButton" text="确 定" onClick={() => { onConfirm() }} style={{ position: 'absolute', right: '64px', bottom: '16px', width: '65px' }} />
      </Table>
    </div>
  )
}
