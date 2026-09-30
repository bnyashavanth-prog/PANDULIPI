import asyncio

class StepperDriver:
    def home(self):
        raise NotImplementedError

    async def move_mm(self, d: float):
        raise NotImplementedError

    def stop(self):
        raise NotImplementedError

    @property
    def position_mm(self) -> float:
        raise NotImplementedError

class MockStepper(StepperDriver):
    def __init__(self):
        self._pos = 0.0

    def home(self):
        self._pos = 0.0

    async def move_mm(self, d: float):
        # simulate travel time
        await asyncio.sleep(abs(d - self._pos) * 0.01)
        self._pos = d

    def stop(self):
        pass

    @property
    def position_mm(self) -> float:
        return self._pos
