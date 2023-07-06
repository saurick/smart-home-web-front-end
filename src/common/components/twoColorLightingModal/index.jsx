import React, { useEffect, useState, useCallback } from 'react'
import styles from './index.module.less'
import { SliderModalFrame } from '@/common/components/sliderModalFrame'
import { Slider } from '@/common/components/slider'

export const TwoColorLightingModal = (props) => {
  const [lightValue, setLightValue] = useState(0)
  const [colorTemperatureValue, setColorTemperatureValue] = useState(0)
  const [defineData3, setDefineData3] = useState({})
  const [defineData4, setDefineData4] = useState({})

  const onLightSliderChange = (value) => {
    const newValue = Math.round(value * defineData3.max / 100)
    setLightValue(value)
    props.debounceRequest(newValue, 3, props.recordData)
  }
  const onColorTemperatureSliderChange = (value) => {
    props.debounceRequest(value, 4, props.recordData)
    setColorTemperatureValue(value)
  }

  useEffect(() => {
    props.cmdData.length > 0 && props.cmdData.forEach((item) => {
      if (item.cmd_type === 3) {
        setDefineData3(item.define)
        const value = Math.round(props.recordData.brightness / item.define.max * 100)
        setLightValue(value)
      }
      if (item.cmd_type === 4) {
        setDefineData4(item.define)
        setColorTemperatureValue(props.recordData.cct)
      }
    })
  }, [])

  return (
    <div className={styles.twoColorLightingModal}>
      <SliderModalFrame {...props}>
        {
          props.cmdData.length > 0 && props.cmdData.map((item) => {
            if (item.cmd_type === 3) {
              return (
                <Slider
                  key={item}
                  style={{ marginTop: '47px' }}
                  title="亮度"
                  min={1}
                  max={100}
                  trackOrRail="track"
                  isPercentage
                  value={lightValue}
                  onChange={(value) => onLightSliderChange(value)}
                />
              )
            }
          })
        }
        {
          props.cmdData.length > 0 && props.cmdData.map((item) => {
            if (item.cmd_type === 4) {
              return (
                <Slider
                  key={item}
                  style={{ marginTop: '44px' }}
                  title="色温"
                  min={defineData4.min}
                  max={defineData4.max}
                  trackOrRail="rail"
                  background="linear-gradient(to right, #F1F4FF, #FFECC8"
                  value={colorTemperatureValue}
                  onChange={(value) => onColorTemperatureSliderChange(value)}
                />
              )
            }
          })
        }
      </SliderModalFrame>
    </div>
  )
}
