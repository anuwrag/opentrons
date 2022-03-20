import * as React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'
import { useSelector } from 'react-redux'

import {
  Flex,
  Box,
  POSITION_RELATIVE,
  POSITION_FIXED,
  DIRECTION_ROW,
} from '@opentrons/components'
import { ApiHostProvider } from '@opentrons/react-api-client'

import { useFeatureFlag } from '../redux/config'
import { getConnectedRobot } from '../redux/discovery'
import { GlobalStyle } from '../atoms/GlobalStyle'
import { Alerts } from '../organisms/Alerts'

import { Robots } from '../pages/Robots'
import { Upload } from '../pages/Upload'
import { Run } from '../pages/Run'
import { LiquidClass } from '../pages/LiquidClass'
import { More } from '../pages/More'

import { ConnectPanel } from '../pages/Robots/ConnectPanel'
import { RunPanel } from '../pages/Run/RunPanel'
import { MorePanel } from '../pages/More/MorePanel'
import { LiquidClassPanel } from '../pages/LiquidClass/LiquidClassPanel'

import { Navbar } from './Navbar'
import { NextGenApp } from './NextGenApp'
import { PortalRoot as ModalPortalRoot, TopPortalRoot } from './portal'

import type { State } from '../redux/types'

const stopEvent = (event: React.MouseEvent): void => event.preventDefault()

export const AppComponent = (): JSX.Element => {
  const connectedRobot = useSelector((state: State) => getConnectedRobot(state))
  const isNextGenApp = useFeatureFlag('hierarchyReorganization')

  return (
    <ApiHostProvider hostname={connectedRobot?.ip ?? null}>
      <GlobalStyle />
      <Flex
        position={POSITION_FIXED}
        flexDirection={DIRECTION_ROW}
        width="100%"
        height="100vh"
        onDragOver={stopEvent}
        onDrop={stopEvent}
      >
        {isNextGenApp ? (
          <NextGenApp />
        ) : (
          <>
            <Navbar />
            <Switch>
              <Route path="/robots/:name?" component={ConnectPanel} />
              <Route path="/more" component={MorePanel} />
              <Route path="/run" component={RunPanel} />
              <Route path="/liquidclass" component={LiquidClassPanel} />
            </Switch>
            <TopPortalRoot />
            <Box position={POSITION_RELATIVE} width="100%" height="100%">
              <ModalPortalRoot />
              <Switch>
                <Route path="/robots/:name?">
                  <Robots />
                </Route>
                <Route path="/more">
                  <More />
                </Route>
                <Route path="/upload">
                  <Upload />
                </Route>
                <Route path="/run">
                  <Run />
                </Route>
                <Route path="/liquidclass">
                  <LiquidClass />
                </Route>                
                <Redirect exact from="/" to="/robots" />
                {/* redirect after next gen app feature flag toggle */}
                <Redirect exact from="/app-settings/feature-flags" to="/more" />
              </Switch>
              <Alerts />
            </Box>
          </>
        )}
      </Flex>
    </ApiHostProvider>
  )
}

export const App = hot(AppComponent)
