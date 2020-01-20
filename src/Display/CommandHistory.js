import React from 'react'
import ReactDOM from 'react-dom'
import '../styles/style.css'
import { userHistoryList } from './Console.js'

class CommandHistory extends React.Component {
  render() {
    const userInputHistoryDisplay =
      this.state.userHistoryList.map((command) =>
        <li key={COMMAND_LIST_KEYS+=1}>
          { command }
        </li>
    )
    return (
      <div id="history" className="display-component">
          command history
          <ul>
            { userInputHistoryDisplay }
          </ul>
      </div>
    )
  }
}

export default CommandHistory
