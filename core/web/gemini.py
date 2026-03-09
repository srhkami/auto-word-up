from google.genai import types, Client

LLM_MODEL = 'gemini-2.5-flash'


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
