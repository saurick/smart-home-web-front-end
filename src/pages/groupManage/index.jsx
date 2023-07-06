import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from 'antd'
import styles from './index.module.less'
import { Input } from '@/common/components/input'
import { Table } from '@/common/components/table'
import { Button } from '@/common/components/button'
import { Select } from '@/common/components/select'
import { FilterIcon } from '@/common/components/icons'
import { getContext } from '@/common/stores'

import { JsonRpc } from '@/common/utils/jsonRpc'

export const GroupManage = () => {
  const [isEdit, setIsEdit] = useState(false)
  const navigate = useNavigate()
  const tableRef = useRef(null)
  const [selectData, setSelectData] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [initialData, setInitialData] = useState([])
  const [areas, setAreas] = useState([])
  const [groups, setGroups] = useState([])

  const context = getContext()

  const onSelectAll = () => {
    if (selectData.length === dataSource.length) {
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

  const onSelect = (record) => {
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

  const onGroupNameInput = (value, record) => {
    dataSource.forEach((item, index) => {
      if (item.key == record.key) {
        item.group_name = value
      }
    })
    console.log(dataSource, 'item3213')
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
        dataSource[dataIndex].area.area_id = value
        dataSource[dataIndex].group_area_id = value
        dataSource[dataIndex].area.name = name
      }
    })

    setDataSource([...dataSource])
  }

  const onSelectGroupType = (record, value) => {
    let name = ''
    groups.forEach((item) => {
      if (item.value === value) {
        name = item.label
      }
    })
    dataSource.forEach((dataItem, dataIndex) => {
      if (dataItem.key === record.key) {
        dataItem.group_type_name = name
        dataItem.group_type = value
      }
    })
    setDataSource([...dataSource])
  }

  const deleteGroup = async () => {
    console.log(dataSource, 'dataSource111')
    const group_id_list = []
    selectData.forEach((item) => {
      dataSource.forEach((dataItem, dataIndex) => {
        if (dataItem.key == item) {
          dataSource.splice(dataIndex, 1)
          group_id_list.push(dataItem.group_id)
        }
      })
    })
    const rpc = new JsonRpc('delete_groups')
    const result = await rpc.fetchData({ group_id_list })
    setSelectData([])
    setDataSource([...dataSource])
  }

  const cancelSaveGroup = () => {
    setDataSource([...initialData])
    setIsEdit(false)
  }

  const editGroup = () => {
    const data = JSON.parse(JSON.stringify(dataSource))
    setInitialData([...data])
    setIsEdit(true)
  }

  const saveGroup = async () => {
    const groups = []
    dataSource.map((item) => {
      const obj = {}
      obj.group_id = item.group_id
      obj.group_area_id = item.group_area_id
      obj.group_name = item.group_name
      groups.push(obj)
      item.isCopy = false
      item.isCreate = false
      return item
    })
    const rpc = new JsonRpc('update_groups')
    const result = await rpc.fetchData({ groups })
    setDataSource([...dataSource])
    setIsEdit(false)
  }

  const createGroup = () => {
    const data = JSON.parse(JSON.stringify(dataSource[0]))
    data.area = {
      address: '',
      area_id: 0,
      gw_id: '',
      icon: 0,
      name: ''
    }
    data.device_count = 0
    data.group_area_id = 0
    data.group_devices = []
    data.group_id = 0
    data.group_name = ''
    data.group_type = ''
    data.group_type_name = ''
    data.gw_id = ''
    data.orderNum = String(dataSource.length + 1).padStart(3, '0')
    data.status = ''
    data.key = dataSource.length
    data.isCreate = true
    setDataSource((dataSource) => [...dataSource, data])
  }

  const onCopy = (record) => {
    const data = JSON.parse(JSON.stringify(record))
    data.key = dataSource.length
    data.orderNum = String(dataSource.length + 1).padStart(3, '0')
    data.isCopy = true
    setDataSource((dataSource) => [...dataSource, data])
  }

  const onConfirm = async (record) => {
    if (record.isCreate) {
      const addObj = {}
      dataSource.forEach((dataItem) => {
        if (dataItem.key === record.key) {
          addObj.group_name = dataItem.group_name
          addObj.group_type = dataItem.group_type
          addObj.group_area_id = dataItem.group_area_id
          addObj.device_count = dataItem.device_count
        }
      })
      const addRpc = new JsonRpc('add_group')
      const addResult = await addRpc.fetchData({ ...addObj })

      const groupInfo = addResult.groups[0]
      Object.keys(groupInfo).forEach((item) => {
        if (!['orderNum', 'key'].includes(item)) {
          record[item] = groupInfo[item]
        }
      })
    }

    if (record.isCopy) {
      const addObj = {}
      dataSource.map((item) => {
        if (item.key === record.key) {
          addObj.group_name = item.group_name
          addObj.group_type = item.group_type
          addObj.group_area_id = item.group_area_id
          addObj.device_count = item.device_count
        }
      })
      const addRpc = new JsonRpc('add_group')
      const addResult = await addRpc.fetchData({ ...addObj })

      const groupInfo = addResult.groups[0]
      Object.keys(groupInfo).forEach((item) => {
        if (!['orderNum', 'key'].includes(item)) {
          record[item] = groupInfo[item]
        }
      })
      const group_list = []
      const obj = {}
      obj.group_id = groupInfo.group_id
      obj.group_area_id = groupInfo.group_area_id
      obj.group_type = groupInfo.group_type
      obj.group_name = groupInfo.group_name
      obj.group_devices = record.group_devices
      group_list.push(obj)
      const saveRpc = new JsonRpc('strict_save_groups_detail')
      const saveResult = await saveRpc.fetchData({ group_list })
    }

    dataSource.forEach((item, index) => {
      if (item.key === record.key) {
        dataSource[index].isCopy = false
        dataSource[index].isCreate = false
      }
    })

    setDataSource([...dataSource])
  }

  const onCancel = (record) => {
    dataSource.forEach((item, index) => {
      if (item.key === record.key) {
        dataSource.splice(index, 1)
        setDataSource([...dataSource])
      }
    })
  }

  const goToDetail = (group_id) => {
    if (group_id !== undefined) {
      navigate('/group-manage/group-detail', { state: { group_id } })
    }
  }

  const getGroupTypeInfoList = async () => {
    const rpc = new JsonRpc('get_group_type_info_list')
    const result = await rpc.fetchData()
    const arr = []
    result.group_type_info_list.forEach((item) => {
      const obj = {}
      obj.label = item.group_type_name
      obj.value = item.group_type
      arr.push(obj)
    })
    console.log(arr, 'arr')
    setGroups([...arr])
  }

  const queryAllGroupDetail = async () => {
    const rpc = new JsonRpc('query_all_group_detail')
    const result = await rpc.fetchData()

    setDataSource(result.group_list)
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

  useEffect(() => {
    getGroupTypeInfoList()
    queryAllGroupDetail()
    queryAreas()
  }, [tableRef?.current?.filterActive])

  const columns = [
    {
      title: () =>
      (
        (isEdit && dataSource.length > 0) && <Checkbox checked={selectData.length === dataSource.length} onChange={() => onSelectAll()} />
      ),
      render: (text, record, index) => {
        if (isEdit) {
          let isChecked = false
          selectData.forEach((item) => {
            if (item == record.key) {
              isChecked = true
            }
          })
          return <Checkbox checked={isChecked} onChange={() => onSelect(record)} />
        }
      },
      width: 40
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">序号</div>
        </div>
      ),
      dataIndex: 'orderNum',
      width: 60
    },
    {
      title: () => (
        <div className="title-wrapper">
          <div className="title">群组名称</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('group_name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'group_name') }} />
        </div>
      ),
      dataIndex: 'group_name',
      render: (text, record, index) => {
        if (isEdit || record.isCreate || record.isCopy) {
          return <Input type="default" placeholder="输入群组名称" defaultValue={record.group_name} onChange={(value) => onGroupNameInput(value, record)} />
        }
        if (!isEdit && !record.isCreate && !record.isCopy) {
          return <div>{record.group_name || '--'}</div>
        }
      },
      width: 200
    },
    {
      title: () => (
        <div className="title-wrapper">
          <div className="title">群组类型</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('group_type_name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'group_type_name') }} />
        </div>
      ),
      dataIndex: 'group_type_name',
      render: (text, record, index) => {
        if (record.isCreate) {
          return <Select type="default" options={groups} placeholder="选择群组" defaultValue={record.group_type_name} onChange={(value) => onSelectGroupType(record, value)} />
        }
        if (!record.isCreate) {
          return <div>{record.group_type_name || '--'}</div>
        }
      },
      width: 200
    },
    {
      title: () => (
        <div className="title-wrapper">
          <div className="title">所在空间</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('area_name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'area_name') }} />
        </div>
      ),
      dataIndex: 'area',
      render: (text, record, index) => {
        if (isEdit || record.isCreate || record.isCopy) {
          return <Select type="default" placeholder="选择空间" options={areas} defaultValue={record.area.name} onChange={(value) => onSelectArea(record, value)} />
        }
        if (!isEdit && !record.isCreate && !record.isCopy) {
          return <div>{record?.area?.name || '--'}</div>
        }
      },
      width: 200
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">设备数量</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('device_count') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'device_count') }} />
        </div>
      ),
      dataIndex: 'device_count',
      width: 120
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">操作</div>
        </div>
      ),
      // dataIndex: 'operate',
      render: (text, record, index) => {
        if (!isEdit && (record.isCopy || record.isCreate)) {
          return (
            <div className="operate-wrapper">
              <div className="copy" onClick={() => { onConfirm(record) }}>确定</div>
              <div className="detail" onClick={() => { onCancel(record) }}>取消</div>
            </div>
          )
        }
          return (
            <div className="operate-wrapper">
              <div className="copy" onClick={() => { onCopy(record) }}>复制</div>
              <div className="detail" onClick={() => { goToDetail(record.group_id) }}>详情</div>
            </div>
          )
      },
      width: 120
    },
    {
      title: () => {
        return isEdit ? (
          <Button type="blueButton" text="保存编辑" onClick={() => { saveGroup() }} />
        ) : (
          <Button type="blueButton" text="编辑群组" onClick={() => { editGroup() }} />
        )
      },
      width: 120
    }
  ]

  return (
    <div className={styles.groupManageWrapper}>
      <Table
        columns={columns}
        dataSource={dataSource}
        ref={tableRef}
        height="calc(100vh - 204px)"
      >
        {
          isEdit && (
            <Button type="whiteButton" text="取消保存" onClick={() => { cancelSaveGroup() }} style={{ position: 'absolute', left: '64px', bottom: '16px' }} />
          )
        }
        <Button type="blueButton" disabled={isEdit} text="创建群组" onClick={() => { createGroup() }} style={{ position: 'absolute', right: '64px', bottom: '16px' }} />
        {
          isEdit && (
            <Button type="whiteButton" text="删除群组" onClick={() => { deleteGroup() }} style={{ position: 'absolute', right: '168px', bottom: '16px' }} />
          )
        }
      </Table>
    </div>
  )
}
