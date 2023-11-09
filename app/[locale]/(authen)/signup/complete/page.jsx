"use client";
import { Link, Button } from "@nextui-org/react";

export default function SignUpComplete() {
  return (
    <div className="flex flex-wrap md:flex-nowrap justify-between items-center self-center">
      <div className="flex items-center flex-col gap-1">
        <div>
          <h1 className="text-xl font-bold text-center">Congratulation!</h1>
          <span>You just have created successfully your company profile!</span>
        </div>
        <div className="flex flex-col">
          <span>Please log in before continuing to set up your profile</span>
          <Button
            href="/login"
            as={Link}
            color="primary"
            className="mt-3"
            variant="solid"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
