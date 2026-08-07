# services/ai_service.py
import os
from groq import Groq
from faster_whisper import WhisperModel

# Inicialización de Faster Whisper
model_size = "base"
Whisper_Model = WhisperModel(model_size, device="cpu", compute_type="int8")

# Configuración cliente Groq (IA)
client = Groq(api_key="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")