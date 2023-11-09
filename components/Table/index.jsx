"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  getKeyValue,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import useSWR, { preload } from "swr";
import { MoreHorizontal } from "react-feather";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CustomTable({ url, columns, actions }) {
  const rowsPerPage = 2;
  const [state, setstate] = useState({
    page: 1,
    records: [],
  });

  const { data, isLoading, mutate } = useSWR(
    url +
      "?" +
      new URLSearchParams({
        page: state.page,
        size: rowsPerPage,
      }),
    fetcher
  );

  preload(
    url +
      "?" +
      new URLSearchParams({
        page: state.page + 1,
        size: rowsPerPage,
      }),
    fetcher
  );

  const router = useRouter();

  const pages = useMemo(() => {
    return data?.total ? Math.ceil(data?.total / rowsPerPage) : 0;
  }, [data?.total, rowsPerPage]);

  const updatePage = (page) => {
    setstate({ ...state, page });
    preload(
      url +
        "?" +
        new URLSearchParams({
          page: state.page + 1,
          size: rowsPerPage,
        }),
      fetcher
    );
  };

  const onAction = (action, id) => {
    switch (action) {
      case "edit":
        router.replace("/manage/providers/edit/" + id);
        break;
      case "delete":
        deleteItem(id);
        break;
    }
  };

  const deleteItem = (id) => {
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([id]),
    })
      .then((d) => d.json())
      .then((d) => {
        mutate({ ...data, total: data?.total - 1 });
        toast.success(d.message);
      });
  };

  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <MoreHorizontal className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {(actions ?? []).map((a) => (
                  <DropdownItem
                    className="capitalize"
                    onPress={(e) => onAction(a, item.id)}
                    key={a}
                  >
                    {a}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <>
      {isLoading ? "loading" : "false"}
      {data?.total ?? 0}
      <Table
        aria-label="Example table with client async pagination"
        bottomContent={
          pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                isDisabled={isLoading ? "loading" : "idle"}
                page={state.page}
                total={pages}
                onChange={(page) => updatePage(page)}
              />
            </div>
          ) : null
        }
        // selectionMode="multiple"
      >
        <TableHeader>
          {(columns ?? []).map((column) => (
            <TableColumn key={column.id}>{column.label}</TableColumn>
          ))}
          <TableColumn key="actions">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={"No rows to display."}
          items={data?.result ?? []}
          loadingContent={<Spinner />}
          loadingState={isLoading ? "loading" : "idle"}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
