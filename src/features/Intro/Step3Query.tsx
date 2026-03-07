import {Dispatch, SetStateAction} from "react";
import {Badge, Button} from "@/component";
import {showToast} from "@/func";
import axios from "axios";
import toast from "react-hot-toast";
import {SubmitHandler, useForm} from "react-hook-form";
import {Step, WordResult} from "@/utils/type.ts";


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
  } = useForm<FormValues>({defaultValues: {deck_id: localStorage.getItem('deck_id') ?? ''}});

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    const apiKey = localStorage.getItem('api-key');
    if (!apiKey) {
      toast.error('尚未儲存 API KEY')
    }
    localStorage.setItem('deck_id', formData.deck_id);
    showToast(
      async () =>
        axios<Array<WordResult>>({
          url: '/api/query_gemini',
          method: 'POST',
          data: {
            api_key: apiKey,
            word_content: formData.word_content,
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
      <div className='flex justify-between'>
        <Button onClick={() => reset({word_content: ''})} color='secondary' className='mt-4'>清除</Button>
        <Button onClick={handleSubmit(onSubmit)} color='primary' className='mt-4'>開始解析</Button>
      </div>

    </div>
  )
}