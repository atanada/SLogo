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

  drawShape(parsedInput) {
    const direction = parsedInput[0]
    var distance = parsedInput[1]
    const degree = (this.state.startPosition.angle * Math.PI) / 180

    if (direction === "forward" || direction === "fd") {
      var xDist = distance * Math.sin(degree)
      var yDist = distance * Math.cos(degree)
      var newX = this.state.startPosition.x + xDist
      var newY = this.state.startPosition.y - yDist

      ctx.beginPath()
      ctx.moveTo(this.state.startPosition.x, this.state.startPosition.y)
      ctx.lineTo(newX, newY)
      ctxBird.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctxBird.save()
      ctxBird.translate(newX, newY)
      ctxBird.rotate(degree)
      ctxBird.drawImage(birdIcon, -BIRD_SIZE/2, -BIRD_SIZE/2, BIRD_SIZE, BIRD_SIZE)
      ctxBird.restore()
      ctx.stroke()

      this.setState({
        startPosition: {
          x: newX,
          y: newY,
          angle: this.state.startPosition.angle,
        }
      })

    } else if (direction === "back" || direction === "bk") {
      let revDegree = ((this.state.startPosition.angle + 180) * Math.PI) / 180
      var xDist = distance * Math.sin(revDegree)
      var yDist = distance * Math.cos(revDegree)
      var newX = this.state.startPosition.x + xDist
      var newY = this.state.startPosition.y - yDist

      ctx.beginPath()
      ctx.moveTo(this.state.startPosition.x, this.state.startPosition.y)
      ctx.lineTo(newX, newY)
      ctxBird.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctxBird.save()
      ctxBird.translate(newX, newY)
      ctxBird.rotate(degree)
      ctxBird.drawImage(birdIcon, -BIRD_SIZE/2, -BIRD_SIZE/2, BIRD_SIZE, BIRD_SIZE)
      ctxBird.restore()
      ctx.stroke()

      this.setState({
        startPosition: {
          x: newX,
          y: newY,
          angle: this.state.startPosition.angle,
        }
      })

    } else if (direction === "right" || direction === "rt") {
      let newAngle = this.state.startPosition.angle + distance
      const degree = (newAngle * Math.PI) / 180

      ctxBird.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctxBird.save()
      ctxBird.translate(this.state.startPosition.x , this.state.startPosition.y )
      ctxBird.rotate(degree)
      ctxBird.drawImage(birdIcon, -BIRD_SIZE/2, -BIRD_SIZE/2, BIRD_SIZE, BIRD_SIZE)
      ctxBird.restore()

      this.setState({
        startPosition: {
          x: this.state.startPosition.x,
          y: this.state.startPosition.y,
          angle: newAngle,
        }
      })

    } else if (direction === "left" || direction === "lt") {
      let newAngle = this.state.startPosition.angle - distance
      const degree = (newAngle * Math.PI) / 180

      ctxBird.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctxBird.save()
      ctxBird.translate(this.state.startPosition.x , this.state.startPosition.y )
      ctxBird.rotate(degree)
      ctxBird.drawImage(birdIcon, -BIRD_SIZE/2, -BIRD_SIZE/2, BIRD_SIZE, BIRD_SIZE)
      ctxBird.restore()

      this.setState({
        startPosition: {
          x: this.state.startPosition.x,
          y: this.state.startPosition.y,
          angle: newAngle,
        }
      })
    } else if (direction === "home") {
      ctxBird.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      ctxBird.drawImage(birdIcon, CENTER.x - BIRD_SIZE / 2, CENTER.y - BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE)

      this.setState({
        startPosition: {
          x: CENTER.x,
          y: CENTER.y,
          angle: 0,
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
