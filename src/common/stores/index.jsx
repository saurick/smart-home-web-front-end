import React, { createContext, useContext, useReducer } from 'react'

export const intiData = {
    sceneSelectedActions: [],
    autoControlSelectedConditions: [],
    autoControlSelectedActions: [],
    filterActiveList: [],
    routerFrom: ''
}

const Context = createContext({
    state: intiData,
    dispatch: () => { }
})

export const getContext = () => {
    return useContext(Context)
}

export const ContextProvider = (props) => {
    const reducer = (preState = intiData, action) => {
        const { type, payload } = action
        switch (type) {
            case 'scene-selected-actions':
                console.log(payload, 'payload')
                return { ...preState, sceneSelectedActions: payload }
            case 'auto-control-selected-conditions':
                console.log(payload, 'payload')
                return { ...preState, autoControlSelectedConditions: payload }
            case 'auto-control-selected-actions':
                console.log(payload, 'payload')
                return { ...preState, autoControlSelectedActions: payload }
            case 'table-filter-active-list':
                return { ...preState, filterActiveList: payload }
            case 'router-from':
                return { ...preState, routerFrom: payload }
            default: return { ...preState }
        }
    }
    const [state, dispatch] = useReducer(reducer, intiData)
    const store = React.useMemo(() => ({ state, dispatch }), [state])
    return (
      <Context.Provider value={store}>
        {props.children}
      </Context.Provider>
    )
}
export default ContextProvider
