import {Dispatch, SetStateAction, useRef, useState} from "react";
import {Badge, Button} from "@/component";
import toast from "react-hot-toast";
import {Step} from "@/utils/type.ts";

type Props = {
  readonly setStep: Dispatch<SetStateAction<Step>>
}

export default function Step2ApiKey({setStep}:Props) {

  const [key, setKey] = useState<string>(localStorage.getItem('api-key') ?? '')
  const inputRef = useRef<HTMLInputElement>(null);

  const onSave = () => {
    if (inputRef.current) {
      setKey(inputRef.current.value)
      localStorage.setItem('api-key', inputRef.current.value)
      toast.success('儲存成功')
      setStep(3);
    }
  }
  return (
    <div className='card-body'>
      <div className='card-title'><Badge color='info'>Step 2</Badge>連結 Gemini</div>
      <label htmlFor='key' className='label'>請輸入Gemini的API KEY</label>
      <input name='key' defaultValue={key} ref={inputRef} className='input w-full' type='text'/>
      <Button shape='block' color='success' className='mt-4' onClick={onSave}>儲存</Button>
    </div>
  )
}