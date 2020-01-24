import React from 'react'
import ReactDOM from 'react-dom'
import './styles/style.css'
import Display from './Display/Display'

class App extends React.Component {
  render () {
    return (
      <div>
        <Display />
        <div>
          Icons made by
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>
          from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

module.hot.accept()
