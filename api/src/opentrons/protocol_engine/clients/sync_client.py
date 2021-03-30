"""Synchronous ProtocolEngine client module."""
from uuid import uuid4
from typing import cast

from .. import commands
from ..state import StateView
from ..types import DeckSlotLocation, WellLocation
from .transports import AbstractSyncTransport


class SyncClient:
    """Synchronously interact with a `ProtocolEngine`.

    A `ProtocolEngine` normally provides an ``async`` interface for executing
    commands. This class wraps that with a synchronous interface. Each
    method blocks until the underlying command completes and returns a result,
    or raises an exception if the underlying command has an error.

    In the future, this class could also abstract away stuff like running
    the `ProtocolEngine` in a separate process.
    """

    def __init__(self, transport: AbstractSyncTransport) -> None:
        """Initialize the client with a transport."""
        self._transport = transport

    @property
    def state(self) -> StateView:
        """Get a view of the engine's state."""
        return self._transport.state

    @staticmethod
    def _create_command_id() -> str:
        return str(uuid4())

    def load_labware(
        self,
        location: DeckSlotLocation,
        load_name: str,
        namespace: str,
        version: int,
    ) -> commands.LoadLabwareResult:
        """Execute a ``LoadLabwareRequest``, returning the result."""
        request = commands.LoadLabwareRequest(
            location=location,
            loadName=load_name,
            namespace=namespace,
            version=version,
        )
        result = self._transport.execute_command(
            request=request,
            command_id=self._create_command_id(),
        )

        return cast(commands.LoadLabwareResult, result)

    def aspirate(
        self,
        pipette_id: str,  # fix before merge: This is the right place to
                          # transition from snake_case to camelCase, right?
        labware_id: str,
        well_name: str,
        well_location: WellLocation,
        volume: float,
        rate: float,
    ) -> commands.AspirateResult:
        """Execute an ``AspirateRequest``, returning the result."""
        request = commands.AspirateRequest(
            pipetteId=pipette_id,
            labwareId=labware_id,
            wellName=well_name,
            wellLocation=well_location,
            volume=volume,
        )
        # Fix before merge: AspirateRequest needs to take a rate?
        result = self._transport.execute_command(
            request=request,
            command_id=self._create_command_id()
        )

        return cast(commands.AspirateResult, result)
