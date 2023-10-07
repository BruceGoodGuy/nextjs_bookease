"use client";
import { Fragment, useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Briefcase, MapPin, LogIn } from "react-feather";
import {
  Input,
  Select as NextSelect,
  SelectItem,
  Button,
  Checkbox,
} from "@nextui-org/react";
import MapMaker from "@/components/MapMaker";
import { countries } from "@/config/countries";

export default function SignUp() {
  const ref = useRef();
  const [data, setData] = useState({
    step: 1,
    countries: [],
    loading: true,
    fields: [],
    isDisabledButton: [true, true, true],
    isCompanyUrlDirty: false,
    location: {
      country: "",
      city: "",
      lat: "",
      long: "",
      code: "",
    },
    form: {
      // step 1
      companyname: "",
      companyurl: "",
      workphone: "",
      fields: new Set([]),
      // step 2
      country: new Set([]),
      city: "",
      lat: "",
      long: "",
      code: new Set([]),
      state: "",
      zip: "",
      // step 3
      username: "",
      password: "",
      email: "",
    },
    errors: {
      step1: {
        companyname: "",
        companyurl: "",
        workphone: "",
        fields: "",
      },
      step2: {
        city: "",
        street: "",
      },
      step3: {
        username: "",
        email: "",
        password: "",
      },
    },
  });

  const getFields = () => {
    const url = process.env.NEXT_PUBLIC_APP_API + "/public/fields";
    return fetch(url);
  };

  const getCurrentLocation = () => {
    const url = process.env.NEXT_PUBLIC_APP_API + "/public/location";
    return fetch(url);
  };

  const retrieveData = async () => {
    const fetchPromise = [getFields(), getCurrentLocation()];
    const dataPromises = await Promise.all(fetchPromise);
    const hasError = dataPromises.some((promise) => promise.status !== 200);
    if (hasError) {
      toast.error("Can't fetch data");
      return;
    }

    const [fields, location] = await Promise.all([
      dataPromises[0].json(),
      dataPromises[1].json(),
    ]);
    setData({
      ...data,
      loading: false,
      location: {
        country: location.data.country,
        city: location.data.city,
        lat: location.data.latitude,
        long: location.data.longitude,
        code: location.data.country_code,
      },
      form: {
        ...data.form,
        country: location.data.country,
        city: location.data.city,
        lat: location.data.latitude,
        long: location.data.longitude,
        code: new Set([location.data.country_code]),
      },
      fields,
    });
  };

  const updateSelect = (e) => {
    console.log(e);
    let { name, value } = e.target;
    value = value.split(",");
    let newData = new Set(value);
    if (value.length === 1 && value[0] === "") {
      newData = new Set([]);
    }
    setData({
      ...data,
      form: { ...data.form, [name]: newData },
    });
  };

  const locateMe = (e) => {
    if ("geolocation" in navigator) {
      // Geolocation is available
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setData({
            ...data,
            location: {
              ...data.location,
              lat: position.coords.latitude,
              long: position.coords.longitude,
            },
          });
          ref.current.locateMe(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        function (error) {
          toast.error("Please grant location permission");
          console.log("Location permission is not granted");
        }
      );
    } else {
      // Geolocation is not available
      toast.error("Can't retrive location");
      console.log("Geolocation is not available in this browser.");
    }
  };

  useEffect(function () {
    retrieveData();
    return;
  }, []);

  const isInvalidStep = (step) => {
    return true;
  };

  const changeStep = (step) => {
    console.log(data.form);
    setData({ ...data, step });
  };

  const validateFields = async (e) => {
    const { step, isDisabledButton } = data;
    let { name, value } = e.target;
    let errors = data.errors[`step${step}`];
    let isInvalid = false;
    value = value.trim();
    if (e.target.required && value === "") {
      isInvalid = true;
      // Use lang string later.
      errors[name] = "Please fill in your " + name;
    }

    switch (name) {
      case "companyname":
        if (data.isCompanyUrlDirty) {
          break;
        }
      case "companyurl":
        if (value === "") {
          errors["companyurl"] = "Please fill in your " + name;
        } else if (await isUniqueCompanyURL(value)) {
          isInvalid = true;
          errors["companyurl"] =
            "Oh Snap! This login name is already taken, please choose another one";
        } else {
          delete errors["companyurl"];
        }
        break;
      case "workphone":
        if (!/^\d{10}$/.test(value)) {
          isInvalid = true;
          errors[name] = "Please insert valid phone number";
        }
        break;
    }
    if (!isInvalid) {
      delete errors[name];
    }

    isDisabledButton[step - 1] = Object.keys(errors).length !== 0;

    setData({
      ...data,
      isDisabledButton,
      errors: { ...data.errors, [`step${step}`]: errors },
    });
  };

  const validateFieldsSelect = (e) => {
    const { step, isDisabledButton } = data;
    const errors = data.errors[`step${step}`];
    const {
      form: { fields },
    } = data;
    if (fields.size === 0) {
      errors.fields =
        "Please choose at least one category. If you don’t find anything that fits, please choose ‘Other’";
    } else {
      delete errors.fields;
    }

    isDisabledButton[step - 1] = Object.keys(errors).length !== 0;
    setData({
      ...data,
      isDisabledButton,
      errors: { ...data.errors, [`step${step}`]: errors },
    });
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

  const updateFields = (e) => {
    let { name, value } = e.target;
    let updateForm = {};
    let isDirty = data.isCompanyUrlDirty;
    if (name === "companyname" && !data.isCompanyUrlDirty) {
      updateForm.companyurl = value.replace(/[^a-zA-Z0-9_-]/g, "");
    }
    if (name === "companyurl") {
      if (!data.isCompanyUrlDirty) {
        isDirty = true;
      }
      value = value.replace(/[^a-zA-Z0-9_-]/g, "");
    }

    updateForm[name] = value;
    setData({
      ...data,
      isCompanyUrlDirty: isDirty,
      form: { ...data.form, ...updateForm },
    });
  };

  return (
    <Fragment>
      <Toaster />
      <div className="flex w-full mx-auto max-w-[1024px] gap-4 md:flex-row flex-col">
        <div className="w-full md:w-2/5">
          <h1 className="md:text-3xl text-xl font-bold">
            Register your company
          </h1>
          <p className="text-sm">
            Your free 14-day trial includes most features and 50 bookings. No
            credit card is needed.
          </p>
          <div className="flex flex-row md:flex-col justify-around md:justify-start">
            <div className="step-1 flex items-center gap-4 mt-5">
              <div
                className={`${
                  data.step === 1 ? "bg-orange-200 dark:bg-violet-700" : ""
                } w-[30px] h-[30px] flex justify-center items-center rounded-full`}
              >
                <Briefcase size={20} />
              </div>
              <span className="hidden md:inline">
                General company information
              </span>
            </div>
            <div className="step-2 flex items-center gap-4 mt-5">
              <div
                className={`w-[30px] h-[30px] flex justify-center items-center rounded-full ${
                  data.step === 2 ? "bg-orange-200 dark:bg-violet-700" : ""
                }`}
              >
                <MapPin size={20} />
              </div>
              <span className="hidden md:inline">Address</span>
            </div>
            <div className="step-3 flex items-center gap-4 mt-5">
              <div
                className={`w-[30px] h-[30px] flex justify-center items-center rounded-full ${
                  data.step === 3 ? "bg-orange-200 dark:bg-violet-700" : ""
                }`}
              >
                <LogIn />
              </div>
              <span className="hidden md:inline">Login information</span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-3/5">
          <form>
            <div className={`step-1 ${data.step !== 1 ? "hidden" : ""}`}>
              <p className="text-xl md:text-3xl font-bold md:text-start text-center">
                General company information
              </p>
              <div className="flex flex-col gap-4">
                <div className="xx">
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
                    value={data.form.companyname}
                    onBlur={validateFields}
                    onChange={updateFields}
                    errorMessage={data.errors.step1.companyname}
                    isInvalid={
                      data.errors.step1.hasOwnProperty("companyname") &&
                      data.errors.step1.companyname !== ""
                        ? true
                        : false
                    }
                  />
                </div>
                <div className="xx">
                  <Input
                    className="max-w-md"
                    type="text"
                    name="companyurl"
                    labelPlacement="outside"
                    label="Company login"
                    isRequired
                    value={data.form.companyurl}
                    onBlur={validateFields}
                    onChange={updateFields}
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">
                          https://bookease.com/
                        </span>
                      </div>
                    }
                    isInvalid={
                      data.errors.step1.hasOwnProperty("companyurl") &&
                      data.errors.step1.companyurl !== ""
                        ? true
                        : false
                    }
                    errorMessage={data.errors.step1.companyurl}
                    placeholder="companyname"
                    description="Part of URL, cannot be changed"
                  />
                </div>
                <div className="xx">
                  <Input
                    className="max-w-md"
                    type="text"
                    labelPlacement="outside"
                    isRequired={true}
                    label="Work phone"
                    name="workphone"
                    value={data.form.workphone}
                    placeholder="Work phone"
                    description="You can change this later"
                    onBlur={validateFields}
                    onChange={updateFields}
                    isInvalid={
                      data.errors.step1.hasOwnProperty("workphone") &&
                      data.errors.step1.workphone !== ""
                        ? true
                        : false
                    }
                    errorMessage={data.errors.step1.workphone}
                  />
                </div>
                <div className="xx">
                  <NextSelect
                    isRequired
                    selectionMode="multiple"
                    label="Please choose your business category"
                    className="max-w-md"
                    labelPlacement="outside"
                    name="fields"
                    selectedKeys={data.form.fields}
                    onOpenChange={validateFieldsSelect}
                    onChange={updateSelect}
                    placeholder="What is your business category?"
                    description="Help us suggest the best features for your needs"
                    isInvalid={
                      data.errors.step1.hasOwnProperty("fields") &&
                      data.errors.step1.fields !== ""
                        ? true
                        : false
                    }
                    errorMessage={data.errors.step1.fields}
                  >
                    {data.fields.map((field) => (
                      <SelectItem key={field.label} value={field.label}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </NextSelect>
                </div>
                <div className="flex justify-end max-w-md">
                  <Button
                    color="primary"
                    isDisabled={data.isDisabledButton[0]}
                    onPress={(e) => changeStep(2)}
                    className="md:w-1/3 w-full"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
            <div className={`step-2 ${data.step !== 2 ? "hidden" : ""}`}>
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
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
