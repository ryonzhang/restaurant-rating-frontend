import React, { Component } from 'react'
import auth0 from 'auth0-js'

import { AUTH_CONFIG } from '../auth0-variables'
import { AuthProvider } from '../authContext'

import visitor from '../assets/visitor.png'

const auth = new auth0.WebAuth({
  domain: AUTH_CONFIG.domain,
  clientID: AUTH_CONFIG.clientId,
  redirectUri: AUTH_CONFIG.callbackUrl,
  audience: AUTH_CONFIG.audience,
  responseType: 'token id_token',
})

class Auth extends Component {
  state = {
    authenticated: false,
    user: {
      role: '',
      picture: visitor,
      name: '',
    },
    accessToken: '',
  }

  initiateLogin = () => {
    auth.authorize()
  }

  logout = () => {
    this.setState({
      authenticated: false,
      user: {
        role: '',
        picture: visitor,
        name: '',
      },
      accessToken: '',
    })
    localStorage.removeItem('auth')
  }

  handleAuthentication = () => {
    auth.parseHash((error, authResult) => {
      if (error || localStorage.getItem('auth')) {
        console.log(error)
        // console.log(`Error ${error.error} Occured`)
        return
      }
      console.log(authResult)
      this.setSession(authResult)
    })
  }

  setSession(data) {
    console.log(data)
    const user = {
      id: data.idTokenPayload.sub,
      email: data.idTokenPayload.email,
      role: data.idTokenPayload[AUTH_CONFIG.roleUrl][0]||'user',
      picture: data.idTokenPayload.picture,
      name: data.idTokenPayload.name,
    }
    const auth = {
      authenticated: true,
      accessToken: data.accessToken,
      user,
    }
    this.setState(auth)
    localStorage.setItem('auth', JSON.stringify(auth))
    console.log(this.state)
  }

  render() {
    const auth = JSON.parse(localStorage.getItem('auth'))
    const state = auth ? auth : this.state
    console.log(this.state)
    const authProviderValue = {
      ...state,
      initiateLogin: this.initiateLogin,
      handleAuthentication: this.handleAuthentication,
      logout: this.logout,
    }
    return (
      <AuthProvider value={authProviderValue}>
        {this.props.children}
      </AuthProvider>
    )
  }
}

export default Auth
