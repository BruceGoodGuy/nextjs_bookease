import { object, string, number, array, boolean } from "yup";

const companySchema = object({
  companyname: string().trim().required().max(200),
  companyurl: string().trim().required().max(200),
  workphone: string()
    .trim()
    .required()
    .matches(/^\d{10}$/, "Phone number is not valid"),
  fields: array()
    .min(1)
    .of(string().trim().required("Fields is required").length(24))
    .ensure(),
  country: string().trim().required().max(200),
  countrycode: string().trim().required().max(10),
  lat: number().min(-100).max(100).required(),
  long: number().min(-200).max(200).required(),
  city: string().trim().required().max(200),
  state: string().trim().max(100).optional(),
  street: string().trim().max(200).required(),
  zip: string().trim().max(100).optional(),
  username: string().trim().max(200).required(),
  email: string().trim().email().required(),
  password: string()
    .trim()
    .required()
    .max(200)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).+$/,
      "Password should include at least one lowercase letter, one uppercase letter, one digit, and one of these special characters: !@#$%^&*."
    ),
  tos: boolean().required().isTrue(),
});

const loginSchema = object({
  password: string().trim().required().max(200),
  email: string().trim().required().email(),
});

const staffSchema = array()
  .min(1)
  .max(5)
  .of(
    object().shape({
      name: string().trim().required("Name is required").max(100),
    })
  );

const deleteStaffSchema = array()
  .min(1)
  .max(5)
  .of(string().required().length(24));

export { companySchema, loginSchema, staffSchema, deleteStaffSchema };
