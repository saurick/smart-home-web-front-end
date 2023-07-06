import React, { useRef, forwardRef } from 'react'
import styles from './index.module.less'

export const SliderModalButton = forwardRef(({ ...props }, ref) => {
  const onClickButton = (event) => {
    event.stopPropagation()
    props.onClick(event)
  }

  return (
    <div className={styles.sliderModalButtonWrapper} onClick={(event) => { onClickButton(event) }} ref={ref}>
      {
        props.type === 'upOpenButton' && (
          <button className="up-open-button">
            <div className="top" />
            <div className="bottom" />
          </button>
        )
      }
      {
        props.type === 'downOpenButton' && (
          <button className="down-open-button">
            <div className="top" />
            <div className="bottom" />
          </button>
        )
      }
      {
        props.type === 'openButton' && (
          <button className="open-button">
            <div className="left" />
            <div className="right" />
          </button>
        )
      }
      {
        props.type === 'closeButton' && (
          <button className="close-button">
            <div className="left" />
            <div className="right" />
          </button>
        )
      }
      {
        props.type === 'lightTransmissionOpenButton' && (
          <button className="light-transmission-open-button">
            <div className="left" />
            <div className="middle" />
            <div className="right" />
          </button>
        )
      }
      {
        props.type === 'lightTransmissionCloseButton' && (
          <button className="light-transmission-close-button">
            <div className="icon" />
          </button>
        )
      }
      {
        props.type === 'stopButton' && (
          <button className="stop-button">
            <div className="left" />
            <div className="right" />
          </button>
        )
      }
      {
        props.type === 'decreaseButton' && (
          <button className="decrease-button">
            <div className="icon" />
          </button>
        )
      }
      {
        props.type === 'increaseButton' && (
          <button className="increase-button">
            <div className="icon-vertical" />
            <div className="icon-horizontal" />
          </button>
        )
      }
      {
        props.type === 'modeButton' && (
          <button className="mode-button" style={props.style}>
            {props.text}
          </button>
        )
      }
    </div>
  )
})
