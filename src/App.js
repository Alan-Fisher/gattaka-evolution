import React, { useEffect } from 'react'
import {
  BrowserRouter as Router, Routes, Navigate, Route,
} from 'react-router-dom'
import { observer } from 'mobx-react'

import { Evolution } from './components/pages'

const App = () => {
  useEffect(() => {
    window.addEventListener('touchmove', preventZoom, { passive: false })

    return () => {
      window.removeEventListener('touchmove', preventZoom, { passive: false })
    }
  }, [])

  const preventZoom = (e) => {
    if (![1, undefined].includes(e.scale)) { e.preventDefault() } // undefined is for old android browsers
  }

  return (
    <Router>
      <Routes>
        <Route element={<Evolution />} exact path="/" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </Router>
  )
}

export default observer(App)
