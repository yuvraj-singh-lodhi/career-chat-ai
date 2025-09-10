import { initTRPC } from "@trpc/server";
// Use the correct type for the fetch handler context
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext(opts: FetchCreateContextFnOptions) {
  // You now have access to the Request object from the fetch API
  const { req } = opts;
  // You can still return an empty object if you don't need a database or other context
  return {};
}

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;