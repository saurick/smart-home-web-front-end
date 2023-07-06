import React, { useState, useEffect, useCallback } from 'react'
import styles from './index.module.less'
import { SliderModalFrame } from '@/common/components/sliderModalFrame'
import { Slider } from '@/common/components/slider'
import { SliderModalButton } from '@/common/components/sliderModalButton'

export const DreamCurtainModal = (props) => {
  const [isOpenStop, setIsOpenStop] = useState(false)
  const [islightTransmissionOpenStop, setIslightTransmissionOpenStop] = useState(false)
  const [islightTransmissionCloseStop, setIslightTransmissionCloseStop] = useState(false)
  const [isCloseStop, setIsCloseStop] = useState(false)
  const [lightTransmissionValue, setLightTransmissionValue] = useState(0)
  const [openCloseValue, setOpenCloseValue] = useState(0)
  const [defineData2, setDefineData2] = useState({})
  const [defineData29, setDefineData29] = useState({})

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
  const changeLightTransmissionOpenStatus = () => {
    let cmd
    if (!islightTransmissionOpenStop) {
      cmd = 1
    }
    if (islightTransmissionOpenStop) {
      cmd = 2
    }

    props.debounceRequest(cmd, 28, props.recordData)

    setIslightTransmissionOpenStop(!islightTransmissionOpenStop)
  }
  const changeLightTransmissionClosStatus = () => {
    let cmd
    if (!islightTransmissionCloseStop) {
      cmd = 0
    }
    if (islightTransmissionCloseStop) {
      cmd = 2
    }

    props.debounceRequest(cmd, 28, props.recordData)

    setIslightTransmissionCloseStop(!islightTransmissionCloseStop)
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

  const onLightTransmissionSliderChange = (value) => {
    props.debounceRequest(value, 29, props.recordData)
    setLightTransmissionValue(value)
  }

  const onOpenCloseSliderChange = (value) => {
    props.debounceRequest(value, 2, props.recordData)
    setOpenCloseValue(value)
  }

  useEffect(() => {
    props.cmdData.length > 0 && props.cmdData.forEach((item) => {
      if (item.cmd_type === 2) {
        setDefineData2(item.define)
        setOpenCloseValue(props.recordData.open_level)
      }
      if (item.cmd_type === 29) {
        setDefineData29(item.define)
        setLightTransmissionValue(props.recordData.brightness_open_level)
      }
    })
  }, [props])

  return (
    <div className={styles.dreamCurtainModalWrapper}>

      <SliderModalFrame {...props}>
        {
          props.cmdData.length > 0 && props.cmdData.map((item) => {
            if (item.cmd_type === 29) {
              return (
                <Slider
                  key={item}
                  style={{ marginTop: '30px' }}
                  title="透光度"
                  trackOrRail="track"
                  background="#7AD2DE"
                  min={defineData29.min}
                  max={defineData29.max}
                  isPercentage
                  value={lightTransmissionValue}
                  onChange={(value) => onLightTransmissionSliderChange(value)}
                />
              )
            }
          })
        }
        {
          props.cmdData.length > 0 && props.cmdData.map((item) => {
            if (item.cmd_type === 2) {
              return (
                <Slider
                  key={item}
                  style={{ marginTop: '30px' }}
                  title="开合度"
                  trackOrRail="track"
                  min={defineData2.min}
                  max={defineData2.max}
                  isPercentage
                  value={openCloseValue}
                  onChange={(value) => onOpenCloseSliderChange(value)}
                />
              )
            }
          })
        }

        <div className="dream-curtain-button-wrapper">
          <SliderModalButton
            type={isOpenStop ? 'stopButton' : 'openButton'}
            onClick={() => { changeOpenStatus() }}
          />
          <SliderModalButton
            type={islightTransmissionOpenStop ? 'stopButton' : 'lightTransmissionOpenButton'}
            onClick={() => { changeLightTransmissionOpenStatus() }}
          />
          <SliderModalButton
            type={islightTransmissionCloseStop ? 'stopButton' : 'lightTransmissionCloseButton'}
            onClick={() => { changeLightTransmissionClosStatus() }}
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
