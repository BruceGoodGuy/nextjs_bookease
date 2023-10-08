"use client";
import { createContext, useState } from "react";
import Toaster from "@/components/Toast";
import { rule } from "postcss";

export const SignUp = createContext(null);

const availableFields = {
  step1: ["companyname", "companyurl", "workphone", "fields"],
};

function SignUpContext({ children }) {
  const [data, setData] = useState({
    step: 1,
    isDisabledButton: true,
    form: {
      companyname: "",
      companyurl: "",
      workphone: "",
      fields: new Set([]),
    },
    errors: {
      conheo: "dasda",
    },
  });

  const setErrors = (errors) => {
    let currentErrors = data.errors;
    if (Object.keys(currentErrors).length === 0) {
      currentErrors = errors;
    } else {
      const fields = availableFields[`step${data.step}`];
      for (let field of fields) {
        if (errors[field] === undefined) {
          delete currentErrors[field];
        } else {
          currentErrors[field] = errors[field];
        }
      }
    }
    setData({ ...data, errors: currentErrors });
  };

  const setFormData = (form) => {
    setData({ ...data, form: { ...data.form, ...form } });
  };

  const isUniqueCompanyURL = async (value) => {
    const url = process.env.NEXT_PUBLIC_APP_API + "/public/validation/company";
    const promise = await fetch(
      url +
        "?" +
        new URLSearchParams({
          companyname: value,
        })
    );

    const response = await promise.json();
    return await response.data;
  };

  const submitNextStep = async () => {
    const { step, form } = data;
    const fields = availableFields[`step${step}`];
    let errors = {};
    for (let field of fields) {
      const value = form[field] ?? "";
      const error = await validationFields(field, value);
      errors = { ...errors, ...error };
    }
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
        setData({...data, step: 2});
    }
  };

  const validationFields = async (name, data) => {
    let value = data;
    if (typeof data === "string") {
      value = data.trim();
      if (value === "") {
        return { [name]: "Please fill in your " + name };
      }
    } else {
      if (value.size === 0) {
        return {
          [name]:
            "Please choose at least one category. If you don’t find anything that fits, please choose ‘Other’",
        };
      }
    }
    switch (name) {
      case "companyurl":
        const isUnique = await isUniqueCompanyURL(value);
        if (!isUnique) {
          return {
            companyurl:
              "Oh Snap! This login name is already taken, please choose another one",
          };
        }
        break;
      case "workphone":
        if (!/^\d{10}$/.test(value)) {
          return { workphone: "Please insert valid phone number" };
        }
        break;
      default:
        return {};
    }
    return {};
  };

  return (
    <SignUp.Provider
      value={{
        data,
        setData,
        setFormData,
        validationFields,
        submitNextStep,
        setErrors,
      }}
    >
      <Toaster />
      {children}
    </SignUp.Provider>
  );
}

export default SignUpContext;
