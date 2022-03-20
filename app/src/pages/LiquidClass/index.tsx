// more nav button routes
import * as React from 'react'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'

import { createLiquidClassName } from './BuildOnRobot/createName'
import { BuildOnRobot } from './BuildOnRobot'

export function LiquidClass(): JSX.Element {
  const { path } = useRouteMatch()
  const appPath = `${path}/app`

  return (
    <Switch>
      <Redirect exact from={path} to={appPath} />
      <Route path={`${path}/`} component={createLiquidClassName} />
      <Route path={`${path}/`} component={BuildOnRobot} />
    </Switch>
  )
}
