import {Badge, Button, Col, FormInputCol, Row} from "@/component";
import {SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import {showToast} from "@/func";
import {Dispatch, SetStateAction} from "react";
import {MdNumbers} from "react-icons/md";
import {AppVersionText} from "@/lib/log.ts";
import {Profile, Step} from "@/lib/type.ts";

type Props = {
  readonly setStep: Dispatch<SetStateAction<Step>>
  readonly setProfile: Dispatch<SetStateAction<Profile | undefined>>
}

type FormValues = {
  email: string,
  password: string,
}


export default function Step1Login({setStep, setProfile}: Props) {

  const {
    handleSubmit,
    register,
    formState: {errors, isSubmitting}
  } = useForm<FormValues>({defaultValues: {email: localStorage.getItem('email') ?? ''}});

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    await showToast(
      async () => axios<Profile>({
        url: '/api/login',
        method: 'POST',
        data: formData
      }),
      {label: '登入', success: '登入成功'})
      .then((res) => {
        setProfile(res.data);
        setStep(2);
      })
      .finally(() => localStorage.setItem('email', formData.email))
  }

  return (
    <form className='card-body' onSubmit={handleSubmit(onSubmit)}>
      <div className='card-title'><Badge color='info'>Step 1</Badge>登入 WORD UP</div>
      <Row>
        <FormInputCol label='Email' error={errors.email?.message}>
          <input className='input w-full' type='email'
                 {...register('email', {required: '此為必填欄位'})}/>
        </FormInputCol>
        <FormInputCol label='密碼' error={errors.password?.message}>
          <input className='input w-full' type='password'
                 {...register('password', {required: '此為必填欄位'})}/>
        </FormInputCol>
        <Col xs={12} className='mt-6 px-1'>
          <Button color='primary' shape='block' disabled={isSubmitting}>登入</Button>
        </Col>
      </Row>
      <div className='divider my-1 text-xs'>關於此軟體</div>
      <div className='grid grid-cols-5 gap-2 font-bold'>
        <div className='flex justify-start items-center'>
          <MdNumbers className='mr-2'/>
          版本
        </div>
        <div className='col-span-2 text-start flex items-center'>
          {AppVersionText}
        </div>
      </div>
    </form>
  )
}