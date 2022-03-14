import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Flex,
  Text,
  DIRECTION_ROW,
  DIRECTION_COLUMN,
  FONT_WEIGHT_SEMIBOLD,
  FONT_WEIGHT_REGULAR,
  JUSTIFY_SPACE_BETWEEN,
  TEXT_TRANSFORM_UPPERCASE,
  C_BRIGHT_GRAY,
  JUSTIFY_FLEX_END,
  COLORS,
  TYPOGRAPHY,
  SPACING,
} from '@opentrons/components'
import {
  getModuleDisplayName,
  MAGNETIC_MODULE_TYPE_LABWARE_BOTTOM_HEIGHT,
  MAGNETIC_MODULE_V1,
  MAGNETIC_MODULE_V1_DISNEGAGED_HEIGHT,
  MAGNETIC_MODULE_V1_MAX_ENGAGE_HEIGHT,
  MAGNETIC_MODULE_V2_DISNEGAGED_HEIGHT,
  MAGNETIC_MODULE_V2_MAX_ENGAGE_HEIGHT,
  MM,
} from '@opentrons/shared-data'
import { useSendModuleCommand } from '../../../redux/modules'
import { Slideout } from '../../../atoms/Slideout'
import { PrimaryButton } from '../../../atoms/Buttons'

import type { TFunctionResult } from 'i18next'
import type { AttachedModule } from '../../../redux/modules/types'
import type { ModuleModel } from '@opentrons/shared-data'
import { InputField } from '../../../atoms/InputField'
import { parseInt } from 'lodash'

interface ModelContents {
  version: string
  units: string | null
  maxHeight: number
  labwareBottomHeight: number
  disengagedHeight: number
  caption: string
}

const InfoByModel = (model: ModuleModel): ModelContents => {
  const { t } = useTranslation('device_details')
  if (model === MAGNETIC_MODULE_V1) {
    return {
      version: 'GEN 1',
      units: null,
      maxHeight: MAGNETIC_MODULE_V1_MAX_ENGAGE_HEIGHT,
      labwareBottomHeight: MAGNETIC_MODULE_TYPE_LABWARE_BOTTOM_HEIGHT,
      disengagedHeight: MAGNETIC_MODULE_V1_DISNEGAGED_HEIGHT,
      caption: t('between_5_to_40'),
    }
  } else {
    return {
      version: 'GEN 2',
      units: MM,
      maxHeight: MAGNETIC_MODULE_V2_MAX_ENGAGE_HEIGHT,
      labwareBottomHeight: MAGNETIC_MODULE_TYPE_LABWARE_BOTTOM_HEIGHT,
      disengagedHeight: MAGNETIC_MODULE_V2_DISNEGAGED_HEIGHT,
      caption: t('betwen_4_to_16'),
    }
  }
}

interface MagneticModuleSlideoutProps {
  module: AttachedModule
  onCloseClick: () => unknown
  isExpanded: boolean
}

export const MagneticModuleSlideout = (
  props: MagneticModuleSlideoutProps
): JSX.Element | null => {
  const { module, isExpanded, onCloseClick } = props
  const { t } = useTranslation('device_details')
  const sendModuleCommand = useSendModuleCommand()
  const [engageHeightValue, setEngageHeightValue] = React.useState<
    string | null
  >(null)
  const handleSubmitHeight = (): void => {
    if (engageHeightValue != null) {
      sendModuleCommand(module.serial, 'engage', [Number(engageHeightValue)])
    }
    setEngageHeightValue(null)
  }
  const moduleName = getModuleDisplayName(module.model)
  const info = InfoByModel(module.model)

  let max: number | TFunctionResult = 0
  let labwareBottom: number | TFunctionResult = 0
  let disengageHeight: number | TFunctionResult = 0

  switch (info.version) {
    case 'GEN 1': {
      max = info.maxHeight
      labwareBottom = info.labwareBottomHeight
      disengageHeight = info.disengagedHeight
      break
    }
    case 'GEN 2': {
      max = t('gen2_num_slideout', { num: info.maxHeight })
      labwareBottom = t('gen2_num_slideout', { num: info.labwareBottomHeight })
      disengageHeight = t('gen2_num_slideout', { num: info.disengagedHeight })
    }
  }

  const errorMessage =
    engageHeightValue != null &&
    (parseInt(engageHeightValue) < info.disengagedHeight ||
      parseInt(engageHeightValue) > info.maxHeight)
      ? t('input_out_of_range')
      : null

  return (
    <Slideout
      title={t('set_engage_height_slideout', { name: moduleName })}
      onCloseClick={onCloseClick}
      isExpanded={isExpanded}
      height={`calc(100vh - ${SPACING.spacing4})`}
      footer={
        <PrimaryButton
          width="100%"
          onClick={handleSubmitHeight}
          disabled={engageHeightValue == null || errorMessage !== null}
          data-testid={`Mag_Slideout_set_height_btn_${module.model}`}
        >
          {t('set_engage_height')}
        </PrimaryButton>
      }
    >
      <Text
        fontWeight={FONT_WEIGHT_REGULAR}
        fontSize={TYPOGRAPHY.fontSizeP}
        paddingTop={SPACING.spacing2}
        data-testid={`Mag_Slideout_body_text_${module.model}`}
      >
        {t('set_engage_height_slideout_body', {
          lower: module.model === MAGNETIC_MODULE_V1 ? 5 : 4,
          higher: module.model === MAGNETIC_MODULE_V1 ? 40 : 16,
        })}
      </Text>
      <Text
        fontSize={TYPOGRAPHY.fontSizeH6}
        fontWeight={FONT_WEIGHT_SEMIBOLD}
        paddingTop={SPACING.spacing4}
        textTransform={TEXT_TRANSFORM_UPPERCASE}
        paddingBottom={SPACING.spacing3}
        data-testid={`Mag_Slideout_body_subtitle_${module.model}`}
      >
        {t('set_engage_height_slideout_subtitle', { gen: info.version })}
      </Text>
      <Flex
        backgroundColor={C_BRIGHT_GRAY}
        flexDirection={DIRECTION_ROW}
        justifyContent={JUSTIFY_SPACE_BETWEEN}
        fontWeight={FONT_WEIGHT_REGULAR}
        fontSize={TYPOGRAPHY.fontSizeP}
        padding={SPACING.spacing4}
      >
        <Flex
          flexDirection={DIRECTION_COLUMN}
          data-testid={`Mag_Slideout_body_data_text_${module.model}`}
        >
          <Text paddingBottom={SPACING.spacing3}>
            {t('max_engage_height_slideout')}
          </Text>
          <Text paddingBottom={SPACING.spacing3}>
            {t('labware_bottom_slideout')}
          </Text>
          <Text paddingBottom={SPACING.spacing3}>
            {t('disengage_slideout')}
          </Text>
        </Flex>
        <Flex
          flexDirection={DIRECTION_COLUMN}
          justifyContent={JUSTIFY_FLEX_END}
          data-testid={`Mag_Slideout_body_data_num_${module.model}`}
        >
          <Text paddingBottom={SPACING.spacing3}>{max}</Text>
          <Text paddingBottom={SPACING.spacing3}>{labwareBottom}</Text>
          <Text paddingBottom={SPACING.spacing3}>{disengageHeight}</Text>
        </Flex>
      </Flex>
      <Flex
        marginTop={SPACING.spacing4}
        flexDirection={DIRECTION_COLUMN}
        data-testid={`Mag_Slideout_input_field_${module.model}`}
      >
        <Text
          fontWeight={FONT_WEIGHT_REGULAR}
          fontSize={TYPOGRAPHY.fontSizeH6}
          color={COLORS.darkGrey}
          paddingBottom={SPACING.spacing3}
        >
          {t('engage_height_slideout')}
        </Text>
        <InputField
          units={info.units}
          value={engageHeightValue}
          onChange={e => setEngageHeightValue(e.target.value)}
          type="number"
          max={info.maxHeight}
          min={info.disengagedHeight}
          caption={info.caption}
          error={errorMessage}
        />
      </Flex>
    </Slideout>
  )
}
