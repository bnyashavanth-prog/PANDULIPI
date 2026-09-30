from typing import Optional

class NfcDriver:
    def poll(self) -> Optional[str]:
        raise NotImplementedError

class MockNfc(NfcDriver):
    def __init__(self):
        self._pending_uid = None
        
    def trigger(self, uid: str):
        self._pending_uid = uid

    def poll(self) -> Optional[str]:
        uid = self._pending_uid
        self._pending_uid = None
        return uid
