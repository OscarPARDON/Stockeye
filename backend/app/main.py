import uvicorn
from fastapi import FastAPI
from backend.app.api.routes.values import router_values
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Stockeye")
app.include_router(router_values,prefix="/api/values", tags=["Values"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)