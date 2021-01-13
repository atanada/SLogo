import birdImgPath from '../icons/bird.png'
import {STARTING_ANGLE, CENTER} from './constants';
import {Point} from './Point'

const birdIcon = new Image()
birdIcon.src = birdImgPath

let Bird = {
  x: CENTER.x,
  y: CENTER.y,
  angle: STARTING_ANGLE,

  reset: () => {
    Object.assign(
      Bird,
      {
        x: CENTER.x,
        y: CENTER.y,
        angle: STARTING_ANGLE,
      }
    )
  },

  getAngleInRadians: () => {
    return (Bird.angle * Math.PI) / 180
  },

  getAngleInDegrees: () => {
    return Bird.angle
  },

  getPosition: () => {
    return new Point(Bird.x, Bird.y)
  },
  // get bird position after displacement
  moveForward: (distance) => {
    const degree = Bird.getAngleInRadians()
    let xDist = distance * Math.sin(degree)
    let yDist = distance * Math.cos(degree)

    Bird.x = Bird.x + xDist
    Bird.y = Bird.y - yDist
  },

  moveBackward: (distance) => {
    Bird.moveForward(-1 * distance)
  },
}

export {
  Bird,
  birdIcon,
}
