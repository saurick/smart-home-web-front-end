export class RpcError extends Error {
    constructor(json) {
        if (json.error) {
            super(json.error.message)
        }
        Object.setPrototypeOf(this, RpcError.prototype)
        this.json = json
    }
}
