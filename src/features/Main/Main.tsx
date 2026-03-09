import Step1Login from "@/features/Main/Step1Login.tsx";
import Step2ApiKey from "@/features/Main/Step2ApiKey.tsx";
import Step3Query from "@/features/Main/Step3Query.tsx";
import {useState} from "react";
import {Profile, Step, WordResult} from "@/lib/type.ts";
import Step4Cards from "@/features/Main/Step4Cards.tsx";

export default function Main() {

  const [step, setStep] = useState<Step>(1);
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