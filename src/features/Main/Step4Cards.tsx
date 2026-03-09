import {Badge, Button} from "@/component";
import {CreateCardsResponse, Profile, Step, WordResult} from "@/lib/type.ts";
import {Dispatch, SetStateAction, useState} from "react";
import {showToast} from "@/func";
import axios from "axios";
import toast from "react-hot-toast";
import {FaArrowLeft, FaCheckCircle} from "react-icons/fa";

type Props = {
  readonly setStep: Dispatch<SetStateAction<Step>>
  readonly words: Array<WordResult>,
  readonly profile: Profile | undefined,
}

export default function Step4Cards({setStep, words, profile}: Props) {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onStart = () => {
    setIsLoading(true);
    showToast(
      async () => axios<CreateCardsResponse>({
        url: '/api/create_cards',
        method: 'POST',
        data: {
          profile: profile,
          deck_id: localStorage.getItem('deck_id'),
          force_create: false,
          cards: words,
        }
      }), {label: '匯入', success: '匯入成功'}
    ).then((res) => {
      setStep(3);
      toast.success(`成功${res.data.success_words.length}筆，失敗${res.data.failed_words.length}筆`)
    }).finally(() => setIsLoading(false))
  }

  const items = words.map(word => {
    return (
      <div key={word.word} className='card card-border border-base-300 my-1'>
        <div className='card-body'>
          <div className='flex justify-between items-end'>
            <div className='text-xl border-l-4 border-primary pl-2'>{word.word}</div>
            <div>{word.translations}</div>
          </div>
          <div className='text-sm'>{word.description}</div>
          <div className='text-sm'>{word.sentences}
          </div>
        </div>
      </div>
    )
  })

  return (
    <div className='card-body'>
      <div className='card-title'><Badge color='info'>Step 4</Badge>預覽及匯入卡片</div>
      <ul className='list'>
        {items}
      </ul>
      <div className='flex justify-between mt-4'>
        <Button color='secondary' onClick={() => setStep(3)}><FaArrowLeft/>返回</Button>
        <Button color='primary' onClick={onStart} disabled={isLoading}><FaCheckCircle/>開始匯入</Button>
      </div>
    </div>
  )
}