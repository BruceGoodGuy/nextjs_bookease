"use client";
import { useContext, useState } from "react";
import { SignUp as SignUpContext } from "@/provider/signup";
import Step1 from "@/components/SignupStepper/step1";
import Step2 from "@/components/SignupStepper/step2";
import Step3 from "@/components/SignupStepper/step3";
import { Button } from "@nextui-org/react";

export default function SignupStepper() {
  let { data, submitNextStep, setData } = useContext(SignUpContext);
  const [state, setstate] = useState({ errors: {} });
  const renderStepper = function (step) {
    switch (step) {
      case 1:
        return <Step1 label={"General company information"} />;
      case 2:
        return <Step2 label={"Address"} />;
      case 3:
        return <Step3 label={"Login information"} />;
      default:
        return "Invalid step!";
    }
  };

  const returnStep = function () {
    let prevStep = data.step - 1;
    if (prevStep >= 1) {
      setData({ ...data, step: prevStep });
    }
  };

  return (
    <div className="w-full">
      <form>
        {renderStepper(data.step)}
        <div className="flex md:gap-2 justify-end max-w gap-2 mt-3 flex-col md:flex-row">
          <Button
            color="primary"
            onPress={submitNextStep}
            className="md:w-1/3 w-full"
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
