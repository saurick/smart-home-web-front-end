import React, { useState, useEffect } from 'react'
import { CheckOutlined } from '@ant-design/icons'
import styles from './index.module.less'
import { Input } from '@/common/components/input'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { crypto } from '@/common/stores/crypto'
import { UserInfoHeaderIcon } from '@/common/components/icons'
import { isUndefined } from '@/common/utils/util'

export const UserInfo = () => {
  const [isGatewayNameEdit, setIsGatewayNameEdit] = useState(false)
  const [isPasswordEdit, setIsPasswordEdit] = useState(false)
  const [password, setPassword] = useState('')
  const [localGwInfo, setLocalGwInfo] = useState({})
  const [passwordErrorInfo, setPasswordErrorInfo] = useState('')

  const toChangeGatewayName = () => {
    setIsGatewayNameEdit(true)
  }

  const toChangePassword = async () => {
    setIsPasswordEdit(true)
  }

  const onGatewayInput = (value) => {
    setLocalGwInfo({ ...localGwInfo, gw_name: value })
  }

  const onPasswordInput = (value) => {
    setPassword(value)
  }

  const onSaveGatewayName = async () => {
    const obj = {}
    obj.gw_id = localGwInfo.gw_id
    obj.gw_name = localGwInfo.gw_name
    const rpc = new JsonRpc('set_gw_name')
    const result = await rpc.fetchData({ ...obj })
    setIsGatewayNameEdit(false)
  }

  const onSavePassword = async () => {
    if (isUndefined(password, true)) {
      setPasswordErrorInfo('请输入密码')
      return
    }

    const obj = {}
    obj.username = 'admin'
    obj.password = crypto.md5(`admin${password}`)
    const rpc = new JsonRpc('change_password')
    const result = await rpc.fetchData({ ...obj })
    setIsPasswordEdit(false)
  }

  const getLocalGwInfo = async () => {
    const rpc = new JsonRpc('get_local_gw_info')
    const result = await rpc.fetchData()
    setLocalGwInfo(result)
  }

  useEffect(() => {
    getLocalGwInfo()
  }, [])

  return (
    <div className={styles.userInfoWrapper}>
      <div className="user-info-header-wrapper">
        <UserInfoHeaderIcon />
        <div className="title">用户信息</div>
      </div>
      <div className="user-info-content-wrapper">
        <div className="platform-wrapper">
          <div className="title">网关名称</div>
          {
            isGatewayNameEdit ? (
              <Input type="default" defaultValue={localGwInfo.gw_name} onChange={(value) => onGatewayInput(value)} placeholder="输入网关名称" style={{ marginRight: '40px', width:'230px' }} />
            ) : (
              <div className="value">{localGwInfo.gw_name}</div>
            )
          }
          {
            isGatewayNameEdit ? (
              <div className="change-platform-button-wrapper" onClick={() => { onSaveGatewayName() }}>
                <CheckOutlined className="icon" />
                <div className="text">保存修改</div>
              </div>
            ) : (
              <div className="change-platform-button" onClick={() => { toChangeGatewayName() }}>修改名称</div>
            )
          }
        </div>

        <div className="password-wrapper">
          <div className="title">登陆密码</div>
          {
            isPasswordEdit ? (
              <Input type="default" defaultValue={password} errorInfo={passwordErrorInfo} onChange={(event) => onPasswordInput(event)} placeholder="输入密码" style={{ marginRight: '40px', width:'230px' }} />
            ) : (
              <div className="value">{password.replace(/(.)/g, '*')}</div>
            )
          }
          {
            isPasswordEdit ? (
              <div className="change-password-button-wrapper" onClick={() => { onSavePassword() }}>
                <CheckOutlined className="icon" />
                <div className="text">保存修改</div>
              </div>
            ) : (
              <div className="change-password-button" onClick={() => { toChangePassword() }}>修改密码</div>
            )
          }
        </div>
      </div>
    </div>
  )
}
