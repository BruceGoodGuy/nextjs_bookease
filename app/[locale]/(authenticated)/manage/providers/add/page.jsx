"use client";
import { Input, Button } from "@nextui-org/react";
import { PlusCircle } from "react-feather";
import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

export default function Add() {
  const router = useRouter();
  const [providers, addProvider] = useState([{ name: "" }]);
  const [loading, setLoading] = useState(false);
  const addMoreProvider = (e) => {
    if (providers.length === 5) {
      return;
    }
    addProvider([...providers, { name: "" }]);
  };
  const changeName = (e, index) => {
    const value = e.target.value;
    let providerClone = providers;
    if (!providerClone[index]) {
      return;
    }
    providerClone[index].name = value.trim();
    addProvider(providerClone);
  };

  const saveProviders = async () => {
    const providerData = providers.filter((provider) => provider.name !== "");
    if (providerData.length === 0) {
      toast.error("Require at least 1 provider");
      return;
    }
    setLoading(true);
    const url = process.env.NEXT_PUBLIC_APP_API + "/private/providers";
    let data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(providerData),
    });

    if (data.status !== 200) {
      data = await data.json();
      toast.error(data.message ?? "Something went wrong");
      setLoading(false);
      return;
    }

    data = await data.json();
    setLoading(false);
    router.replace('/manage/providers');
    toast.success(data.message);
  };
  return (
    <>
      <div className="h-full lg:2/3 w-full">
        <div className="flex items-center gap-1">
          <h1 className="text-bold text-2xl">Create your providers</h1>
          <span>(Your employees)</span>
        </div>
        <div className="flex mt-3 flex-col justify-start lg:w-1/3 md:w-1/2 w-full">
          {providers.map((provider, index) => (
            <Fragment key={index}>
              <Input
                className={index > 0 ? "mt-3" : ""}
                type="text"
                name={providers[index].name}
                variant={"flat"}
                onChange={(e) => changeName(e, index)}
                label="Provider name"
                isRequired
                isDisabled={loading}
              />
            </Fragment>
          ))}
        </div>
        <div className="flex gap-1">
          <Button
            onPress={addMoreProvider}
            color="primary"
            className="mt-3"
            variant="bordered"
            startContent={<PlusCircle />}
            isDisabled={providers.length === 5 || loading}
          >
            Add another provider
          </Button>
          <Button
            onPress={saveProviders}
            color="success"
            className="mt-3"
            variant="bordered"
            startContent={<PlusCircle />}
            isLoading={loading}
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
}
