import React, { useState, useEffect } from 'react'
import styles from './index.module.less'
import { sleep } from '@/common/utils/util'
import { SuccessfulIcon, WarningIcon, FailedIcon } from '@/common/components/icons'

export const Toast = ({ toastProps, ...props }) => {
    const [showToast, setShowToast] = useState(false)

    const autoCloseToastDuration = async (duration) => {
        await sleep(duration)
        setShowToast(false)
    }

    useEffect(() => {
        console.log(toastProps.showToast, 'toastProps.showToast')
        setShowToast(!!toastProps.showToast)
        autoCloseToastDuration(toastProps.duration || 3000)
    }, [toastProps])

    return (
      <>
        {
                showToast && (
                <div className={styles.toastWrapper} {...props}>
                  <div className="toast-wrapper">
                    {
                                    (toastProps.type === 'successful' || !toastProps.type) && <SuccessfulIcon />
                                }
                    {
                                    toastProps.type === 'warning' && <WarningIcon />
                                }
                    {
                                    toastProps.type === 'failed' && <FailedIcon />
                                }
                    <div className="content">{toastProps.content || ''}</div>
                  </div>
                </div>
                )
            }
      </>
    )
}
