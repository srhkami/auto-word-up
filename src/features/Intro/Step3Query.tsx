import {Dispatch, SetStateAction} from "react";
import {Badge, Button, Collapse, CollapseContent, CollapseTitle} from "@/component";
import {showToast} from "@/func";
import axios from "axios";
import toast from "react-hot-toast";
import {SubmitHandler, useForm} from "react-hook-form";
import {Step, WordResult} from "@/utils/type.ts";

const defaultPrompt = `# 任務
使用者會輸入數個英文詞彙，以換行符號分隔，這個詞彙通常與航空業有關，你需要生成指定的內容。

# 生成內容
- **word**: 使用者輸入的原詞彙。
- **translations**: 繁體中文翻譯。
- **description**: 用英文描述這個詞彙的含義。
- **sentences**: 利用這個詞彙以英文造句，情境盡量與航空有關。

# 輸出格式
請參考以下的JSON格式，每個詞彙為一個物件，組成一個清單
\`\`\`
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
\`\`\``

type FormValues = {
  word_content: string,
  deck_id: string
  prompt: string,
}

type Props = {
  readonly setStep: Dispatch<SetStateAction<Step>>,
  readonly setWords: Dispatch<SetStateAction<Array<WordResult>>>,
}

export default function Step3Query({setStep, setWords}: Props) {

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      deck_id: localStorage.getItem('deck_id') ?? '',
      prompt: localStorage.getItem('prompt') ?? defaultPrompt,
    }
  });

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    const apiKey = localStorage.getItem('api-key');
    if (!apiKey) {
      toast.error('尚未儲存「API KEY」或「提示詞」')
    }
    localStorage.setItem('deck_id', formData.deck_id);
    localStorage.setItem('prompt', formData.prompt)
    showToast(
      async () =>
        axios<Array<WordResult>>({
          url: '/api/query_gemini',
          method: 'POST',
          data: {
            api_key: apiKey,
            word_content: formData.word_content,
            prompt: formData.prompt,
          }
        })
      , {label: '調用 Gemini ', success: '處理完成', error: err => err.response.data}
    ).then(res => {
      setWords(res.data);
      setStep(4);
    })
  }

  return (
    <div className='card-body'>
      <div className='card-title'><Badge color='info'>Step 3</Badge>匯入詞彙</div>
      <div className='label'>卡片堆 ID</div>
      <div className='text-[11px] italic text-warning'>請複製網址中「deckId=」後面的數字</div>
      <input className='input w-full' {...register('deck_id', {required: true})}/>
      <div className='label mt-2'>請在此輸入詞彙（以換行分隔）</div>
      <div className='text-[11px] italic text-warning'>建議每次數量不要太多，以免 AI 輸出缺漏</div>
      <textarea className='textarea w-full' {...register('word_content', {required: true})}/>
      <Collapse inputName='prompt' className='mt=2' icon='plus'>
        <CollapseTitle>
          修改提示詞
        </CollapseTitle>
        <CollapseContent>

          <Button size='sm' style='outline'>重置</Button>
          <div className='text-[11px] italic text-error'>格式部分請勿更動，否則會出錯</div>
          <textarea className='textarea w-full'
                    {...register('prompt', {required: true})}/>
        </CollapseContent>
      </Collapse>
      <div className='flex justify-between'>
        <Button onClick={() => reset({word_content: ''})} color='secondary' className='mt-4'>清除</Button>
        <Button onClick={handleSubmit(onSubmit)} color='primary' className='mt-4'>開始解析</Button>
      </div>
    </div>
  )
}