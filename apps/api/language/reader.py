import random

class Word:
    def __init__(self, text: str, conf: float, bbox: str, alts: list[str]):
        self.text = text
        self.conf = conf
        self.bbox = bbox
        self.alts = alts
        self.status = "machine"

class LineReader:
    def recognize(self, line_image) -> list[Word]:
        raise NotImplementedError

class MockRecognizer(LineReader):
    def __init__(self):
        # Public domain Sanskrit verse stub
        self.vocab = ["धर्मक्षेत्रे", "कुरुक्षेत्रे", "समवेता", "युयुत्सवः", "मामकाः", "पाण्डवाश्चैव", "किमकुर्वत", "सञ्जय"]
        
    def recognize(self, line_image) -> list[Word]:
        words = []
        num_words = random.randint(4, 7)
        for i in range(num_words):
            text = random.choice(self.vocab)
            # Inject realistic errors and varied confidences
            conf = random.random()
            alts = []
            
            if conf < 0.4:
                # Poor recognition
                text = text[:-1] + "x"
                alts = [random.choice(self.vocab) for _ in range(3)]
            elif conf < 0.7:
                # Medium recognition
                alts = [text, random.choice(self.vocab)]
                
            # Dummy bbox [x, y, w, h]
            bbox = f"{i * 50},0,40,30"
            words.append(Word(text, conf, bbox, alts))
            
        return words

def transliterate(text: str, source: str, target: str) -> str:
    """
    Mock Aksharamukha stub.
    """
    if source == target:
        return text
    # In a real app this would call Aksharamukha API or use a local library
    return f"[{target}]{text}"
