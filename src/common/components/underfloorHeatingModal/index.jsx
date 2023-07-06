import React, { useState, useRef, useEffect } from 'react'
import styles from './index.module.less'
import { SliderModalFrame } from '@/common/components/sliderModalFrame'
import { SliderModalButton } from '@/common/components/sliderModalButton'

export const UnderfloorHeatingModal = (props) => {
  const [celsius, setCelsius] = useState(0)
  const [defineData15, setDefineData15] = useState({})

  const onDecrease = () => {
    console.log(defineData15.min, 'defineData15.min')
    console.log(props.recordData.target_temp, 'props.recordData.target_temp')
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

  useEffect(() => {
    let data = {}
    props.cmdData.forEach((item) => {
      if (item.cmd_type === 15) {
        data = item.define
        setDefineData15(item.define)
        const tempCelsius = props.recordData.target_temp / data.scale
        setCelsius(tempCelsius)
      }
    })
  }, [])

  return (
    <div className={styles.underfloorHeatingModal}>
      <SliderModalFrame {...props}>
        <div className="temperature-adjust-wrapper">
          <div className="title">温度</div>
          <div className="input-wrapper">
            <SliderModalButton className="decrease-button" type="decreaseButton" onClick={() => { onDecrease() }} />
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
            <SliderModalButton className="increase-button" type="increaseButton" onClick={() => { onIncrease() }} />
          </div>
        </div>

      </SliderModalFrame>
    </div>
  )
}
