"use client";
import { Fragment, useContext, useEffect } from "react";
import { SignUp as SignUpContext } from "@/provider/signup";
import { Briefcase, MapPin, LogIn } from "react-feather";
export default function SignUpDisplay() {
  let { data } = useContext(SignUpContext);
  const steps = [
    {
      id: 1,
      icon: Briefcase,
      label: "General company information",
    },
    {
      id: 2,
      icon: MapPin,
      label: "Address",
    },
    {
      id: 3,
      icon: LogIn,
      label: "Login information",
    },
  ];
  return (
    <Fragment>
      <h1 className="md:text-3xl text-xl font-bold">Register your company</h1>
      <p className="text-sm">
        Your free 14-day trial includes most features and 50 bookings. No credit
        card is needed.
      </p>
      <div className="flex flex-row md:flex-col justify-around md:justify-start">
        {steps.map((step) => {
          return (
            <div
              className={`step-${step.id} flex items-center gap-4 mt-5`}
              key={step.id}
            >
              <div
                className={`${
                  data.step === step.id
                    ? "bg-orange-200 dark:bg-violet-700"
                    : ""
                } w-[30px] h-[30px] flex justify-center items-center rounded-full`}
              >
                {<step.icon size={20} />}
              </div>
              <span className="hidden md:inline">{step.label}</span>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
}
