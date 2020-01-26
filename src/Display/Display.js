import React from 'react'
import ReactDOM from 'react-dom'
import '../styles/style.css'
import BirdIcon from '../icons/bird.svg'

var COMMAND_LIST_KEYS = 0
const UserInputProcessingContext = React.createContext()

class Console extends React.Component {
  render () {
    return (
      <div id="console" className="display-component">
        <textarea
          placeholder="enter a command..."
          autoFocus={true}
          value={this.context.statefulValues.userInput}
          onChange={() => this.context.updateUserInput()}
        >
        </textarea>
        <button
          id="run-button"
          onClick={() => this.context.submitUserInput()}
        >
          Run
        </button>
      </div>
    )
  }
}
Console.contextType = UserInputProcessingContext

class CommandHistory extends React.Component {
  render() {
    return (
      <div id="history" className="display-component">
          Command History
          <ul>
            {
              this.context.statefulValues.userHistoryList.map((command) =>
                <li key={COMMAND_LIST_KEYS+=1}>
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

const BIRD_SIZE = 40
const CANVAS_WIDTH = 1060
const CANVAS_HEIGHT = 600
const CENTER = {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2}
var canvas = null
var ctx = null

class BirdCanvas extends React.Component {

  componentDidMount() {
    canvas = this.refs.birdDisplay
    ctx = canvas.getContext("2d")
  }

  render () {
    return (
      <div id="bird-display">
        <canvas
          ref="birdDisplay"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
        />
        <BirdIcon
          style={this.context.statefulValues.birdPosition}
        />
      </div>
    )
  }
}
BirdCanvas.contextType = UserInputProcessingContext

class Display extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userInput: "",
      userHistoryList: [],
      startingPoint: {
        x: CENTER.x,
        y: CENTER.y
      },
      birdPosition: {
        top: CANVAS_HEIGHT / 2 - BIRD_SIZE / 2,
        left: CANVAS_WIDTH / 2 - BIRD_SIZE / 2,
        transform: null,
      }
    }
    this.updateUserInput = this.updateUserInput.bind(this)
    this.submitUserInput = this.submitUserInput.bind(this)
    this.drawShape = this.drawShape.bind(this)
  }

  updateUserInput () {
    this.setState({
      userInput: event.target.value
    })
  }

  drawShape(userInput) {
    if (userInput === "forward") {
      ctx.beginPath()
      ctx.moveTo(this.state.startingPoint.x, this.state.startingPoint.y)
      ctx.lineTo(this.state.startingPoint.x, this.state.startingPoint.y - 100)
      this.setState({
        startingPoint: {
          x: this.state.startingPoint.x,
          y: this.state.startingPoint.y - 100,
        },
        birdPosition: {
          top: this.state.birdPosition.top - 100,
          left: this.state.birdPosition.left,
          transform: `rotate(${90}deg)`,
        }
      })
      ctx.stroke()
    } else {
      alert("invalid command")
    }
  }

  submitUserInput () {
    this.drawShape(this.state.userInput)
    this.setState({
      userHistoryList: this.state.userHistoryList.concat(this.state.userInput),
      userInput: ""
    })
  }

  render () {
    const userInputProcessing = {
      statefulValues: this.state,
      updateUserInput: this.updateUserInput,
      submitUserInput: this.submitUserInput,
    }

    return (
      <UserInputProcessingContext.Provider value={userInputProcessing}>
        <div id="display">
          <div>
            <div id="title">
              <h1>SLogo</h1>
              <p>A simple version of Logo</p>
            </div>
            <BirdCanvas />
          </div>
          <div id="side-bar">
            <CommandHistory />
            <Console />
          </div>
        </div>
      </UserInputProcessingContext.Provider>
    )
  }
}

export default Display
