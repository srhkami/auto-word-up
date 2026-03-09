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
from core.web.models import Login, Profile, CreateCards, CreateCardsResponse, QueryGemini, WordResult
from core.web.gemini import word_agent
from google import genai
import httpx

DEBUG_MODE = False
APP_NAME = '預設程式'

app = FastAPI()


def get_resource_path(relative_path):
    """ 獲取資源絕對路徑，適應開發環境與 PyInstaller 打包環境 """
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath('.'), relative_path)


def get_portable_path(folder_name):
    """ 獲取程式執行檔 (.exe) 旁邊的路徑 """
    if hasattr(sys, 'frozen'):
        # 如果是打包後的環境，sys.executable 是 .exe 的完整路徑
        base_path = os.path.dirname(sys.executable)
    else:
        # 如果是開發環境，則使用目前腳本所在目錄
        base_path = os.path.dirname(os.path.abspath(__file__))

    full_path = os.path.join(base_path, folder_name)

    # 確保資料夾存在
    if not os.path.exists(full_path):
        try:
            os.makedirs(full_path)
        except PermissionError:
            # 如果沒有權限（例如在 Program Files 下），這裡會報錯
            print("權限不足，無法在程式旁建立資料夾！")

    return full_path


DIST_PATH = str(get_resource_path("dist"))
CACHE_PATH = str(get_portable_path("web_cache"))

# 2. 掛載靜態資源 (CSS, JS, Images)
# 注意：必須放在 API 路由之後，否則可能攔截 API 請求
if os.path.exists(DIST_PATH):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_PATH, "assets")), name="assets")


# 3. 核心：處理 React 路由 (SPA)
# 無論用戶訪問什麼路徑，只要不是 API，都返回 index.html
@app.get("/{catchall:path}")
async def serve_react_app(catchall: str):
    log().info(DIST_PATH)
    log().info(CACHE_PATH)
    index_file = os.path.join(DIST_PATH, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"error": "React build files not found. Did you run 'npm run build'?"}


# 4. FastAPI 接口

@app.post('/api/login')
async def login(data: Login) -> Profile:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url='https://api.wordup.com.tw/api/v1/auth/sign_in',
            data=data.model_dump()
        )
        if response.status_code != 200:
            raise HTTPException(response.status_code, '登入帳號錯誤')

        return Profile(
            token=response.headers.get('access-token'),
            client=response.headers.get('client'),
            uid=response.headers.get('uid'),
        )


@app.post('/api/query_gemini')
async def query_gemini(data: QueryGemini) -> list[WordResult]:
    gemini_client = genai.Client(api_key=data.api_key)
    json_text = await word_agent(data.word_content, data.prompt, gemini_client)
    words = json.loads(json_text)
    results: list[WordResult] = []
    for i in words:
        results.append(WordResult(
            word=i.get('word'),
            translations=i.get('translations'),
            description=i.get('description'),
            sentences=i.get('sentences'),
        ))
    return results


@app.post('/api/create_cards')
async def create_cards(data: CreateCards) -> CreateCardsResponse:
    async with httpx.AsyncClient() as client:
        success_words: list[str] = []
        failed_words: list[str] = []
        for card in data.cards:
            response = await client.post(
                url='https://api.wordup.com.tw/api/v1/cards',
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0",
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    # 關鍵身分與自定義標頭
                    "Client-Info": "web3/3.97.0",
                    "Client-Lang": "zh-TW",
                    'access-token': data.profile.token,
                    'client': data.profile.client,
                    'uid': data.profile.uid,
                    # 防盜連
                    "Origin": "https://app.wordup.com.tw",
                    "Referer": "https://app.wordup.com.tw/",
                },
                json={
                    "deck_id": data.deck_id,
                    "force_create": data.force_create,
                    "word": card.word,
                    "text_content":
                        {
                            "explanations":
                                [
                                    {
                                        "images": [],
                                        "notes": ["[card.note.tag]"],
                                        "sentences": [card.sentences],
                                        "synonyms": [],
                                        "translations": [card.translations, card.description],
                                        "word_types": [],
                                    }
                                ]
                        },

                }
            )
            log().info(f'【{card.word}】' + str(response.status_code))
            if response.status_code == 200:
                success_words.append(card.word)
            else:
                failed_words.append(card.word)

        return CreateCardsResponse(
            deck_id=data.deck_id,
            success_words=success_words,
            failed_words=failed_words,
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
        storage_path=CACHE_PATH,
        private_mode=False,
    )
