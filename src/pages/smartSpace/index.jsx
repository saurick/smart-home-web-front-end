import React, { useState, useEffect } from 'react'
import styles from './index.module.less'
import './index.less'
import { useNavigate } from 'react-router-dom'
import { SmartSpaceCard } from '@/common/components/smart-space-card'
import { Button } from '@/common/components/button'
import { Modal } from '@/common/components/modal'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { AddSpaceIcon } from '@/common/components/icons'
import { useCallbackPrompt } from '@/common/hooks'

export const SmartSpace = () => {
  const [dataSource, setDataSource] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [isEnterEditCard, setIsEnterEditCard] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(showModal)

  const navigate = useNavigate()

  const onEditSpace = () => {
    setIsEdit(true)
  }

  const getDeleteItemIndex = async (index, area_id) => {
    console.log(area_id, 'area_id')
    const rpc = new JsonRpc('delete_area')
    const result = await rpc.fetchData({ area_id })

    const temp = dataSource.filter((item, i) => {
      return i != index
    })
    setDataSource(temp)
  }

  const onNameInput = (value, index) => {
    dataSource[index].name = value
    setDataSource([...dataSource])

    setShowModal(true)
    setModalTitle('当前编辑未保存，需要保存吗？')
  }

  const onAliasInput = (value, index) => {
    dataSource[index].address = value
    setDataSource([...dataSource])

    setShowModal(true)
    setModalTitle('当前编辑未保存，需要保存吗？')
  }

  const updateAreas = async () => {
    const areas = []
    dataSource.forEach((item) => {
      const obj = {}
      obj.area_id = item.area_id
      obj.name = item.name
      obj.address = item.address
      areas.push(obj)
    })
    const rpc = new JsonRpc('update_areas')
    const result = await rpc.fetchData({ areas })
  }

  const onSaveSpace = () => {
    updateAreas()
    setDataSource([...dataSource])
    setIsEdit(false)
    setShowModal(false)
  }

  const onCancelModal = () => {
    confirmNavigation()
  }

  const onSaveModal = () => {
    onSaveSpace()
    confirmNavigation()
  }

  const editCardEnter = () => {
    setIsEnterEditCard(true)
  }
  const editCardLeave = () => {
    setIsEnterEditCard(false)
  }

  const addNewCard = async () => {
    const rpc = new JsonRpc('add_area')
    const result = await rpc.fetchData({ name: '', address: '', icon: 0 })
    console.log(result, 'result')
    console.log(dataSource, 'dataSource')
    const arr = dataSource.concat(result.areas)
    setDataSource([...arr])
  }

  const goToDetail = (area_id) => {
    if (!isEdit) {
      navigate('/smart-space/space-detail', { state: { area_id } })
    }
  }

  const queryAllAreas = async () => {
    const queryAreasRpc = new JsonRpc('query_areas_with_device_count')
    const queryAreasResult = await queryAreasRpc.fetchData()
    const { areas } = queryAreasResult
    console.log(queryAreasResult, 'queryAreasResult')
    setDataSource(areas)
  }

  useEffect(() => {
    queryAllAreas()
  }, [])

  return (
    <div className={styles.smartSpaceWrapper}>
      <div className="smart-space-card-wrapper">
        {
          dataSource.map((item, index) => {
            return (
              <SmartSpaceCard
                key={item.area_id}
                isEdit={isEdit}
                data={item}
                index={index}
                getDeleteItemIndex={getDeleteItemIndex}
                onNameInput={onNameInput}
                onAliasInput={onAliasInput}
                onClick={goToDetail}
              />
            )
          })
        }
        {
          isEdit && (
            <div
              className={isEnterEditCard ? 'add-card-wrapper-hover' : 'add-card-wrapper-default'}
              onMouseEnter={() => { editCardEnter() }}
              onMouseLeave={() => { editCardLeave() }}
              onClick={() => { addNewCard() }}
            >
              <AddSpaceIcon />
            </div>
          )
        }
        <div className="footer-wrapper">
          {
            isEdit ? (
              <Button type="blueButton" text="保存编辑" onClick={() => { onSaveSpace() }} style={{ position: 'fixed', right: '70px', bottom: '16px' }} />
            ) : (
              <Button type="blueButton" text="编辑空间" onClick={() => { onEditSpace() }} style={{ position: 'fixed', right: '70px', bottom: '16px' }} />
            )
          }
        </div>
      </div>

      <Modal showModal={showPrompt} title={modalTitle} titlePosition="left" buttonPosition="right">
        <Button type="whiteButton" text="取 消" onClick={() => { onCancelModal() }} style={{ width: '64px', marginRight: '8px' }} />
        <Button type="blueButton" text="保 存" onClick={() => { onSaveModal() }} style={{ width: '64px' }} />
      </Modal>
    </div>
  )
}
