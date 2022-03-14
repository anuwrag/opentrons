import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { getModuleDisplayName } from '@opentrons/shared-data'
import { useSendModuleCommand } from '../../../redux/modules'
import { Slideout } from '../../../atoms/Slideout'
import { InputField } from '../../../atoms/InputField'
import {
  COLORS,
  DIRECTION_COLUMN,
  Flex,
  FONT_WEIGHT_REGULAR,
  SPACING,
  Text,
  TYPOGRAPHY,
} from '@opentrons/components'
import { PrimaryButton } from '../../../atoms/Buttons'

import type { AttachedModule } from '../../../redux/modules/types'

interface ThermocyclerModuleSlideoutProps {
  module: AttachedModule
  onCloseClick: () => unknown
  isExpanded: boolean
  isSecondaryTemp?: boolean
}

export const ThermocyclerModuleSlideout = (
  props: ThermocyclerModuleSlideoutProps
): JSX.Element | null => {
  const { module, onCloseClick, isExpanded, isSecondaryTemp } = props
  const { t } = useTranslation('device_details')
  const [tempValue, setTempValue] = React.useState<string | null>(null)
  const sendModuleCommand = useSendModuleCommand()

  const moduleName = getModuleDisplayName(module.model)
  const modulePart = isSecondaryTemp ? 'Lid' : 'Block'
  const tempRanges = getTCTempRange(isSecondaryTemp)

  const handleSubmitTemp = (): void => {
    if (tempValue != null) {
      sendModuleCommand(
        module.serial,
        isSecondaryTemp ? 'set_lid_temperature' : 'set_temperature',
        [Number(tempValue)]
      )
    }
    setTempValue(null)
  }

  let errorMessage
  if (isSecondaryTemp) {
    errorMessage =
      tempValue != null &&
      (parseInt(tempValue) < 37 || parseInt(tempValue) > 110)
        ? t('input_out_of_range')
        : null
  } else {
    errorMessage =
      tempValue != null && (parseInt(tempValue) < 4 || parseInt(tempValue) > 99)
        ? t('input_out_of_range')
        : null
  }

  return (
    <Slideout
      title={t('tc_set_temperature', { part: modulePart, name: moduleName })}
      onCloseClick={onCloseClick}
      isExpanded={isExpanded}
      height={`calc(100vh - ${SPACING.spacing4})`} // subtract breadcrumb strip
      footer={
        <PrimaryButton
          onClick={handleSubmitTemp}
          disabled={tempValue === null || errorMessage !== null}
          width="100%"
          data-testid={`TC_Slideout_set_height_btn_${module.model}`}
        >
          {t('set_tc_temp_slideout', { part: modulePart })}
        </PrimaryButton>
      }
    >
      <Text
        fontWeight={FONT_WEIGHT_REGULAR}
        fontSize={TYPOGRAPHY.fontSizeP}
        paddingTop={SPACING.spacing2}
        data-testid={`TC_Slideout_body_text_${module.model}`}
      >
        {t('tc_set_temperature_body', {
          part: modulePart,
          min: tempRanges.min,
          max: tempRanges.max,
        })}
      </Text>
      <Flex
        marginTop={SPACING.spacing4}
        flexDirection={DIRECTION_COLUMN}
        data-testid={`TC_Slideout_input_field_${module.model}`}
      >
        <Text
          fontWeight={FONT_WEIGHT_REGULAR}
          fontSize={TYPOGRAPHY.fontSizeH6}
          color={COLORS.darkGrey}
          marginBottom={SPACING.spacing1}
        >
          {t('temperature')}
        </Text>
        <InputField
          units={'°C'}
          value={tempValue}
          onChange={e => setTempValue(e.target.value)}
          type="number"
          min={tempRanges.min}
          max={tempRanges.max}
          caption={
            isSecondaryTemp ? t('between_37_to_110') : t('between_4_to_99')
          }
          error={errorMessage}
        />
      </Flex>
    </Slideout>
  )
}

interface TemperatureRanges {
  min: number
  max: number
}

const getTCTempRange = (isSecondaryTemp = false): TemperatureRanges => {
  if (isSecondaryTemp) {
    return { min: 37, max: 110 }
  } else {
    return { min: 4, max: 99 }
  }
}
