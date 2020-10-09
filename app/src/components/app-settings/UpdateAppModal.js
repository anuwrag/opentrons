// @flow
import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link as InternalLink } from 'react-router-dom'

import {
  ALIGN_CENTER,
  C_BLUE,
  C_TRANSPARENT,
  C_WHITE,
  DIRECTION_COLUMN,
  DISPLAY_FLEX,
  FONT_SIZE_BODY_1,
  FONT_SIZE_BODY_2,
  FONT_SIZE_HEADER,
  FONT_STYLE_ITALIC,
  FONT_WEIGHT_REGULAR,
  JUSTIFY_FLEX_END,
  SIZE_4,
  SIZE_6,
  SPACING_2,
  SPACING_3,
  SPACING_4,
  SPACING_AUTO,
  useMountEffect,
  BaseModal,
  Btn,
  Box,
  Flex,
  Icon,
  SecondaryBtn,
  Text,
} from '@opentrons/components'

import {
  getShellUpdateState,
  downloadShellUpdate,
  applyShellUpdate,
} from '../../shell'

import { ErrorModal } from '../modals'
import { ReleaseNotes } from '../ReleaseNotes'

import type { Dispatch } from '../../types'

export type UpdateAppModalProps = {|
  dismissAlert?: (remember: boolean) => mixed,
  closeModal?: () => mixed,
|}

// TODO(mc, 2020-10-06): i18n
const APP_VERSION = 'App Version'
const AVAILABLE = 'Available'
const DOWNLOADED = 'Downloaded'
const DOWNLOAD_IN_PROGRESS = 'Download in progress'
const DOWNLOAD = 'Download'
const RESTART_APP = 'Restart App'
const NOT_NOW = 'Not Now'
const OK = 'OK'
const UPDATE_ERROR = 'Update Error'
const SOMETHING_WENT_WRONG = 'Something went wrong while updating your app'
const TURN_OFF_UPDATE_NOTIFICATIONS = 'Turn off update notifications'
const YOUVE_TURNED_OFF_NOTIFICATIONS = "You've Turned Off Update Notifications"
const VIEW_APP_SOFTWARE_SETTINGS = 'View App Software Settings'
const NOTIFICATIONS_DISABLED_DESCRIPTION = (
  <>
    You{"'"}ve chosen to not be notified when an app update is available. You
    can change this setting under More {'>'} App {'>'}{' '}
    App&nbsp;Software&nbsp;Settings.
  </>
)

const FINISH_UPDATE_INSTRUCTIONS = (
  <>
    <Text marginBottom={SPACING_3}>
      Restart your app to complete the update. Please note the following:
    </Text>
    <Box as="ol" paddingLeft={SPACING_3}>
      <li>
        <Text marginBottom={SPACING_2}>
          After updating the Opentrons App, <strong>update your OT-2</strong> to
          ensure the app and robot software is in sync.
        </Text>
      </li>
      <li>
        <Text>
          You should update the Opentrons App on <strong>all computers</strong>{' '}
          that you use with your OT-2.
        </Text>
      </li>
    </Box>
  </>
)

const SPINNER = (
  <BaseModal
    color={C_WHITE}
    backgroundColor={C_TRANSPARENT}
    fontSize={FONT_SIZE_BODY_2}
    fontStyle={FONT_STYLE_ITALIC}
  >
    <Flex alignItems={ALIGN_CENTER} flexDirection={DIRECTION_COLUMN}>
      <Icon spin name="ot-spinner" width={SIZE_4} />
      <Text marginTop={SPACING_4}>{DOWNLOAD_IN_PROGRESS}</Text>
    </Flex>
  </BaseModal>
)

export function UpdateAppModal(props: UpdateAppModalProps): React.Node {
  const { dismissAlert, closeModal } = props
  const [updatesIgnored, setUpdatesIgnored] = React.useState(false)
  const dispatch = useDispatch<Dispatch>()
  const updateState = useSelector(getShellUpdateState)
  const { downloaded, downloading, error, info: updateInfo } = updateState
  const version = updateInfo?.version ?? ''
  const releaseNotes = updateInfo?.releaseNotes

  const handleUpdateClick = () => {
    dispatch(downloaded ? applyShellUpdate() : downloadShellUpdate())
  }

  // ensure close handlers are called on close button click or on component
  // unmount (for safety), but not both
  const latestHandleClose = React.useRef(null)

  React.useEffect(() => {
    latestHandleClose.current = () => {
      if (typeof dismissAlert === 'function') dismissAlert(updatesIgnored)
      if (typeof closeModal === 'function') closeModal()
      latestHandleClose.current = null
    }
  })

  const handleCloseClick = () => {
    latestHandleClose.current && latestHandleClose.current()
  }

  useMountEffect(() => {
    return () => {
      latestHandleClose.current && latestHandleClose.current()
    }
  })

  if (error) {
    return (
      <ErrorModal
        error={error}
        heading={UPDATE_ERROR}
        description={SOMETHING_WENT_WRONG}
        close={handleCloseClick}
      />
    )
  }

  if (downloading) return SPINNER

  // TODO(mc, 2020-10-08): refactor most of this back into a new AlertModal
  // component built with BaseModal
  return (
    <BaseModal
      maxWidth="38rem"
      fontSize={FONT_SIZE_BODY_2}
      header={
        <Text
          as="h2"
          display={DISPLAY_FLEX}
          alignItems={ALIGN_CENTER}
          fontSize={FONT_SIZE_HEADER}
          fontWeight={FONT_WEIGHT_REGULAR}
        >
          <Icon name="alert" width="1em" marginRight={SPACING_2} />
          {updatesIgnored
            ? YOUVE_TURNED_OFF_NOTIFICATIONS
            : `${APP_VERSION} ${version} ${
                downloaded ? DOWNLOADED : AVAILABLE
              }`}
        </Text>
      }
      footer={
        <Flex alignItems={ALIGN_CENTER} justifyContent={JUSTIFY_FLEX_END}>
          {updatesIgnored ? (
            <>
              <SecondaryBtn
                as={InternalLink}
                to="/more/app"
                onClick={handleCloseClick}
                marginRight={SPACING_3}
              >
                {VIEW_APP_SOFTWARE_SETTINGS}
              </SecondaryBtn>
              <SecondaryBtn onClick={handleCloseClick}>{OK}</SecondaryBtn>
            </>
          ) : (
            <>
              {dismissAlert != null && !downloaded ? (
                <Btn
                  color={C_BLUE}
                  marginRight={SPACING_AUTO}
                  fontSize={FONT_SIZE_BODY_1}
                  onClick={() => setUpdatesIgnored(true)}
                >
                  {TURN_OFF_UPDATE_NOTIFICATIONS}
                </Btn>
              ) : null}
              <SecondaryBtn marginRight={SPACING_3} onClick={handleCloseClick}>
                {NOT_NOW}
              </SecondaryBtn>
              <SecondaryBtn onClick={handleUpdateClick}>
                {downloaded ? RESTART_APP : DOWNLOAD}
              </SecondaryBtn>
            </>
          )}
        </Flex>
      }
    >
      <Box maxWidth={SIZE_6}>
        {updatesIgnored ? (
          NOTIFICATIONS_DISABLED_DESCRIPTION
        ) : downloaded ? (
          FINISH_UPDATE_INSTRUCTIONS
        ) : (
          <ReleaseNotes source={releaseNotes} />
        )}
      </Box>
    </BaseModal>
  )
}
