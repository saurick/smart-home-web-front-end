import React, { useState, useEffect } from 'react'
import styles from './index.module.less'

export const Tabs = ({ children, ...props }) => {
  const [activeTab, setActiveTab] = useState('')

  const setTabs = (item) => {
    setActiveTab(item.key)
    props.getActiveTab && props.getActiveTab(item.key)
  }

  useEffect(() => {
    console.log(props.defaultActiveTab, 'props.defaultActiveTab')
    const key = props.defaultActiveTab || props.items[0]?.key
    setActiveTab(key)
  }, [props.defaultActiveTab])
console.log(props.items, 'items')
  return (
    <div className={styles.tabsWrapper}>
      {
        props.type === 'default' && (
          <div className="default-tabs-header" style={{ ...props.headerStyle }}>
            {
              (props.items.length > 0) && props.items.map((item, index) => {
                return (
                  <div key={item.label} className={activeTab === item.key ? 'tab-active' : 'tab-inactive'} onClick={() => { setTabs(item) }}>
                    <div className={activeTab === item.key ? 'text-active' : 'text-inactive'}>{item.label}</div>
                  </div>
                )
              })
            }
          </div>
        )
      }
      {
        props.type === 'card' && (
          <div className="card-tabs-header" style={{ ...props.headerStyle }}>
            {
              (props.items.length > 0) && props.items.map((item, index) => {
                return (
                  <div key={item.key} className={activeTab === item.key ? 'tab-active' : 'tab-inactive'} onClick={() => { setTabs(item) }}>
                    <div className={activeTab === item.key ? 'text-active' : 'text-inactive'}>{item.label}</div>
                  </div>
        )
      })
            }
          </div>
  )
}
      {
  props.type === 'icon' && (
    <div className="icon-tabs-header" style={{ ...props.headerStyle }}>
      {
        (props.items.length > 0) && props.items.map((item, index) => {
          return (
            <div key={item.key} className={activeTab === item.key ? 'tab-active' : 'tab-inactive'} onClick={() => setTabs(item)}>
              <div className={activeTab === item.key ? 'icon-active icon' : 'icon-inactive icon'}>
                {item.icon}
              </div>
              <div className={activeTab === item.key ? 'text-active' : 'text-inactive'}>{item.label}</div>
            </div>
          )
        })
      }
    </div>
  )
}
      {
  (props.items.length > 0) && props.items.map((item, index) => {
    return (
      <div className="tab-content" key={item.key}>
        {
          (activeTab == item.key) && (
            children || item.children
          )
        }
      </div>
    )
  })
}
    </div>
  )
}
