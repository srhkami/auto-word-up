import {useRef, useState} from "react";
import {Button} from "@/component";


export default function Step2ApiKey() {

  const [key, setKey] = useState<string>(localStorage.getItem('api-key') ?? '')
  const inputRef = useRef<HTMLInputElement>(null);

  const onSave = () => {
    if (inputRef.current) {
      setKey(inputRef.current.value)
      localStorage.setItem('api-key', inputRef.current.value)
    }
  }
  return (
    <div>
      <label htmlFor='key' className='label'>請輸入Gemini的API KEY</label>
      <input name='key' defaultValue={key} ref={inputRef} className='input' type='text'/>
      <Button shape='block' color='success' className='mt-4' onClick={onSave}>儲存</Button>
    </div>
  )
}