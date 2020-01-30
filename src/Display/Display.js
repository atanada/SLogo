import React from 'react'
import ReactDOM from 'react-dom'
import '../styles/style.css'
import birdImgPath from '../icons/bird.png'

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
var canvasBird = null
var ctxBird = null
const birdIcon = new Image()
birdIcon.src = birdImgPath

class BirdCanvas extends React.Component {

  componentDidMount() {
    canvas = this.refs.drawingLayer
    ctx = canvas.getContext("2d")
    canvasBird = this.refs.birdLayer
    ctxBird = canvasBird.getContext("2d")
    ctxBird.drawImage(birdIcon, CENTER.x - BIRD_SIZE / 2, CENTER.y - BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE)
  }

  render () {
    return (
      <div id="bird-display">
        <canvas
          ref="drawingLayer"
          id="drawingLayer"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
        />
        <canvas
          ref="birdLayer"
          id="birdLayer"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
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
      startPosition: {
        x: CENTER.x,
        y: CENTER.y,
        angle: 0,
      },
    }
    this.updateUserInput = this.updateUserInput.bind(this)
    this.submitUserInput = this.submitUserInput.bind(this)
    this.drawShape = this.drawShape.bind(this)
    this.parseInput = this.parseInput.bind(this)
  }

  updateUserInput () {
    this.setState({
      userInput: event.target.value
    })
  }

  drawShape(parsedInput) {
    const direction = parsedInput[0]
    var distance = parsedInput[1]
    // this.state.startPosition.angle < 0 || this.state.startPosition.angle > 180
    //   ? (
    //     distance = parsedInput[1]
    //     )
    //   : (
    //     distance = parsedInput[1]
    //     )
    const degree = (this.state.startPosition.angle * Math.PI) / 180
    console.log("angle  ", this.state.startPosition.angle)

    var xDist = distance * Math.sin(degree)
    var yDist = distance * Math.cos(degree)



    if (direction === "forward" || direction === "fd") {
      var newX = this.state.startPosition.x + xDist
      var newY = this.state.startPosition.y - yDist
      var xBird = newX - BIRD_SIZE / 2
      var yBird = newY - BIRD_SIZE / 2

      ctx.beginPath()
      ctx.moveTo(this.state.startPosition.x, this.state.startPosition.y)
      ctx.lineTo(newX, newY)
      ctxBird.clearRect(0, 0, canvasBird.width, canvasBird.height)
      ctxBird.drawImage(birdIcon, xBird, yBird, BIRD_SIZE, BIRD_SIZE)
      console.log("new x, y", newX, " - ", newY)
      console.log("bird x, y", xBird, " - ", yBird)
      ctx.stroke()
      this.setState({
        startPosition: {
          x: newX,
          y: newY,
          angle: this.state.startPosition.angle,
        }
      })

    } else if (direction === "back" || direction === "bk") {
      const newX = this.state.startPosition.x + xDist
      const newY = this.state.startPosition.y + yDist
      ctx.beginPath()
      ctx.moveTo(this.state.startPosition.x, this.state.startPosition.y)
      ctx.lineTo(newX, newY)
      this.setState({
        startPosition: {
          x: newX,
          y: newY,
          angle: this.state.startPosition.angle,
        },
        birdPosition: {
          left: newX,
          top: newY,
          transform: this.state.birdPosition.transform,
        }
      })
      ctx.stroke()
    } else if (direction === "right" || direction === "rt") {
      const newAngle = this.state.startPosition.angle + distance
      this.setState({
        startPosition: {
          x: this.state.startPosition.x,
          y: this.state.startPosition.y,
          angle: newAngle
        },
        // birdPosition: {
        //   left: this.state.birdPosition.left,
        //   top: this.state.birdPosition.top,
        //   transform: `rotate(${newAngle}deg)`,
        // }
      })
    } else if (direction === "left" || direction === "lt") {
      const newAngle = this.state.startPosition.angle - distance
      this.setState({
        startPosition: {
          x: this.state.startPosition.x,
          y: this.state.startPosition.y,
          angle: newAngle
        },
        birdPosition: {
          left: this.state.birdPosition.left,
          top: this.state.birdPosition.top,
          transform: `rotate(${newAngle}deg)`,
        }
      })
    } else if (direction === "home") {
      this.setState({
        startPosition: {
          x: CENTER.x,
          y: CENTER.y,
          angle: 0,
        },
        birdPosition: {
          left: CANVAS_WIDTH / 2 - BIRD_SIZE / 2,
          top: CANVAS_HEIGHT / 2 - BIRD_SIZE / 2,
          transform: `rotate(${0}deg)`,
        }
      })
    } else {
      alert("invalid command")
    }
  }

  parseInput(userInput) {
    const parsedInput = userInput.split(" ")
    parsedInput[1] = parseInt(parsedInput[1], 10)
    this.drawShape(parsedInput)
  }

  submitUserInput () {
    this.parseInput(this.state.userInput)
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
