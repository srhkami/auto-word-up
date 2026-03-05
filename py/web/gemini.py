import json
import os
from google import genai
from google.genai import types

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GENAI_CLIENT = genai.Client(api_key=GEMINI_API_KEY)
LLM_MODEL = 'gemini-2.5-flash'

SYSTEM_PROMPT = """
# 任務
使用者會輸入一個英文詞彙，你需要生成指定的內容。這個詞彙通常與航空業有關，

# 生成內容
- **word**: 使用者輸入的原詞彙。
- **translations**: 繁體中文翻譯。
- **description**: 用英文描述這個詞彙的含義。
- **sentences**: 利用這個詞彙以英文造句，情境盡量與航空有關。

# 輸出格式
請嚴格輸出以下的JSON格式，不要帶有開場白、總結或其他多餘的MD格式內容
```
{
    "word": string,
    "translations": string,
    "description": string,
    "sentences": string,
}
```

"""


async def word_agent(word: str) -> str:
    genai_config = types.GenerateContentConfig(
        temperature=0.1,  # 法律問題需要極高的穩定性，設為 0.0 或 0.1
        max_output_tokens=8192,
        system_instruction=types.Part.from_text(text=SYSTEM_PROMPT)
    )

    # 4.2 呼叫Gemini生成最後答案
    response = await GENAI_CLIENT.aio.models.generate_content(
        model=LLM_MODEL,
        contents=f'# 使用者輸入的詞彙：**{word}**',
        config=genai_config,
    )

    return response.text
