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
const STARTING_ANGLE = 0
const CENTER = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT / 2
}
var canvas = null
var ctx = null
var canvasBird = null
var ctxBird = null
const birdIcon = new Image()
birdIcon.src = birdImgPath
var birdPosition = {
  x: CENTER.x,
  y: CENTER.y,
  angle: STARTING_ANGLE,
}

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
      }
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

  forwardMove(position, distance) {
    const degree = (position.angle * Math.PI) / 180
    var xDist = distance * Math.sin(degree)
    var yDist = distance * Math.cos(degree)
    var newX = position.x + xDist
    var newY = position.y - yDist
    ctx.beginPath()
    ctx.moveTo(position.x, position.y)
    ctx.lineTo(newX, newY)
    ctxBird.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ctxBird.save()
    ctxBird.translate(newX, newY)
    ctxBird.rotate(degree)
    ctxBird.drawImage(birdIcon, -BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE)
    ctxBird.restore()
    ctx.stroke()
    birdPosition.x = newX
    birdPosition.y = newY
  }

  backMove(position, distance) {
    const degree = (position.angle * Math.PI) / 180
    let revDegree = ((position.angle + 180) * Math.PI) / 180
    var xDist = distance * Math.sin(revDegree)
    var yDist = distance * Math.cos(revDegree)
    var newX = position.x + xDist
    var newY = position.y - yDist

    ctx.beginPath()
    ctx.moveTo(position.x, position.y)
    ctx.lineTo(newX, newY)
    ctxBird.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ctxBird.save()
    ctxBird.translate(newX, newY)
    ctxBird.rotate(degree)
    ctxBird.drawImage(birdIcon, -BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE)
    ctxBird.restore()
    ctx.stroke()
    birdPosition.x = newX
    birdPosition.y = newY
  }

  rightRotate(position, distance) {
    let newAngle = position.angle + distance
    const degree = (newAngle * Math.PI) / 180
    ctxBird.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ctxBird.save()
    ctxBird.translate(position.x, position.y)
    ctxBird.rotate(degree)
    ctxBird.drawImage(birdIcon, -BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE)
    ctxBird.restore()
    birdPosition.angle = newAngle
  }

  leftRotate (position, distance) {
    let newAngle = position.angle - distance
    const degree = (newAngle * Math.PI) / 180

    ctxBird.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ctxBird.save()
    ctxBird.translate(position.x , position.y )
    ctxBird.rotate(degree)
    ctxBird.drawImage(birdIcon, -BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE)
    ctxBird.restore()
    birdPosition.angle = newAngle
  }

  homeMove () {
    ctxBird.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ctxBird.drawImage(birdIcon, CENTER.x - BIRD_SIZE / 2, CENTER.y - BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE)
    birdPosition = {
      x: CENTER.x,
      y: CENTER.y,
      angle: STARTING_ANGLE,
    }
  }

  parseInput(userInput) {
    const lineBreakParse = userInput.split("\n")
    this.drawShape(lineBreakParse)
  }
  // commands still needed:
  // repeat
  // for
  // pen up
  // pen down

  drawShape(lineBreakParse) {
    for (var i = 0; i < lineBreakParse.length; i++) {
      let parsedInput = lineBreakParse[i].split(" ")
      let distance = parseInt(parsedInput[1], 10)
      let direction = parsedInput[0]

      if (direction === "forward" || direction === "fd") {
        this.forwardMove(birdPosition, distance)
      } else if (direction === "back" || direction === "bk") {
        this.backMove(birdPosition, distance)
      } else if (direction === "right" || direction === "rt") {
        this.rightRotate(birdPosition, distance)
      } else if (direction === "left" || direction === "lt") {
        this.leftRotate(birdPosition, distance)
      } else if (direction == "home") {
        this.homeMove()
      } else if (direction == "clear") {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        this.homeMove()
      } else {
        alert(direction + "is an invalid command")
      }
    }
    this.setState({
      startPosition: {
        x: birdPosition.x,
        y: birdPosition.y,
        angle: birdPosition.angle,
      }
    })
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
