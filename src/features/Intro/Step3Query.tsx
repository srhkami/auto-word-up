import {useRef} from "react";
import {Button} from "@/component";

export default function Step3Query(){

  const ref = useRef<HTMLTextAreaElement>(null);


  return(
    <div>
      <label htmlFor='words' className='label'>請在此輸入詞彙（以換行分隔）</label>
      <textarea name='words' className='textarea' ref={ref}/>
      <Button color='primary' shape='block' className='mt-4'>運行</Button>
    </div>
  )
}