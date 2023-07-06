import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PlayCircleOutlined } from '@ant-design/icons'
import styles from './index.module.less'
import { Button } from '@/common/components/button'
import { Input } from '@/common/components/input'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { Select } from '@/common/components/select'

export const SceneTime = (props) => {
  const [sceneData, setSceneData] = useState({})
  const [actions, setActions] = useState([])

  const canvasRef = useRef(null)

  const { state } = useLocation()

  const drawChart = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const height = 42
    const width = 37

    context.beginPath()
    context.moveTo(0, height / 2)
    context.lineTo(0, height)
    context.lineTo(width * 3, height)
    context.quadraticCurveTo(width * 2, height / 2, width * 1.5, height / 2)
    context.lineTo(0, height / 2)

    const gradient = context.createLinearGradient(0, 0, width * 3, 0)
    gradient.addColorStop(0, '#F6EF42')
    gradient.addColorStop(1, '#FA8F95')
    context.fillStyle = gradient

    context.strokeStyle = '#F3F5F6'
    context.stroke()

    context.fill()
  }

  const queryScene = async () => {
    const rpc = new JsonRpc('query_scene_detail_by_scene_id_ex2')
    const result = await rpc.fetchData({ scene_id: state.scene_id })
    setSceneData(result.scene_list[0])

    const action = result.scene_list[0]?.actions
    action.forEach((item, index) => {
      item.orderNum = String(index + 1).padStart(3, '0')
    })
    console.log(action, 'action')
    setActions(action)
  }

  useEffect(() => {
    queryScene()
    drawChart()
  }, [])

  return <div className={styles.sceneTimeWrapper}>
    <div className="scene-time-header-wrapper">
      <div className="left">
        <Input type="increase-decrease-input" title="场景时长（s）" value="60" />
      </div>
      <div className="right">
        <Button type="whiteButton" icon={<PlayCircleOutlined />} text="执行" style={{ marginRight: '54px' }} />
        <Button type="goBackButton" />
      </div>
    </div>

    <div className="table-wrapper">
      <div className="header-row-wrapper">
        <div className="device-name-wrapper">
          <div className="device-name">设备名称</div>
        </div>
        <div className="second-wrapper">
          <div className="second">1s</div>
        </div>
        <div className="second-wrapper">
          <div className="second">2s</div>
        </div>
        <div className="second-wrapper">
          <div className="second">3s</div>
        </div>
      </div>
      <div className="device-row-wrapper">
        <div className="device-wrapper">
          <div className="device">客厅主灯</div>
        </div>
        <div className="row-cell-wrapper">
          <div className="canvas-container">
            <canvas className="canvas" ref={canvasRef} />
          </div>
          <div className="row-cell" />
          <div className="row-cell" />
          <div className="row-cell" />
        </div>
      </div>
      <div className="device-row-wrapper">
        <div className="device-wrapper">
          <div className="device">客厅主灯</div>
        </div>
        <div className="row-cell-wrapper">
          <div className="canvas-container">
            <canvas className="canvas" ref={canvasRef} height={42} width={1000} />
          </div>
          <div className="row-cell" />
          <div className="row-cell" />
          <div className="row-cell" />
        </div>
      </div>
    </div>
    <div className="scene-time-footer-wrapper">
      <div className="title-wrapper">
        <div className="title">参数设置</div>
        <div className="time-period">5s</div>
      </div>
      <div className="form-wrapper">
        <div className="left">
          {/* <Select options={stateValues[index]} placeholder="选择触发属性" defaultValue={item.state_type_name} onChange={(value) => { selectStateValues(value, item, index) }} style={{ marginLeft: '12px' }} width={'80'} /> */}
          <Input type="increase-decrease-input" title="时间周期（s）" value="60" style={{ marginRight: '16px' }} />
          <div className="dividing-line" />
          <Input type="increase-decrease-input" title="亮度" value="60" style={{ marginRight: '12px' }} />
          <Input type="increase-decrease-input" title="色温" value="60" style={{ marginRight: '12px' }} />
          <Input type="increase-decrease-input" title="渐变" value="60" />
        </div>
        <div className="right">
          <Button type="whiteButton" text="清除设置" style={{ marginRight: '16px' }} />
          <Button type="whiteButton" text="删除设备" style={{ marginRight: '16px' }} />
          <Button type="blueButton" text="添加设备" />
        </div>
      </div>
    </div>
  </div>
}
