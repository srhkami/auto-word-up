import {Dispatch, SetStateAction} from "react";
import {Badge, Button} from "@/component";
import toast from "react-hot-toast";
import {Step} from "@/lib/type.ts";
import {SubmitHandler, useForm} from "react-hook-form";

type Props = {
  readonly setStep: Dispatch<SetStateAction<Step>>
}

type FormValues = {
  api_key: string,
}

export default function Step2ApiKey({setStep}: Props) {

  const {register, handleSubmit} = useForm<FormValues>({
    defaultValues: {
      api_key: localStorage.getItem('api-key') ?? '',
    }
  });

  const onSave: SubmitHandler<FormValues> = (formData) => {
    localStorage.setItem('api-key', formData.api_key)
    toast.success('儲存成功')
    setStep(3);
  }
  return (
    <form className='card-body' onSubmit={handleSubmit(onSave)}>
      <div className='card-title'><Badge color='info'>Step 2</Badge>連結 Gemini</div>
      <label htmlFor='key' className='label'>請輸入Gemini的API KEY</label>
      <input className='input w-full' type='text'
             {...register('api_key', {required: true})}/>
      <Button shape='block' color='success' className='mt-4'>儲存</Button>
    </form>
  )
}