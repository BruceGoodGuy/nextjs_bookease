import CustomTable from "@/components/Table";
export default function Providers() {
  const url = process.env.NEXT_PUBLIC_APP_API + "/private/providers";

  return (
    <>
      <div className="h-full lg:2/3 w-full">
        <div className="flex items-center gap-1">
          <h1 className="text-bold text-2xl">Your providers</h1>
          <span>(Your employees)</span>
        </div>
        <div className="flex lg:w-2/3 mt-3">
          <CustomTable url={url} columns={[{ id: "name", label: "Name" }]} actions={['edit', 'delete']} />
        </div>
      </div>
    </>
  );
}
