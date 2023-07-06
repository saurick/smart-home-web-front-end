import React, { useState, useRef, useEffect } from 'react'
import styles from './index.module.less'
import { SliderModalFrame } from '@/common/components/sliderModalFrame'
import { SliderModalButton } from '@/common/components/sliderModalButton'

export const FreshAirModal = (props) => {
  const [gear, setGear] = useState('')
  const dehumidifyButtonRef = useRef()
  const aiSupplyButtonRef = useRef()

  const setGearSpeed = (speed) => {
    setGear(speed)

    props.debounceRequest(speed, 17, props.recordData)
  }

  const switchBackground = (current) => {
    const { childNodes } = current.parentNode
    childNodes.forEach((item, index) => {
      item.childNodes[0].style.background = '#FFFFFF'
    })
    current.childNodes[0].style.background = '#205AD2'
  }

  const onClickDehumidifyButton = () => {
    const current = dehumidifyButtonRef?.current
    switchBackground(current)
  }

  const onClickAiSupplyButton = () => {
    const current = aiSupplyButtonRef?.current
    switchBackground(current)
  }

  useEffect(() => {
    const { wind_speed } = props.recordData
    setGear(wind_speed)
  }, [])

  return (
    <div className={styles.freshAirModalWrapper}>
      <SliderModalFrame {...props}>
        <div className="mode-wrapper">
          <div className="title">模式</div>
          <div className="mode-button-wrapper">
            <SliderModalButton
              className="dehumidify-button"
              type="modeButton"
              text="除湿"
              onClick={() => { onClickDehumidifyButton() }}
              ref={dehumidifyButtonRef}
              style={{ marginRight: '10px' }}
            />
            <SliderModalButton
              className="air-supply-button"
              type="modeButton"
              text="送风"
              onClick={() => { onClickAiSupplyButton() }}
              ref={aiSupplyButtonRef}
            />
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
