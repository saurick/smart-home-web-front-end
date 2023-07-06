import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'
import { GoBackIcon } from '@/common/components/icons'

export const Button = (props) => {
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1)
  }

  return (
    <>
      {
        props.type === 'blueButton' && (
          <button className={props.disabled ? styles.blueButtonDisabled : styles.blueButton} {...props}>
            <div className={props.disabled ? styles.blueButtonTextDisabled : styles.blueButtonText} style={props.textstyle}>{props.text}</div>
          </button>
        )
      }
      {
        props.type === 'whiteButton' && (
          <button className={props.disabled ? styles.whiteButtonDisabled : styles.whiteButton} {...props}>
            {
              !!props.icon && (
                <div className={styles.icon}>
                  {props.icon}
                </div>
              )
            }
            <div className={props.disabled ? styles.whiteButtonTextDisabled : styles.whiteButtonText} style={props.textstyle}>{props.text}</div>
          </button>
        )
      }
      {
        props.type === 'tableButton' && (
          <button className={props.disabled ? styles.tableButtonDisabled : styles.tableButton} {...props}>
            <div className={props.disabled ? styles.tableButtonTextDisabled : styles.tableButtonText} style={props.textstyle}>{props.text}</div>
          </button>
        )
      }
      {
        props.type === 'goBackButton' && (
          <div className={styles.goBackWrapper} onClick={() => { goBack() }} {...props}>
            <GoBackIcon />
            <div className={styles.goBackText}>{props.text || '返回'}</div>
          </div>
        )
      }
    </>
  )
}
