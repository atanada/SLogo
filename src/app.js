import React from 'react'
import ReactDOM from 'react-dom'
import './styles/style.css'
import Display from './Display/Display'

class App extends React.Component {
  render () {
    return (
      <div>
        <Display />
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

module.hot.accept()
