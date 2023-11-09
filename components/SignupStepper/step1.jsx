import { Input, Select as NextSelect, SelectItem } from "@nextui-org/react";
import toast from "react-hot-toast";
import { useState, useEffect, useTransition, useContext } from "react";
import { SignUp as SignUpContext } from "@/provider/signup";

export default function Step1({ label }) {
  const { setFormData, validationFields, data, setErrors } =
    useContext(SignUpContext);
  const [isPending, startTransition] = useTransition();
  const [stepData, setDataStep] = useState({
    form: {
      companyname: data.form.companyname,
      companyurl: data.form.companyurl,
      workphone: data.form.workphone,
      fields: data.form.fields,
    },
    errors: data.errors,
    isDirtyFields: false,
    fields: [],
  });

  const getFields = async () => {
    const url = process.env.NEXT_PUBLIC_APP_API + "/public/fields";
    try {
      const fieldsData = await fetch(url);
      const fields = await fieldsData.json();
      setDataStep({ ...stepData, fields });
    } catch (e) {
      toast.error("Can't fetch data");
    }
  };

  const updateFormData = (e) => {
    let { name, value } = e.target;
    let { isDirtyFields } = stepData;
    if (!e.target.tagName) {
      value = value.split(",");
      let newData = new Set(value);
      if (value.length === 1 && value[0] === "") {
        newData = new Set([]);
      }
      value = newData;
    }
    let step1Data = { [name]: value };
    if (name === "companyname" && !isDirtyFields) {
      step1Data = {
        ...step1Data,
        companyurl: value.replace(/[^a-zA-Z0-9_-]/g, ""),
      };
    }

    if (name === "companyurl") {
      value = value.replace(/[^a-zA-Z0-9_-]/g, "");
      isDirtyFields = true;
      step1Data[name] = value;
    }

    const formData = { ...stepData.form, ...step1Data };

    setDataStep({
      ...stepData,
      isDirtyFields,
      form: formData,
    });
    setFormData(formData);
  };

  const validateFieldsSelect = async (e) => {
    const {
      form: { fields },
    } = stepData;
    let errors = data.errors;
    const error = await validationFields("fields", fields);
    errors = { ...errors, ...error };

    if (!error.fields) {
      delete errors.fields;
    }

    setErrors(errors);
  };

  const validateFields = async (e) => {
    let {
      isDirtyFields,
      form: { companyurl },
    } = stepData;

    let { errors } = data;

    let { name, value } = e.target;
    let error = await validationFields(name, value);
    if (name === "companyname" && !isDirtyFields) {
      const companyUrlError = await validationFields("companyurl", companyurl);
      if (Object.keys(companyUrlError).length === 0) {
        delete errors.companyurl;
      } else {
        error = { ...error, ...companyUrlError };
      }
    }
    errors = { ...errors, ...error };

    if (!error[name]) {
      delete errors[name];
    }
    setErrors(errors);
  };

  useEffect(() => {
    startTransition(() => {
      getFields();
    });
  }, []);
  return (
    <div className={`step-1`}>
      <p className="text-xl md:text-3xl font-bold md:text-start text-center">
        {label}
      </p>
      <div className="flex flex-col gap-4">
        <div className="contains">
          <Input
            className="max-w-md"
            type="text"
            labelPlacement="outside"
            placeholder="Company name"
            isRequired
            maxLength={100}
            description="e.g. company name"
            label="Your Booking Page Title"
            name="companyname"
            value={stepData.form.companyname}
            onBlur={validateFields}
            onChange={updateFormData}
            errorMessage={data.errors.companyname}
            isInvalid={
              data.errors.hasOwnProperty("companyname") &&
              data.errors.companyname !== ""
                ? true
                : false
            }
          />
        </div>
        <div className="contains">
          <Input
            className="max-w-md"
            type="text"
            name="companyurl"
            labelPlacement="outside"
            label="Company login"
            isRequired
            value={stepData.form.companyurl}
            onBlur={validateFields}
            onChange={updateFormData}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">
                  https://bookease.com/
                </span>
              </div>
            }
            isInvalid={
              data.errors.hasOwnProperty("companyurl") &&
              data.errors.companyurl !== ""
                ? true
                : false
            }
            errorMessage={data.errors.companyurl}
            placeholder="companyname"
            description="Part of URL, cannot be changed"
          />
        </div>
        <div className="contains">
          <Input
            className="max-w-md"
            type="text"
            labelPlacement="outside"
            isRequired={true}
            label="Work phone"
            name="workphone"
            value={stepData.form.workphone}
            placeholder="Work phone"
            description="You can change this later"
            onBlur={validateFields}
            onChange={updateFormData}
            isInvalid={
              data.errors.hasOwnProperty("workphone") &&
              data.errors.workphone !== ""
                ? true
                : false
            }
            errorMessage={data.errors.workphone}
          />
        </div>
        <div className="contains">
          <NextSelect
            isRequired
            selectionMode="multiple"
            label="Please choose your business category"
            className="max-w-md"
            labelPlacement="outside"
            isLoading={isPending || stepData.fields.length === 0}
            name="fields"
            selectedKeys={stepData.form.fields}
            onOpenChange={validateFieldsSelect}
            onChange={updateFormData}
            placeholder="What is your business category?"
            description="Help us suggest the best features for your needs"
            isInvalid={
              data.errors.hasOwnProperty("fields") && data.errors.fields !== ""
                ? true
                : false
            }
            errorMessage={data.errors.fields}
          >
            {stepData.fields.map((field) => (
              <SelectItem key={field.id} value={field.label}>
                {field.label}
              </SelectItem>
            ))}
          </NextSelect>
        </div>
      </div>
    </div>
  );
}
