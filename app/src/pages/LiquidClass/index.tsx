// more nav button routes
import * as React from 'react'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'

import { BuildOnRobot } from './BuildOnRobot'

export function LiquidClass(): JSX.Element {
  const { path } = useRouteMatch()
  const appPath = `${path}/app`

  return (
    <Switch>
      <Redirect exact from={path} to={appPath} />
      <Route path={`${path}/build-on-robot`} component={BuildOnRobot} />
    </Switch>
  )
}
