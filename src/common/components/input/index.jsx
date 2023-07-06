import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import { isUndefined } from '@/common/utils/util'
// import { SelectHoverIcon, SelectDefaultIcon } from '@/common/components/icons'

export const Input = ({ errorInfo, ...props }) => {
  const [brightness, setBrightness] = useState(0)
  const [unit, setUnit] = useState('')
  const [defaultErrorInfo, setDefaultErrorInfo] = useState('')

  const increaseDecreaseInputRef = useRef(null)

  const onChange = (event) => {
    setDefaultErrorInfo('')

    const { value } = event.target
    props.onChange && props.onChange(value)
  }

  const onBlur = () => {
    if (props.min !== undefined && props.min > props.value) {
      props.onChange && props.onChange(props.min)
    }
    if (props.max !== undefined && props.max < props.value) {
      props.onChange && props.onChange(props.max)
    }
  }

  const onFocus = () => {

  }

  const onIncreaseDecreaseInputChange = (event) => {
    const define = props?.define || {}
    let value = 0
    const regex = /(\d+(?:\.\d*)?)/
    const Inputvalue = event.target.value || '0'
    if (props.title !== '亮度') {
      value = Number(Inputvalue.match(regex)[0]) * define.scale
    }
    if (props.title === '亮度') {
      value = Math.round(Number(Inputvalue.match(regex)[0]) * define.max / 100)
    }
    props.onChange && props.onChange(value)
  }

  const onIncreaseDecreaseInputBlur = () => {
    const define = props?.define || {}

    const newUnit = define.unit === '百分比' ? '%' : define.unit
    setUnit(newUnit)

    const regex = /(\d+(?:\.\d+)?)/
    const value = Number(increaseDecreaseInputRef.current.value.match(regex)[0])

    if (props.title !== '亮度') {
      if (define.min / define.scale > value) {
        props.onChange && props.onChange(define.min)
      }
      if (define.max / define.scale < value) {
        props.onChange && props.onChange(define.max)
      }
    }
    if (props.title === '亮度') {
      if (value < 1) {
        props.onChange && props.onChange(1 * define.max / 100)
      }
      if (value > 100) {
        props.onChange && props.onChange(100 * define.max / 100)
      }
    }
  }

  const onIncreaseDecreaseInputFocus = () => {
    setUnit('')
  }

  const onDecrease = () => {
    const define = props?.define || {}
    let value = 0
    if (props.title !== '亮度') {
      const regex = /(\d+(?:\.\d+)?)/
      value = Number(increaseDecreaseInputRef.current.value.match(regex)[0]) * define.scale
      if (define.min >= value) {
        value = define.min
      } else {
        value -= define.step
      }
    }
    if (props.title === '亮度') {
      let newValue
      if (brightness <= 1) {
        newValue = 1
      } else {
        newValue = brightness - 1
      }
      value = Math.round(newValue * define.max / 100)
      setBrightness(newValue)
    }
    props.onChange && props.onChange(value)
  }

  const onIncrease = () => {
    const define = props?.define || {}
    let value = 0
    if (props.title !== '亮度') {
      const regex = /(\d+(?:\.\d+)?)/
      value = Number(increaseDecreaseInputRef.current.value.match(regex)[0]) * define.scale
      if (define.max <= value) return
      value += define.step
    }
    if (props.title === '亮度') {
      if (brightness >= 100) return
      const newValue = brightness + 1
      value = Math.round(newValue * define.max / 100)
      setBrightness(newValue)
    }

    props.onChange && props.onChange(value)
  }

  const onIncreaseDecreaseInputEnter = (event) => {
    event.stopPropagation()
    increaseDecreaseInputRef.current.style.background = '#EDEFF1'
  }

  const onIncreaseDecreaseInputLeave = (event) => {
    event.stopPropagation()
    increaseDecreaseInputRef.current.style.background = '#F7F8FA'
  }

  const getIncreaseDecreaseInputValue = () => {
    const define = props?.define || {}
    let value = !isUndefined(props.value) ? props.value : 0
    if (props.title !== '亮度') {
      value = String(value / define.scale) + unit
    }
    if (props.title === '亮度') {
      value = String(Math.round(value / define.max * 100)) + unit
    }
    return value
  }

  useEffect(() => {
    const define = props?.define || {}
    if (props.title === '亮度') {
      const value = Math.round(props.value / define.max * 100)
      setBrightness(value)
    }
    const newUnit = define.unit === '百分比' ? '%' : define.unit
    setUnit(newUnit)
  }, [])

  useEffect(() => {
    setDefaultErrorInfo(errorInfo)
  }, [errorInfo])

  return (
    <div className={styles.inputCustom}>
      {
        props.type === 'default' && (
          <React.Fragment>
            <input
              className="input-default"
              type="text"
              {...props}
              onBlur={() => { onBlur() }}
              onChange={(event) => { onChange(event) }}
            />
            {
              !isUndefined(defaultErrorInfo, true) && (
                <div className='error-info-default'>{defaultErrorInfo}</div>
              )
            }
          </React.Fragment>
        )
      }
      {
        props.type === 'on-base-color' && (
          <input
            className="input-on-base-color"
            type="text"
            {...props}
            onBlur={(value) => { onBlur(value) }}
            onChange={(event) => { onChange(event) }}
            onFocus={() => { onFocus() }}
          />
        )
      }
      {
        props.type === 'increase-decrease-input' && (
          <div className="increase-decrease-button-wrapper" style={props.style}>
            <div className="title" style={props.titleStyle}>{props.title}</div>
            <div className="increase-decrease-button">
              <div className="increase-decrease-arrow-left-wrapper" onClick={() => { onDecrease() }}>
                <div className="increase-decrease-arrow-left" />
              </div>
              <input
                className="increase-decrease-value"
                type="text"
                ref={increaseDecreaseInputRef}
                value={getIncreaseDecreaseInputValue()}
                onChange={(event) => { onIncreaseDecreaseInputChange(event) }}
                onBlur={() => { onIncreaseDecreaseInputBlur() }}
                onFocus={() => { onIncreaseDecreaseInputFocus() }}
                onMouseEnter={(event) => { onIncreaseDecreaseInputEnter(event) }}
                onMouseLeave={(event) => { onIncreaseDecreaseInputLeave(event) }}
              />
              <div className="increase-decrease-arrow-right-wrapper" onClick={() => { onIncrease() }}>
                <div className="increase-decrease-arrow-right" />
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}
