import numpy as np

class CameraDriver:
    def capture(self, exposure_us: int, gain: float) -> np.ndarray:
        raise NotImplementedError

    async def stream(self):
        raise NotImplementedError

class MockCamera(CameraDriver):
    def capture(self, exposure_us: int, gain: float) -> np.ndarray:
        # Return a dummy image
        return np.zeros((1080, 1920, 3), dtype=np.uint8)

    async def stream(self):
        import asyncio
        while True:
            yield np.zeros((480, 640, 3), dtype=np.uint8)
            await asyncio.sleep(0.1)
