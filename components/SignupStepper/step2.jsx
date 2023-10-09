import {
  Input,
  Select as NextSelect,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import { useState, useEffect, useContext, Fragment } from "react";
import { SignUp as SignUpContext } from "@/provider/signup";
import MapMaker from "@/components/MapMaker";
import { countries } from "@/config/countries";

// Import the whole library
import * as maptilerClient from "@maptiler/client";

// Or import only the bits you need
import { config } from "@maptiler/client";

export default function Step2({ label }) {
  const {
    data,
    data: { form },
    validationFields,
    setFormData,
    setErrors,
    updateLocation,
  } = useContext(SignUpContext);
  const [state, setState] = useState({
    countries: [],
    loading: true,
    errors: data.errors,
  });
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
  const getCurrentLocation = async () => {
    config.apiKey = process.env.NEXT_PUBLIC_GEO_API_KEY;
    try {
      const result = await maptilerClient.geolocation.info();
      updateLocation({
        country: result.country,
        countrycode: result.country_code,
        lat: result.latitude,
        long: result.longitude,
        city: result.city,
      });
      setState({ ...state, loading: false });
    } catch (e) {
      toast.error("Can't fetch data");
    }
  };

  const updateFormData = (e) => {
    let { name, value } = e.target;
    setFormData({ [name]: value });
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);
  return (
    <Fragment>
      <p className="text-xl md:text-3xl font-bold md:text-start text-center">
        {label}
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <NextSelect
            label="Country"
            className="max-w-md"
            placeholder="Country"
            labelPlacement="outside"
            name="countrycode"
            onChange={updateFormData}
            selectedKeys={[form.countrycode]}
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
            maxLength={100}
            labelPlacement="outside"
            value={form.state}
            label="State (if applicable)"
            placeholder="State"
            onBlur={validateFields}
            onChange={updateFormData}
            isInvalid={
              data.errors.hasOwnProperty("state") && data.errors.state !== ""
                ? true
                : false
            }
            errorMessage={data.errors.state}
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
            value={form.city ?? ""}
            placeholder="City"
            maxLength={100}
            onBlur={validateFields}
            onChange={updateFormData}
            isInvalid={
              data.errors.hasOwnProperty("city") && data.errors.city !== ""
                ? true
                : false
            }
            errorMessage={data.errors.city}
          />
          <Input
            className="max-w-md"
            type="text"
            labelPlacement="outside"
            label="ZIP / Post code"
            placeholder="Zip code"
            name="zip"
            value={form.zip}
            maxLength={100}
            onBlur={validateFields}
            onChange={updateFormData}
            isInvalid={
              data.errors.hasOwnProperty("zip") && data.errors.zip !== ""
                ? true
                : false
            }
            errorMessage={data.errors.zip}
          />
        </div>
        <div className="xx">
          <Input
            type="text"
            labelPlacement="outside"
            label="Street address"
            placeholder="Street"
            name="street"
            value={form.street}
            isRequired
            description="You can change this later"
            maxLength={100}
            onBlur={validateFields}
            onChange={updateFormData}
            isInvalid={
              data.errors.hasOwnProperty("street") && data.errors.street !== ""
                ? true
                : false
            }
            errorMessage={data.errors.street}
          />
        </div>
        <div className="xx">
          {state.loading ? (
            <div className="flex items-center gap-2">
              <span>Loading map...</span>
              <Spinner color="primary" />
            </div>
          ) : (
            <MapMaker lat={form.lat} long={form.long} />
          )}
        </div>
      </div>
    </Fragment>
  );
}
