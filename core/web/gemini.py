from google.genai import types, Client

LLM_MODEL = 'gemini-2.5-flash'

SYSTEM_PROMPT = """
# 任務
使用者會輸入數個英文詞彙，以換行符號分隔，這個詞彙通常與航空業有關，你需要生成指定的內容。

# 生成內容
- **word**: 使用者輸入的原詞彙。
- **translations**: 繁體中文翻譯。
- **description**: 用英文描述這個詞彙的含義。
- **sentences**: 利用這個詞彙以英文造句，情境盡量與航空有關。

# 輸出格式
請參考以下的JSON格式，每個詞彙為一個物件，組成一個清單
```
[
    {
        "word": "word1",
        "translations": "translations1",
        "description": "description1",
        "sentences": "sentences1",
    },
    {
        "word": "word2",
        "translations": "translations2",
        "description": "description2"
        "sentences": "sentences2",
    }
]
```
"""


async def word_agent(word: str, prompt: str, client: Client) -> str:
    genai_config = types.GenerateContentConfig(
        temperature=0.5,
        max_output_tokens=8192,
        system_instruction=types.Part.from_text(text=prompt),
        response_mime_type='application/json',
    )

    # 4.2 呼叫Gemini生成最後答案
    response = await client.aio.models.generate_content(
        model=LLM_MODEL,
        contents=f'# 使用者輸入的詞彙：**{word}**',
        config=genai_config,
    )

    return response.text
