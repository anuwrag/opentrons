import * as React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link as RRDLink } from 'react-router-dom'
import {
  Text,
  Flex,
  Link,
  PrimaryBtn,
  SPACING_3,
  ALIGN_CENTER,
  DIRECTION_ROW,
  FONT_SIZE_BODY_1,
  FONT_STYLE_ITALIC,
  C_BLUE,
  DIRECTION_COLUMN,
  ALIGN_FLEX_END,
} from '@opentrons/components'
import { Portal } from '../../../../App/portal'
import { AskForCalibrationBlockModal } from '../../../../organisms/CalibrateTipLength/AskForCalibrationBlockModal'
import * as Config from '../../../../redux/config'
import * as PipetteConstants from '../../../../redux/pipettes/constants'
import { INTENT_CALIBRATE_PIPETTE_OFFSET } from '../../../CalibrationPanels'
import { useCalibratePipetteOffset } from '../../../CalibratePipetteOffset/useCalibratePipetteOffset'
import { CalibrationItem } from './CalibrationItem'

import type { ProtocolPipetteTipRackCalData } from '../../../../redux/pipettes/types'

const pipettesPageUrl = `/robots/opentrons-dev/instruments`
const inexactPipetteSupportArticle =
  'https://support.opentrons.com/en/articles/3450143-gen2-pipette-compatibility'

interface Props {
  pipetteTipRackData: ProtocolPipetteTipRackCalData
  index: number
  mount: string
  robotName: string
}

export function PipetteCalibration(props: Props): JSX.Element {
  const { pipetteTipRackData, index, mount, robotName } = props
  const { t } = useTranslation('protocol_setup')
  const [showCalBlockModal, setShowCalBlockModal] = React.useState(false)
  const configHasCalibrationBlock = useSelector(Config.getHasCalibrationBlock)

  const [
    startPipetteOffsetCalibration,
    PipetteOffsetCalibrationWizard,
  ] = useCalibratePipetteOffset(robotName, { mount })

  const startPipetteOffsetCalibrationBlockModal = (
    hasBlockModalResponse: boolean | null
  ): void => {
    if (hasBlockModalResponse === null && configHasCalibrationBlock === null) {
      setShowCalBlockModal(true)
    } else {
      startPipetteOffsetCalibration({
        overrideParams: {
          hasCalibrationBlock: Boolean(
            configHasCalibrationBlock ?? hasBlockModalResponse
          ),
        },
        withIntent: INTENT_CALIBRATE_PIPETTE_OFFSET,
      })
      setShowCalBlockModal(false)
    }
  }

  let button: JSX.Element | undefined
  let subText
  const attached =
    pipetteTipRackData.exactPipetteMatch === PipetteConstants.INEXACT_MATCH ||
    pipetteTipRackData.exactPipetteMatch === PipetteConstants.MATCH

  let pipetteMismatchInfo
  if (pipetteTipRackData.exactPipetteMatch === PipetteConstants.INEXACT_MATCH) {
    pipetteMismatchInfo = (
      <Flex flexDirection={DIRECTION_COLUMN} alignItems={ALIGN_FLEX_END}>
        <Text
          fontSize={FONT_SIZE_BODY_1}
          fontStyle={FONT_STYLE_ITALIC}
          marginRight={SPACING_3}
        >
          {t('pipette_mismatch')}
        </Text>
        <Link
          external
          fontSize={FONT_SIZE_BODY_1}
          href={inexactPipetteSupportArticle}
          color={C_BLUE}
          marginRight={SPACING_3}
          id={'PipetteCalibration_pipetteMismatchHelpLink'}
        >
          {t('pipette_compat_help')}
        </Link>
      </Flex>
    )
  }

  if (pipetteTipRackData.pipetteCalDate != null && attached) {
    button = pipetteMismatchInfo
  } else if (!attached) {
    subText = t('attach_pipette_calibration')
    button = (
      <Flex flexDirection={DIRECTION_ROW} alignItems={ALIGN_CENTER}>
        <Text
          fontSize={FONT_SIZE_BODY_1}
          fontStyle={FONT_STYLE_ITALIC}
          marginRight={SPACING_3}
        >
          {t('pipette_missing')}
        </Text>
        <PrimaryBtn
          as={RRDLink}
          to={pipettesPageUrl}
          backgroundColor={C_BLUE}
          id={'PipetteCalibration_attachPipetteButton'}
        >
          {t('attach_pipette_cta')}
        </PrimaryBtn>
      </Flex>
    )
  } else {
    button = (
      <>
        <Flex flexDirection={DIRECTION_ROW} alignItems={ALIGN_CENTER}>
          {pipetteMismatchInfo}
          <PrimaryBtn
            backgroundColor={C_BLUE}
            onClick={() => startPipetteOffsetCalibrationBlockModal(null)}
            id={'PipetteCalibration_calibratePipetteButton'}
          >
            {t('calibrate_now_cta')}
          </PrimaryBtn>
        </Flex>
        {PipetteOffsetCalibrationWizard}
        {showCalBlockModal && (
          <Portal level="top">
            <AskForCalibrationBlockModal
              onResponse={hasBlockModalResponse => {
                startPipetteOffsetCalibrationBlockModal(hasBlockModalResponse)
              }}
              titleBarTitle={t('pipette_offset_cal')}
              closePrompt={() => setShowCalBlockModal(false)}
            />
          </Portal>
        )}
      </>
    )
  }

  return (
    <CalibrationItem
      button={button}
      calibratedDate={attached ? pipetteTipRackData.pipetteCalDate : null}
      index={index}
      subText={subText}
      title={`${t('mount_title', { mount: mount.toUpperCase() })} ${
        pipetteTipRackData.pipetteDisplayName
      }`}
      id={`PipetteCalibration_${mount}MountTitle`}
    />
  )
}
