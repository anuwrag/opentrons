import * as Types from '../types'
import * as ApiTypes from '../api-types'
import type {
  RobotApiResponse,
  RobotApiResponseMeta,
} from '../../robot-api/types'

export const mockRobot = { name: 'robot', ip: '127.0.0.1', port: 31950 }

export const mockApiTemperatureModuleLegacy: ApiTypes.ApiTemperatureModuleLegacy = {
  name: 'tempdeck',
  displayName: 'Temperature Deck',
  port: '/dev/ot_module_tempdeck0',
  serial: 'abc123',
  model: 'temp_deck_v4.0',
  fwVersion: 'v2.0.0',
  status: 'idle',
  hasAvailableUpdate: true,
  data: {
    currentTemp: 25,
    targetTemp: null,
  },
}

export const mockApiTemperatureModule: ApiTypes.ApiTemperatureModule = {
  id: 'tempdeck_id',
  name: 'tempdeck',
  displayName: 'tempdeck',
  port: '/dev/ot_module_tempdeck0',
  serial: 'abc123',
  revision: 'temp_deck_v4.0',
  moduleModel: 'temperatureModuleV1',
  model: 'temp_deck_v1.5',
  fwVersion: 'v2.0.0',
  status: 'idle',
  hasAvailableUpdate: true,
  data: {
    currentTemp: 25,
    targetTemp: null,
  },
  usbPort: { hub: 1, port: 1 },
}

export const mockApiTemperatureModuleGen2: ApiTypes.ApiTemperatureModule = {
  id: 'tempdeck_id',
  name: 'tempdeck',
  displayName: 'tempdeck',
  model: 'temp_deck_v20',
  moduleModel: 'temperatureModuleV2',
  port: '/dev/ot_module_tempdeck0',
  serial: 'abc123',
  revision: 'temp_deck_v20',
  fwVersion: 'v2.0.0',
  status: 'idle',
  hasAvailableUpdate: true,
  data: {
    currentTemp: 25,
    targetTemp: null,
  },
  usbPort: { hub: 1, port: 1 },
}

export const mockTemperatureModule: Types.TemperatureModule = {
  id: 'tempdeck_id',
  model: 'temperatureModuleV1',
  type: 'temperatureModuleType',
  port: '/dev/ot_module_tempdeck0',
  serial: 'abc123',
  revision: 'temp_deck_v4.0',
  fwVersion: 'v2.0.0',
  status: 'idle',
  hasAvailableUpdate: true,
  data: {
    currentTemp: 25,
    targetTemp: null,
  },
  usbPort: { hub: 1, port: 1 },
}

export const mockTemperatureModuleGen2: Types.TemperatureModule = {
  id: 'tempdeck_id',
  model: 'temperatureModuleV2',
  type: 'temperatureModuleType',
  port: '/dev/ot_module_tempdeck0',
  serial: 'abc123',
  revision: 'temp_deck_v20.0',
  fwVersion: 'v2.0.0',
  status: 'idle',
  hasAvailableUpdate: true,
  data: {
    currentTemp: 25,
    targetTemp: null,
  },
  usbPort: { hub: 1, port: 1 },
}

export const mockApiMagneticModuleLegacy: ApiTypes.ApiMagneticModuleLegacy = {
  name: 'magdeck',
  displayName: 'Magnetic Deck',
  port: '/dev/ot_module_magdeck0',
  serial: 'def456',
  model: 'mag_deck_v4.0',
  fwVersion: 'v2.0.0',
  status: 'disengaged',
  hasAvailableUpdate: true,
  data: {
    engaged: false,
    height: 42,
  },
}

export const mockApiMagneticModule: ApiTypes.ApiMagneticModule = {
  id: 'magdeck_id',
  name: 'magdeck',
  displayName: 'magdeck',
  model: 'mag_deck_v4.0',
  moduleModel: 'magneticModuleV1',
  port: '/dev/ot_module_magdeck0',
  serial: 'def456',
  revision: 'mag_deck_v4.0',
  fwVersion: 'v2.0.0',
  status: 'disengaged',
  hasAvailableUpdate: true,
  data: {
    engaged: false,
    height: 42,
  },
  usbPort: { hub: 1, port: 1 },
}

export const mockApiMagneticModuleGen2: ApiTypes.ApiMagneticModule = {
  id: 'magdeck_id',
  name: 'magdeck',
  displayName: 'magdeck',
  model: 'mag_deck_v20',
  moduleModel: 'magneticModuleV2',
  port: '/dev/ot_module_magdeck0',
  serial: 'def456',
  revision: 'mag_deck_v20',
  fwVersion: 'v2.0.0',
  status: 'disengaged',
  hasAvailableUpdate: true,
  data: {
    engaged: false,
    height: 42,
  },
  usbPort: { hub: 1, port: 1 },
}

export const mockMagneticModule: Types.MagneticModule = {
  id: 'magdeck_id',
  model: 'magneticModuleV1',
  type: 'magneticModuleType',
  port: '/dev/ot_module_magdeck0',
  serial: 'def456',
  revision: 'mag_deck_v4.0',
  fwVersion: 'v2.0.0',
  status: 'disengaged',
  hasAvailableUpdate: true,
  data: {
    engaged: false,
    height: 42,
  },
  usbPort: { hub: 1, port: 1 },
}

export const mockMagneticModuleGen2: Types.MagneticModule = {
  id: 'magdeck_id',
  model: 'magneticModuleV2',
  type: 'magneticModuleType',
  port: '/dev/ot_module_magdeck0',
  serial: 'def456',
  revision: 'mag_deck_v4.0',
  fwVersion: 'v2.0.0',
  status: 'disengaged',
  hasAvailableUpdate: true,
  data: {
    engaged: false,
    height: 42,
  },
  usbPort: { hub: 1, port: 1 },
}

export const mockApiThermocyclerLegacy: ApiTypes.ApiThermocyclerModuleLegacy = {
  name: 'thermocycler',
  displayName: 'Thermocycler',
  port: '/dev/ot_module_thermocycler0',
  serial: 'ghi789',
  model: 'thermocycler_v4.0',
  fwVersion: 'v2.0.0',
  status: 'idle',
  hasAvailableUpdate: true,
  data: {
    lid: 'open',
    lidTarget: null,
    lidTemp: null,
    currentTemp: null,
    targetTemp: null,
    holdTime: null,
    rampRate: null,
    currentCycleIndex: null,
    totalCycleCount: null,
    currentStepIndex: null,
    totalStepCount: null,
  },
}

export const mockApiThermocycler: ApiTypes.ApiThermocyclerModule = {
  id: 'thermocycler_id',
  name: 'thermocycler',
  displayName: 'thermocycler',
  port: '/dev/ot_module_thermocycler0',
  serial: 'ghi789',
  model: 'thermocycler_v4.0',
  moduleModel: 'thermocyclerModuleV1',
  revision: 'thermocycler_v4.0',
  fwVersion: 'v2.0.0',
  status: 'idle',
  hasAvailableUpdate: true,
  data: {
    lid: 'open',
    lidTarget: null,
    lidTemp: null,
    currentTemp: null,
    targetTemp: null,
    holdTime: null,
    rampRate: null,
    currentCycleIndex: null,
    totalCycleCount: null,
    currentStepIndex: null,
    totalStepCount: null,
  },
  usbPort: { hub: 1, port: 1 },
}

export const mockThermocycler: Types.ThermocyclerModule = {
  id: 'thermocycler_id',
  model: 'thermocyclerModuleV1',
  type: 'thermocyclerModuleType',
  port: '/dev/ot_module_thermocycler0',
  serial: 'ghi789',
  revision: 'thermocycler_v4.0',
  fwVersion: 'v2.0.0',
  status: 'idle',
  hasAvailableUpdate: true,
  data: {
    lid: 'open',
    lidTarget: null,
    lidTemp: null,
    currentTemp: null,
    targetTemp: null,
    holdTime: null,
    rampRate: null,
    currentCycleIndex: null,
    totalCycleCount: null,
    currentStepIndex: null,
    totalStepCount: null,
  },
  usbPort: { hub: 1, port: 1 },
}

export const mockApiHeaterShaker: ApiTypes.ApiHeaterShakerModule = {
  id: 'heatershaker_id',
  displayName: 'heatershaker',
  port: '/dev/ot_module_heatershaker0',
  serial: 'jkl123',
  model: 'heatershaker_v4.0',
  moduleModel: 'heaterShakerModuleV1',
  revision: 'heatershaker_v4.0',
  fwVersion: 'v2.0.0',
  status: 'idle',
  hasAvailableUpdate: true,
  data: {
    labwareLatchStatus: 'idle_unknown',
    speedStatus: 'idle',
    temperatureStatus: 'idle',
    currentSpeed: null,
    currentTemp: null,
    targetSpeed: null,
    targetTemp: null,
    errorDetails: null,
  },
  usbPort: { hub: 1, port: 1 },
}

export const mockHeaterShaker: Types.HeaterShakerModule = {
  id: 'heatershaker_id',
  model: 'heaterShakerModuleV1',
  type: 'heaterShakerModuleType',
  port: '/dev/ot_module_thermocycler0',
  serial: 'jkl123',
  revision: 'heatershaker_v4.0',
  fwVersion: 'v2.0.0',
  status: 'idle',
  hasAvailableUpdate: true,
  data: {
    labwareLatchStatus: 'idle_unknown',
    speedStatus: 'idle',
    temperatureStatus: 'idle',
    currentSpeed: null,
    currentTemp: null,
    targetSpeed: null,
    targetTemp: null,
    errorDetails: null,
  },
  usbPort: { hub: 1, port: 1 },
}

// fetch modules fixtures

export const mockFetchModulesSuccessMeta: RobotApiResponseMeta = {
  method: 'GET',
  path: '/modules',
  ok: true,
  status: 200,
}

export const mockFetchModulesSuccess: RobotApiResponse = {
  ...mockFetchModulesSuccessMeta,
  host: mockRobot,
  body: {
    modules: [
      mockApiMagneticModule,
      mockApiTemperatureModule,
      mockApiThermocycler,
    ],
  },
}

export const mockLegacyFetchModulesSuccess: RobotApiResponse = {
  ...mockFetchModulesSuccessMeta,
  host: mockRobot,
  body: {
    modules: [
      mockApiMagneticModuleLegacy,
      mockApiTemperatureModuleLegacy,
      mockApiThermocyclerLegacy,
    ],
  },
}

export const mockFetchModulesSuccessActionPayloadModules = [
  mockMagneticModule,
  mockTemperatureModule,
  mockThermocycler,
]

export const mockFetchModulesFailureMeta: RobotApiResponseMeta = {
  method: 'GET',
  path: '/modules',
  ok: false,
  status: 500,
}

export const mockFetchModulesFailure: RobotApiResponse = {
  ...mockFetchModulesFailureMeta,
  host: mockRobot,
  body: { message: 'AH' },
}

// send module command fixtures

export const mockSendModuleCommandSuccessMeta: RobotApiResponseMeta = {
  method: 'POST',
  path: '/modules/abc123',
  ok: true,
  status: 200,
}

export const mockSendModuleCommandSuccess: RobotApiResponse = {
  ...mockSendModuleCommandSuccessMeta,
  host: mockRobot,
  body: {
    message: 'Success',
    returnValue: 42,
  },
}

export const mockSendModuleCommandFailureMeta: RobotApiResponseMeta = {
  method: 'POST',
  path: '/modules/abc123',
  ok: false,
  status: 500,
}

export const mockSendModuleCommandFailure: RobotApiResponse = {
  ...mockSendModuleCommandFailureMeta,
  host: mockRobot,
  body: { message: 'AH' },
}

// update module command fixtures

export const mockUpdateModuleSuccessMeta: RobotApiResponseMeta = {
  method: 'POST',
  path: '/modules/abc123/update',
  ok: true,
  status: 200,
}

export const mockUpdateModuleSuccess: RobotApiResponse = {
  ...mockUpdateModuleSuccessMeta,
  host: mockRobot,
  body: {
    message: 'update successful',
  },
}

export const mockUpdateModuleFailureMeta: RobotApiResponseMeta = {
  method: 'POST',
  path: '/modules/abc123/update',
  ok: false,
  status: 500,
}

export const mockUpdateModuleFailure: RobotApiResponse = {
  ...mockUpdateModuleFailureMeta,
  host: mockRobot,
  body: { message: 'BAD NEWS BEARS' },
}
