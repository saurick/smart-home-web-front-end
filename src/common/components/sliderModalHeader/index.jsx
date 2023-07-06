import React from 'react'
import { EnvironmentOutlined } from '@ant-design/icons'
import styles from './index.module.less'

export const SliderModalHeader = (props) => {
  return (
    <div className={styles.sliderModalHeaderWrapper}>
      <div className="top-wrapper">
        <div className="device-name">{props.headerData.name}</div>
        <div className="located-space-wrapper">
          <EnvironmentOutlined className="icon" />
          <div className="located-space">{props.headerData.position}</div>
        </div>
      </div>
      <div className="bottom-wrapper">
        <div className="device-type">{props.headerData.dev_type_name}</div>
        <div className="mac-wrapper">
          <div className="title">MAC:&nbsp;</div>
          <div className="mac">{props.headerData.dev_id}</div>
        </div>
      </div>
    </div>
  )
}
