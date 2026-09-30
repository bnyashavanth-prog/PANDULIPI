import random

class SensorDriver:
    def read(self) -> dict:
        raise NotImplementedError

class MockSensors(SensorDriver):
    def read(self) -> dict:
        # Realistic drifting mock
        return {
            "humidity": 50.0 + random.uniform(-2, 2),
            "temp": 22.0 + random.uniform(-0.5, 0.5),
            "voc": 100.0 + random.uniform(-10, 10),
            "lux": 300.0 + random.uniform(-20, 20)
        }
