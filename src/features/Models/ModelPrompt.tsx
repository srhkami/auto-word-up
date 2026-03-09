import {Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle} from "@/component";
import {useModal} from "@/hooks";
import {SubmitHandler, useForm} from "react-hook-form";
import toast from "react-hot-toast";

type FormValues = {
  prompt: string,
}

const defaultPrompt = `# 任務
使用者會輸入數個英文詞彙，以換行符號分隔，你需要生成指定的內容。

# 生成內容
- **word**: 使用者輸入的詞彙，這個詞彙通常與航空業有關，也有可能是航空用語的縮寫。
- **translations**: 繁體中文翻譯。
- **description**: 用英文描述這個詞彙的含義，如果這個詞彙是縮寫，請補充還原後的原文。
- **sentences**: 利用這個詞彙以英文造句，情境盡量與航空有關。

# 輸出格式
請參考以下的JSON格式，每個詞彙為一個物件，組成一個清單
\`\`\`
[
    {
        "word": "word1",
        "translations": "translations1",
        "description": "description1",
        "sentences": "sentences1",
    },
    {
        "word": "word2",
        "translations": "translations2",
        "description": "description2"
        "sentences": "sentences2",
    }
]
\`\`\``

export default function ModelPrompt() {

  const {isShow, onShow, onHide} = useModal();
  const {
    register,
    handleSubmit,
    reset
  } = useForm<FormValues>({defaultValues: {prompt: localStorage.getItem('prompt') ?? defaultPrompt,}});

  const onSubmit: SubmitHandler<FormValues> = ({prompt}) => {
    localStorage.setItem('prompt', prompt);
    toast.success('儲存成功');
    onHide();
  }

  return (
    <>
      <Button onClick={onShow} style='outline'>提示詞</Button>
      <Modal isShow={isShow} onHide={onHide} closeButton>
        <ModalHeader>
          <ModalTitle>編輯提示詞</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className='p-1'>
            <div className='text-[11px] italic text-error'>只能編輯「生成內容」中的描述，其他部分請勿更動</div>
            <textarea className='textarea w-full min-h-72'
                      {...register('prompt', {required: true})}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button style='outline' size='sm' onClick={() => reset({prompt: defaultPrompt})}>重設</Button>
          <Button size='sm' color='success' onClick={handleSubmit(onSubmit)}>儲存</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}