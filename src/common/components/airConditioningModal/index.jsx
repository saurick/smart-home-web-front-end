import React, { useState, useRef, useEffect } from 'react'
import styles from './index.module.less'
import { SliderModalFrame } from '@/common/components/sliderModalFrame'
import { SliderModalButton } from '@/common/components/sliderModalButton'

export const AirConditioningModal = (props) => {
  const [gear, setGear] = useState(1)
  const [celsius, setCelsius] = useState(0)
  const [airMode, setAirMode] = useState(0)
  const [defineData15, setDefineData15] = useState({})
  const [defineData14, setDefineData14] = useState({})
  const [defineData17, setDefineData17] = useState({})

  const onDecrease = () => {
    const scaleData = celsius * defineData15.scale
    if (defineData15.min === celsius * defineData15.scale) return
    const cmd = scaleData - defineData15.step
    const tempCelsius = cmd / defineData15.scale
    setCelsius(tempCelsius)

    props.debounceRequest(cmd, 15, props.recordData)
  }

  const onIncrease = () => {
    const scaleData = celsius * defineData15.scale
    if (defineData15.max === celsius * defineData15.scale) return
    const cmd = scaleData + defineData15.step
    const tempCelsius = cmd / defineData15.scale
    setCelsius(tempCelsius)

    props.debounceRequest(cmd, 15, props.recordData)
  }

  const switchBackground = (current) => {
    const { childNodes } = current.parentNode.parentNode
    console.log(childNodes, 'childNodes')
    childNodes.forEach((item, index) => {
      item.childNodes[0].style.background = '#FFFFFF'
    })
    current.style.background = '#205AD2'
  }

  const onClickModeButton = (event, cmd) => {
    const current = event.target
    switchBackground(current)

    props.debounceRequest(cmd, 14, props.recordData)
  }

  const setGearSpeed = (speed) => {
    console.log(speed, 'speed')
    setGear(speed)

    props.debounceRequest(speed, 17, props.recordData)
  }

  useEffect(() => {
    let data = {}
    props.cmdData.forEach((item) => {
      if (item.cmd_type === 15) {
        data = item.define
        setDefineData15(item.define)
        const tempCelsius = props.recordData.target_temp / data.scale
        setCelsius(tempCelsius)
      }
      if (item.cmd_type === 14) {
        data = item.define
        setDefineData14(item.define)
        setAirMode(props.recordData.air_mode)
      }
      if (item.cmd_type === 17) {
        const { wind_speed } = props.recordData
        setGear(wind_speed)
        data = item.define
        setDefineData17(item.define)
      }
    })
  }, [props])

  return (
    <div className={styles.airConditioningModalWrapper}>
      <SliderModalFrame {...props}>
        <div className="temperature-adjust-wrapper">
          <div className="title">温度</div>
          <div className="input-wrapper">
            <SliderModalButton
              className="decrease-button"
              type="decreaseButton"
              onClick={() => { onDecrease() }}
            />
            {
              props.cmdData.length > 0 && props.cmdData.map((item) => {
                if (item.cmd_type === 15) {
                  return (
                    <div className="value-wrapper" key={item}>
                      <div className="value">{celsius}{item.define.unit}</div>
                    </div>
                  )
                }
              })
            }
            <SliderModalButton
              className="increase-button"
              type="increaseButton"
              onClick={() => { onIncrease() }}
            />
          </div>
        </div>
        <div className="mode-wrapper">
          <div className="title">模式</div>
          <div className="mode-button-wrapper">
            {
              props.cmdData.length > 0 && props.cmdData.map((cmdItem) => {
                if (cmdItem.cmd_type === 14) {
                  // console.log(cmdItem.define.mapping, 'cmdItem.define.mapping')
                  return Object.keys(cmdItem.define.mapping).map((item, index) => {
                    return (
                      <SliderModalButton
                        key={item}
                        className="refrigerate-button"
                        type="modeButton"
                        text={cmdItem.define.mapping[item]}
                        style={{ marginRight: (Number(item) !== Object.keys(cmdItem.define.mapping).length) && '10px', background: airMode === Number(item) && '#205AD2' }}
                        onClick={(event) => { onClickModeButton(event, item) }}
                      />
                    )
                  })
                }
              })
            }
          </div>
        </div>
        <div className="wind-velocity-wrapper">
          <div className="title">风速</div>
          <div className="gear-adjust-wrapper">
            <div className="gear-speed">{gear}档</div>
            <div className="gear-button-wrapper">
              {
                props.cmdData.length > 0 && props.cmdData.map((item) => {
                  if (item.cmd_type === 17) {
                    const keys = Object.keys(item.define.mapping)
                    if (keys.length === 2) {
                      return (
                        <React.Fragment key={item}>
                          <div className="low2" onClick={() => { setGearSpeed(1) }} style={{ background: gear >= 1 && '#205AD2' || '#E8ECFA' }} />
                          <div className="high2" onClick={() => { setGearSpeed(3) }} style={{ background: gear == 3 && '#205AD2' || '#E8ECFA' }} />
                        </React.Fragment>
                      )
                    }
                    if (keys.length === 3) {
                      return (
                        <React.Fragment key={item}>
                          <div className="low3" onClick={() => { setGearSpeed(1) }} style={{ background: gear >= 1 && '#205AD2' || '#E8ECFA' }} />
                          <div className="middle3" onClick={() => { setGearSpeed(2) }} style={{ background: gear >= 2 && '#205AD2' || '#E8ECFA' }} />
                          <div className="high3" onClick={() => { setGearSpeed(3) }} style={{ background: gear == 3 && '#205AD2' || '#E8ECFA' }} />
                        </React.Fragment>
                    )
                    }
                    if (keys.length === 5) {
                      return (
                        <React.Fragment key={item}>
                          <div className="low5" onClick={() => { setGearSpeed(1) }} style={{ background: gear >= 1 && '#205AD2' || '#E8ECFA' }} />
                          <div className="low-middle5" onClick={() => { setGearSpeed(2) }} style={{ background: gear >= 2 && '#205AD2' || '#E8ECFA' }} />
                          <div className="middle5" onClick={() => { setGearSpeed(3) }} style={{ background: gear >= 3 && '#205AD2' || '#E8ECFA' }} />
                          <div className="middle-high5" onClick={() => { setGearSpeed(4) }} style={{ background: gear >= 4 && '#205AD2' || '#E8ECFA' }} />
                          <div className="high5" onClick={() => { setGearSpeed(5) }} style={{ background: gear == 5 && '#205AD2' || '#E8ECFA' }} />
                        </React.Fragment>
                      )
                    }
                  }
                })
              }
            </div>
            <div className="placeholder-div" />
          </div>
        </div>
      </SliderModalFrame>
    </div>
  )
}
