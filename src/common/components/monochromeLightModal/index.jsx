import React, { useState, useEffect, useCallback } from 'react'
import styles from './index.module.less'
import { SliderModalFrame } from '@/common/components/sliderModalFrame'
import { Slider } from '@/common/components/slider'

export const MonochromeLightModal = (props) => {
  const [lightValue, setLightValue] = useState(0)
  const [defineData3, setDefineData3] = useState({})

  const onLightSliderChange = (value) => {
    const newValue = Math.round(value * defineData3.max / 100)
    setLightValue(value)
    props.debounceRequest(newValue, 3, props.recordData)
  }

  useEffect(() => {
    props.cmdData.length > 0 && props.cmdData.forEach((item) => {
      if (item.cmd_type === 3) {
        setDefineData3(item.define)
        const value = Math.round(props.recordData.brightness / item.define.max * 100)
        setLightValue(value)
      }
    })
  }, [props])

  return (
    <div className={styles.monochromeLightModalWrapper}>
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
      </SliderModalFrame>
    </div>
  )
}
