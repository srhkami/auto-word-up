from pydantic import BaseModel


class Login(BaseModel):
    email: str
    password: str


class Profile(BaseModel):
    uid: str
    token: str
    client: str


class WordResult(BaseModel):
    word: str
    translations: str  # 譯本
    description: str  # 描述
    sentences: str  # 例句


class CreateCards(BaseModel):
    profile: Profile
    deck_id: str  # 卡片堆 ID
    force_create: bool  # 強制創建模式
    cards: list[WordResult]


class CreateCardsResponse(BaseModel):
    deck_id: str
    success_words: list[str] = []
    failed_words: list[str] = []


class QueryGemini(BaseModel):
    api_key: str
    word_content: str
