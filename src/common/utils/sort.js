import { isUndefined, isTypeString, getValForKey } from './util'

export const sortAction = (inputArray = [], type = undefined, { valueFunc = undefined, caseSensitive = false, key = undefined } = {}) => {
  if (!isUndefined(type)) {
    const inputCopy = [...inputArray]

    const sortFunc = (a, b) => {
      let aValue, bValue

      if (!isUndefined(key)) {
        aValue = getValForKey(a, key)
        bValue = getValForKey(b, key)
      } else {
        aValue = a
        bValue = b
      }

      if (!isUndefined(valueFunc)) {
        aValue = valueFunc(aValue)
        bValue = valueFunc(bValue)
      } else {
        if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
          aValue = Number(aValue)
          bValue = Number(bValue)
        }

        if (isTypeString(aValue)) {
          aValue = aValue.trim()
          if (!caseSensitive) {
            aValue = aValue.toUpperCase()
          }
        }

        if (isTypeString(bValue)) {
          bValue = bValue.trim()
          if (!caseSensitive) {
            bValue = bValue.toUpperCase()
          }
        }
      }

      if (isUndefined(aValue)) {
        aValue = ''
      }

      if (isUndefined(bValue)) {
        bValue = ''
      }

      let result = 0

      // if (aValue < bValue) {
      //   result = -1
      // } else {
      //   result = 1
      // }

      const reg = /[a-zA-Z0-9]/
      if (reg.test(aValue) || reg.test(bValue)) {
        if (aValue > bValue) {
          result = 1
        } else if (aValue < bValue) {
          result = -1
        } else {
          result = 0
        }
      } else {
        result = aValue.localeCompare(bValue, 'zh-Hans-CN', { numeric: true })
      }

      if (type === 'asc') {
        return result
      }
        return -(result)
    }

    return inputCopy.sort(sortFunc)
  }
  return inputArray
}

export default sortAction
