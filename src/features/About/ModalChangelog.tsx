import {LuNotebookTabs} from "react-icons/lu";
import {Modal, ModalBody, ModalHeader} from "@/component";
import {CHANGELOG_LIST} from "@/utils/log.ts";
import ChangelogCollapse from "@/features/About/ChangelogCollapse.tsx";
import {useModal} from "@/hooks";

/* 顯示更新日誌的對話框 */
export default function ModalChangelog() {

  const {isShow, onShow, onHide} = useModal();

  const Collapses = CHANGELOG_LIST.map(obj => {
    return (
      <ChangelogCollapse key={obj.version} obj={obj}/>
    )
  })

  return (
    <>
      <button onClick={onShow}>更新日誌</button>
      <Modal isShow={isShow} onHide={onHide} closeButton>
        <ModalBody>
          <ModalHeader className='justify-center' divider>
            <LuNotebookTabs className='text-info mr-2'/>
            更新日誌
          </ModalHeader>
          <div>
            {Collapses}
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}