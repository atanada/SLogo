import React from 'react';
import ReactDOM from 'react-dom';
import './styles/style.css'

class App extends React.Component {
  render () {
    return (
      <div>
        <h1>SLogo</h1>
        <p> A simple version of Logo</p>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

module.hot.accept()
