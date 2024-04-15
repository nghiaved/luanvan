import React, { createContext, useReducer, useContext } from 'react'

const defaultGlobal = {
    fetchAgain: false,
    userConversation: null
}

export const globalContext = createContext(defaultGlobal)
export const dispatchContext = createContext(undefined)

export const GlobalState = ({ children }) => {
    const [state, dispatch] = useReducer(
        (state, newValue) => ({ ...state, ...newValue }),
        defaultGlobal
    )
    return (
        <globalContext.Provider value={state}>
            <dispatchContext.Provider value={dispatch}>
                {children}
            </dispatchContext.Provider>
        </globalContext.Provider>
    )
}

export const useGlobal = () => [
    useContext(globalContext),
    useContext(dispatchContext)
]