import React from 'react'
import '../styles/style.css'

import {UserInputProcessingContext} from './UserInputProcessingContext'

import {Console} from './Console'
import {CommandHistory} from './CommandHistory'
import {BIRD_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT, STARTING_ANGLE, CENTER} from './constants';
import {birdIcon, Bird} from './BirdImage'
import {Point} from './Point'

// layer used to draw lines
class BaseLayer {
  init(context) {
    this.context = context
  }

  clear() {
    this.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }

  drawLine(start, end) {
    this.context.beginPath()
    this.context.moveTo(start.x, start.y)
    this.context.lineTo(end.x, end.y)
    this.context.stroke()
  }
}
const baseLayer = new BaseLayer()

// canvas with only bird icon
// bird moves separately from drawn lines
class BirdLayer {
  init(context) {
    this.context = context
  }

  clear() {
    this.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }

  draw() {
    this.context.save()
    this.context.translate(Bird.x, Bird.y)
    this.context.rotate(Bird.getAngleInRadians())
    this.context.drawImage(
        birdIcon,
        -BIRD_SIZE / 2, -BIRD_SIZE / 2,
        BIRD_SIZE, BIRD_SIZE)
    this.context.restore()
  }
  // when bird moves, clear 'old bird' image and draw an updated bird 
  redraw() {
    this.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    this.draw()
  }
}
const birdLayer = new BirdLayer()

class CanvasComponent extends React.Component {
  componentDidMount() {
    baseLayer.init(this.refs.drawingLayer.getContext('2d'))
    birdLayer.init(this.refs.birdLayer.getContext('2d'))
    birdLayer.draw()
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
CanvasComponent.contextType = UserInputProcessingContext

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
    this.parseInput = this.parseInput.bind(this)
  }

  updateUserInput (event) {
    this.setState({
      userInput: event.target.value
    })
  }

  // get new position for bird
  // create drawing on canvas for move command
  forwardMove(distance) {
    const originalPosition = Bird.getPosition()
    Bird.moveForward(distance)
    const newPosition = Bird.getPosition()

    baseLayer.drawLine(originalPosition, newPosition)
    birdLayer.redraw()
  }

  backMove(distance) {
    this.forwardMove(distance * -1)
  }

  rightRotate(angle) {
    Bird.angle += angle
    birdLayer.redraw()
  }

  leftRotate(angle) {
    this.rightRotate(angle * -1)
  }

  homeMove () {
    Bird.reset()
    birdLayer.redraw()
  }

  parseInput(userInput) {
    const commandList = userInput.split("\n")
    let userCommandsNotParsed = commandList
    let userCommands = commandList

    // find repeat commands to parse
    for (let lineNum = 0; lineNum < commandList.length; lineNum++) {
      if (commandList[lineNum].includes("repeat")) {
        userCommandsNotParsed = commandList.join(" ")
        // number of times to repeat a command
        const repeatNumStr =
          userCommandsNotParsed.slice(
            userCommandsNotParsed.indexOf("repeat") + "repeat".length + 1,
            userCommandsNotParsed.indexOf("["),
          )
        if (!/\d/.test(repeatNumStr)) {
          alert("Missing number of repeats")
        }
        const repeatNumInt = parseInt(repeatNumStr, 10)
        let startInd = userCommandsNotParsed.indexOf("[") + 1
        let endInd = userCommandsNotParsed.indexOf("]")
        const repeatCommands = userCommandsNotParsed.slice(startInd, endInd)
        userCommands = [
          ...Array(repeatNumInt).fill(repeatCommands)
        ]
        break
      }
    }
    const finalCommandArray = []
    for (let ind = 0; ind < userCommands.length; ind++) {
      let intermediate = userCommands[ind].split(" ")
      for (let subCommand = 0; subCommand < intermediate.length; subCommand++) {
        if (/^[a-zA-Z]+$/.test(intermediate[subCommand])) {
          finalCommandArray.push([intermediate[subCommand], intermediate[subCommand + 1]])
        }
      }
    }
    for (let i = 0; i < finalCommandArray.length; i++) {
      let distance = parseInt(finalCommandArray[i][1], 10)
      let direction = finalCommandArray[i][0]

      if (direction === "forward" || direction === "fd") {
        this.forwardMove(distance)
      } else if (direction === "back" || direction === "bk") {
        this.backMove(distance)
      } else if (direction === "right" || direction === "rt") {
        this.rightRotate(distance)
      } else if (direction === "left" || direction === "lt") {
        this.leftRotate(distance)
      } else if (direction == "home") {
        this.homeMove()
      } else if (direction == "clear") {
        baseLayer.clear()
        this.homeMove()
      } else {
        alert(direction + " is not a valid command")
      }
    }
    this.setState({
      startPosition: {
        x: Bird.x,
        y: Bird.y,
        angle: Bird.angle,
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
            <CanvasComponent />
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
