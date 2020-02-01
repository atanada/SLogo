import '../styles/style.css'
import React from 'react'
import {UserInputProcessingContext} from './UserInputProcessingContext'

class CommandHistory extends React.Component {
  render() {
    return (
      <div id="history" className="display-component">
          Command History
          <ul>
            {
              this.context.statefulValues.userHistoryList.map((command, index) =>
                <li key={index}>
                  { command }
                </li>
              )
            }
          </ul>
      </div>
    )
  }
}
CommandHistory.contextType = UserInputProcessingContext

export {
  CommandHistory
}
