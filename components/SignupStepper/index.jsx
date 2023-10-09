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
        return <Step3 />;
      default:
        return "Invalid step!";
    }
  };

  const returnStep = function () {
    let prevStep = data.step - 1;
    if (prevStep >= 1) {
      setData({...data, step: prevStep});
    }
  };

  //   const handleSubmit = async () => {
  //     const errors = await submitNextStep();
  //     setstate({ ...state, errors });
  //   };

  return (
    <div className="w-full">
      <form>
        {renderStepper(data.step)}
        <div className="flex md:gap-2 justify-end max-w gap-2 mt-3 flex-col md:flex-row">
          {data.step !== 1 ? (
            <Button
              variant="bordered"
              onPress={returnStep}
              className="md:w-1/3 w-full"
            >
              Back
            </Button>
          ) : (
            ""
          )}
          <Button
            color="primary"
            // isDisabled={data.isDisabledButton}
            onPress={submitNextStep}
            className="md:w-1/3 w-full"
          >
            Continue
          </Button>
        </div>
        {/* <div className={`step-2 ${data.step !== 2 ? "hidden" : ""}`}>
          <p className="text-xl md:text-3xl font-bold md:text-start text-center">
            Address
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <NextSelect
                label="Country"
                className="max-w-md"
                placeholder="Country"
                labelPlacement="outside"
                name="code"
                onChange={updateSelect}
                selectedKeys={data.form.code}
              >
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </NextSelect>
              <Input
                className="max-w-md"
                type="text"
                name="state"
                labelPlacement="outside"
                value={data.form.state}
                label="State (if applicable)"
                placeholder="State"
                onBlur={validateFields}
                onChange={updateFields}
                isInvalid={
                  data.errors.step2.hasOwnProperty("state") &&
                  data.errors.step2.state !== ""
                    ? true
                    : false
                }
                errorMessage={data.errors.step2.state}
              />
            </div>
            <div className="flex gap-4">
              <Input
                className="max-w-md"
                type="text"
                labelPlacement="outside"
                label="City"
                isRequired
                name="city"
                value={data.form.city ?? ""}
                placeholder="City"
                maxLength={100}
                onBlur={validateFields}
                onChange={updateFields}
                isInvalid={
                  data.errors.step2.hasOwnProperty("city") &&
                  data.errors.step2.city !== ""
                    ? true
                    : false
                }
                errorMessage={data.errors.step2.city}
              />
              <Input
                className="max-w-md"
                type="text"
                labelPlacement="outside"
                label="ZIP / Post code"
                placeholder="Zip code"
                name="zip"
                value={data.form.zip}
                maxLength={100}
                onBlur={validateFields}
                onChange={updateFields}
                isInvalid={
                  data.errors.step2.hasOwnProperty("zip") &&
                  data.errors.step2.zip !== ""
                    ? true
                    : false
                }
                errorMessage={data.errors.step2.zip}
              />
            </div>
            <div className="xx">
              <Input
                type="text"
                labelPlacement="outside"
                label="Street address"
                placeholder="Street"
                name="street"
                value={data.form.street}
                isRequired
                description="You can change this later"
                maxLength={100}
                onBlur={validateFields}
                onChange={updateFields}
                isInvalid={
                  data.errors.step2.hasOwnProperty("street") &&
                  data.errors.step2.street !== ""
                    ? true
                    : false
                }
                errorMessage={data.errors.step2.street}
              />
            </div>
            <div className="xx">
              <div className="flex justify-between">
                <p className="flex items-center">Map</p>
                <Button
                  variant="bordered"
                  className="md:w-1/5 w-1/2"
                  startContent={<MapPin />}
                  onPress={locateMe}
                >
                  Locate me
                </Button>
              </div>
              <div className="flex mt-3">
                {data.loading ? (
                  ""
                ) : (
                  <MapMaker
                    ref={ref}
                    long={data.location.long}
                    lat={data.location.lat}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 md:flex-nowrap flex-wrap">
              <Button
                variant="bordered"
                onPress={(e) => changeStep(1)}
                className="md:w-1/3 w-full"
              >
                Back
              </Button>
              <Button
                color="primary"
                isDisabled={data.isDisabledButton[1]}
                onPress={(e) => changeStep(3)}
                className="md:w-1/3 w-full"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
        <div className={`step-3 ${data.step !== 3 ? "hidden" : ""}`}>
          <p className="text-xl md:text-3xl font-bold md:text-start text-center">
            Login information
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Input
                className="max-w-md"
                type="text"
                labelPlacement="outside"
                label="Your name"
                placeholder="What is your name?"
                name="username"
                value={data.form.username}
                maxLength={100}
                onBlur={validateFields}
                onChange={updateFields}
                isInvalid={
                  data.errors.step3.hasOwnProperty("username") &&
                  data.errors.step3.username !== ""
                    ? true
                    : false
                }
                errorMessage={data.errors.step3.username}
              />
            </div>
            <div className="flex gap-4">
              <Input
                className="max-w-md"
                type="email"
                labelPlacement="outside"
                label="Email"
                placeholder="eg. company@email.com"
                value={data.form.email}
                name="email"
                maxLength={100}
                onBlur={validateFields}
                onChange={updateFields}
                isInvalid={
                  data.errors.step3.hasOwnProperty("email") &&
                  data.errors.step3.email !== ""
                    ? true
                    : false
                }
                errorMessage={data.errors.step3.email}
              />
            </div>
            <div className="xx">
              <Input
                type="password"
                className="max-w-md"
                labelPlacement="outside"
                label="Password"
                placeholder="Password"
                description="You will use it to login"
                name="password"
                value={data.form.password}
                maxLength={100}
                onBlur={validateFields}
                onChange={updateFields}
                isInvalid={
                  data.errors.step3.hasOwnProperty("password") &&
                  data.errors.step3.password !== ""
                    ? true
                    : false
                }
                errorMessage={data.errors.step3.password}
              />
            </div>
            <div className="xx">
              <Checkbox classNames="dark:bg-white">
                I agree to terms and conditions
              </Checkbox>
            </div>
            <div className="flex justify-end max-w-md gap-2 md:flex-nowrap flex-wrap">
              <Button
                variant="bordered"
                onPress={(e) => changeStep(2)}
                className="md:w-1/3 w-full"
              >
                Back
              </Button>
              <Button
                color="danger"
                isDisabled={data.isDisabledButton[2]}
                onPress={(e) => changeStep(3)}
                className="md:w-1/3 w-full"
              >
                Sign up now
              </Button>
            </div>
          </div>
        </div> */}
      </form>
    </div>
  );
}
