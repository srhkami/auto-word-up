from pydantic import BaseModel


class Login(BaseModel):
    email: str
    password: str


class Profile(BaseModel):
    uid: str
    token: str
    client: str


class CardContent(BaseModel):
    word: str
    translations: str  # 譯本
    description: str  # 描述
    sentences: str  # 例句


class CreateCard(CardContent):
    deck_id: str  # 卡片堆 ID
    force_create: bool  # 強制創建模式


class QueryGemini(BaseModel):
    word: str
