import React from 'react'
import styles from './index.module.less'
import { isUndefined } from '@/common/utils/util'
import { TipIcon, SuccessfulIcon, FailedIcon } from '@/common/components/icons'

export const Modal = (props) => {
    return (
      <div className={styles.modalWrapper} {...props}>
        {
                props.showModal && (
                <>
                  <div className="mask" />
                  <div className="modal-outer-wrapper">
                    <div className="modal-wrapper">
                      <div className={props.titlePosition === 'left' ? 'title-outer-wrapper-left' : 'title-outer-wrapper-center'}>
                        <div className="title-wrapper">
                          {
                                            props.icon === 'successful' && (
                                            <SuccessfulIcon style={{ width: '19px', height: '19px' }} />
                                            )
                                        }
                          {
                                            (isUndefined(props.icon) || props.icon === 'tip') && (
                                            <TipIcon />
                                            )
                                        }
                          {
                                            props.icon === 'failed' && (
                                            <FailedIcon style={{ width: '19px', height: '19px' }} />
                                            )
                                        }
                          <div className="title">{props.title || ''}</div>
                        </div>
                      </div>
                      <div className={props.buttonPosition ? props.buttonPosition : 'center'}>
                        {props.children}
                      </div>
                    </div>
                  </div>
                </>
                )
            }
      </div>
    )
}
