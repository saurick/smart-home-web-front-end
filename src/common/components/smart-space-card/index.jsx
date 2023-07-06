import React, { useState, forwardRef } from 'react'
import styles from './index.module.less'
import { Modal } from '@/common/components/modal'
import { Input } from '@/common/components/input'
import { Button } from '@/common/components/button'

export const SmartSpaceCard = forwardRef((props, ref) => {
  const [areaId, setAreaId] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  const onComfirmModal = () => {
    props.getDeleteItemIndex(props.index, areaId)
    setShowModal(false)
  }

  const onCancelModal = () => {
    setShowModal(false)
  }

  const onDeleteCard = (event, area_id, name) => {
    event.stopPropagation()
    setShowModal(true)
    setAreaId(area_id)

    const title = (
      <div className="modal-title">
        <span style={{ whiteSpace: 'nowrap' }}>确定删除空间</span>
        <span className="area-name">“{name}”</span>
        <span>吗？</span>
      </div>
    )
    setModalTitle(title)
  }

  const onClickCard = (area_id) => {
    props.onClick && props.onClick(area_id)
  }

  return (
    <div className={styles.smartSpaceCardWrapper} onClick={() => { onClickCard(props.data.area_id) }}>
      <div className={props.isEdit ? 'edit' : 'default'}>
        {
          props.isEdit && (
            <div className="delete-wrapper" onClick={(event) => { onDeleteCard(event, props.data.area_id, props.data.name) }}>
              <div className="delete">删除</div>
            </div>

          )
        }
        <div className="name-wrapper">
          <div className="name">名称</div>
          {
            props.isEdit ? (
              <Input type="default" placeholder="输入名称" defaultValue={props.data.name} onChange={(value) => { props.onNameInput(value, props.index) }} />
            ) : (
              <div className="name-value">{props.data.name}</div>
            )
          }
        </div>
        <div className="alias-wrapper">
          <div className="alias">别名</div>
          {
            props.isEdit ? (
              <Input type="default" placeholder="输入别名" defaultValue={props.data.address} onChange={(value) => { props.onAliasInput(value, props.index) }} />
            ) : (
              <div className="alias-value">{props.data.address}</div>
            )
          }
        </div>
        <div className={props.isEdit ? 'footer-wrapper-edit' : 'footer-wrapper-default'}>
          <div className={props.isEdit ? 'room-wrapper-edit' : 'room-wrapper-default'}>
            <div className="room">房间</div>
            <div className="room-num">{props.data.roomNum}</div>
          </div>
          <div className="online-wrapper">
            <div className="online">在线</div>
            <div className="online-amount">{props.data.online_count}</div>
          </div>
          <div className="offline-wrapper">
            <div className="offline">离线</div>
            <div className="offline-amount">{props.data.offline_count}</div>
          </div>
        </div>
      </div>

      <Modal showModal={showModal} title={modalTitle} titlePosition="left" buttonPosition="right">
        <Button type="whiteButton" text="取 消" onClick={() => { onCancelModal() }} style={{ width: '64px', marginRight: '8px' }} />
        <Button type="blueButton" text="确 定" onClick={() => { onComfirmModal() }} style={{ width: '64px' }} />
      </Modal>
    </div>
  )
})
