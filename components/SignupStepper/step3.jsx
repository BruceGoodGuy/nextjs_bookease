import { Input, Checkbox, Button } from "@nextui-org/react";
import { useContext, useState } from "react";
import { SignUp as SignUpContext } from "@/provider/signup";

export default function Step3({ label }) {
  const [state, setState] = useState({
    errors: {},
    form: { username: "", email: "", password: "", tos: "" },
  });
  const {
    data,
    data: { form },
    validationFields,
    setFormData,
    setErrors,
    updateLocation,
  } = useContext(SignUpContext);
  const validateFields = async (e) => {
    let { errors } = data;
    const { name, value } = e.target;
    let error = await validationFields(name, value);
    errors = { ...errors, ...error };

    if (!error[name]) {
      delete errors[name];
    }
    setErrors(errors);
  };

  const updateFields = (e) => {
    let { name, value, checked } = e.target;
    if (name === "tos") {
      value = checked ? true : "";
    }
    setState({ ...state, form: { ...state.form, [name]: value } });
    setFormData({ [name]: value });
  };
  return (
    <>
      <p className="text-xl md:text-3xl font-bold md:text-start text-center">
        {label}
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
            value={state.form.username}
            maxLength={100}
            onBlur={validateFields}
            onChange={updateFields}
            isInvalid={
              data.errors.hasOwnProperty("username") &&
              data.errors.username !== ""
                ? true
                : false
            }
            errorMessage={data.errors.username}
          />
        </div>
        <div className="flex gap-4">
          <Input
            className="max-w-md"
            type="email"
            labelPlacement="outside"
            label="Email"
            placeholder="eg. company@email.com"
            value={state.form.email}
            name="email"
            maxLength={100}
            onBlur={validateFields}
            onChange={updateFields}
            isInvalid={
              data.errors.hasOwnProperty("email") && data.errors.email !== ""
                ? true
                : false
            }
            errorMessage={data.errors.email}
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
            value={state.form.password}
            maxLength={100}
            onBlur={validateFields}
            onChange={updateFields}
            isInvalid={
              data.errors.hasOwnProperty("password") &&
              data.errors.password !== ""
                ? true
                : false
            }
            errorMessage={data.errors.password}
          />
        </div>
        <div className="xx">
          <Checkbox
            color={"danger"}
            name="tos"
            onChange={updateFields}
            value={state.form.tos}
            isRequired
            classNames="dark:bg-white"
          >
            <div className={data.errors.hasOwnProperty("tos") && data.errors.tos !== "" ? "text-danger" : ""}>
              I agree to terms and conditions
            </div>
          </Checkbox>
        </div>
      </div>
    </>
  );
}
