"use server";

import db from "@/db/drizzle";
import { formatError } from "../utils";
import { insertCommonSchema, updateCommonSchema } from "../validator";
import { commons } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";
import { PAGE_SIZE } from "../constants";

// CREATE
export async function createCommon(data: unknown) {
  try {
    const common = insertCommonSchema.parse(data);
    await db.insert(commons).values(common);

    revalidatePath("/admin/commons");

    return {
      success: true,
      message: "Common created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// UPDATE
export async function updateCommon(data: unknown) {
  try {
    const common = updateCommonSchema.parse(data);
    const commonExists = await db.query.commons.findFirst({
      where: eq(commons.id, common.id),
    });
    if (!commonExists) throw new Error("Common not found");
    await db.update(commons).set(common).where(eq(commons.id, common.id));
    revalidatePath("/admin/commons");
    return {
      success: true,
      message: "Common updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// GET
export async function getAllCommons({
  type,
  limit = PAGE_SIZE,
  page,
  parentId,
}: {
  type?: (typeof commons.type.enumValues)[number];
  limit?: number;
  page: number;
  parentId?: string | null;
}) {
  const typeFilter = type ? eq(commons.type, type) : undefined;
  const parentIdFilter = parentId
    ? eq(commons.parentId, parentId)
    : parentId === null
      ? isNull(commons.parentId)
      : undefined;

  const condition = and(typeFilter, parentIdFilter);

  const data = await db
    .select()
    .from(commons)
    .where(condition)
    .offset((page - 1) * limit)
    .limit(limit);

  const dataCount = await db.$count(commons, condition);

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// DELETE
export async function deleteCommon(id: string) {
  try {
    const commonExists = await db.query.commons.findFirst({
      where: eq(commons.id, id),
    });
    if (!commonExists) throw new Error("Common not found");
    await db.delete(commons).where(eq(commons.id, id));
    revalidatePath("/admin/commons");
    return {
      success: true,
      message: "Common deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
