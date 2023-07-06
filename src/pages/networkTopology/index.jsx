import React, { useState, useRef, useEffect, useCallback } from 'react'
import G6 from '@antv/g6'
import styles from './index.module.less'
import { Table } from '@/common/components/table'
import { Tabs } from '@/common/components/tabs'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { sleep } from '@/common/utils/util'
import { Button } from '@/common/components/button'
import { FilterIcon } from '@/common/components/icons'
import { getContext } from '@/common/stores'

export const NetworkTopology = () => {
  const [dataSource, setDataSource] = useState([])
  const [showRootInfo, setShowRootInfo] = useState(false)
  const [showNodeInfo, setShowNodeInfo] = useState(false)
  const [showedNodePosition, setShowedNodePosition] = useState({ canvasX: 0, canvasY: 0, clientX: 0, clientY: 0 })
  const [currentNodeInfo, setCurrentNodeInfo] = useState({})

  const context = getContext()

  const tableRef = useRef(null)
  const treeDataRef = useRef(null)
  const nodeRef = useRef(null)
  const rootNodeRef = useRef(null)

  const renderTree = (treeData) => {
    const container = treeDataRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight
    console.log(treeData, 'container')
    const graph = new G6.TreeGraph({
      container,
      width,
      height,
      linkCenter: true,
      modes: {
        default: [
          // {
          //   type: 'collapse-expand',
          //   onChange: function onChange(item, collapsed) {
          //     const data = item.get('model');
          //     data.collapsed = collapsed;
          //     return true;
          //   },
          // },
          'drag-canvas',
          'zoom-canvas',
        ],
      },
      animate: true,
      animateCfg: {
        duration: 500, // Number，一次动画的时长
        easing: 'linearEasing', // String，动画函数
      },
      // defaultNode: {
      //   size: 30,
      //   anchorPoints: [
      //     [0, 0.5],
      //     [1, 0.5],
      //   ],
      // },
      defaultEdge: {
        type: 'cubic-vertical',
      },
      layout: {
        type: 'dendrogram',
        direction: 'TB',
        nodeSep: 60,
        rankSep: 70,
      },
    })

    graph.edge((edge) => {
      return {
        style: {
          stroke: '#B9C0C9'
        }
      }
    })

    graph.node((node) => {
      const labelStyle = {
        fontSize: 14,
        fontFamily: 'PingFang SC-Medium, PingFang SC',
        fontWeight: 500,
        fill: '#F3F4F8',
      }

      if (node.snr >= 3 && node.snr < 8) {
        return {
          label: node.tei,
          size: 30,
          style: {
            fill: '#E74747',
            stroke: '#E74747'
          },
          labelCfg: labelStyle
        }
      }
      if (node.snr < 3) {
        return {
          label: node.tei,
          size: 30,
          style: {
            fill: '#B1B4BD',
            stroke: '#B1B4BD'
          },
          labelCfg: labelStyle
        }
      }
      return {
        label: node.tei,
        size: 30,
        style: {
          fill: '#43B241',
          stroke: '#43B241'
        },
        labelCfg: {
          style: {
            fontSize: 14,
            fontFamily: 'PingFang SC-Medium, PingFang SC',
            fontWeight: 500,
            fill: '#F3F4F8',
          }
        },
      }
    })

    graph.on('node:click', (ev) => {
      const node = ev.item
      console.log(ev, 'ev')
      setCurrentNodeInfo(node._cfg.model)
      onClickNode(ev.canvasX, ev.canvasY, ev.clientX, ev.canvasY)
      const group = node.getContainer()
      const shape = group.get('children')[0]
      if (node._cfg.snr >= 3 && node._cfg.snr < 8) {
        graph.updateItem(node, {
          style: {
            fill: '#E43131',
            stroke: '#E43131'
          },
        })
      } else if (node._cfg.snr < 3) {
        graph.updateItem(node, {
          style: {
            fill: '#A7ABB8',
            stroke: '#A7ABB8'
          },
        })
      } else {
        graph.updateItem(node, {
          style: {
            fill: '#24A622',
            stroke: '#24A622'
          },
        })
      }

      shape.animate(
        {
          r: 21,
        },
        {
          repeat: false,
          duration: 100,
        },
      )
    })
    graph.on('node:mouseenter', (ev) => {
      const node = ev.item

      if (node._cfg.snr >= 3 && node._cfg.snr < 8) {
        graph.updateItem(node, {
          style: {
            fill: '#EF5B5B',
            stroke: '#EF5B5B'
          },
        })
      } else if (node._cfg.snr < 3) {
        graph.updateItem(node, {
          style: {
            fill: '#CED1DA',
            stroke: '#CED1DA'
          },
        })
      } else {
        graph.updateItem(node, {
          style: {
            fill: '#6FD46D',
            stroke: '#6FD46D'
          },
        })
      }
    })
    graph.on('node:mouseleave', (ev) => {
      const node = ev.item
      if (node._cfg.snr >= 3 && node._cfg.snr < 8) {
        graph.updateItem(node, {
          style: {
            fill: '#E74747',
            stroke: '#E74747'
          },
        })
      } else if (node._cfg.snr < 3) {
        graph.updateItem(node, {
          style: {
            fill: '#B1B4BD',
            stroke: '#B1B4BD'
          },
        })
      } else {
        graph.updateItem(node, {
          style: {
            fill: '#43B241',
            stroke: '#43B241'
          },
        })
      }
    })

    graph.data(treeData)
    graph.render()
    graph.fitView()

    if (typeof window !== 'undefined') {
 window.onresize = () => {
        if (!graph || graph.get('destroyed')) return
        if (!container || !container.scrollWidth || !container.scrollHeight) return
        graph.changeSize(container.scrollWidth, container.scrollHeight)
      }
}
  }

  const getTopoTree = (list) => {
    const map = {}
    const treeList = []
    list.forEach((node) => {
      // node 添加 children
      if (!node.children) {
        node.children = []
      }
      map[node.tei] = node // 属性名:属性值
    })

    // console.log(JSON.stringify(map));

    list.forEach((node) => {
      if (map[node.proxy]) {
        map[node.proxy].children.push(node)
      } else {
        treeList.push(node)
      }
    })
    return treeList[0]
  }

  const getTopoInfo = async () => {
    const rpc = new JsonRpc('get_topo_info')
    const result = await rpc.fetchData()
    console.log(result.topo_node_list, 'result.topo_node_list')
    setDataSource(result.topo_node_list)

    const list = JSON.parse(JSON.stringify((result.topo_node_list)))
    const tree = getTopoTree(list)
    renderTree(tree)
    setTreeData(tree)
  }

  const getActiveTab = async (activeTab) => {
    setShowNodeInfo(false)
    if (activeTab == '1') {
      // await sleep(1000)
      // let tree = JSON.parse(JSON.stringify(treeData))
      // tree.name = '111'
      // setTreeData(tree)
      // renderTree(tree)
      getTopoInfo()
    }
  }

  const onClickNode = (canvasX, canvasY, clientX, clientY) => {
    setShowNodeInfo(!showNodeInfo)
    setShowedNodePosition({ canvasX, canvasY, clientX, clientY })
  }

  useEffect(() => {
    getTopoInfo()
  }, [])

  // useEffect(() => {
  //   console.log(treeDataRef, 'treeDataRef')
  // }, [treeDataRef])

  useEffect(() => {
    console.log(treeDataRef, 'treeDataRef')
    const current = nodeRef?.current
    const treeCurrent = treeDataRef?.current
    if (current && treeCurrent) {
      console.log(current.getBoundingClientRect(), 'ccc')
      const { canvasX } = showedNodePosition
      const { canvasY } = showedNodePosition
      const { clientX } = showedNodePosition
      const { clientY } = showedNodePosition
      const distanceX = document.body?.clientWidth - clientX
      const distanceY = treeCurrent.clientHeight - clientY

      console.log(canvasX, 'canvasX')
      console.log(canvasY, 'canvasY')
      console.log(clientX, 'clientX')
      console.log(clientY, 'clientY')
      console.log(treeCurrent.clientWidth, 'treeCurrent.clientWidth')
      console.log(treeCurrent.clientHeight, 'treeCurrent.clientHeight')
      console.log(document.documentElement.clientHeight, 'document.documentElement.clientHeight')
      console.log(document.documentElement.clientWidth, 'document.documentElement.clientWidth')
      console.log(distanceX, 'distanceX')
      console.log(distanceY, 'distanceY')
      // current.style.left = canvasX + 'px'
      // current.style.top = (canvasY + 32 +32) + 'px'
      if ((distanceY - 64) > 260 && distanceX > 238) {
        current.style.right = 'unset'
        current.style.bottom = 'unset'
        current.style.left = `${canvasX}px`
        current.style.top = `${canvasY + 32 + 32}px`
      }
      if ((distanceY - 64) > 260 && distanceX < 238) {
        current.style.left = 'unset'
        current.style.bottom = 'unset'
        current.style.right = `${distanceX - 32}px`
        current.style.top = `${canvasY + 32 + 32}px`
      }
      if ((distanceY - 64) < 260 && distanceX > 238) {
        current.style.right = 'unset'
        current.style.top = 'unset'
        current.style.left = `${canvasX}px`
        current.style.bottom = `${distanceY}px`
      }
      if ((distanceY - 64) < 260 && distanceX < 238) {
        current.style.left = 'unset'
        current.style.top = 'unset'
        current.style.right = `${distanceX - 32}px`
        current.style.bottom = `${distanceY}px`
      }
    }
  }, [showNodeInfo, showedNodePosition])

  const columns = [
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">设备名</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'name') }} />
        </div>
      ),
      dataIndex: 'name',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">MAC</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('dev_id') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'dev_id') }} />
        </div>
      ),
      dataIndex: 'dev_id',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">通讯延迟</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('comm_delay') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'comm_delay') }} />
        </div>
      ),
      dataIndex: 'comm_delay',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">衰减</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('atten') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'atten') }} />
        </div>
      ),
      dataIndex: 'atten',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">信噪比</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('snr') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'snr') }} />
        </div>
      ),
      dataIndex: 'snr',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">通信成功率</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('comm_rate') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'comm_rate') }} />
        </div>
      ),
      dataIndex: 'comm_rate',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">上行成功率</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('ul_comm_rate') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'ul_comm_rate') }} />
        </div>
      ),
      dataIndex: 'ul_comm_rate',
    },
    {
      title: () =>
      (
        <div className="title-wrapper">
          <div className="title">下行成功率</div>
          <FilterIcon stroke={context.state.filterActiveList.includes('dl_comm_rate') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'dl_comm_rate') }} />
        </div>
      ),
      dataIndex: 'dl_comm_rate',
    }
  ]

  const items = [
    {
      label: '树状图',
      key: '1',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <g id="Frame">
          <path id="Vector" d="M9 12.375V5.625" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path id="Vector_2" d="M14.25 3.375H3.75V5.625H14.25V3.375Z" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path id="Vector_3" d="M3 12L5.25 9.375H12.7404L15 12" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path id="Vector_4" d="M4.5 12.375H1.5V15.375H4.5V12.375Z" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path id="Vector_5" d="M10.5 12.375H7.5V15.375H10.5V12.375Z" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path id="Vector_6" d="M16.2632 12.3154H13.2632V15.3154H16.2632V12.3154Z" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>,
      children: 'Tab 1'
    },
    {
      label: '列表',
      key: '2',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <g id="Frame">
          <path id="Vector" d="M3 15.75C3.82841 15.75 4.5 15.0784 4.5 14.25C4.5 13.4216 3.82841 12.75 3 12.75C2.17157 12.75 1.5 13.4216 1.5 14.25C1.5 15.0784 2.17157 15.75 3 15.75Z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
          <path id="Vector_2" d="M3 4.5C3.41421 4.5 3.75 4.16422 3.75 3.75C3.75 3.33579 3.41421 3 3 3C2.58579 3 2.25 3.33579 2.25 3.75C2.25 4.16422 2.58579 4.5 3 4.5Z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
          <path id="Vector_3" d="M3 9.75C3.41421 9.75 3.75 9.41422 3.75 9C3.75 8.58577 3.41421 8.25 3 8.25C2.58579 8.25 2.25 8.58577 2.25 9C2.25 9.41422 2.58579 9.75 3 9.75Z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
          <path id="Vector_4" d="M7.5 9H16.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path id="Vector_5" d="M7.5 14.25H16.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path id="Vector_6" d="M7.5 3.75H16.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>,
      children: 'Tab 2'
    },
  ]

  items.forEach((item) => {
    console.log(treeDataRef, 'treeDataRef222')
    if (item.key === '1') {
      item.children = (
        <div className="tree-wrapper" ref={treeDataRef}>
          {/* <div className='layout'></div> */}
        </div>
      )
    }
    if (item.key === '2') {
      item.children = (
        <Table
          columns={columns}
          dataSource={dataSource}
          ref={tableRef}
          style={{ marginTop: '24px' }}
          height="calc(100vh - 270px)"
        >
          <Button type="blueButton" text="测试" onClick={() => { createAutoControl() }} style={{ position: 'absolute', right: '64px', bottom: '13px' }} />

        </Table>
      )
    }
  })

  return (
    <div className={styles.networkTopologyWrapper}>
      <Tabs type="icon" items={items} getActiveTab={(activeTab) => { getActiveTab(activeTab) }} />
      {
        showRootInfo && (
          <div className="root-node-wrapper" ref={rootNodeRef}>
            <div className="device-name-wrapper">
              <div className="online-circle" />
              <div className="device-name">智能中控主机</div>
            </div>
            <div className="num">8344552</div>
          </div>
        )
      }
      {
        showNodeInfo && (
          <div className="node-wrapper" ref={nodeRef}>
            <div className="node-item-wrapper">
              <div className="name">设备名:</div>
              <div className="value">{currentNodeInfo.name}</div>
            </div>
            <div className="node-item-wrapper">
              <div className="name">MAC:</div>
              <div className="value">{currentNodeInfo.dev_id}</div>
            </div>
            <div className="node-item-wrapper">
              <div className="name">衰减:</div>
              <div className="value">{currentNodeInfo.atten}</div>
            </div>
            <div className="node-item-wrapper">
              <div className="name">信噪比:</div>
              <div className="value">{currentNodeInfo.snr}</div>
            </div>
            <div className="node-item-wrapper">
              <div className="name">通信成功率:</div>
              <div className="value">{currentNodeInfo.comm_rate}</div>
            </div>
            <div className="node-item-wrapper">
              <div className="name">上行通信成功率:</div>
              <div className="value">{currentNodeInfo.ul_comm_rate}</div>
            </div>
            <div className="node-item-wrapper">
              <div className="name">下行通信成功率:</div>
              <div className="value">{currentNodeInfo.dl_comm_rate}</div>
            </div>
            <div className="node-item-wrapper">
              <div className="name">通信延迟:</div>
              <div className="value">{currentNodeInfo.comm_delay}</div>
            </div>
          </div>
        )
      }
    </div>
  )
}
