import React, { useState, useEffect, useCallback } from 'react'
import styles from './index.module.less'
import { SliderModalFrame } from '@/common/components/sliderModalFrame'
import { Slider } from '@/common/components/slider'
import { SliderModalButton } from '@/common/components/sliderModalButton'

export const RollerBlindModal = (props) => {
  const [isUpOpenStop, setIsUpOpenStop] = useState(false)
  const [isDownOpenStop, setIsDownOpenStop] = useState(false)
  const [lightValue, setLightValue] = useState(0)
  const [defineData2, setDefineData2] = useState({})

  const changeUpOpenStatus = () => {
    let cmd
    if (!isUpOpenStop) {
      cmd = 1
    }
    if (isUpOpenStop) {
      cmd = 2
    }

    props.debounceRequest(cmd, 1, props.recordData)

    setIsUpOpenStop(!isUpOpenStop)
  }
  const changeDownOpenStatus = () => {
    let cmd
    if (!isDownOpenStop) {
      cmd = 0
    }
    if (isDownOpenStop) {
      cmd = 2
    }

    props.debounceRequest(cmd, 1, props.recordData)

    setIsDownOpenStop(!isDownOpenStop)
  }

  const onLightSliderChange = (value) => {
    props.debounceRequest(value, 2, props.recordData)
    setLightValue(value)
  }

  useEffect(() => {
    props.cmdData.length > 0 && props.cmdData.forEach((item) => {
      if (item.cmd_type === 2) {
        setDefineData2(item.define)
        setLightValue(props.recordData.open_level)
      }
    })
  }, [props])

  return (
    <div className={styles.rollerBlindModalWrapper}>
      <SliderModalFrame {...props}>
        {
          props.cmdData.length > 0 && props.cmdData.map((item) => {
            if (item.cmd_type === 2) {
              return (
                <Slider
                  key={item}
                  style={{ marginTop: '40px' }}
                  title="开合度"
                  min={defineData2.min}
                  max={defineData2.max}
                  trackOrRail="track"
                  isPercentage
                  value={lightValue}
                  onChange={(value) => onLightSliderChange(value)}
                />
              )
            }
          })
        }
        <div className="roller-blind-button-wrapper">
          <SliderModalButton type={isUpOpenStop ? 'stopButton' : 'upOpenButton'} onClick={() => { changeUpOpenStatus() }} />
          <SliderModalButton type={isDownOpenStop ? 'stopButton' : 'downOpenButton'} onClick={() => { changeDownOpenStatus() }} />
        </div>
      </SliderModalFrame>
    </div>
  )
}
