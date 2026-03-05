import {BsFillPersonLinesFill} from "react-icons/bs";
import {MdNumbers} from "react-icons/md";
import {AppVersionText} from "@/utils/log.ts";
import ModalFeedback from "./ModalFeedback.tsx";
import {Button, Col, Row} from "@/component";

export default function Intro() {
  return (
    <div className='flex justify-center items-center'>
      <div className="card bg-neutral text-neutral-content w-96 my-10">
        <div className='card-body'>
          <Row>
            空
          </Row>
          <div className='divider my-1 text-xs'>關於此軟體</div>
          <div className='grid grid-cols-5 gap-2 font-bold text-gray-300'>
            <div className='flex justify-start items-center'>
              <BsFillPersonLinesFill className='mr-2'/>
              作者
            </div>
            <div className='col-span-2 text-start'>
              蔡智楷 C.K.SAI
              <br/>
              <span className='text-xs'>嘉義縣警察局民雄分局</span>
            </div>
            <div className='col-span-2 flex'>
              <ModalFeedback/>
            </div>
            <div className='flex justify-start items-center'>
              <MdNumbers className='mr-2'/>
              版本
            </div>
            <div className='col-span-2 text-start flex items-center'>
              {AppVersionText}
            </div>
            <div className='col-span-2 flex'>
              <a className='btn btn-info btn-sm btn-outline ml-auto' target='_blank'
                 href='https://drive.google.com/drive/folders/1VRCiQbSn09LS3aWd4mgw_Eczls9wJsRm?usp=drive_link'>
                檢查新版
              </a>
            </div>
          </div>
          <div className='divider my-1 text-xs'>作者的網站</div>
          <Row>
            <Col xs={6} className='px-1'>
              <Button style='outline' shape='block'
              onClick={()=>window.open('https://pigeonhand.tw')}>
                <img src='/Logo_PH.png' alt="" className='w-4 h-4'/>
                鴿手
              </Button>
            </Col>
            <Col xs={6} className='px-1'>
              <Button style='outline' shape='block'
                      onClick={()=>window.open('https://traffic.pigeonhand.tw')}>
                <img src='/Logo_TP.png' alt="" className='w-5 h-5'/>
                交通鴿手
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}