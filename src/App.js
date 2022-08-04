import React from 'react'
import {
  BrowserRouter as Router, Routes, Navigate, Route,
} from 'react-router-dom'
import { observer } from 'mobx-react'

import { Evolution } from './components/pages'

const App = () => (
  <Router>
    <Routes>
      <Route element={<Evolution />} exact path="/evolution" />
      <Route element={<Navigate replace to="/evolution" />} path="*" />
    </Routes>
  </Router>
)

export default observer(App)
