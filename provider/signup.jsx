"use client";
import { createContext, useState } from "react";
import Toaster from "@/components/Toast";

export const SignUp = createContext(null);

const availableFields = {
  step1: ["companyname", "companyurl", "workphone", "fields"],
  step2: ["city", "countrycode", "street"],
  step3: ["username", "email", "password", "tos"],
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
      country: "United States",
      countrycode: "US",
      lat: "36.147247",
      long: "-115.156029",
      city: "Las Vegas",
      state: "",
      street: "",
      zip: "",
      username: "",
      email: "",
      password: "",
      tos: "",
    },
    errors: {},
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

  const updateLocation = (location) => {
    setData({
      ...data,
      form: { ...data.form, ...location },
    });
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
      if (data.step < 3) {
        setData({ ...data, step: step + 1 });
      } else {
        fetch(process.env.NEXT_PUBLIC_APP_API + "/public/company", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(data.form)
        }).then(data => data.json() ).then(response => {
          console.log(response);
        })
      }
    }
  };

  const validationFields = async (name, dataInput) => {
    let value = dataInput;
    const fields = availableFields[`step${data.step}`];
    if (!fields.includes(name)) {
      return {};
    }
    if (typeof dataInput === "string") {
      value = dataInput.trim();
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
      case "email":
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
          return {
            email: "Oops, please check if you entered correct email address",
          };
        }
        break;
      case "password":
        // Check for at least one lowercase letter
        const lowercaseRegex = /[a-z]/;

        // Check for at least one uppercase letter
        const uppercaseRegex = /[A-Z]/;

        // Check for at least one special character
        const specialCharRegex = /[!@#$%^&*]/;

        // Check for at least one number
        const numberRegex = /[0-9]/;
        if (
          !lowercaseRegex.test(value) ||
          !uppercaseRegex.test(value) ||
          !specialCharRegex.test(value) ||
          !numberRegex.test(value)
        ) {
          return {
            password:
              "Password should include at least one lowercase letter, one uppercase letter, one digit, and one of these special characters: !@#$%^&*.",
          };
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
        updateLocation,
      }}
    >
      <Toaster />
      {children}
    </SignUp.Provider>
  );
}

export default SignUpContext;
