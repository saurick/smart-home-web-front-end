export const int2hex = (numberT) => {
    let numNew = numberT
    if (typeof (numberT) === 'string') {
        numNew = Number(numberT)
    }
    let reuslt = numNew.toString(16)
    if (reuslt.length % 2 != 0) {
        reuslt = `0${reuslt}`
    }
    return numNew < 0 ? `-${reuslt}` : reuslt
}

export const hexToDecimal = (hex) => parseInt(hex, 16)

export const sleep = async (milliseconds) => {
    await new Promise((resolve) => {
        return setTimeout(resolve, milliseconds)
    })
}

export const findParentNodeByClassName = (node, className) => {
    if (node.className !== className) {
        return findParentNodeByClassName(node?.parentNode, className)
    }
    if (node.className === className) {
        return node
    }
}

export const isUndefined = (str, emptyStringCheck) => {
    if (typeof str === 'undefined' || str === null || str === 'undefined' || str === 'null') {
        return true
    }
    if (emptyStringCheck && typeof str === 'string' && str.toString().trim().length === 0) {
        return true
    }
    return false
}

export const isTypeArray = (val) => {
    return Object.prototype.toString.call(val) === '[object Array]'
}

export const isTypeString = (val) => {
    return Object.prototype.toString.call(val) === '[object String]'
}

export const getValForKey = (obj, key) => {
    if (!isUndefined(key)) {
        if (isTypeString(key)) {
            const keyArray = key.split('.')

            if (keyArray.length === 1) {
                return obj[key]
            }
            let finalValue = obj
            let i
            let l
            for (i = 0, l = keyArray.length; i < l; i += 1) {
                const currKey = keyArray[i]
                const currValue = finalValue[currKey]

                if (!isUndefined(currValue)) {
                    finalValue = currValue
                } else {
                    finalValue = undefined
                    break
                }
            }

            return finalValue
        }
        return obj[key]
    }
}
