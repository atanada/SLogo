import React from 'react'
import ReactDOM from 'react-dom'
import '../styles/style.css'

class Console extends React.Component {
  // handleKeyPress = (event) => {
  //   if (event == 'Enter') {


  //   }
  // }
  render () {
    return (
      <div id="console" className="display-component">
        <textarea
            placeholder="enter a command..."
            autofocus={true}
        >
        </textarea>
        <button id="run-button">
          Run
        </button>

      </div>
    )
  }

}
export default Console
