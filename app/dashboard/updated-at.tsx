import { connection } from "next/server";

export default async function UpdatedAt() {
  await connection();

  return (
    <p>
      {new Date().toLocaleDateString("en-PH", {
        dateStyle: "full",
        timeZone: "Asia/Manila",
      })}
    </p>
  );
}