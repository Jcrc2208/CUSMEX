import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from groq import Groq

app = FastAPI()
app.title = "Nexus API"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginSchema(BaseModel):
    accessRole: str
    email: EmailStr
    password: str
    language: str

@app.post("/api/v1/auth/login")
async def login(data: LoginSchema):
    if data.email == "admin@natp.com" and data.password == "Secret123":
        return {
            "status": "success",
            "message": "Bienvenido al Nexus",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales incorrectas, verifica tu acceso."
    )

#client = Groq(api_key=("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"))
client = Groq(api_key=os.getenv("AQUI_VA_TU_API_KEY_DE_GROQ"))

class ChatRequest(BaseModel):
    prompt: str
    uploaded_by: str = "Usuario"  # Quién subió el evento/archivo
    item_content: str = ""        # Qué fue lo que subió

@app.post("/api/chat")
async def chat_with_ai(data: ChatRequest):
    try:
        system_instruction = (
            "Eres el asistente personal de CUSMEX. "
            "REGLAS ESTRICTAS:\n"
            "1. Cero rodeos y cero introducciones largas. Ve directo al grano.\n"
            "2. Si el usuario responde con un 'sí', 'claro' o una afirmación corta a tu pregunta anterior, NO vuelvas a preguntar lo mismo; asume de inmediato la acción y muestra la información o los eventos de hoy.\n"
            "3. Mantén las respuestas cortas (máximo 3-4 líneas) y en un tono natural y servicial."
        )

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
        print("Error en el cliente de Groq:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

#"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")
