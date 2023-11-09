"use client";
import { createContext, useState, useTransition } from "react";
import Toaster from "@/components/Toast";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const SignUp = createContext(null);

const availableFields = {
  step1: ["companyname", "companyurl", "workphone", "fields"],
  step2: ["city", "countrycode", "street"],
  step3: ["username", "email", "password", "tos"],
};

function SignUpContext({ children }) {
  const router = useRouter();
  const [data, setData] = useState({
    step: 1,
    isDisabledButton: false,
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
      tos: true,
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
    setData({ ...data, isDisabledButton: true });
    const url = process.env.NEXT_PUBLIC_APP_API + "/public/validation/company";
    const promise = await fetch(
      url +
        "?" +
        new URLSearchParams({
          companyname: value,
        })
    );

    const response = await promise.json();
    setData({ ...data, isDisabledButton: false });
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
    let body = form;
    body = { ...body, fields: [...body.fields] };
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
        setData({ ...data, isDisabledButton: true });
        fetch(process.env.NEXT_PUBLIC_APP_API + "/public/company", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })
          .then((data) => {
            return data.json();
          })
          .then((response) => {
            if (response.status !== 200) {
              throw new Error(response.message);
            }
            router.push("/signup/complete");
          })
          .catch((e) => {
            console.log("oops!");
            toast.error(e + " ");
          })
          .finally(() => {
            setData({ ...data, isDisabledButton: false });
          });
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
