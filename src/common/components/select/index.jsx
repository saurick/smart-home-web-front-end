import React, { useEffect, useRef, useState, useMemo } from 'react'
import styles from './index.module.less'
import { useClickAway } from '@/common/hooks'
import { ClearIcon, SelectHoverIcon, SelectDefaultIcon } from '@/common/components/icons'
import { findParentNodeByClassName, isUndefined } from '@/common/utils/util'

export const Select = (props) => {
    const [isDropdown, setIsDropdown] = useState(false)
    const [options, setOptions] = useState([])
    const [dropdownStyle, setDropdownStyle] = useState({})
    const [showClearButton, setShowClearButton] = useState(false)
    const [showHoverIcon, setShowHoverIcon] = useState(false)

    const dropdownRef = useRef()
    const showDropdownRef = useRef()
    const itemRef = useRef()

    const onDropdown = (event) => {
        event.stopPropagation()

        if (isDropdown === false) {
            showDropdownRef.current.style.border = '1px solid #2558BF'
        }
        if (isDropdown === true) {
            showDropdownRef.current.style.border = 'none'
        }

        const node = findParentNodeByClassName(event.target, 'select-input-outer-wrapper')
        const rect = node.getBoundingClientRect()
        const distance = document.body.offsetHeight - rect.top - rect.height - 170
        if (distance < 0) {
            setDropdownStyle({
                bottom: document.body.offsetHeight - rect.top + 7
            })
        }
        if (distance > 0) {
            setDropdownStyle({
                top: rect.top + rect.height + 7
            })
        }
        setIsDropdown(!isDropdown)
    }

    const onClickItem = (value) => {
        props.onChange && props.onChange(value)
        setIsDropdown(false)
    }

    const clearSelectedData = (event) => {
        event.stopPropagation()
        props.onChange && props.onChange('')
    }

    const enterSelectInput = () => {
        if (props.allowClear) {
            setShowClearButton(true)
        }
        if (!props.allowClear) {
            setShowHoverIcon(true)
        }
    }

    const leaveSelectInput = () => {
        setShowClearButton(false)
        setShowHoverIcon(false)
    }

    useClickAway(showDropdownRef, dropdownRef, () => {
        setIsDropdown(false)
        showDropdownRef.current.style.border = 'none'
    })
    useClickAway(showDropdownRef, showDropdownRef, () => {
        if (isDropdown === false) {
            showDropdownRef.current.style.border = 'none'
        }
    })

    useEffect(() => {
        console.log(props.defaultValue, 'isUndefined(props.defaultValue)')
        setOptions(props.options || [])
    }, [props])

    return (
      <div className={styles.selectWrapper} {...props}>
        {
                props.title && (
                <div className="title">{props.title}</div>
                )
            }
        <div className="select-input-outer-wrapper" style={{ width: props.width && `${props.width}px` }}>
          <div
            className={`select-wrapper ${props.placeholder}`}
            onClick={(event) => { onDropdown(event) }}
            ref={showDropdownRef}
            onMouseEnter={() => { enterSelectInput() }}
            onMouseLeave={() => { leaveSelectInput() }}
          >
            {
                        !isUndefined(props.defaultValue, true) && (
                        <div className="value">{props.defaultValue}</div>
                        )
                    }
            {
                        (isUndefined(props.defaultValue, true) && props.placeholder) && (
                        <div className="placeholder">{props.placeholder}</div>
                        )
                    }

            {
                        showClearButton ? (
                          <ClearIcon width="13" height="13" style={{ marginRight: '4px' }} onClick={(event) => { clearSelectedData(event) }} />
                        ) : (
                          <>
                            {
                                    showHoverIcon ? (
                                      <SelectHoverIcon />
                                    ) : (
                                      <SelectDefaultIcon />
                                    )
                                }
                          </>
                        )
                    }
          </div>
          {
                    isDropdown && (
                    <div className="dropdown-wrapper" ref={dropdownRef} style={{ ...dropdownStyle, width: props.width && `${props.width}px` }}>
                      {

                                options.length > 0 && options.map((item, index) => {
                                    if (item.label) {
                                        return (
                                          <div
                                            className="item-wrapper"
                                            key={index}
                                            ref={itemRef}
                                            onClick={() => { onClickItem(item.value) }}
                                            style={{ background: props.defaultValue === item.label && 'rgba(32, 90, 210, 0.1)' }}
                                          >
                                            <div className="item" style={{ fontWeight: props.defaultValue === item.label && 'bold' }}>{item.label}</div>
                                          </div>
                                        )
                                    }
                                })
                            }
                      {
                                options.length === 0 && (
                                <div className="empty">（空）</div>
                                )
                            }
                    </div>
                    )
                }
        </div>
      </div>
    )
}
