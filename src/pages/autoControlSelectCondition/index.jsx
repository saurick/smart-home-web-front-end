import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from 'antd'
import styles from './index.module.less'
import { Table } from '@/common/components/table'
import { Button } from '@/common/components/button'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { getContext } from '@/common/stores'
import { FilterIcon } from '@/common/components/icons'

export const AutoControlSelectCondition = () => {
  const [selectData, setSelectData] = useState([])
  const [dataSource, setDataSource] = useState([])

  const navigate = useNavigate()
  const tableRef = useRef(null)

  const context = getContext()

  const onConfirm = () => {
    console.log(selectData, 'selectData')
    const data = []
    selectData.forEach((item) => {
      data.push(dataSource[item])
    })
    console.log(data, 'data')
    context.dispatch({ type: 'auto-control-selected-conditions', payload: data })
    context.dispatch({ type: 'router-from', payload: 'auto-control-select-condition' })
    navigate(-1)
  }

  const onCancel = () => {
    context.dispatch({ type: 'router-from', payload: 'auto-control-select-condition' })
    navigate(-1)
  }

  // const onSelectAll = (event) => {
  //   if (selectData.length === dataSource.length && !event.target.checked) {
  //     setSelectData([])
  //   } else {
  //     dataSource.forEach((item, index) => {
  //       if (!selectData.includes(item.key)) {
  //         selectData.push(item.key)
  //       }
  //     })
  //     console.log(selectData, 'selectDataaa')
  //     setSelectData(selectData)

  //   }
  //   setDataSource([...dataSource])
  // }

  const onSelect = (event, text, record, index) => {
    if (selectData.length === 5) return
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

  const queryAllExecuteDeviceEpDetail = async () => {
    const rpc = new JsonRpc('query_all_automation_condition_device_ep_detail')
    const result = await rpc.fetchData()
    const { device_ep_list } = result
    device_ep_list.forEach((item, index) => {
      item.key = index
    })

    const autoControlDetailConditions = JSON.parse(localStorage.getItem('autoControlDetailConditions'))
    console.log(autoControlDetailConditions, 'autoControlDetailConditions')
    autoControlDetailConditions.forEach((conditionItem, conditionIndex) => {
      device_ep_list.forEach((item, index) => {
        if (
          conditionItem.dev_id === item.dev_id &&
          (conditionItem.ep === item.ep_id || conditionItem.ep_id === item.ep_id) &&
          !selectData.includes(item.key)
        ) {
          selectData.push(item.key)
        }
      })
      setSelectData(selectData)
    })
    setDataSource(device_ep_list)
  }

  useEffect(() => {
    queryAllExecuteDeviceEpDetail()
  }, [])

  const columns = [
    {
      // title: () =>
      // (
      //   dataSource.length > 0 && <Checkbox checked={selectData.length === dataSource.length} onChange={(event) => onSelectAll(event)} />
      // ),
      width: 60,
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
      dataIndex: 'area',
    }
  ]

  return (
    <div className={styles.autoControlSelectConditionWrapper}>

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
