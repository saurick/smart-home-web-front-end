import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'
import loginBackground from '@/assets/icons/login-background.png'
import { JsonRpc } from '@/common/utils/jsonRpc'
import { crypto } from '@/common/stores/crypto'
import {
  LoginIcon,
  PasswordInputIcon
} from '@/common/components/icons'

export const Login = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')

  const onPasswordInput = (event) => {
    setPassword(event.target.value)
  }

  const login = async () => {
    const rpc = new JsonRpc('user_login')
    const obj = {}
    obj.username = 'admin'
    obj.password = crypto.md5(`admin${password}`)
    const result = await rpc.fetchData({ ...obj })
    localStorage.setItem('sid', result.sid)
    const path = localStorage.getItem('path')
    if (path) {
      navigate(path)
      return
    }
    navigate('/smart-space')
  }

  return (
    <div className={styles.loginWrapper}>
      <div className="login-background-wrapper" style={{ backgroundImage: `url(${loginBackground})` }}>
        <LoginIcon />
        <div className="login-title">海令云平台设备终端管理系统</div>
        <div className="login-password-wrapper">
          <div className="password">登录密码</div>
          <div className="password-input-wrapper">
            <PasswordInputIcon className="icon" />
            <input className="input" type="password" placeholder="输入登录密码" onChange={(event) => onPasswordInput(event)} />
          </div>
        </div>
        <div className="login-button-wrapper" onClick={() => login()}>
          <div className="login">登 录</div>
        </div>
      </div>
    </div>
  )
}
