import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Sidebar } from 'semantic-ui-react'
import HomePage from './pages/home'
import DashboardPage from './pages/dashboard'
import CallbackPage from './pages/callback'
import Auth from './components/Auth'
import 'semantic-ui-css/semantic.min.css'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment'
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu'
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon'

function App() {
  return (
    <div className="App" style={{ height: '100%' }}>
      <Auth>
        <Router>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/callback" component={CallbackPage} />
          </Switch>
        </Router>
      </Auth>
    </div>
  )
}

const rootElement = document.getElementById('root')
// rootElement.style.height = "100%";
ReactDOM.render(<App />, rootElement)
