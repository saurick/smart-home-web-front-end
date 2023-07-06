import React, { useEffect, useState, useCallback } from 'react'
import styles from './index.module.less'
import { SliderModalFrame } from '@/common/components/sliderModalFrame'
import { Slider } from '@/common/components/slider'
import { Input } from '@/common/components/input'
import { int2hex } from '@/common/utils/util'
import { hsvToRgb, rgbToHsv } from '@/common/utils/color'

export const CorlorfulLightModal = (props) => {
  const [hPickerValue, setHPickerValue] = useState(0)
  const [lightValue, setLightValue] = useState(0)
  const [rgbValue, setRgbValue] = useState({ R: 0, G: 0, B: 0 })
  const [whiteValue, setWhiteValue] = useState(0)
  const [defineData3, setDefineData3] = useState({})

  const onHueSliderChange = (value) => {
    const { rValue, gValue, bValue } = hsvToRgb(value / 360, 1, 1)

    const cmd = int2hex(rValue) + int2hex(gValue) + int2hex(bValue) + int2hex(whiteValue)
    props.debounceRequest(cmd, 6, props.recordData)

    setRgbValue({ R: rValue, G: gValue, B: bValue })
    setHPickerValue(value)
  }

  const changeRValue = (value) => {
    if (value > 255) return
    const { h } = rgbToHsv(value, rgbValue.G, rgbValue.B)
    setHPickerValue(h)
    setRgbValue({ R: value, G: rgbValue.G, B: rgbValue.B })

    const cmd = int2hex(value) + int2hex(rgbValue.G) + int2hex(rgbValue.B) + int2hex(whiteValue)
    props.debounceRequest(cmd, 6, props.recordData)
  }
  const changeGValue = (value) => {
    if (value > 255) return
    const { h } = rgbToHsv(rgbValue.R, value, rgbValue.B)
    setHPickerValue(h)
    setRgbValue({ ...rgbValue, G: value })

    const cmd = int2hex(rgbValue.R) + int2hex(value) + int2hex(rgbValue.B) + int2hex(whiteValue)
    props.debounceRequest(cmd, 6, props.recordData)
  }
  const changeBValue = (value) => {
    if (value > 255) return
    const { h } = rgbToHsv(rgbValue.R, rgbValue.G, value)
    setHPickerValue(h)
    setRgbValue({ ...rgbValue, B: value })

    const cmd = int2hex(rgbValue.R) + int2hex(rgbValue.G) + int2hex(value) + int2hex(whiteValue)
    props.debounceRequest(cmd, 6, props.recordData)
  }

  const changeWValue = (value) => {
    setWhiteValue(value)

    const cmd = int2hex(rgbValue.R) + int2hex(rgbValue.G) + int2hex(rgbValue.B) + int2hex(value)
    props.debounceRequest(cmd, 6, props.recordData)
  }

  useEffect(() => {
    let red; let green; let blue; let
      white
    props.cmdData.length > 0 && props.cmdData.forEach((item) => {
      if (item.cmd_type === 3) {
        setDefineData3(item.define)
        const value = Math.round(props.recordData.brightness / item.define.max * 100)
        setLightValue(value)
      }
      if (item.cmd_type === 8) {
        red = props.recordData.red
        // setRgbValue({...rgbValue, R: red})
      }
      if (item.cmd_type === 9) {
        green = props.recordData.green
        // setRgbValue({...rgbValue, G: green})
      }
      if (item.cmd_type === 10) {
        blue = props.recordData.blue
      }
      if (item.cmd_type === 11) {
        white = props.recordData.white
        setWhiteValue(white)
      }
    })
    setRgbValue({ R: red, G: green, B: blue })
    console.log(red, green, blue, white)
    const { h } = rgbToHsv(red, green, blue)
    setHPickerValue(h)
  }, [props])

  const onLightSliderChange = (value) => {
    const newValue = Math.round(value * defineData3.max / 100)
    setLightValue(value)
    props.debounceRequest(newValue, 3, props.recordData)
  }

  return (
    <div className={styles.corlorfulLightModalWrapper}>
      <SliderModalFrame {...props}>
        {
          props.cmdData.length > 0 && props.cmdData.map((item) => {
            if (item.cmd_type === 3) {
              return (
                <Slider
                  key={item}
                  style={{ marginTop: '29px' }}
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

        <Slider
          style={{ marginTop: '38px' }}
          title="幻彩"
          min={0}
          max={360}
          trackOrRail="rail"
          onChange={(value) => onHueSliderChange(value)}
          value={hPickerValue}
          background="linear-gradient(to right, #FF3F04, #FFE600, #00FF19, #00FFFF, #0500FF, #FA00FF, #FF0000"
        />
        <div className="increase-decrease-button-outer-wrapper">
          {
            props.cmdData.length > 0 && props.cmdData.map((item) => {
              if (item.cmd_type === 8) {
                return (
                  <Input type="increase-decrease-input" title="R" max={255} min={0} value={rgbValue.R} onChange={(value) => { changeRValue(value) }} key={item} />

                )
              }
            })
          }
          {
            props.cmdData.length > 0 && props.cmdData.map((item) => {
              if (item.cmd_type === 9) {
                return (
                  <Input type="increase-decrease-input" title="G" max={255} min={0} value={rgbValue.G} onChange={(value) => { changeGValue(value) }} key={item} />

                )
              }
            })
          }
          {
            props.cmdData.length > 0 && props.cmdData.map((item) => {
              if (item.cmd_type === 10) {
                return (
                  <Input type="increase-decrease-input" title="B" max={255} min={0} value={rgbValue.B} onChange={(value) => { changeBValue(value) }} key={item} />
                )
              }
            })
          }
          {
            props.cmdData.length > 0 && props.cmdData.map((item) => {
              if (item.cmd_type === 11) {
                return (
                  <Input type="increase-decrease-input" title="W" max={255} min={0} value={whiteValue} onChange={(value) => { changeWValue(value) }} key={item} />
                )
              }
            })
          }
        </div>
      </SliderModalFrame>
    </div>
  )
}
