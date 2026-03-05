import './App.css'
import {Toaster} from "react-hot-toast";
import {Nav} from "@/layout";
import {Intro, ModalNewVersion} from "@/features";

function App() {
  return (
    <div>
      <Nav/>
      <div className='min-h-[84vh]'>
        <Intro/>
      </div>
      {/*對話框*/}
      <ModalNewVersion/>
      {/*快速彈窗*/}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  )
}

export default App
