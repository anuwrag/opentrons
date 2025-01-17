import * as React from 'react'
import { when, resetAllWhenMocks } from 'jest-when'
import '@testing-library/jest-dom'
import { fireEvent, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import {
  componentPropsMatcher,
  nestedTextMatcher,
  renderWithProviders,
} from '@opentrons/components'
import _uncastedSimpleV6Protocol from '@opentrons/shared-data/protocol/fixtures/6/simpleV6.json'
import { i18n } from '../../../i18n'
import * as RobotSelectors from '../../../redux/robot/selectors'
import { useTrackEvent } from '../../../redux/analytics'
import { useProtocolDetails } from '../../RunDetails/hooks'
import { getLatestLabwareOffsetCount } from '../../ProtocolSetup/LabwarePositionCheck/utils/getLatestLabwareOffsetCount'
import { LastRun } from '../LastRun'
import { useMostRecentRunId } from '../hooks/useMostRecentRunId'
import { useProtocolQuery, useRunQuery } from '@opentrons/react-api-client'
import { RerunningProtocolModal } from '../RerunningProtocolModal'
import { useCloneRun } from '../hooks'
import type { ProtocolFile } from '@opentrons/shared-data'
import type { LabwareOffset } from '@opentrons/api-client'

jest.mock('@opentrons/react-api-client')
jest.mock('../../../redux/analytics')
jest.mock(
  '../../ProtocolSetup/LabwarePositionCheck/utils/getLatestLabwareOffsetCount'
)
jest.mock('../../RunDetails/hooks')
jest.mock('../../../redux/robot/selectors')
jest.mock('../hooks')
jest.mock('../RerunningProtocolModal')
jest.mock('../hooks/useMostRecentRunId')

const mockUseMostRecentRunId = useMostRecentRunId as jest.MockedFunction<
  typeof useMostRecentRunId
>
const mockUseRunQuery = useRunQuery as jest.MockedFunction<typeof useRunQuery>
const mockUseProtocolDetails = useProtocolDetails as jest.MockedFunction<
  typeof useProtocolDetails
>
const mockGetConnectedRobotName = RobotSelectors.getConnectedRobotName as jest.MockedFunction<
  typeof RobotSelectors.getConnectedRobotName
>
const mockUseCloneRun = useCloneRun as jest.MockedFunction<typeof useCloneRun>
const mockUseProtocolQuery = useProtocolQuery as jest.MockedFunction<
  typeof useProtocolQuery
>
const mockRerunningProtocolModal = RerunningProtocolModal as jest.MockedFunction<
  typeof RerunningProtocolModal
>
const mockGetLatestLabwareOffsetCount = getLatestLabwareOffsetCount as jest.MockedFunction<
  typeof getLatestLabwareOffsetCount
>
const mockUseTrackEvent = useTrackEvent as jest.MockedFunction<
  typeof useTrackEvent
>

const simpleV6Protocol = (_uncastedSimpleV6Protocol as unknown) as ProtocolFile<{}>

const render = () => {
  return renderWithProviders(
    <BrowserRouter>
      <LastRun />
    </BrowserRouter>,
    {
      i18nInstance: i18n,
    }
  )[0]
}

let mockTrackEvent: jest.Mock

describe('LastRun', () => {
  let mockOffsets: LabwareOffset[]

  beforeEach(() => {
    mockOffsets = [
      {
        id: 'someId',
        createdAt: 'someTimestamp',
        definitionUri: 'mockUri',
        location: { slotName: '3' },
        vector: { x: 5, y: 5, z: 5 },
      },
    ]
    mockGetConnectedRobotName.mockReturnValue('robotName')
    mockUseMostRecentRunId.mockReturnValue('RunId')
    when(mockUseProtocolDetails).calledWith().mockReturnValue({
      protocolData: simpleV6Protocol,
      displayName: 'mock display name',
    })
    when(mockUseRunQuery)
      .calledWith('RunId')
      .mockReturnValue({
        data: {
          data: {
            protocolId: 'ProtocolId',
            createdAt: '2021-11-12T19:39:19.668514+00:00',
            labwareOffsets: mockOffsets,
          },
        },
      } as any)
    mockUseCloneRun.mockReturnValue({ cloneRun: jest.fn(), isLoading: false })
    when(mockUseProtocolQuery)
      .calledWith('ProtocolId')
      .mockReturnValue({
        data: {
          data: {
            protocolType: 'python',
            createdAt: 'now',
            id: 'ProtocolId',
            metadata: {},
            analyses: {},
            files: [{ name: 'name', role: 'main' }],
          },
        },
      } as any)

    when(mockRerunningProtocolModal)
      .calledWith(
        componentPropsMatcher({
          onCloseClick: expect.anything(),
        })
      )
      .mockImplementation(({ onCloseClick }) => (
        <div onClick={onCloseClick}>Mock Rerunning Protocol Modal</div>
      ))

    when(mockGetLatestLabwareOffsetCount)
      .calledWith(mockOffsets)
      .mockReturnValue(0)
    mockTrackEvent = jest.fn()
    when(mockUseTrackEvent).calledWith().mockReturnValue(mockTrackEvent)
  })

  afterEach(() => {
    resetAllWhenMocks()
    jest.restoreAllMocks()
  })

  it('renders the correct latest protocol uplaoded info', () => {
    when(mockGetLatestLabwareOffsetCount)
      .calledWith(mockOffsets)
      .mockReturnValue(1)
    const { getByText } = render()
    getByText('robotName’s last run')
    getByText('mock display name')
    getByText('Protocol name')
    getByText('Run status')
    getByText('Run timestamp')
    //  Had to use nestedTextMatcher to avoid testing for the changing timezones
    getByText(nestedTextMatcher('2021-11-12'))
    getByText(nestedTextMatcher(':39:19'))
    getByText('Labware Offset data')
    getByText('1 Labware Offsets')
    getByText('See How Rerunning a Protocol Works')
    getByText('Run again')
  })
  it('renders No Offset data', () => {
    when(mockUseRunQuery)
      .calledWith('RunId')
      .mockReturnValue({
        data: {
          data: {
            createdAt: '2021-11-12T19:39:19.668514+00:00',
            labwareOffsets: [],
          },
        },
      } as any)
    when(mockGetLatestLabwareOffsetCount).calledWith([]).mockReturnValue(0)
    const { getByText } = render()
    getByText('No Labware Offset data')
  })
  it('renders run again button', () => {
    const { getByRole } = render()
    mockUseCloneRun.mockReturnValue({ cloneRun: jest.fn(), isLoading: false })
    const button = getByRole('button', { name: 'Run again' })
    expect(button).not.toBeDisabled()
    fireEvent.click(button)
    expect(mockTrackEvent).toHaveBeenCalledWith({
      name: 'runAgain',
      properties: {},
    })
  })
  it('renders correct link text', () => {
    const { getByRole } = render()
    getByRole('link', {
      name: 'See How Rerunning a Protocol Works',
    })
    expect(screen.queryByText('Mock Rerunning Protocol Modal')).toBeNull()
  })
  it('renders modal when link is clicked', () => {
    mockRerunningProtocolModal.mockReturnValue(
      <div>Mock Rerunning Protocol Modal</div>
    )
    const { getByText, getByRole } = render()
    const openModal = getByRole('link', {
      name: 'See How Rerunning a Protocol Works',
    })
    fireEvent.click(openModal)
    getByText('Mock Rerunning Protocol Modal')
  })
  it('renders null if run is null', () => {
    when(mockUseRunQuery)
      .calledWith('RunId')
      .mockReturnValue({
        data: null,
      } as any)

    const { queryByText } = render()
    expect(queryByText('Run Again')).toBeNull()
  })
  it('renders file name if Protocol name is null', () => {
    when(mockUseProtocolQuery)
      .calledWith('ProtocolId')
      .mockReturnValue({
        data: {
          data: {
            protocolType: 'python',
            createdAt: 'now',
            id: 'ProtocolId',
            metadata: {},
            analyses: {},
            files: [{ name: 'name', role: 'main' }],
          },
        },
      } as any)

    when(mockUseProtocolDetails)
      .calledWith()
      .mockReturnValue({
        protocolData: { displayName: null },
      } as any)
    const { getByText } = render()
    getByText('name')
  })
})
