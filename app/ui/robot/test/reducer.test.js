// robot reducer test

import path from 'path'
import {reducer, actionTypes} from '../'

describe('robot reducer', () => {
  test('initial state', () => {
    const state = reducer(undefined, {})

    expect(state).toEqual({
      connectRequest: {inProgress: false, error: null},
      homeRequest: {inProgress: false, error: null},
      runRequest: {inProgress: false, error: null},
      protocol: path.join(
        __dirname,
        '../../../../api/opentrons/server/tests/data/dinosaur.py'
      ),
      protocolError: null,
      isConnected: false,
      isRunning: false,
      currentCommand: -1,
      commands: []
    })
  })

  test('handles connect action', () => {
    const state = {connectRequest: {inProgress: false, error: new Error('AH')}}
    const action = {type: actionTypes.CONNECT}

    expect(reducer(state, action)).toEqual({
      connectRequest: {inProgress: true, error: null}
    })
  })

  test('handles connect response success', () => {
    const state = {
      connectRequest: {inProgress: true, error: null},
      isConnected: false
    }
    const action = {type: actionTypes.CONNECT_RESPONSE, error: null}

    expect(reducer(state, action)).toEqual({
      connectRequest: {inProgress: false, error: null},
      isConnected: true
    })
  })

  test('handles connectResponse failure', () => {
    const state = {
      connectRequest: {inProgress: true, error: null},
      isConnected: true
    }
    const action = {type: actionTypes.CONNECT_RESPONSE, error: new Error('AH')}

    expect(reducer(state, action)).toEqual({
      connectRequest: {inProgress: false, error: new Error('AH')},
      isConnected: false
    })
  })

  // TODO(mc): we may need to track which specific axes are homing
  test('handles home action', () => {
    const state = {homeRequest: {inProgress: false, error: new Error('AH')}}
    const action = {type: actionTypes.HOME}

    expect(reducer(state, action)).toEqual({
      homeRequest: {inProgress: true, error: null}
    })
  })

  test('handles homeResponse success', () => {
    const state = {homeRequest: {inProgress: true, error: null}}
    const action = {type: actionTypes.HOME_RESPONSE, error: null}

    expect(reducer(state, action)).toEqual({
      homeRequest: {inProgress: false, error: null}
    })
  })

  test('handles homeResponse failure', () => {
    const state = {homeRequest: {inProgress: true, error: null}}
    const action = {type: actionTypes.HOME_RESPONSE, error: new Error('AH')}

    expect(reducer(state, action)).toEqual({
      homeRequest: {inProgress: false, error: new Error('AH')}
    })
  })

  test('handles run action', () => {
    const state = {runRequest: {inProgress: false, error: new Error('AH')}}
    const action = {type: actionTypes.RUN}

    expect(reducer(state, action)).toEqual({
      runRequest: {inProgress: true, error: null},
      // TODO(mc): for now, naively assume that if a run request is dispatched
      // the robot is running
      isRunning: true
    })
  })

  test('handles runResponse success', () => {
    const state = {isRunning: true, runRequest: {inProgress: true, error: null}}
    const action = {type: actionTypes.RUN_RESPONSE, error: null}

    expect(reducer(state, action)).toEqual({
      runRequest: {inProgress: false, error: null},
      isRunning: false
    })
  })

  test('handles runResponse failure', () => {
    const state = {isRunning: true, runRequest: {inProgress: true, error: null}}
    const action = {type: actionTypes.RUN_RESPONSE, error: new Error('AH')}

    expect(reducer(state, action)).toEqual({
      runRequest: {inProgress: false, error: new Error('AH')},
      isRunning: false
    })
  })

  test('handles setIsConnected', () => {
    const state = {isConnected: false}
    const action = {
      type: actionTypes.SET_IS_CONNECTED,
      payload: {isConnected: true}
    }

    expect(reducer(state, action)).toEqual({isConnected: true})
  })

  test('handles setCommands', () => {
    const state = {commands: [], currentCommand: 42}
    const action = {
      type: actionTypes.SET_COMMANDS,
      payload: {commands: ['foo', 'bar', 'baz']}
    }

    expect(reducer(state, action)).toEqual({
      commands: ['foo', 'bar', 'baz'],
      currentCommand: -1
    })
  })

  test('handles setProtocolError', () => {
    const state = {protocolError: null}
    const action = {
      type: actionTypes.SET_PROTOCOL_ERROR,
      error: new Error('AHHH')
    }

    expect(reducer(state, action)).toEqual({protocolError: new Error('AHHH')})
  })

  test('handles tickCurrentCommand', () => {
    const state = {currentCommand: 3}
    const action = {type: actionTypes.TICK_CURRENT_COMMAND}

    expect(reducer(state, action)).toEqual({currentCommand: 4})
  })
})
