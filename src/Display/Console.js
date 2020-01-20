import React from 'react'
import ReactDOM from 'react-dom'
import '../styles/style.css'

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
export default Console

// export { userHistoryList }
