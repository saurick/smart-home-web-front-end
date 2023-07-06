import React, { useEffect, useState, useCallback } from 'react'
import styles from './index.module.less'
import { SliderModalFrame } from '@/common/components/sliderModalFrame'
import { Slider } from '@/common/components/slider'
import { SliderModalButton } from '@/common/components/sliderModalButton'

export const CasementCurtainModal = (props) => {
  const [isOpenStop, setIsOpenStop] = useState(false)
  const [isCloseStop, setIsCloseStop] = useState(false)
  const [lightValue, setLightValue] = useState(0)
  const [defineData2, setDefineData2] = useState({})

  const changeOpenStatus = () => {
    let cmd
    if (!isOpenStop) {
      cmd = 1
    }
    if (isOpenStop) {
      cmd = 2
    }
    props.debounceRequest(cmd, 1, props.recordData)

    setIsOpenStop(!isOpenStop)
  }
  const changeCloseStatus = () => {
    let cmd
    if (!isCloseStop) {
       cmd = 0
    }
    if (isCloseStop) {
       cmd = 2
    }

    props.debounceRequest(cmd, 1, props.recordData)

    setIsCloseStop(!isCloseStop)
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
    <div className={styles.casementCurtainModalWrapper}>
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
        <div className="casement-curtain-button-wrapper">
          <SliderModalButton
            type={isOpenStop ? 'stopButton' : 'openButton'}
            onClick={() => { changeOpenStatus() }}
          />
          <SliderModalButton
            type={isCloseStop ? 'stopButton' : 'closeButton'}
            onClick={() => { changeCloseStatus() }}
          />
        </div>
      </SliderModalFrame>
    </div>
  )
}
