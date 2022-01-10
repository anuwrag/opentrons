import dropWhile from 'lodash/dropWhile'
import * as React from 'react'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useTranslation } from 'react-i18next'
import {
  Flex,
  DIRECTION_COLUMN,
  TEXT_TRANSFORM_UPPERCASE,
  FONT_SIZE_CAPTION,
  SPACING_1,
  Icon,
  JUSTIFY_SPACE_BETWEEN,
  Btn,
  SIZE_1,
  C_MED_DARK_GRAY,
  FONT_HEADER_DARK,
  JUSTIFY_START,
  Text,
  SPACING_2,
  C_NEAR_WHITE,
  TEXT_TRANSFORM_CAPITALIZE,
  AlertItem,
  Box,
} from '@opentrons/components'
import { useRunStatus } from '../RunTimeControl/hooks'
import { useProtocolDetails } from './hooks'
import { useCurrentProtocolRun } from '../ProtocolUpload/hooks'
import { ProtocolSetupInfo } from './ProtocolSetupInfo'
import { CommandItem } from './CommandItem'
import type {
  ProtocolFile,
  Command,
  CommandStatus,
} from '@opentrons/shared-data'
import type { RunCommandSummary } from '@opentrons/api-client'
import type { } from 'react-window`'


export function CommandList(): JSX.Element | null {
  const { t } = useTranslation('run_details')
  const [
    showProtocolSetupInfo,
    setShowProtocolSetupInfo,
  ] = React.useState<boolean>(false)
  const protocolData: ProtocolFile<{}> | null = useProtocolDetails()
    .protocolData
  const { runRecord } = useCurrentProtocolRun()
  const runStatus = useRunStatus()
  const runDataCommands = runRecord?.data.commands
  const firstPlayTimestamp = runRecord?.data.actions.find(
    action => action.actionType === 'play'
  )?.createdAt

  const analysisCommandsWithStatus =
    protocolData?.commands != null
      ? protocolData.commands.map(command => ({
          ...command,
          status: 'queued' as CommandStatus,
        }))
      : []
  const allProtocolCommands: Command[] =
    protocolData != null ? analysisCommandsWithStatus : []

  const firstNonSetupIndex = allProtocolCommands.findIndex(
    command =>
      command.commandType !== 'loadLabware' &&
      command.commandType !== 'loadPipette' &&
      command.commandType !== 'loadModule'
  )
  const protocolSetupCommandList = allProtocolCommands.slice(
    0,
    firstNonSetupIndex
  )
  const postSetupAnticipatedCommands: Command[] = allProtocolCommands.slice(
    firstNonSetupIndex
  )

  interface CommandRuntimeInfo {
    analysisCommand: Command | null // analysisCommand will only be null if protocol is nondeterministic
    runCommandSummary: RunCommandSummary | null
  }

  let currentCommandList: CommandRuntimeInfo[] = postSetupAnticipatedCommands.map(
    postSetupAnticaptedCommand => ({
      analysisCommand: postSetupAnticaptedCommand,
      runCommandSummary: null,
    })
  )
  if (
    runDataCommands != null &&
    runDataCommands.length > 0 &&
    firstPlayTimestamp != null
  ) {
    const firstPostPlayRunCommandIndex = runDataCommands.findIndex(
      command => command.id === postSetupAnticipatedCommands[0]?.id
    )
    const postPlayRunCommands =
      firstPostPlayRunCommandIndex >= 0
        ? runDataCommands
            .slice(firstPostPlayRunCommandIndex)
            .map(runDataCommand => ({
              runCommandSummary: runDataCommand,
              analysisCommand:
                postSetupAnticipatedCommands.find(
                  postSetupAnticipatedCommand =>
                    runDataCommand.id === postSetupAnticipatedCommand.id
                ) ?? null,
            }))
        : []

    const remainingAnticipatedCommands = dropWhile(
      postSetupAnticipatedCommands,
      anticipatedCommand =>
        runDataCommands.some(runC => runC.id === anticipatedCommand.id)
    ).map(remainingAnticipatedCommand => ({
      analysisCommand: remainingAnticipatedCommand,
      runCommandSummary: null,
    }))

    const isProtocolDeterministic = postPlayRunCommands.reduce(
      (isDeterministic, command, index) => {
        return (
          isDeterministic &&
          command.runCommandSummary.id ===
            postSetupAnticipatedCommands[index]?.id
        )
      },
      true
    )

    currentCommandList = isProtocolDeterministic
      ? [...postPlayRunCommands, ...remainingAnticipatedCommands]
      : [...postPlayRunCommands]
  }

  if (protocolData == null || runStatus == null) return null

  let alertItemTitle
  if (runStatus === 'failed') {
    alertItemTitle = t('protocol_run_failed')
  }
  if (runStatus === 'stop-requested' || runStatus === 'stopped') {
    alertItemTitle = t('protocol_run_canceled')
  }
  if (runStatus === 'succeeded') {
    alertItemTitle = t('protocol_run_complete')
  }

  return (
    <React.Fragment>
      <Flex flexDirection={DIRECTION_COLUMN} flex={'auto'}>
        {runStatus === 'failed' ||
        runStatus === 'succeeded' ||
        runStatus === 'stop-requested' ||
        runStatus === 'stopped' ? (
          <Box padding={SPACING_2}>
            <AlertItem
              type={
                runStatus === 'stop-requested' ||
                runStatus === 'failed' ||
                runStatus === 'stopped'
                  ? 'error'
                  : 'success'
              }
              title={alertItemTitle}
            />
          </Box>
        ) : null}
        <Flex
          paddingLeft={SPACING_2}
          css={FONT_HEADER_DARK}
          textTransform={TEXT_TRANSFORM_CAPITALIZE}
        >
          {t('protocol_steps')}
        </Flex>
        {protocolSetupCommandList.length > 0 && (
          <Flex margin={SPACING_1}>
            {showProtocolSetupInfo ? (
              <React.Fragment>
                <Flex
                  flexDirection={DIRECTION_COLUMN}
                  flex={'auto'}
                  backgroundColor={C_NEAR_WHITE}
                  marginLeft={SPACING_2}
                >
                  <Flex
                    justifyContent={JUSTIFY_SPACE_BETWEEN}
                    color={C_MED_DARK_GRAY}
                    padding={SPACING_2}
                  >
                    <Text
                      textTransform={TEXT_TRANSFORM_UPPERCASE}
                      fontSize={FONT_SIZE_CAPTION}
                      id={`RunDetails_ProtocolSetupTitle`}
                    >
                      {t('protocol_setup')}
                    </Text>
                    <Btn
                      size={SIZE_1}
                      onClick={() => setShowProtocolSetupInfo(false)}
                    >
                      <Icon name="chevron-up" color={C_MED_DARK_GRAY}></Icon>
                    </Btn>
                  </Flex>
                  <Flex
                    id={`RunDetails_ProtocolSetup_CommandList`}
                    flexDirection={DIRECTION_COLUMN}
                    marginLeft={SPACING_1}
                    paddingLeft={SPACING_2}
                  >
                    {protocolSetupCommandList?.map(command => {
                      return (
                        <ProtocolSetupInfo
                          key={command.id}
                          setupCommand={command as Command}
                        />
                      )
                    })}
                  </Flex>
                </Flex>
              </React.Fragment>
            ) : (
              <Btn
                width={'100%'}
                role={'link'}
                onClick={() => setShowProtocolSetupInfo(true)}
                margin={SPACING_1}
              >
                <Flex
                  fontSize={FONT_SIZE_CAPTION}
                  justifyContent={JUSTIFY_SPACE_BETWEEN}
                  textTransform={TEXT_TRANSFORM_UPPERCASE}
                  color={C_MED_DARK_GRAY}
                  backgroundColor={C_NEAR_WHITE}
                  marginLeft={SPACING_1}
                >
                  <Flex padding={SPACING_2}>{t('protocol_setup')}</Flex>
                  <Flex>
                    <Icon name={'chevron-left'} width={SIZE_1} />
                  </Flex>
                </Flex>
              </Btn>
            )}
          </Flex>
        )}

        <Box
          fontSize={FONT_SIZE_CAPTION}
          color={C_MED_DARK_GRAY}
          flexDirection={DIRECTION_COLUMN}
          height="96vh"
          width="100%"
        >
          <AutoSizer>
            {
              ({height, width}: {height: number, width: number}) =>
              <Flex flexDirection={DIRECTION_COLUMN} marginX={SPACING_2}>
                <FixedSizeList
                  height={height}
                  width={width}
                  itemCount={currentCommandList.length}
                  itemData={{
                    currentCommandList,
                    runStatus,
                  }}
                  itemSize={60}
                >
                  {CommandRow}
                </FixedSizeList>
                <Flex padding={SPACING_1}>{t('end_of_protocol')}</Flex>
              </Flex>
            }
          </AutoSizer>
        </Box>
      </Flex>
    </React.Fragment>
  )
}

function CommandRow(props: any) {
  const {index, style, data} = props
  const {currentCommandList, runStatus } = data
  const showAnticipatedStepsTitle =
    (index === 0 && currentCommandList[0]?.runCommandSummary == null) ||
    (index > 0 &&
      currentCommandList[index - 1].runCommandSummary?.status ===
        'running')
  const {analysisCommand , runCommandSummary} = currentCommandList[index]
  return (
    <Flex
      key={ analysisCommand?.id ?? runCommandSummary?.id }
      id={`RunDetails_CommandItem`}
      paddingLeft={SPACING_1}
      justifyContent={JUSTIFY_START}
      flexDirection={DIRECTION_COLUMN}
      style={style}
    >
      <CommandItem
        analysisCommand={analysisCommand}
        runCommandSummary={runCommandSummary}
        runStatus={runStatus}
        showAnticipatedStepsTitle={showAnticipatedStepsTitle}
      />
    </Flex>
  )
}
