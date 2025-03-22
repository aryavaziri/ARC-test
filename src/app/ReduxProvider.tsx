'use client'

import { Provider } from 'react-redux'
import { AppStore, makeStore } from "@/store/store";
import { useRef } from 'react';

export default function ReduxProvider({children}:React.PropsWithChildren){

    const storeRef = useRef<AppStore>(null)
    if (!storeRef.current) {
        storeRef.current = makeStore()
    }

    return (
        <Provider store={storeRef.current}>
            {children}
        </Provider>
    )
}

