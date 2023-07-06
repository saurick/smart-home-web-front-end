import React, { useState, useEffect } from 'react'
import { default as RcSlider } from 'rc-slider'
import styles from './index.module.less'

export const Slider = (props) => {
  const [railStyle, setRailStyle] = useState({
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '8px',
    margin: 'auto',
    borderRadius: '6px',
  })
  const [trackStyle, setTrackStyle] = useState({
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: '8px',
    margin: 'auto 0',
    borderRadius: '6px',
  })
  const [trackOrRail, setTrackOrRail] = useState('')

  const handleStyle = {
    position: 'absolute',
    width: '24px',
    height: '24px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    boxShadow: '1px 1px 1px 1px #A0AFE7',
    boxSizing: 'border-box'
  }

  useEffect(() => {
    setRailStyle({ ...railStyle, background: props.background || '#205AD2' })
    setTrackStyle({ ...trackStyle, background: props.background || '#205AD2' })
    setTrackOrRail(props.trackOrRail)
  }, [props])

  const onChange = (value) => {
    console.log(value)
    props.onChange && props.onChange(value)
  }

  return (
    <div className={styles.sliderWrapper} style={props.style}>
      <div className="slider-wrapper">
        <div className="title">{props.title || ''}</div>
        <div className="rc-slider-wrapper">
          <div className="rc-slider-background" />
          <RcSlider
            className="rc-slider"
            min={props.min || 0}
            max={props.max || 100}
            value={props.value}
            trackStyle={trackOrRail == 'track' ? trackStyle : {}}
            railStyle={trackOrRail == 'rail' ? railStyle : {}}
            handleStyle={handleStyle}
            onChange={(value) => onChange(value)}
          />
        </div>
        {
          props.isPercentage ? (
            <div className="percentage">{props.value}%</div>
          ) : (
            <div className="num">{props.value}</div>
          )
        }
      </div>
    </div>
  )
}
