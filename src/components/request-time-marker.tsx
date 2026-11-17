import { connection } from "next/server";

export async function RequestTimeMarker() {
  await connection();
  return null;
}
