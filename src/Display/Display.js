import React from 'react'
import ReactDOM from 'react-dom'
import '../styles/style.css'
import Console from './Console'

class Display extends React.Component {
  render () {
    return (
      <div id="display">
        <div>
          <div id="title">
            <h1>SLogo</h1>
            <p> A simple version of Logo</p>
          </div>

          <div id="turtle-display">
            turtle
          </div>
        </div>
        <div id="side-bar">
          <div id="history" className="display-component">
            history
          </div>
          <Console />
        </div>
      </div>
    )
  }
}

export default Display
