// view info about the app and update
import * as React from 'react'

import { SPACING_3, Box } from '@opentrons/components'
import { Page } from '../../../atoms/Page'
import { AnalyticsSettingsCard } from '../../More/AppSettings/AnalyticsSettingsCard'
import { AppSoftwareSettingsCard } from '../../More/AppSettings/AppSoftwareSettingsCard'
import { AppAdvancedSettingsCard } from '../../More/AppSettings/AppAdvancedSettingsCard'
import { createLiquidClassName } from './createName'

export function BuildOnRobot(): JSX.Element {
  return (
    <Page titleBarProps={{ title: 'Create a new liquid class' }}>
      <Box margin={SPACING_3}>
        <AppSoftwareSettingsCard />
      </Box>
      <Box margin={SPACING_3}>
        <AnalyticsSettingsCard />
      </Box>
      <Box margin={SPACING_3}>
        <AppAdvancedSettingsCard />
      </Box>
    </Page>
  )
}
