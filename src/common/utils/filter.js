import { isUndefined, isTypeString, getValForKey } from './util'

import { sortAction } from './sort'
import {
  BLANK_LABEL,
  ASC_VALUE
} from '@/common/consts/filter'

export const filterActions = (inputArray = [], filterArray = [], addFilter = true, valueFunc = undefined) => {
  const filteredArray = []
  const dataWithFilter = inputArray.map((item) => {
    const itemCopy = { ...item }

    let i
    let l

    if (isUndefined(itemCopy.appliedFilters)) {
      itemCopy.appliedFilters = {}
    }

    for (i = 0, l = filterArray.length; i < l; i += 1) {
      const filterItem = filterArray[i]
      const { key } = filterItem
      let { value } = filterItem

      if (isUndefined(value)) {
        value = ''
      }

      let itemValue = getValForKey(item, key)
      if (!isUndefined(valueFunc)) {
        itemValue = valueFunc(itemValue)
      }

      if (isUndefined(itemValue)) {
        itemValue = ''
      }

      if (isTypeString(itemValue)) {
        itemValue = itemValue.trim()
      }

      if (addFilter) {
        if (itemValue === value) {
          if (!itemCopy.appliedFilters[key]) {
            itemCopy.appliedFilters[key] = 0
          }
          itemCopy.appliedFilters[key] += 1
        }
      } else if (itemValue === value) {
          itemCopy.appliedFilters[key] -= 1
          if (itemCopy.appliedFilters[key] === 0) {
            delete itemCopy.appliedFilters[key]
          }
        }
    }

    if (Object.keys(itemCopy.appliedFilters).length === 0) {
      delete itemCopy.appliedFilters
      filteredArray.push({ ...itemCopy })
    }

    return itemCopy
  })

  return {
    filteredArray,
    dataWithFilter,
  }
}

export const filterAction = (inputArray = [], filter = {}, addFilter = true, valueFunc = undefined) => {
  const { key } = filter
  let { value } = filter

  if (isUndefined(value)) {
    value = ''
  }
  if (!isUndefined(key)) {
    const filteredArray = []
    const dataWithFilter = inputArray.map((item) => {
      const itemCopy = { ...item }
      let itemValue = getValForKey(item, key)

      if (!isUndefined(valueFunc)) {
        itemValue = valueFunc(itemValue)
      }

      if (isUndefined(itemValue)) {
        itemValue = ''
      }

      if (isUndefined(itemCopy.appliedFilters)) {
        itemCopy.appliedFilters = {}
      }

      if (isTypeString(itemValue)) {
        itemValue = itemValue.trim()
      }

      if (addFilter) {
        if (itemValue === value) {
          if (!itemCopy.appliedFilters[key]) {
            itemCopy.appliedFilters[key] = 0
          }
          itemCopy.appliedFilters[key] += 1
        }
      } else if (itemValue === value) {
          itemCopy.appliedFilters[key] -= 1
          if (itemCopy.appliedFilters[key] === 0) {
            delete itemCopy.appliedFilters[key]
          }
        }

      if (Object.keys(itemCopy.appliedFilters).length === 0) {
        delete itemCopy.appliedFilters
        filteredArray.push({ ...itemCopy })
      }

      return itemCopy
    })

    return {
      filteredArray,
      dataWithFilter,
    }
  }
}

export const filtersReset = (inputArray = [], values = [], key = undefined, selectAll = true, valueFunc = undefined) => {
  const filteredArray = []
  const dataWithFilter = inputArray.map((item) => {
    const itemCopy = { ...item }

    if (isUndefined(itemCopy.appliedFilters)) {
      itemCopy.appliedFilters = {}
    }

    let itemValue = getValForKey(itemCopy, key)

    if (!isUndefined(valueFunc)) {
      itemValue = valueFunc(itemValue)
    }

    if (isUndefined(itemValue)) {
      itemValue = ''
    }

    if (isTypeString(itemValue)) {
      itemValue = itemValue.trim()
    }

    if (values.indexOf(itemValue) >= 0) {
      if (selectAll) {
        delete itemCopy.appliedFilters[key]
      } else {
        if (!itemCopy.appliedFilters[key]) {
          itemCopy.appliedFilters[key] = 0
        }
        itemCopy.appliedFilters[key]++
      }
    }

    if (Object.keys(itemCopy.appliedFilters).length === 0) {
      delete itemCopy.appliedFilters
      filteredArray.push({ ...itemCopy })
    }

    return itemCopy
  })

  return {
    filteredArray,
    dataWithFilter,
  }
}

export const createFiltersFromItems = (dataArray, filterkey, itemDisplayValueFunc, itemSortValueFunc) => {
  console.log(dataArray, 'dataArray333')
  console.log(filterkey, 'filterkey333')
  const filteredData = dataArray ? [...dataArray] : []
  const usedKeys = []
  let filterList = []

  let selectState = true

  filteredData.map((item) => {
    let itemKey = getValForKey(item, filterkey)
    let orinigalValue = itemKey
    if (!isUndefined(itemDisplayValueFunc)) {
      itemKey = itemDisplayValueFunc(itemKey)
    }

    const appliedFilters = item.appliedFilters || {}
    let displayName = itemKey

    if (isUndefined(itemKey)) {
      displayName = BLANK_LABEL
      itemKey = ''
      orinigalValue = displayName
    } else if ((isTypeString(itemKey))) {
      itemKey = itemKey.trim()
      if (itemKey.length === 0) {
        displayName = BLANK_LABEL
        orinigalValue = displayName
      }
    }

    if (usedKeys.indexOf(itemKey) === -1) {
      if (!isUndefined(appliedFilters) && Object.keys(appliedFilters).length > 0) {
        if (Object.keys(appliedFilters).length === 1 && Object.keys(appliedFilters)[0] === filterkey) {
          selectState = false
          filterList.push({
            key: itemKey,
            display: displayName,
            selected: false,
            visible: true,
            orinigalValue,
          })
        } else {
          filterList.push({
            key: itemKey,
            display: displayName,
            selected: true,
            visible: false,
            orinigalValue,
          })
        }
      } else {
        filterList.push({
          key: itemKey,
          display: displayName,
          selected: true,
          visible: true,
          orinigalValue,
        })
      }

      usedKeys.push(itemKey)
    } else {
      const filterIndex = usedKeys.indexOf(itemKey)
      let filterItem = filterList[filterIndex]
      if (Object.keys(appliedFilters).length === 0) {
        if (!filterItem.selected || !filterItem.visible) {
          filterItem = { ...filterItem, selected: true, visible: true }
          filterList[filterIndex] = filterItem
        }
      }

      if (Object.keys(appliedFilters).length === 1 && Object.keys(appliedFilters)[0] === filterkey) {
        selectState = false
        filterItem = { ...filterItem, selected: false, visible: true }
        filterList[filterIndex] = filterItem
      }
    }
  })

  filterList = sortAction(filterList, ASC_VALUE, {
    valueFunc: itemSortValueFunc,
    key: 'orinigalValue',
  })
  console.log(filterList, 'filterList')
  return {
    filterList,
    selectState,
  }
}

export const calculateFilterProps = ({
  filteredData,
  filterkey,
  itemDisplayValueFunc,
  itemSortValueFunc,
  sortKey,
  sortType,
}) => {
  console.log(filteredData, 'filteredData555')
  console.log(filterkey, 'filterkey555')
  const { filterList, selectState } = createFiltersFromItems(filteredData, filterkey, itemDisplayValueFunc, itemSortValueFunc)
  const sortTypeState = (!isUndefined(sortKey) && (sortKey === filterkey)) ? sortType : undefined

  return {
    filterList,
    selectAllFilters: selectState,
    sortType: sortTypeState,
  }
}
