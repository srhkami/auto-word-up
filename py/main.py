import json
import sys
import threading

import uvicorn
import webview
import os.path

from fastapi import FastAPI

from web.response import Response
from utils.log import log
from web.models import Login, Profile, CreateCard, QueryGemini, WordContent
from web.gemini import word_agent
from pydantic import ValidationError
import requests

DEBUG_MODE = False

APP_NAME = '預設程式'

USER_PROFILE: Profile | None = None


def get_root_path():
    # 如果是打包後的 exe
    if getattr(sys, 'frozen', False):
        return os.path.dirname(sys.executable)
    # 如果是開發環境的 .py
    else:
        return os.path.dirname(os.path.abspath(__file__))


# 瀏覽器緩存路徑 (如果你還是想讓 localStorage 生效)
CACHE_DIR = os.path.join(get_root_path(), "web_cache")

# --- 2. 建立 FastAPI 應用 ---
app = FastAPI()




def login(self, req):
    """
    登入
    :param req:
    :return:
    """
    try:
        data = Login.model_validate(req)
        response = requests.post(
            url='https://api.wordup.com.tw/api/v1/auth/sign_in',
            data=data.model_dump()
        )
        if response.status_code != 200:
            return Response(status=500, message='帳密錯誤')
        USER_PROFILE = Profile(
            token=response.json().get('token'),
            client=response.headers.get('client'),
            uid=response.headers.get('uid'),
        )
        return Response(status=200).model_dump()

    except ValidationError as e:
        return Response(status=500, message=str(e)).model_dump()

def create_card(self, req):
    try:
        data = CreateCard.model_validate(req)
        response = requests.post(
            url='https://api.wordup.com.tw/api/v1/cards',
            data={
                "deck_id": data.deck_id,
                "force_create": data.force_create,
                "word": data.word,
                "text_content":
                    {
                        "explanations":
                            [
                                {
                                    "translations": [data.translations],
                                    "sentences": [data.sentences],
                                    "word_types": [],
                                    "notes": ["[card.note.tag]"],
                                    "images": [],
                                    "synonyms": []
                                }
                            ]
                    },

            }
        )
        if response.status_code == 422:
            return Response(status=422, message='已有重複卡片').model_dump()
        if response.status_code == 200:
            return Response(status=201, message='創建卡片成功').model_dump()
        return Response(status=response.status_code, message='創建卡片失敗').model_dump()
    except ValidationError as e:
        return Response(status=500, message=str(e)).model_dump()

def query_gemini(self, req):
    try:
        data = QueryGemini.model_validate(req)
        while True:
            text = word_agent(data.word)
            try:
                json.loads(text)
                break
            except ValueError as e:
                print(e)

        # todo: 調用Gemini API得到名詞解析
        word = WordContent(word='name', translations='姓名', sentences='Please write your name on this line.')
        return Response[WordContent](status=200, data=word).model_dump()
    except ValidationError as e:
        return Response(status=500, message=str(e)).model_dump()

# --- 3. 啟動 FastAPI 的函數 (用於線程) ---
def run_server():
    # 使用 uvicorn 啟動，建議固定端口
    uvicorn.run(app, host="127.0.0.1", port=12345, log_level="info")

if __name__ == '__main__':
    # 在子線程中啟動 FastAPI，避免阻塞主 UI 線程
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()

    if DEBUG_MODE:
        log().error('注意！！DEBUG模式已開啟！！')
    log().info('請耐心等待程式開啟......')
    # api = Api()
    url = os.path.join(os.getcwd(), './html/index.html') if not DEBUG_MODE else 'http://localhost:5173'
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
        storage_path=CACHE_DIR,
        private_mode=False,
    )
