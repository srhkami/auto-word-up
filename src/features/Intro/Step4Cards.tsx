import {Badge, Button} from "@/component";
import {CreateCardsResponse, Profile, Step, WordResult} from "@/utils/type.ts";
import {Dispatch, SetStateAction} from "react";
import {showToast} from "@/func";
import axios from "axios";
import toast from "react-hot-toast";

type Props = {
  readonly setStep: Dispatch<SetStateAction<Step>>
  readonly words: Array<WordResult>,
  readonly profile: Profile | undefined,
}

export default function Step4Cards({setStep, words, profile}: Props) {

  const onStart = () => {
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
    })
  }

  const items = words.map(word => {
    return (
      <div key={word.word} className='card card-border border-base-300'>
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
      <div className='card-title'><Badge color='info'>Step 4</Badge>匯入卡片</div>
      <ul className='list'>
        {items}
      </ul>
      <div className='flex justify-between'>
        <Button color='secondary' onClick={() => setStep(3)}>返回上一步</Button>
        <Button color='primary' onClick={onStart}>匯入卡片</Button>
      </div>
    </div>
  )
}