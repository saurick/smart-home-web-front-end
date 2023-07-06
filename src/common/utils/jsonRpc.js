import { RpcError } from '@/common/utils/rpcError'
import { selectedKeys } from '@/common/components/sideBar'

export class JsonRpc {
    constructor(
        method
    ) {
        this.method = method
    }

    goToLogin() {
        const key = selectedKeys()
        localStorage.setItem('path', key)
        window.location.href = `http://${location.host}/`
    }

    async fetchData(params = {}, recieveError = false) {
        let json
        try {
            const sid = localStorage.getItem('sid')
            let id = localStorage.getItem('id')
            id = id ? Number(id) + 1 : 1
            localStorage.setItem('id', id)

            if (!sid && this.method !== 'login') {
                this.goToLogin()
            }

            if (this.method !== 'login' && !!sid) {
                params = { ...params, sid }
            } else {
                params = { ...params }
            }
            const response = await fetch('/rpc', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    params,
                    method: this.method,
                    jsonrpc: '2.0',
                    id
                })
            })
            json = await response.json()

            if (!json.error) {
                Object.keys(json.result).forEach((item) => {
                    if (Array.isArray(json.result[item])) {
                        json.result[item].forEach((item, index) => {
                            item.key = index //  表格数据每行加上key
                            item.orderNum = String(index + 1).padStart(3, '0') //  表格数据每行加上序号
                        })
                    }
                })
            }

            console.log(json.result, 'json.result')
            if (recieveError && json.error) {
                localStorage.setItem('id', '')
                return json.error
            }
            if (json.error && json.error.code === -32000) {
                this.goToLogin()
            }
            if (json.error) {
                localStorage.setItem('id', '')
                throw new RpcError(json)
            }
        } catch (e) {
            e.isFetchError = true
            throw e
        }
        return json.result
    }
}
