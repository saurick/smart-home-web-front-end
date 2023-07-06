# smart-home-web(智能家居前端 -- 私活)

- 项目难点
  - excel过滤功能，和excel一样支持多列联动过滤，并且在表格过滤的同时编辑表格，主要代码参考table组件和filter.js文件
    ![excel filter](/src/assets/snatshot/excel-filter.png "excel filter")
  - 由于excel过滤功能的实现，过滤时支持批量设置，批量编辑，的这个难点功能才得以实现
    ![batch setting](/src/assets/snatshot/batch-setting.png "batch setting")
- 一些项目的主要功能
  - 空间设置时监听路由变化，并且封装成hook
    ![listen-router-change](/src/assets/snatshot/listen-router-change.png "listen-router-change")
  - 设置设备时，避免滑动slider（滑动输入条）的时候，请求过于频繁，利用debounce和useCallback限制请求发送频率
  ![debounce-request](/src/assets/snatshot/debounce-request.png "debounce-request")
  ```
  const debounceRequest = useCallback(debounce(request, 500), []
  ```
  - 使用json-rpc2.0规范的方式进行api请求组织（详见jsonRpc.js文件），而非restful方式，这种方式比restful那种将任何东西都视为资源的方式更好地抽象接口，语义更明确，适合实现内部使用的业务接口，restful更适合做开放接口
    ```
    import { RpcError } from '@/common/utils/rpcError'
    import { selectedKeys } from '@/common/components/sideBar'

    export class JsonRpc {
        constructor(
            method
        ) {
            this.method = method
        }

        async fetchData(params = {}, recieveError = false) {
            let json
            try {
                const sid = localStorage.getItem('sid')
                let id = localStorage.getItem('id')
                id = id ? Number(id) + 1 : 1
                localStorage.setItem('id', id)

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

                if (recieveError && json.error) {
                    localStorage.setItem('id', '')
                    return json.error
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
    ```
- todo：时光场景，还在等设计稿完善，实现思路就是根据各种波形变化画贝塞尔曲线并且在每个时间段填充渐变颜色，并且支持编辑可视化表格
    ![scene-time](/src/assets/snatshot/scene-time.png "scene-time")
  