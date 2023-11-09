"use client";
import { Input, Button } from "@nextui-org/react";
import useSWR, { preload } from "swr";
import { PlusCircle } from "react-feather";
import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function EditProvider({ params }) {
  const url = process.env.NEXT_PUBLIC_APP_API + "/private/providers";

  const { data, isLoading, mutate } = useSWR(
    url +
      "?" +
      new URLSearchParams({
        id: params.id,
      }),
    fetcher
  );

  const changeName = (e) => {
    mutate({ ...data, result: { ...data?.result, name: e.target.value } });
  };
  return (
    <>
      <div className="h-full lg:2/3 w-full">
        <div className="flex items-center gap-1">
          <h1 className="text-bold text-2xl">Create your providers</h1>
          <span>(Your employees)</span>
        </div>
        <div className="flex mt-3 flex-col justify-start lg:w-1/3 md:w-1/2 w-full">
          <Fragment>
            <Input
              className="mt-3"
              type="text"
              value={data?.result?.name ?? ""}
              variant={"flat"}
              onChange={changeName}
              label="Provider name"
              isRequired
              isDisabled={isLoading}
            />
          </Fragment>
        </div>
        <div className="flex gap-1">
          <Button
            // onPress={saveProviders}
            color="warning"
            className="mt-3"
            variant="bordered"
            startContent={<PlusCircle />}
            isLoading={isLoading}
          >
            Update
          </Button>
        </div>
      </div>
    </>
  );
}
