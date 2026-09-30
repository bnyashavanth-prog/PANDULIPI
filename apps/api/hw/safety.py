import time
import asyncio
from typing import Optional

class SafetyGuard:
    def __init__(self, config: dict, light_driver, stepper_driver):
        self.config = config
        self.light_driver = light_driver
        self.stepper_driver = stepper_driver
        
        self.uv_unlocked = False
        self.uv_seconds_used = 0.0
        self.uv_start_time = None
        self.e_stopped = False

    def trip_estop(self, reason: str):
        self.e_stopped = True
        self.light_driver.all_off()
        self.stepper_driver.stop()
        print(f"E-STOP TRIPPED: {reason}")

    def reset_estop(self):
        self.e_stopped = False

    def unlock_uv(self, pin: str) -> bool:
        # In a real app, verify PIN securely
        if pin == "1234":
            self.uv_unlocked = True
            return True
        return False

    def lock_uv(self):
        self.uv_unlocked = False

    def check_env(self, env_data: dict) -> tuple[bool, str]:
        safe = self.config.get("env", {}).get("safe_range", {})
        rh = env_data.get("humidity", 50)
        temp = env_data.get("temp", 22)
        
        if not (safe.get("rh_min", 0) <= rh <= safe.get("rh_max", 100)):
            return False, "Humidity out of safe range"
        if not (safe.get("temp_min", 0) <= temp <= safe.get("temp_max", 100)):
            return False, "Temperature out of safe range"
        
        return True, "Safe"

    async def monitor_loop(self):
        while True:
            if self.uv_unlocked and self.light_driver.is_uv_on():
                if self.uv_start_time is None:
                    self.uv_start_time = time.time()
                else:
                    elapsed = time.time() - self.uv_start_time
                    if elapsed > self.config.get("safety", {}).get("uv_hard_cap_seconds", 3):
                        self.light_driver.set("UV395", 0)
                        self.trip_estop("UV light exceeded hard cap")
            else:
                self.uv_start_time = None
                
            await asyncio.sleep(0.1)
