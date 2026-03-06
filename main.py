import json
import sys
import threading
import uvicorn
import webview
import os.path
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from core.utils.log import log
from core.web.models import Login, Profile, CreateCards, CreateCardsResponse, QueryGemini, CardContent
from core.web.gemini import word_agent
from google import genai
import httpx

DEBUG_MODE = False
APP_NAME = '預設程式'

app = FastAPI()

USER_PROFILE: Profile | None = None


# 1. 獲取 dist 文件夾的絕對路徑
def get_resource_path(relative_path):
    """ 獲取資源絕對路徑，適應開發環境與 PyInstaller 打包環境 """
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath('.'), relative_path)


DIST_PATH = str(get_resource_path("dist"))
# 瀏覽器緩存路徑 (如果你還是想讓 localStorage 生效)
CACHE_PATH = str(get_resource_path("web_cache"))

# 2. 掛載靜態資源 (CSS, JS, Images)
# 注意：必須放在 API 路由之後，否則可能攔截 API 請求
if os.path.exists(DIST_PATH):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_PATH, "assets")), name="assets")


# 3. 核心：處理 React 路由 (SPA)
# 無論用戶訪問什麼路徑，只要不是 API，都返回 index.html
@app.get("/{catchall:path}")
async def serve_react_app(catchall: str):
    index_file = os.path.join(DIST_PATH, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"error": "React build files not found. Did you run 'npm run build'?"}


# 4. FastAPI 接口

@app.post('/login')
async def login(data: Login) -> Profile:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url='https://api.wordup.com.tw/api/v1/auth/sign_in',
            data=data.model_dump()
        )
        if response.status_code != 200:
            raise HTTPException(response.status_code, '登入帳號錯誤')
        user_profile = Profile(
            token=response.headers.get('token'),
            client=response.headers.get('client'),
            uid=response.headers.get('uid'),
        )
        return user_profile


@app.post('/create_cards')
async def create_cards(data: CreateCards) -> CreateCardsResponse:
    async with httpx.AsyncClient() as client:
        success_words: list[str] = []
        failed_words: list[str] = []
        for card in data.cards:
            response = await client.post(
                url='https://api.wordup.com.tw/api/v1/cards',
                data={
                    "deck_id": data.deck_id,
                    "force_create": data.force_create,
                    "word": card.word,
                    "text_content":
                        {
                            "explanations":
                                [
                                    {
                                        "translations": [card.translations, card.description],
                                        "sentences": [card.sentences],
                                        "word_types": [],
                                        "notes": ["[card.note.tag]"],
                                        "images": [],
                                        "synonyms": []
                                    }
                                ]
                        },

                }
            )
            if response.status_code == 200:
                success_words.append(card.word)
            else:
                failed_words.append(card.word)

        return CreateCardsResponse(
            deck_id=data.deck_id,
            success_words=success_words,
            failed_words=failed_words,
        )


@app.post('/query_gemini')
async def query_gemini(data: QueryGemini) -> CardContent:
    gemini_client = genai.Client(api_key=data.api_key)
    while True:
        text = await word_agent(data.word, gemini_client)
        try:
            res = json.loads(text)
            break
        except ValueError as e:
            print(e)

    return CardContent(
        word=res.get('word'),
        translations=res.get('translations'),
        description=res.get('description'),
        sentences=res.get('sentences'),
    )


# --- 3. 啟動 FastAPI 的函數 (用於線程) ---
def run_server():
    # 使用 uvicorn 啟動，建議固定端口
    uvicorn.run(app, host="127.0.0.1", port=12345, log_level="info", reload=False)


if __name__ == '__main__':
    # 在子線程中啟動 FastAPI，避免阻塞主 UI 線程
    threading.Thread(target=run_server, daemon=True).start()

    if DEBUG_MODE:
        log().error('注意！！DEBUG模式已開啟！！')
    log().info('請耐心等待程式開啟......')
    # api = Api()
    url = 'http://localhost:5173' if DEBUG_MODE else "http://127.0.0.1:12345"
    window = webview.create_window(
        title=APP_NAME,
        url=url,
        min_size=(800, 500),
        maximized=True,
        confirm_close=True,
    )
    log().debug('程式開啟成功')
    webview.start(
        debug=DEBUG_MODE,
        storage_path=str(CACHE_PATH),
        private_mode=False,
    )
