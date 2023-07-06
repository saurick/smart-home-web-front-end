import React, { useRef } from 'react'
import { observer } from 'mobx-react-lite'
import styles from './index.module.less'
import { SliderModalHeader } from '@/common/components/sliderModalHeader'

import { useClickAway } from '@/common/hooks'

export const SliderModalFrame = observer(({ children, ...props }) => {
  const modalRef = useRef(null)

  useClickAway(props.showModalRef, modalRef, () => { props.setShowParamsSettings('') })

  return (
    <>
      <div className="mask" style={props.maskStyle} />
      <div className={styles.slideModalWrapper} style={props.sliderModalStyles} ref={modalRef}>
        <SliderModalHeader {...props} />
        {children}
      </div>
    </>
  )
})
