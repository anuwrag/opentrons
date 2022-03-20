import { format, parseISO } from 'date-fns'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  getNavbarLocations,
  getConnectedRobotPipettesMatch,
  getConnectedRobotPipettesCalibrated,
  getDeckCalibrationOk,
} from '../redux/nav'
import { getConnectedRobot } from '../redux/discovery'
import { useIsProtocolRunLoaded } from '../organisms/ProtocolUpload/hooks'
import { translationKeyByPathSegment } from './NextGenApp'

import type { PathCrumb } from '../molecules/Breadcrumbs'
import type { NavLocation } from '../redux/nav/types'
import { LiquidClass } from '../pages/LiquidClass'

export function useRunLocation(): NavLocation {
  const { t } = useTranslation('top_navigation')
  const robot = useSelector(getConnectedRobot)
  const pipettesMatch = useSelector(getConnectedRobotPipettesMatch)
  const pipettesCalibrated = useSelector(getConnectedRobotPipettesCalibrated)
  const deckCalOk = useSelector(getDeckCalibrationOk)

  const isProtocolRunLoaded = useIsProtocolRunLoaded()

  let disabledReason = null
  if (!robot) disabledReason = t('please_connect_to_a_robot')
  else if (!isProtocolRunLoaded) disabledReason = t('please_load_a_protocol')
  else if (!pipettesMatch) disabledReason = t('attached_pipettes_do_not_match')
  else if (!pipettesCalibrated) disabledReason = t('pipettes_not_calibrated')
  else if (!deckCalOk) disabledReason = t('calibrate_deck_to_proceed')

  return {
    id: 'run',
    path: '/run',
    title: t('run'),
    iconName: 'ot-run',
    disabledReason,
  }
}

export function useNavLocations(): NavLocation[] {
  const [robots, upload, LiquidClass, more] = useSelector(getNavbarLocations)

  const runLocation = useRunLocation()

  const navLocations = [robots, upload, runLocation, LiquidClass, more]

  return navLocations
}

/**
 * a hook for the unified app, to generate an array of path crumbs
 * @returns {PathCrumb[]}
 */
export function usePathCrumbs(): PathCrumb[] {
  const { t } = useTranslation('top_navigation')
  const location = useLocation()

  const subPathname = location.pathname.substring(1)

  const pathCrumbs = subPathname
    .split('/')
    // filter out path segments explicitly defined as null
    .filter(crumb => translationKeyByPathSegment[crumb] !== null)
    .map(crumb => {
      const crumbDisplayNameValue = translationKeyByPathSegment[crumb]

      /**
       * Check if the crumb is a date and parse. may want to pull out as a helper
       * Necessary because 'Run Record ID' is planned to be rendered as a date timestamp
       */
      const crumbDateNameValue =
        // eslint-disable-next-line eqeqeq
        (new Date(crumb) as Date | string) != 'Invalid Date'
          ? format(parseISO(crumb), 'MM/dd/yyyy HH:mm:ss')
          : crumb

      return {
        pathSegment: crumb,
        crumbName:
          crumbDisplayNameValue != null
            ? t(crumbDisplayNameValue)
            : crumbDateNameValue,
      }
    })

  return pathCrumbs
}
