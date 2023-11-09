import SignUpContext from "@/provider/signup";
import SignUpDisplay from "@/components/SignUpDisplay";
import SignupStepper from "@/components/SignupStepper";
export default function SignUp() {
  return (
    <SignUpContext>
      <div className="flex w-full mx-auto max-w-[1024px] gap-4 md:flex-row flex-col">
        <div className="w-full md:w-2/5">
          <SignUpDisplay />
        </div>
        <div className="w-full md:w-3/5">
          <SignupStepper />
        </div>
      </div>
    </SignUpContext>
  );
}
