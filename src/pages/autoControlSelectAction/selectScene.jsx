import React, { useState, useRef, useEffect } from 'react'
import { Checkbox } from 'antd'
import styles from './index.module.less'
import { Table } from '@/common/components/table'
import { getContext } from '@/common/stores'
import { FilterIcon } from '@/common/components/icons'

export const SelectScene = (props) => {
    const [selectData, setSelectData] = useState([])
    const [dataSource, setDataSource] = useState([])

    const context = getContext()

    const tableRef = useRef(null)

    // const onSelectAll = (event) => {
    //     if (selectData.length === dataSource.length && !event.target.checked) {
    //         setSelectData([])
    //     } else {
    //         dataSource.forEach((item, index) => {
    //             if (!selectData.includes(item.key)) {
    //                 selectData.push(item.key)
    //             }
    //         })
    //         console.log(selectData, 'selectDataaa')
    //         setSelectData(selectData)

    //     }
    //     setDataSource([...dataSource])
    // }

    const onSelect = (event, text, record, index) => {
        console.log(selectData, 'selectData2')
        let selectDataCopy = Array.from(new Set(JSON.parse(JSON.stringify(selectData))))
        console.log(selectDataCopy, 'selectDataCopy')
            if (selectDataCopy.includes(record.key)) {
                selectDataCopy.splice(selectData.indexOf(record.key), 1)
            } else {
                selectDataCopy.push(record.key)
            }

        selectDataCopy = Array.from(new Set(selectDataCopy))
        console.log(selectDataCopy, 'selectDataCopy1')
        const arr = []
        selectDataCopy.forEach((item) => {
            arr.push(dataSource[item])
        })
        props.onSelect && props.onSelect(arr, selectDataCopy)
        setSelectData(selectDataCopy)
        setDataSource([...dataSource])
    }

    useEffect(() => {
        console.log(props.toSelectSceneData, 'props.toSelectSceneData')
        console.log(props.dataSource, 'props.dataSource')
        if (props.toSelectSceneData.length > 0) {
            props.toSelectSceneData.forEach((item) => {
                if (!selectData.includes(item)) {
                    console.log(item, 'item')
                    console.log(selectData, 'selectData')
                    setSelectData((selectData) => [...selectData, item])
                }
            })
        }

        props.dataSource && setDataSource(props.dataSource)
    }, [props])

    const columns = [
        {
            // title: () =>
            // (
            //     dataSource.length > 0 && <Checkbox checked={selectData.length === dataSource.length} onChange={(event) => onSelectAll(event)} />
            // ),
            render: (text, record, index) => {
                let isChecked = false
                selectData.forEach((item) => {
                    if (item == record.key) {
                        isChecked = true
                    }
                })
                return <Checkbox checked={isChecked} onChange={(event) => onSelect(event, text, record, index)} />
            }
        },
        {
            title: () =>
            (
              <div className="title-wrapper">
                <div className="title">场景名称</div>
                <FilterIcon stroke={context.state.filterActiveList.includes('scene_name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'scene_name') }} />
              </div>
            ),
            dataIndex: 'scene_name',
        },
        {
            title: () =>
            (
              <div className="title-wrapper">
                <div className="title">所在空间</div>
                <FilterIcon stroke={context.state.filterActiveList.includes('area_name') ? '#205AD2' : ''} onClick={(event) => { tableRef?.current?.showFilterDropdown(event, 'area_name') }} />
              </div>
            ),
            render: (text, record, index) => {
                return <div>{record.area.name}</div>
            }
        },
    ]

    return (
      <div className={styles.autoControlSelectActionWrapper}>
        <Table
          columns={columns}
          dataSource={dataSource}
          ref={tableRef}
          height="calc(100vh - 270px)"
        />
      </div>
    )
}
