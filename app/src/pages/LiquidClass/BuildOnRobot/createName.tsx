// info on analytics data collected and toggle to opt in/out
import * as React from 'react'

import { Card, SecondaryBtn } from '@opentrons/components'
import { AnalyticsToggle } from '../../../organisms/AnalyticsSettingsModal/AnalyticsToggle'
import { useSelector, useDispatch } from 'react-redux'
import type { ViewableRobot } from '../../../redux/discovery/types'
import {
  home,
  move,
  ROBOT,
  getLightsOn,
  updateLights,
} from '../../../redux/robot-controls'

import type { Mount, AttachedPipette } from '../../../redux/pipettes/types'
import type { State, Dispatch } from '../../../redux/types'

interface Props {
  robotName: string
  mount: Mount
  closeModal: () => unknown
}

const TITLE = 'Create a new liquid class'
const HOME_BUTTON = 'Home'
const LIGHT_ON_BUTTON = "Lights On"

export function createLiquidClassName(props:Props): JSX.Element {
  const dispatch = useDispatch<Dispatch>()
  const {robot,mount} = props
  const BOTNAME = "OT2CEP20201130B13"
  const lighton = useSelector((state: State) => getLightsOn(state, BOTNAME))

  //const {ip} = robot
  //const namebot:string = robot.ip
  return (
      <p><h1>Create liquid class name menu</h1><br></br>
      Home the robot: 
      
      <SecondaryBtn
      onClick={() => dispatch(home(BOTNAME, ROBOT))}>
      {HOME_BUTTON}
      </SecondaryBtn><br></br><br></br>

      <h3>Print details</h3><br></br>
      Lights on : 

      <SecondaryBtn
      onClick={() => dispatch(updateLights(BOTNAME,!lighton))}>
      {LIGHT_ON_BUTTON}
      </SecondaryBtn><br></br><br></br>

      Move pipette: 

      <SecondaryBtn
      onClick={() => dispatch(move(BOTNAME, "attachTip", "left", true))}>
      {}move
      </SecondaryBtn><br></br><br></br>

      </p>

  )
}
