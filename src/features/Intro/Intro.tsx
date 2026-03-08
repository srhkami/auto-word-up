import Step1Login from "@/features/Intro/Step1Login.tsx";
import Step2ApiKey from "@/features/Intro/Step2ApiKey.tsx";
import Step3Query from "@/features/Intro/Step3Query.tsx";
import {useState} from "react";
import {Profile, Step, WordResult} from "@/utils/type.ts";
import Step4Cards from "@/features/Intro/Step4Cards.tsx";

export default function Intro() {

  const [step, setStep] = useState<Step>(3);
  const [profile, setProfile] = useState<Profile>();
  const [words, setWords] = useState<Array<WordResult>>([]);


  return (
    <div className='flex justify-center items-center'>
      <div className="card bg-base-200/90 w-96 my-10">
        {step === 1 &&
          <Step1Login setStep={setStep} setProfile={setProfile}/>
        }
        {
          step === 2 &&
          <Step2ApiKey setStep={setStep}/>
        }
        {
          step === 3 &&
          <Step3Query setStep={setStep} setWords={setWords}/>
        }
        {
          step === 4 &&
          <Step4Cards setStep={setStep} words={words} profile={profile}/>
        }
      </div>
    </div>
  )
}