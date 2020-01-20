import React from 'react'
import ReactDOM from 'react-dom'
import '../styles/style.css'
// import Console from './Console'
// import CommandHistory from './CommandHistory'

var COMMAND_LIST_KEYS = 0

class Console extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userInput: "",
      userHistoryList: []
    }
  }
  updateUserInput () {
    this.setState(() => {
      return {
        userInput: event.target.value
      }
    })
  }

  submitUserInput () {
    this.setState(() => {
      return {
        userHistoryList: this.state.userHistoryList.concat(this.state.userInput),
        userInput: ""
      }
    })
  }

  render () {
    const userInputHistoryDisplay =
      this.state.userHistoryList.map((command) =>
        <li key={COMMAND_LIST_KEYS+=1}>
          { command }
        </li>
    )
    return (
      <div>
        <div id="history" className="display-component">
          command history
          <ul>
            { userInputHistoryDisplay }
          </ul>
        </div>
        <div id="console" className="display-component">
          <textarea
            placeholder="enter a command..."
            refs="consoleInput"
            autoFocus={true}
            value={this.state.userInput}
            onChange={() => this.updateUserInput()}
          >
          </textarea>
          <button
            id="run-button"
            onClick={() => this.submitUserInput()}
          >
            Run
          </button>
        </div>

      </div>
    )
  }
}

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
          {/* <CommandHistory /> */}
          <Console />
        </div>
      </div>
    )
  }
}

export default Display
