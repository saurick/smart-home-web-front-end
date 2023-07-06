import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'
import { Table } from '@/common/components/table'
import { Button } from '@/common/components/button'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { FilterIcon } from '@/common/components/icons'
import { getContext } from '@/common/stores'

export const CloudService = () => {
  const [dataSource, setDataSource] = useState([])

  const context = getContext()

  const tableRef = useRef(null)
  const inputFileRef = useRef(null)

  const navigate = useNavigate()

  const onUnbind = async (record) => {
    if (record.bind === 0) return
    const rpc = new JsonRpc('unbind_cloud_account')
    const result = await rpc.fetchData({ cloud_platform_id: record.id })
  }

  const saveFile = async (blob) => {
    const a = document.createElement('a')
    a.download = 'backup.txt'
    a.href = URL.createObjectURL(blob)
    a.addEventListener('click', (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000)
    })
    a.click()
  }

  const backupFile = async () => {
    const rpc = new JsonRpc('export_config')
    const result = await rpc.fetchData()

    delete result.succeed

    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    saveFile(blob)
  }

  const importConfig = () => {
    inputFileRef.current.click()
  }

  const onChangeFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]

    const reader = new FileReader()
    reader.onload = async (event) => {
      localStorage.removeItem('configFile')
      const text = (event.target.result)
      localStorage.setItem('configFile', text)
      navigate('/cloud-service/cloud-service-import-config')
    }
    reader.onerror = () => {
      console.error(`Error occurred reading file: ${file.name}`)
    }

    reader.readAsText(file)
  }

  const queryCloudPlatformInfo = async () => {
    const rpc = new JsonRpc('query_cloud_platform_info')
    const result = await rpc.fetchData()
    setDataSource(result.cloud_platforms)
  }

  useEffect(() => {
    queryCloudPlatformInfo()
  }, [])

  const columns = [
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">平台名称</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'name') }} />
        </div>
      ),
      dataIndex: 'name',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">版本号</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('sw_version') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'sw_version') }} />
        </div>
      ),
      dataIndex: 'sw_version',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">功能</div>
        </div>
      ),
      dataIndex: 'function',
      render: (text, record, index) => {
        return (
          // <Button type="whiteButton" text="接入平台" onClick={() => {onUnbind()}} textstyle={{color: '#205AD2'}} style={{border: '1px solid #205AD2'}} />
          <Button type="whiteButton" text="解绑平台" onClick={() => { onUnbind(record) }} />
        )
      }
    },
  ]

  return (
    <div className={styles.cloudServiceWrapper}>
      <Table
        columns={columns}
        dataSource={dataSource}
        ref={tableRef}
        height="calc(100vh - 204px)"
      >
        <input type="file" id="file" ref={inputFileRef} style={{ display: 'none' }} onChange={(event) => { onChangeFile(event) }} />
        <Button type="blueButton" text="备份文件" onClick={() => { backupFile() }} style={{ position: 'absolute', right: '168px', bottom: '13px' }} />
        <Button type="blueButton" text="导入配置" onClick={() => { importConfig() }} style={{ position: 'absolute', right: '64px', bottom: '13px' }} />
      </Table>
    </div>
  )
}
