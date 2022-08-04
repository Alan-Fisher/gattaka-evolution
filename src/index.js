import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'

import App from './App'
import './index.less'

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root'),
)
