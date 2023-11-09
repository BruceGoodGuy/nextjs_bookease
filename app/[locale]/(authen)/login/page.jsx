"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Input,
  Image,
  Button,
} from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { Google } from "@/components/Icon/Google";
import { Facebook } from "react-feather";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [data, setData] = useState({
    errors: {},
    form: { email: "", password: "" },
    isDisabled: false,
  });
  const updateFormData = (e) => {
    let { name, value } = e.target;
    setData({ ...data, form: { ...data.form, [name]: value.trim() } });
  };

  const submitForm = async (e) => {
    setData({ ...data, isDisabled: true });
    try {
      const res = await signIn("credentials", {
        email: data.form.email,
        password: data.form.password,
        redirect: false,
      });

      if (!res.ok) {
        let error = JSON.parse(res.error);
        setData({ ...data, errors: error.error, isDisabled: false });
        return;
      }

      setData({ ...data, isDisabled: false });

      console.log(res);

      router.replace("manage");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-wrap md:flex-nowrap justify-between items-center self-center w-full md:w-2/3 lg:w-1/3">
      <div className="w-full mw-[1280px]">
        <Card>
          <CardHeader>
            <div className="text-center w-full">
              <span>Bookease</span>
            </div>
          </CardHeader>
          <CardBody>
            <form>
              <div className="flex flex-col gap-3">
                <Input
                  className="w-full"
                  type="email"
                  labelPlacement="outside"
                  placeholder="Email"
                  maxLength={100}
                  label="Email"
                  name="email"
                  value={data.form.email}
                  isDisabled={data.isDisabled}
                  onChange={updateFormData}
                  errorMessage={data.errors.email}
                  isInvalid={data.errors.hasOwnProperty("email") ? true : false}
                />
                <Input
                  className="w-full"
                  type="password"
                  labelPlacement="outside"
                  placeholder="Password"
                  maxLength={100}
                  label="Password"
                  isDisabled={data.isDisabled}
                  name="password"
                  value={data.form.password}
                  onChange={updateFormData}
                  errorMessage={data.errors.password}
                  isInvalid={
                    data.errors.hasOwnProperty("password") ? true : false
                  }
                />
              </div>
            </form>
          </CardBody>
          <CardFooter className="pt-0">
            <div className="flex w-full flex-col">
              <div className="flex flex-col md:flex-row justify-between w-full px-2 mb-3">
                <div className="justify-end md:justify-start flex items-center">
                  <Link href="">Forget password</Link>
                </div>
                <Button
                  isDisabled={data.isDisabled}
                  isLoading={data.isDisabled}
                  color="primary"
                  onPress={submitForm}
                  className="md:w-1/3 w-full"
                >
                  Continue
                </Button>
              </div>
              <div className="flex w-full flex-col">
                <Divider />
                <div className="mt-3">
                  <p className="text-center">Or sign in via</p>
                  <div className="flex gap-2 mt-2 justify-center">
                    <Button
                      isIconOnly
                      color="danger"
                      variant="faded"
                      aria-label="Take a photo"
                      className="p-2"
                    >
                      <Google />
                    </Button>
                    <Button
                      isIconOnly
                      color="primary"
                      variant="faded"
                      aria-label="Take a photo"
                      className="p-2"
                    >
                      <Facebook />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
