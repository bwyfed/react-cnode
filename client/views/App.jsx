import React from 'react'
// import { Link } from 'react-router-dom'
import Routes from '../config/router'

export default class App extends React.Component {
  componentDidMount() {
    // do something here
  }

  render() {
    return [
      <Routes key="routes" />,
    ]
  }
}
