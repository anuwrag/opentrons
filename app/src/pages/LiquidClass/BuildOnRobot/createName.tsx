// info on analytics data collected and toggle to opt in/out
import * as React from 'react'

import { Card, SecondaryBtn } from '@opentrons/components'
import { AnalyticsToggle } from '../../../organisms/AnalyticsSettingsModal/AnalyticsToggle'
import { useSelector, useDispatch } from 'react-redux'
import type { ViewableRobot } from '../../../redux/discovery/types'
import {
  home,
  ROBOT,
} from '../../../redux/robot-controls'

import type { State, Dispatch } from '../../../redux/types'

export interface InformationCardProps {
  robot: ViewableRobot
  updateUrl: string
}


const TITLE = 'Create a new liquid class'
const HOME_BUTTON = 'Home'

export function createLiquidClassName(props:InformationCardProps): JSX.Element {
  const dispatch = useDispatch<Dispatch>()
  const {robot} = props
  const testnumber = 10000
  console.log(testnumber.toString())
  
  //const {ip} = robot
  //const namebot:string = robot.ip
  return (
      <p><h1>Create liquid class name menu</h1><br></br>
      Home the robot: {}
      
      <SecondaryBtn
      onClick={() => dispatch(home("OT2CEP20201130B13", ROBOT))}>
      {HOME_BUTTON}
      </SecondaryBtn>
      </p>

  )
}
