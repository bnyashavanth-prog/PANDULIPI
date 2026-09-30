class LightDriver:
    def set(self, channel: str, duty: float):
        raise NotImplementedError

    def all_off(self):
        raise NotImplementedError
        
    def is_uv_on(self) -> bool:
        raise NotImplementedError

class MockLights(LightDriver):
    def __init__(self):
        self.state = {
            "N": 0.0, "E": 0.0, "S": 0.0, "W": 0.0,
            "RING": 0.0, "IR850": 0.0, "UV395": 0.0
        }

    def set(self, channel: str, duty: float):
        if channel in self.state:
            self.state[channel] = duty

    def all_off(self):
        for k in self.state:
            self.state[k] = 0.0

    def is_uv_on(self) -> bool:
        return self.state.get("UV395", 0.0) > 0.0
