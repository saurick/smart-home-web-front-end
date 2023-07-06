import React, { forwardRef, useRef, useState, useImperativeHandle, useEffect } from 'react'
import { Checkbox, Table as AntdTable } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import differenceWith from 'lodash/differenceWith'
import isEqual from 'lodash/isEqual'
import toPairs from 'lodash/toPairs'
import { observer } from 'mobx-react-lite'
import styles from './index.module.less'
import { filterAction, filterActions, calculateFilterProps, filtersReset } from '@/common/utils/filter'
import { isUndefined, findParentNodeByClassName } from '@/common/utils/util'
import { getContext } from '@/common/stores'

import { useClickAway } from '@/common/hooks'

// const TdCell = (props) => {
//   // onMouseEnter, onMouseLeave在数据量多的时候，会严重阻塞表格单元格渲染，严重影响性能
//   const { onMouseEnter, onMouseLeave, ...restProps } = props
//   return <td {...restProps} />
// }

const TableComponent = forwardRef(({ dataSource, children, ...props }, ref) => {
  useImperativeHandle(ref, () => ({
    showFilterDropdown,
    getFilteredTableData,
    tableData,
    antdTableRef: antdTableRef.current //  父组件通过这个属性获取table的ref
  }))
  const [tableBodyHeight, setTableBodyHeight] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [filterStyle, setFilterStyle] = useState({})
  const [showFilterRef, setShowFilterRef] = useState(null)
  const [tableData, setTableData] = useState([])

  const [searchEnabled, setSearchEnabled] = useState(false)
  const [filteredData, setFilteredData] = useState([])
  const [filterkey, setFilterkey] = useState('')
  const [filterList, setFilterList] = useState([])
  const [selectAllFilters, setSelectAllFilters] = useState(true)
  const [filteredArray, setFilteredArray] = useState([])
  const [appliedSearchFilters, setAppliedSearchFilters] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [filterActiveList, setFilterActiveList] = useState([])

  const antdTableRef = useRef(null)
  const filterRef = useRef()

  const context = getContext()

  const getFilteredTableData = () => {
    return tableData
  }

  const showFilterDropdown = (event, filterkey) => {
    event.stopPropagation()

    console.log(filterkey, 'filterkey000')
    console.log(filteredData, 'filteredData000')
    const filterProps = calculateFilterProps({ filteredData, filterkey })
    console.log(filterProps, 'filterProps')
    setFilterList(filterProps.filterList)
    setSelectAllFilters(filterProps.selectAllFilters)

    setFilterkey(filterkey)
    setSearchEnabled(false)

    const node = findParentNodeByClassName(event.target, 'ant-table-cell')
    const tableHeaderClientRect = node.getBoundingClientRect()
    const marginBottom = 12
    console.log(tableHeaderClientRect, 'tableHeaderClientRect')
    setFilterStyle({
      top: tableHeaderClientRect.top + tableHeaderClientRect.height + marginBottom,
      left: tableHeaderClientRect.left
    })
    setShowFilterRef(event.target)

    setShowFilter(!showFilter)
  }

  const setFilterIsActive = (selectAllFilters, key, showFilter) => {
    console.log(selectAllFilters, 'ssssssss2')
    console.log(key, 'ssssssss3')
    console.log(showFilter, 'ssssssss4')
    if (showFilter || !selectAllFilters) {
      let arr = JSON.parse(JSON.stringify(filterActiveList))

      if (searchEnabled) {
        arr = []
      }
      if (!arr.includes(key)) {
        arr.push(key)
      }
      console.log(arr, 'ssssssss')
      setFilterActiveList([...arr])
      context.dispatch({ type: 'table-filter-active-list', payload: arr })
    } else {
      const arr = JSON.parse(JSON.stringify(filterActiveList))

      if (arr.includes(key)) {
        arr.splice(arr.indexOf(key), 1)
      }
      console.log(arr, 'ssssssss1')
      setFilterActiveList([...arr])
      context.dispatch({ type: 'table-filter-active-list', payload: arr })
    }
  }

  const _filterMulipleRows = (addFilterArray = [], removeFilterArray = []) => {
    if (!isUndefined(addFilterArray)) {
      console.log(JSON.parse(JSON.stringify(filteredData)), '555555555')
      let result = filterActions(filteredData, removeFilterArray, false)

      result = filterActions(result.dataWithFilter, addFilterArray, true)

      if (!isUndefined(result)) {
        console.log(result, '55555555511')
        const { filteredArray } = result
        const { dataWithFilter } = result

        setFilteredData(dataWithFilter)
        setTableData(filteredArray)
        // setFilteredArray(filteredArray)

        const filterProps = calculateFilterProps({ filteredData: dataWithFilter, filterkey })
        console.log(filterProps, 'filterProps')
        setFilterList(filterProps.filterList)
        setSelectAllFilters(filterProps.selectAllFilters)
        setFilterIsActive(filterProps.selectAllFilters, filterkey, showFilter)
      }
    }
  }

  const _searchChanged = (searchValue) => {
    setSearchValue(searchValue)

    const prevAppliedFilters = JSON.parse(JSON.stringify(appliedSearchFilters))
    if (!isUndefined(searchValue, true)) {
      setSearchEnabled(true)

      searchValue = searchValue.toLowerCase()

      const filtersToApply = filterList.filter((filterItem) => {
        const filterKey = filterItem.key.toString().toLowerCase()
        if (filterKey.indexOf(searchValue) < 0 && filterItem.visible) {
          return true
        }
        return false
      }).map((filterItem) => {
        return {
          key: filterkey,
          value: filterItem.key,
        }
      })
      setAppliedSearchFilters(filtersToApply)
      _filterMulipleRows(filtersToApply, prevAppliedFilters)
    } else {
      setSearchEnabled(false)

      setAppliedSearchFilters([])
      _filterMulipleRows([], prevAppliedFilters)
    }
  }

  const onFilterInput = (event) => {
    _searchChanged(event.target.value)
  }

  const _resetRows = (filterValues = [], key = undefined, selectAll = true, valueFunc = undefined) => {
    if (!isUndefined(key)) {
      // _updateCurrentFilters(filterValues, !selectAll, key)
      const result = filtersReset(filteredData, filterValues, key, selectAll, valueFunc)
      if (!isUndefined(result)) {
        const { filteredArray } = result
        const { dataWithFilter } = result

        setFilteredData(dataWithFilter)
        setTableData(filteredArray)
        setFilteredArray(filteredArray)
        console.log(result, 'result')
        console.log(key, 'key')
        const filterProps = calculateFilterProps({ filteredData: dataWithFilter, filterkey: key })
        console.log(filterProps, 'filterProps')
        setFilterList(filterProps.filterList)
        setSelectAllFilters(filterProps.selectAllFilters)
        setFilterIsActive(filterProps.selectAllFilters, key, showFilter)
      }
    }
  }

  const _resetData = (filterValues = [], selectAll = true) => {
    console.log(filterValues, 'filterValues')
    console.log(filterkey, 'filterkey')
    console.log(selectAll, 'selectAll')
    _resetRows(filterValues, filterkey, selectAll)
  }

  const onFilterCheckAll = () => {
    const selectAllState = selectAllFilters
    const newSelectAllState = !selectAllState
    const searchState = searchEnabled
    // const searchValue = searchValue

    if (searchState) {
      return
    }

    const visibleFiltersValues = filterList.filter((filterItem) => {
      if (newSelectAllState) {
        return (filterItem.visible && !filterItem.selected)
      }
        return (filterItem.visible && filterItem.selected)
    }).map((filterItem) => {
      return filterItem.key
    })

    _resetData(visibleFiltersValues, newSelectAllState)
  }

  const _filterUpdated = (index) => {
    const allFilters = filterList
    console.log(index, 'index')
    if (!isUndefined(allFilters[index])) {
      const newFilterState = !allFilters[index].selected
      console.log(newFilterState, 'newFilterState')
      _filterData(allFilters[index].key, !newFilterState)
    }
  }

  const _filterData = (filterValue = undefined, addFilter = true) => {
    console.log(filterValue, 'filterValue')
    console.log(addFilter, 'addFilter')
    _filterRows(filterValue, filterkey, addFilter)
  }

  const _filterRows = (value = undefined, key = undefined, addFilter = true, valueFunc = undefined) => {
    console.log(key, 'key222')
    console.log(value, 'value222')
    console.log(addFilter, 'addFilter222')

    // const filteredData = filteredData
    console.log(filteredData, 'filteredData222')
    if (!isUndefined(value) && !isUndefined(key)) {
      const result = filterAction(filteredData, { key, value }, addFilter, valueFunc)
      if (!isUndefined(result)) {
        const { filteredArray } = result
        const { dataWithFilter } = result
        console.log(dataWithFilter, 'result222')
        setFilteredData([...dataWithFilter])
        setTableData([...filteredArray])
        setFilteredArray([...filteredArray])
        console.log(key, 'key333')
        const filterProps = calculateFilterProps({ filteredData: dataWithFilter, filterkey: key })
        console.log(filterProps, 'filterProps')
        setFilterList(filterProps.filterList)
        setSelectAllFilters(filterProps.selectAllFilters)
        setFilterIsActive(filterProps.selectAllFilters, key, showFilter)
      }
    }
  }

  const onFilterCheck = (index) => {
    console.log(filteredData, 'onFilterCheck')
    _filterUpdated(index)
  }

  useEffect(() => {
    if (filterList.length > 0 && filteredArray.length > 0) {
      let changes = []
      let changedFilteredArrayIndex
      console.log(JSON.parse(JSON.stringify(filteredArray)), 'filteredArrayaaaaaa')
      console.log(JSON.parse(JSON.stringify(filteredData)), 'filteredArrayaaa222')
      filteredArray.forEach((item, index) => {
        let count = 0

        dataSource.forEach((dataItem, dataIndex) => {
          if (item.key === dataItem.key) {
            count += 1

            const arr = differenceWith(toPairs(dataItem), toPairs(item), isEqual)
            if (arr.length > 0 && arr[0][0] !== 'area_name') {
              filteredArray[index] = JSON.parse(JSON.stringify(dataItem))
              filteredArray[index].area_name = dataItem?.area?.name

              changes = arr
              changedFilteredArrayIndex = index
              console.log(changes, 'qweqw444')
            }
          }
        })

        if (count === 0) {
          filteredArray.splice(index, 1)
        }
      })

      let newItem
      dataSource.forEach((dataItem, dataIndex) => {
        let count = 0
        filteredData.forEach((arrayItem) => {
          if (dataItem.key === arrayItem.key) {
            count += 1
          }
        })

        if (count === 0) {
          newItem = JSON.parse(JSON.stringify(dataItem))
        }
      })

      filteredData.forEach((dataItem) => {
        changes.forEach((changeItem) => {
          if (changeItem[0] === 'area') {
            if (dataItem[changeItem[0]]?.name === changeItem[1]?.name && !isUndefined(dataItem.appliedFilters) && Object.keys(dataItem.appliedFilters).length > 0) {
              console.log(dataItem[changeItem[0]].name, 'qweqw1')
              console.log(changeItem[1].name, 'qweqw11')

              filteredArray[changedFilteredArrayIndex].appliedFilters = JSON.parse(JSON.stringify(dataItem.appliedFilters))
              console.log(filteredArray[changedFilteredArrayIndex].appliedFilters, 'qweqw111')
            }
          }
          if (changeItem[0].indexOf('area') === -1) {
            if (dataItem[changeItem[0]] === changeItem[1] && !isUndefined(dataItem.appliedFilters) && Object.keys(dataItem.appliedFilters).length > 0) {
              console.log(dataItem[changeItem[0]], 'qweqw1')
              console.log(changeItem[1], 'qweqw11')
              filteredArray[changedFilteredArrayIndex].appliedFilters = JSON.parse(JSON.stringify(dataItem.appliedFilters))
            }
          }
        })
      })

      filteredData.forEach((dataItem, dataIndex) => {
        let count = 0
        filteredArray.forEach((item) => {
          count += 1

          if (item.key === dataItem.key) {
            filteredData[dataIndex] = item
            filteredData[dataIndex].area_name = item?.area?.name
          }
        })

        if (count === 0) {
          filteredData.splice(dataIndex, 1)
        }
      })

      console.log(filteredArray, 'filteredArrayaaa')
      console.log(filteredData, 'filteredArrayaaa111')
      setTableData(() => {
        if (newItem) {
          return [...filteredArray, newItem]
        }
        if (!newItem) {
          return [...filteredArray]
        }
      })
      setFilteredArray(() => {
        if (newItem) {
          return [...filteredArray, newItem]
        }
        if (!newItem) {
          return [...filteredArray]
        }
      })
      setFilteredData(() => {
        if (newItem) {
          return [...filteredData, newItem]
        }
        if (!newItem) {
          return [...filteredData]
        }
      })
      const filterProps = calculateFilterProps({ filteredData, filterkey })
      console.log(filterProps, 'filterProps')
      setFilterList(filterProps.filterList)
      setSelectAllFilters(filterProps.selectAllFilters)
      setFilterIsActive(filterProps.selectAllFilters, filterkey, showFilter)
    } else {
      setTableData(dataSource)

      dataSource.forEach((item) => {
        item.area_name = item?.area?.name || item?.button_area?.name
      })
      console.log(dataSource, 'dataSource')
      setFilteredData(JSON.parse(JSON.stringify(dataSource)))
    }

    if (props.height) {
      setTableBodyHeight(props.height)
    }
    console.log(props.columns, '7777')
  }, [dataSource, props.height])

  useEffect(() => {
    setFilterIsActive(selectAllFilters, filterkey, showFilter)
  }, [showFilter])

  useClickAway(showFilterRef, filterRef, () => setShowFilter(false))

  return (
    <div className={styles.tableWrapper}>
      <div className="antd-table-wrapper" style={props.style}>
        {
          // tableData.length > 0 && (
          <AntdTable
            className="antd-table"
            pagination={false}
            dataSource={tableData || []}
            {...props}
            ref={antdTableRef}
            scroll={{ y: tableBodyHeight, x: 1300 }}

          // components={{
          //   body: { cell: TdCell },
          // }}
          />
        }
        {
          showFilter && (
            <div
              className="filter-wrapper"
              style={filterStyle}
              ref={filterRef}
            >
              <div className="search">
                <input type="text" placeholder="输入设备类型" onChange={(event) => onFilterInput(event)} />
                <SearchOutlined className="icon" />
              </div>
              <div className="list-wrapper">
                <div className="item-wrapper-default" key="全部">
                  <Checkbox checked={selectAllFilters} onChange={() => onFilterCheckAll()}>全部</Checkbox>
                </div>

                {
                  filterList.length > 0 && filterList.map((item, index) => {
                    if (item.visible) {
                      if (searchEnabled === true) {
                        const filterKey = item.key.toString().toLowerCase()
                        if (filterKey.indexOf(searchValue.toLowerCase()) >= 0) {
                          return (
                            <div className="item-wrapper-default" key={`item_${index}`}>
                              <Checkbox checked={item.selected} onChange={() => onFilterCheck(index)}>{item.display}</Checkbox>
                            </div>
                          )
                        }
                          return null
                      }
                      if (searchEnabled === false) {
                        return (
                          <div className="item-wrapper-default" key={`item_${index}`}>
                            <Checkbox checked={item.selected} onChange={() => onFilterCheck(index)}>{item.display}</Checkbox>
                          </div>
                        )
                      }
                    }
                  })
                }

              </div>
            </div>

          )
        }
        {
          children && (
            <div className="footer-wrapper">
              {children}
            </div>
          )
        }
      </div>
    </div>
  )
})

export const Table = observer(TableComponent)
