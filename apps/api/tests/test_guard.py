import pytest
import asyncio
from hw.safety import SafetyGuard
from hw.lights import MockLights
from hw.stepper import MockStepper

@pytest.fixture
def guard():
    config = {
        "env": {"safe_range": {"rh_min": 45, "rh_max": 60, "temp_min": 18, "temp_max": 30}},
        "safety": {"uv_hard_cap_seconds": 0.1, "max_continuous_light_seconds": 60}
    }
    lights = MockLights()
    stepper = MockStepper()
    return SafetyGuard(config, lights, stepper)

def test_uv_lock(guard):
    assert not guard.uv_unlocked
    guard.unlock_uv("1234")
    assert guard.uv_unlocked
    guard.lock_uv()
    assert not guard.uv_unlocked

def test_interlock(guard):
    # safe
    safe, _ = guard.check_env({"humidity": 50, "temp": 25})
    assert safe
    
    # out of range
    safe, _ = guard.check_env({"humidity": 40, "temp": 25})
    assert not safe
    safe, _ = guard.check_env({"humidity": 50, "temp": 35})
    assert not safe

@pytest.mark.asyncio
async def test_uv_hard_cap():
    config = {"safety": {"uv_hard_cap_seconds": 0.1}}
    lights = MockLights()
    stepper = MockStepper()
    g = SafetyGuard(config, lights, stepper)
    
    g.unlock_uv("1234")
    lights.set("UV395", 1.0)
    
    task = asyncio.create_task(g.monitor_loop())
    await asyncio.sleep(0.2)
    
    assert g.e_stopped
    assert not lights.is_uv_on()
    task.cancel()
