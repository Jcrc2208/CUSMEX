# api/routes/ai.py
import os
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from schemas.pydantic_schemas import ChatRequest
from services.ai_service import client, Whisper_Model

router = APIRouter(prefix="/api", tags=["Inteligencia Artificial"])

@router.post("/chat")
async def chat_with_ai(data: ChatRequest):
    """
    Endpoint para el asistente de chat de texto con instrucciones de sistema configuradas.
    """
    try:
        # Aquí incluimos la instrucción de sistema que tenías en tu código original
        system_instruction = (
            "Eres el asistente personal de CUSMEX. "
            "REGLAS ESTRICTAS:\n"
            "1. Cero rodeos y cero introducciones largas. Ve directo al grano.\n"
            "2. Mantén las respuestas cortas (máximo 3-4 líneas) y en un tono natural."
        )
        
        # Formato del mensaje para la IA
        user_message = f"Usuario: {data.uploaded_by}\nContenido subido: {data.item_content}\nComentario adicional: {data.prompt}"

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": user_message}
            ],
            temperature=0.5,
        )
        
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el chat de IA: {str(e)}")

@router.post("/voice-assistant")
async def voice_assistant(file: UploadFile = File(...), language: str = Form(...)):
    """
    Endpoint para procesar audio mediante Whisper y responder con IA.
    """
    audio_path = f"temp_{file.filename}"
    try:
        with open(audio_path, "wb") as buffer:
            buffer.write(await file.read())

        # Transcripción con Faster Whisper
        segments, _ = Whisper_Model.transcribe(audio_path, beam_size=5)
        user_text = " ".join([segment.text for segment in segments])

        # Procesamiento con el cliente de Groq (usando el mismo modelo)
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": user_text}],
            temperature=0.5,
        )
        
        return {
            "userText": user_text, 
            "aiText": completion.choices[0].message.content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el asistente de voz: {str(e)}")
    finally:
        # Limpieza del archivo temporal
        if os.path.exists(audio_path):
            os.remove(audio_path)