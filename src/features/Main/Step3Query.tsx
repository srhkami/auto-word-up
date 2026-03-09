import {Dispatch, SetStateAction} from "react";
import {Badge, Button} from "@/component";
import {showToast} from "@/func";
import axios from "axios";
import toast from "react-hot-toast";
import {SubmitHandler, useForm} from "react-hook-form";
import {Step, WordResult} from "@/lib/type.ts";
import ModelPrompt from "@/features/Models/ModelPrompt.tsx";
import {FaArrowRight} from "react-icons/fa";

type FormValues = {
  word_content: string,
  deck_id: string
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
    formState: {
      isSubmitting
    }
  } = useForm<FormValues>({defaultValues: {deck_id: localStorage.getItem('deck_id') ?? '',}});

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    const apiKey = localStorage.getItem('api-key');
    const prompt = localStorage.getItem('prompt');
    if (!apiKey || !prompt) {
      toast.error('尚未儲存「API KEY」或「提示詞」')
    }
    localStorage.setItem('deck_id', formData.deck_id);
    await showToast(
      async () =>
        axios<Array<WordResult>>({
          url: '/api/query_gemini',
          method: 'POST',
          data: {
            api_key: apiKey,
            word_content: formData.word_content,
            prompt: prompt,
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
      <div className='card-title'><Badge color='info'>Step 3</Badge>AI 解析</div>
      <div className='label'>卡片堆 ID</div>
      <div className='text-[11px] italic text-info'>請複製網址中「deckId=」後面的數字</div>
      <input className='input w-full' {...register('deck_id', {required: true})}/>
      <div className='label mt-2'>請在此輸入詞彙（以換行分隔）</div>
      <div className='text-[11px] italic text-info'>建議每次數量不要太多，以免 AI 輸出遺漏</div>
      <textarea className='textarea w-full min-h-48' {...register('word_content', {required: true})}/>
      <div>

      </div>
      <div className='flex mt-4 gap-2'>
        <Button onClick={() => reset({word_content: ''})} color='secondary'>清除</Button>
        <ModelPrompt/>
        <Button onClick={handleSubmit(onSubmit)} color='primary' className='ml-auto'
                disabled={isSubmitting}>開始解析<FaArrowRight/></Button>
      </div>
    </div>
  )
}