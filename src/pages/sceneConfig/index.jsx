import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from 'antd'
import styles from './index.module.less'
import { Table } from '@/common/components/table'
import { FilterIcon } from '@/common/components/icons'
import { Button } from '@/common/components/button'
import { Input } from '@/common/components/input'
import { Select } from '@/common/components/select'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { getContext } from '@/common/stores'
import { Modal } from '@/common/components/modal'

export const SceneConfig = () => {
  const navigate = useNavigate()
  const tableRef = useRef(null)
  const [isEdit, setIsEdit] = useState(false)
  const [selectData, setSelectData] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [initialData, setInitialData] = useState([])
  const [areas, setAreas] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [sceneOptions, setSceneOptions] = useState([
    {
      value: 0,
      label: '普通场景'
    },
    {
      value: 1,
      label: '时光场景'
    }
  ])

  const context = getContext()

  const editScene = () => {
    const data = JSON.parse(JSON.stringify(dataSource))
    setInitialData([...data])
    setIsEdit(true)
  }

  const goToDetail = (record) => {
    if (record.type === 1) {
      navigate('/scene-config/scene-time', { state: { scene_id: record.scene_id } })
    }
    if (record.type === 0) {
      navigate('/scene-config/scene-normal', { state: { scene_id: record.scene_id } })
    }
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

  const onSelectScene = (record, value) => {
    let name = ''
    sceneOptions.forEach((item) => {
      if (item.value === value) {
        name = item.label
      }
    })
    dataSource.forEach((dataItem, dataIndex) => {
      if (dataItem.key === record.key) {
        dataSource[dataIndex].type = value
        dataSource[dataIndex].type_name = name
      }
    })
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
        dataSource[dataIndex].area.name = name
        dataSource[dataIndex].scene_area_id = value
      }
    })
    setDataSource([...dataSource])
  }

  const onSceneNameInput = (value, record) => {
    dataSource.forEach((item, index) => {
      if (item.key == record.key) {
        dataSource[index].scene_name = value
      }
    })
    setDataSource([...dataSource])
  }

  const onConfirmModal = () => {
    setShowModal(false)
  }

  const onCopy = async (record) => {
    setShowModal(true)
    setModalTitle('正在复制中，请等待')

    let addObj = {}
    addObj = JSON.parse(JSON.stringify(record))
    delete addObj.area
    delete addObj.orderNum
    delete addObj.key
    delete addObj.area_name
    delete addObj.scene_id
    const addRpc = new JsonRpc('add_scene')
    const addResult = await addRpc.fetchData({ ...addObj })
    console.log(addResult, 'addResult')

    const obj = JSON.parse(JSON.stringify(record))
    delete obj.area
    delete obj.orderNum
    delete obj.key
    delete obj.area_name
    obj.scene_id = addResult.scenes[0].scene_id

    const updateRpc = new JsonRpc('update_scene')
    const updateResult = await updateRpc.fetchData({ ...obj })
    const newScene = updateResult.scenes[0]
    newScene.key = dataSource.length
    newScene.orderNum = String(dataSource.length + 1).padStart(3, '0')
    newScene.isCopy = true
    if (newScene.type === 0) {
      newScene.type_name = '普通场景'
    }
    if (newScene.type === 1) {
      newScene.type_name = '时光场景'
    }
    setDataSource((dataSource) => [...dataSource, newScene])

    const detailRpc = new JsonRpc('query_scene_detail_by_scene_id_ex2')
    const detailResult = await detailRpc.fetchData({ scene_id: record.scene_id })
    const { scene_list } = detailResult
    scene_list[0].scene_id = newScene.scene_id

    const saveRpc = new JsonRpc('strict_save_scenes_detail_ex2')
    const saveResult = await saveRpc.fetchData({ scene_list })

    setModalTitle('复制成功')
  }

  const onConfirm = async (record) => {
    const obj = {}
    dataSource.map((item, index) => {
      if (item.key === record.key) {
        obj.type = item.type
        obj.scene_name = item.scene_name
        obj.fade_time = 15
        obj.scene_area_id = item.scene_area_id
      }
    })
    const addRpc = new JsonRpc('add_scene')
    const addResult = await addRpc.fetchData({ ...obj })

    dataSource.forEach((item, index) => {
      if (item.key === record.key) {
      
        dataSource[index] = JSON.parse(JSON.stringify(addResult.scenes[0]))
        dataSource[index].isCreate = false
        dataSource[index].key = dataSource.length - 1
        dataSource[index].orderNum = String(dataSource.length).padStart(3, '0')
        if (dataSource[index].type === 0) {
          dataSource[index].type_name = '普通场景'
        }
        if (dataSource[index].type === 1) {
          dataSource[index].type_name = '时光场景'
        }
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

  const saveScene = async () => {
    const dataSourceCopy = JSON.parse(JSON.stringify(dataSource))
    const scenes = []
    dataSourceCopy.forEach((item) => {
      delete item.area
      delete item.orderNum
      delete item.key
      scenes.push(item)
    })

    const updateRpc = new JsonRpc('update_scenes')
    const updateResult = await updateRpc.fetchData({ scenes })

    dataSource.map((item) => {
      item.isCopy = false
      return item
    })
    setDataSource([...dataSource])
    setIsEdit(false)
  }

  const cancelSaveScene = () => {
    initialData.forEach((item) => {
      if (item.isCopy) {
        item.isCopy = false
      }
    })
    setDataSource([...initialData])
    setIsEdit(false)
  }

  const createScene = () => {
    let data = {}
    data.area = {
      address: '',
      area_id: 0,
      gw_id: '',
      icon: 0,
      name: ''
    }
    data.actions = []
    data.scene_area_id = 0
    data.cycle = 0
    data.fade_time = 15
    data.group_id = ''
    data.icon = 0
    data.invisible = 0
    data.loop = 0
    data.orderNum = String(dataSource.length + 1).padStart(3, '0')
    data.scene_id = 0
    data.scene_name = ''
    data.status = 0
    data.type = 0
    data.type_name = '普通场景'
    data.key = dataSource.length
    data.isCreate = true
    setDataSource((dataSource) => [...dataSource, data])
  }

  const deleteScene = async () => {
    const scene_id_list = []
    let data = []
    data = dataSource
    selectData.forEach((item) => {
      dataSource.forEach((dataItem, dataIndex) => {
        if (dataItem.key == item) {
          dataSource.splice(dataIndex, 1)
          scene_id_list.push(dataItem.scene_id)
        }
      })
    })
    const rpc = new JsonRpc('delete_scenes')
    const result = await rpc.fetchData({ scene_id_list })
    setSelectData([])
    setDataSource([...dataSource])
  }

  const onExecute = async (record) => {
    const obj = {}
    obj.group_id = record.group_id
    obj.scene_id = record.scene_id
    const rpc = new JsonRpc('exec_scene')
    const result = await rpc.fetchData({ ...obj })
  }

  const queryAllScene = async () => {
    const rpc = new JsonRpc('query_all_scene')
    const result = await rpc.fetchData()
    const { scenes } = result
    scenes.forEach((item, index) => {
      if (item.type === 0) {
        scenes[index].type_name = '普通场景'
      }
      if (item.type === 1) {
        scenes[index].type_name = '时光场景'
      }
    })
    setDataSource(scenes)
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
    queryAllScene()
    queryAreas()
  }, [])

  const columns = [
    {
      title: () =>
      (
        isEdit && <Checkbox checked={selectData.length === dataSource.length} onChange={(event) => onSelectAll(event)} />
      ),
      width: 60,
      render: (text, record, index) => {
        if (isEdit) {
          let isChecked = false
          selectData.forEach((item) => {
            if (item == record.key) {
              isChecked = true
            }
          })
          return <Checkbox checked={isChecked} onChange={(event) => onSelect(event, text, record, index)} />
        }
      }
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">序号</div>
        </div>
      ),
      width: 250,
      dataIndex: 'orderNum',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">场景类型</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('type_name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'type_name') }} />
        </div>
      ),
      width: 250,
      dataIndex: 'type',
      render: (text, record, index) => {
        if (record.isCreate) {
          return <Select options={sceneOptions} placeholder="选择场景" defaultValue={record.type_name} onChange={(value) => onSelectScene(record, value)} />
        }
        if (!record.isCreate) {
          return <div>{record.type_name}</div>
        }
      }
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">场景名称</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('scene_name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'scene_name') }} />
        </div>
      ),
      width: 250,
      dataIndex: 'scene_name',
      render: (text, record, index) => {
        if (isEdit || record.isCreate || record.isCopy) {
          return <Input type="default" placeholder="输入场景名称" defaultValue={record.scene_name} onChange={(value) => onSceneNameInput(value, record)} />
        }
        if (!isEdit && !record.isCreate && !record.isCopy) {
          return <div>{record.scene_name || '--'}</div>
        }
      }
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">所在空间</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('area_name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'area_name') }} />
        </div>
      ),
      width: 250,
      // dataIndex: 'locatedSpace',
      render: (text, record, index) => {
        if (isEdit || record.isCreate || record.isCopy) {
          return <Select options={areas} placeholder="选择空间" defaultValue={record?.area?.name} onChange={(value) => onSelectArea(record, value)} />
        }
        if (!isEdit && !record.isCreate && !record.isCopy) {
          return <div>{record?.area?.name || '--'}</div>
        }
      }
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">操作</div>
        </div>
      ),
      width: 250,
      render: (text, record, index) => {
        if (!isEdit && record.isCreate) {
          return (
            <div className="edit-scene-operate-wrapper">
              <div className="copy" onClick={() => { onConfirm(record) }}>确定</div>
              <div className="detail" onClick={() => { onCancel(record) }}>取消</div>
            </div>
          )
        } if (!isEdit && !record.isCopy && !record.isCreate) {
          return <Button type="tableButton" text="执 行" onClick={() => { onExecute(record) }} />
        }
        return (
          <div className="edit-scene-operate-wrapper">
            <div className="copy" onClick={() => { onCopy(record, index) }}>复制</div>
            <div className="detail" onClick={() => { goToDetail(record) }}>详情</div>
          </div>
        )
      }
    },
    {
      title: () => {
        return isEdit ? (
          (
            <Button type="blueButton" text="保存编辑" onClick={() => { saveScene() }} />
          )
        ) : (
          (
            <Button type="whiteButton" text="编辑场景" onClick={() => { editScene() }} />
          )
        )
      }
      ,
    },
  ]

  return (
    <div className={styles.sceneConfigWrapper}>
      <Table
        columns={columns}
        dataSource={dataSource}
        ref={tableRef}
        height="calc(100vh - 204px)"
      >
        {
          isEdit && (
            <>
              <Button type="whiteButton" text="取消保存" onClick={() => { cancelSaveScene() }} style={{ position: 'absolute', left: '64px', bottom: '16px' }} />
              <Button type="whiteButton" text="删除场景" onClick={() => { deleteScene() }} style={{ position: 'absolute', right: '168px', bottom: '16px' }} />
            </>
          )
        }
        <Button type="blueButton" text="创建场景" disabled={isEdit} onClick={() => { !isEdit && createScene() }} style={{ position: 'absolute', right: '64px', bottom: '16px' }} />
      </Table>

      <Modal showModal={showModal} icon={modalTitle === '复制成功' ? 'successful' : 'tip'} title={modalTitle} titlePosition="center" buttonPosition="center">
        {
          modalTitle === '复制成功' && (
            <Button type="blueButton" text="确 定" onClick={() => { onConfirmModal() }} style={{ width: '64px' }} />
          )
        }
      </Modal>
    </div>
  )
}
