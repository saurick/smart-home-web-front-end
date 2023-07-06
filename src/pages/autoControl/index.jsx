import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Switch } from 'antd'
import styles from './index.module.less'
import { Table } from '@/common/components/table'
import { Button } from '@/common/components/button'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { getContext } from '@/common/stores'
import { FilterIcon } from '@/common/components/icons'
import { isUndefined } from '@/common/utils/util'

export const AutoControl = () => {
  const [dataSource, setDataSource] = useState([])

  const context = getContext()
  const navigate = useNavigate()

  const tableRef = useRef(null)

  const createAutoControl = async () => {
    const obj = {}
    obj.name = ' '

    const rpc = new JsonRpc('add_automation')
    const result = await rpc.fetchData({ ...obj })

    const scene = result.scenes[0]
    const data = JSON.parse(JSON.stringify(scene))
    data.key = dataSource.length
    data.isCopyCreate = true
    setDataSource((dataSource) => [...dataSource, data])
  }

  const onSwitchChange = async (record) => {
    if (record.active === 1) {
      record.active = 0
    } else {
      record.active = 1
    }
    const obj = {}
    obj.automation_id = record.automation_id

    obj.active = record.active
    const rpc = new JsonRpc('update_automation')
    const result = await rpc.fetchData({ ...obj })

    setDataSource([...dataSource])
  }

  const onEdit = (automation_id) => {
    navigate('/auto-control/auto-control-detail', { state: { automation_id } })
  }

  const onCopy = async (record) => {
    const obj = {}
    obj.name = record.name
    const addRpc = new JsonRpc('add_automation')
    const addResult = await addRpc.fetchData({ ...obj })
    const newAutoItem = addResult.scenes[0]

    const copyRpc = new JsonRpc('copy_automation_detail')
    const copyResult = await copyRpc.fetchData({ src_automation_id: record.automation_id, dst_automation_id: newAutoItem.automation_id })

    const data = JSON.parse(JSON.stringify(record))
    data.key = dataSource.length
    data.isCopyCreate = true
    setDataSource((dataSource) => [...dataSource, data])
  }

  const onDelete = async (record, index) => {
    const rpc = new JsonRpc('delete_automation')
    const result = await rpc.fetchData({ automation_id: record.automation_id })

    dataSource.splice(index, 1)
    setDataSource([...dataSource])
  }

  const queryAutomationList = async () => {
    const rpc = new JsonRpc('query_automation_list')
    const result = await rpc.fetchData()
    setDataSource(result.automations)
  }

  useEffect(() => {
    queryAutomationList()
  }, [])

  const columns = [
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">自动化名称</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'name') }} />
        </div>
      ),
      dataIndex: 'name',
      render: (text, record, index) => (
        <div>{!isUndefined(record.name, true) ? record.name : '--'}</div>
      )
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">操作</div>
        </div>
      ),
      render: (text, record, index) => (
        <div className="operate-wrapper">
          <div className="edit" onClick={() => { onEdit(record.automation_id) }}>编辑</div>
          <div className="copy" onClick={() => { onCopy(record) }}>复制</div>
          <div className="delete" onClick={() => { onDelete(record, index) }}>删除</div>
        </div>
      ),
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">是否生效</div>
        </div>
      ),
      render: (text, record, index) => (
        <Switch checked={record.active === 1} onChange={() => onSwitchChange(record)} />
      ),
      dataIndex: 'isInEffect',
    },
  ]

  return (
    <div className={styles.autoControlWrapper}>
      <Table
        columns={columns}
        dataSource={dataSource}
        ref={tableRef}
        height="calc(100vh - 204px)"
      >
        <Button type="blueButton" text="创建自动化" onClick={() => { createAutoControl() }} style={{ position: 'absolute', right: '64px', bottom: '13px' }} />
      </Table>
    </div>
  )
}
