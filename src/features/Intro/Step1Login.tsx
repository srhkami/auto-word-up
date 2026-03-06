import {Alert, Button, Col, FormInputCol, Row} from "@/component";
import {SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import {showToast} from "@/func";
import {useState} from "react";

type FormValues = {
  email: string,
  password: string,
}


export default function Step1Login() {

  const [uid, setUid] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    formState: {errors, isLoading}
  } = useForm<FormValues>({defaultValues: {email: localStorage.getItem('email') ?? ''}});

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    localStorage.setItem('email', formData.email)
    showToast(
      async () => axios<string>({
        url: '/api/login',
        method: 'POST',
        data: formData
      }),
      {label: '登入', success: '登入成功'})
      .then(res => setUid(res.data))
  }

  if (uid) {
    return (
      <Alert color='info' style='outline'>
        <div className='w-full'>
          您已登入，帳號為【{uid}】
          <div className='flex justify-end mt-2'>
            <Button size='sm' onClick={() => setUid(null)}>重新登入</Button>
          </div>
        </div>
      </Alert>
    )
  }

  return (
    <Row>
      <FormInputCol label='Email' error={errors.email?.message}>
        <input className='input' type='email'
               {...register('email', {required: '此為必填欄位'})}/>
      </FormInputCol>
      <FormInputCol label='密碼' error={errors.password?.message}>
        <input className='input' type='password'
               {...register('password', {required: '此為必填欄位'})}/>
      </FormInputCol>
      <Col xs={12} className='mt-4'>
        <Button color='primary' shape='block' onClick={handleSubmit(onSubmit)} disabled={isLoading}>登入</Button>
      </Col>
    </Row>
  )
}