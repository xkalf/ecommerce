import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Create product - ${APP_NAME}`,
};

export default async function UpdateCommonPage() {
  return (
    <>
      <h1 className="h2-bold">Create Common</h1>

      <div className="my-8"></div>
    </>
  );
}
