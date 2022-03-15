// more nav button routes
import * as React from 'react'
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom'

import { CreateLiquidClass } from './createliquidclass'


export function Liquids(): JSX.Element {
  const { path } = useRouteMatch()
  const appPath = `${path}/app`

  return (
    <Switch>
      <Redirect exact from={path} to={appPath} />
      <Route path={appPath} component={CreateLiquidClass} />
    </Switch>
  )
}
