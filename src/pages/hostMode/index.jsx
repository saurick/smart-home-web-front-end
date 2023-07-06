import React, { useState, useRef, useEffect } from 'react'
import styles from './index.module.less'
import { Table } from '@/common/components/table'
import { Button } from '@/common/components/button'
import { Tabs } from '@/common/components/tabs'
import { Input } from '@/common/components/input'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { FilterIcon } from '@/common/components/icons'
import { getContext } from '@/common/stores'

export const HostMode = () => {
  const tableRef = useRef(null)
  const [bureauEndHostData, setBureauEndHostData] = useState({ root_gw_id: '', root_gw_ip: '' })
  const [defaultActiveTab, setDefaultActiveTab] = useState('')
  const [tabItems, setTabItems] = useState([])
  const [dataSource, setDataSource] = useState([])

  const context = getContext()

  const onMacInput = (value) => {
    setBureauEndHostData({ ...bureauEndHostData, root_gw_id: value })
  }

  const onIpInput = (value) => {
    setBureauEndHostData({ ...bureauEndHostData, root_gw_ip: value })
  }

  const onConfirm = async () => {
    const obj = {}
    obj.gw_id = localStorage.getItem('gw_id')
    obj.gw_mode = 2
    obj.root_gw_id = bureauEndHostData.root_gw_id
    obj.root_gw_ip = bureauEndHostData.root_gw_ip

    const rpc = new JsonRpc('set_gw_work_mode_info')
    const result = await rpc.fetchData({ ...obj })
    // setBureauEndHostData({...bureauEndHostData})
  }

  const onCancel = () => {
    // setBureauEndHostData(initData)
  }

  const checkUpdate = async () => {
    const rpc = new JsonRpc('gw_check_update')
    const result = await rpc.fetchData({ gw_id: localStorage.getItem('gw_id') })
  }

  const getActiveTab = async (tab) => {
    const obj = {}
    obj.gw_id = localStorage.getItem('gw_id')
    obj.root_gw_id = ''
    obj.root_gw_ip = ''

    if (tab === '1') {
      obj.gw_mode = 2
    }

    if (tab === '2') {
      obj.gw_mode = 1
    }
    const rpc = new JsonRpc('set_gw_work_mode_info')
    const result = await rpc.fetchData({ ...obj })

    if (tab === '2' && dataSource.length === 0) {
      const getGwModeInforpc = new JsonRpc('get_gw_work_mode_info')
      const getGwModeInforpcResult = await getGwModeInforpc.fetchData({ gw_id: localStorage.getItem('gw_id') })
      setDataSource(getGwModeInforpcResult.sub_gw_list)
    }
  }

  const getGwModeInfo = async () => {
    const getGwModeInforpc = new JsonRpc('get_gw_work_mode_info')
    const getGwModeInforpcResult = await getGwModeInforpc.fetchData({ gw_id: localStorage.getItem('gw_id') })

    setTabItems([{
      label: '局端主机',
      key: '1',
      children: 'Tab 1'
    },
    {
      label: '边缘网关',
      key: '2',
      children: 'Tab 2'
    },])
    if (getGwModeInforpcResult.gw_mode === 1) {
      setDefaultActiveTab('2')
      setDataSource(getGwModeInforpcResult.sub_gw_list)
    } else {
      setDefaultActiveTab('1')
    }
  }

  useEffect(() => {
    getGwModeInfo()
  }, [])

  const columns = [
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">局端主机</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('gw_name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'gw_name') }} />
        </div>
      ),
      dataIndex: 'gw_name',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">IP</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('gw_ip') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'gw_ip') }} />
        </div>
      ),
      dataIndex: 'gw_ip',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">厂家信息</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('manufacturer') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'manufacturer') }} />
        </div>
      ),
      dataIndex: 'manufacturer',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">型号</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('gw_model') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'gw_model') }} />
        </div>
      ),
      dataIndex: 'gw_model',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">MAC</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('gw_id') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'gw_id') }} />
        </div>
      ),
      dataIndex: 'gw_id',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">CCO</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('cco_version') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'cco_version') }} />
        </div>
      ),
      dataIndex: 'cco_version',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">MCU</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('mcu_version') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'mcu_version') }} />
        </div>
      ),
      dataIndex: 'mcu_version',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">WEB</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('web_version') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'web_version') }} />
        </div>
      ),
      dataIndex: 'web_version',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">操作</div>
        </div>
      ),
      render: () => <Button type="whiteButton" text="检查更新" textstyle={{ color: '#205AD2' }} onClick={() => { checkUpdate() }} />,
    },
  ]

  tabItems.forEach((item) => {
    if (item.key === '1') {
      item.children = (
        <div className="bureau-end-host-wrapper">
          <div className="tip">请输入边缘网关的MAC和IP地址（请确保边缘局端主机处于边缘网关的同级或下级路由）</div>
          <div className="form-wrapper">
            <div className="type-mac-wrapper">
              <div className="mac">MAC</div>
              <Input type="default" defaultValue={bureauEndHostData.root_gw_id} onChange={(value) => onMacInput(value)} placeholder='请输入MAC' style={{width: '496px'}} />
            </div>
            <div className="type-ip-wrapper">
              <div className="ip">IP</div>
              <Input type="default" defaultValue={bureauEndHostData.root_gw_ip} onChange={(value) => onIpInput(value)} placeholder='请输入IP' style={{width: '496px'}}  />
            </div>
            <div className="buttons-wrapper">
              <Button type="whiteButton" text="取 消" onClick={() => { onCancel() }} style={{ marginRight: '8px', width: '65px' }} />
              <Button type="blueButton" text="确 定" onClick={() => { onConfirm() }} style={{ width: '65px' }} />
            </div>
          </div>
        </div>
      )
    }
    if (item.key === '2') {
      item.children = (
        <Table
          columns={columns}
          dataSource={dataSource}
          ref={tableRef}
          style={{ marginTop: '28px' }}
          height="calc(100vh - 270px)"
        />
      )
    }
  })

  return (
    <div className={styles.hostModeWrapper}>
      <Tabs type="card" items={tabItems} getActiveTab={(tab) => { getActiveTab(tab) }} defaultActiveTab={defaultActiveTab} />
    </div>
  )
}
