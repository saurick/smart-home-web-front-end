import React, { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router'
import { Helmet } from 'react-helmet-async'
import { useFavicon } from 'react-use'
import { Loading } from '@/common/components/loading'
import { Login } from '@/pages/login'
import { LogoIcon } from '@/common/components/icons'

import ContextProvider from '@/common/stores'
import 'normalize.css/normalize.css'
import './reset.css'

const Index = lazy(() => import('@/pages'))

// App 入口
export default () => {
  useFavicon(LogoIcon)
  return (
    <>
      <Helmet>
        <title>template-webapp</title>
      </Helmet>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="*"
            element={
              <ContextProvider>
                <Index />
              </ContextProvider>
          }
          />
        </Routes>
      </Suspense>
    </>
  )
}
