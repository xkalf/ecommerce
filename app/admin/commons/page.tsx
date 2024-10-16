import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllCommons } from "@/lib/actions/common.actions";
import { APP_NAME } from "@/lib/constants";
import { formatId } from "@/lib/utils";
import { CommonType } from "@/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Admin Commons - ${APP_NAME}`,
};

export default async function AdminCommonsPage({
  searchParams,
}: {
  searchParams: {
    page: string;
    type?: CommonType;
    parentId?: string;
  };
}) {
  const page = Number(searchParams.page) || 1;
  const type = searchParams.type;
  const parentId = searchParams.parentId || null;
  const commons = await getAllCommons({ type, parentId, page });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Commons</h1>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>IMAGE</TableHead>
              <TableHead className="w-[100px]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commons?.data.map((common) => (
              <TableRow key={common.id}>
                <TableCell>{formatId(common.id)}</TableCell>
                <TableCell>{common.name}</TableCell>
                <TableCell>
                  {common.image && (
                    <Image src={common.image} fill alt={common.id} />
                  )}
                </TableCell>
                <TableCell className="w-[100px]">
                  <Button asChild variant="ghost">
                    <Link href={`/admin/commons/${common.id}`}>Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
