import { router } from "../trpc";
import { messageRouter } from "./message";
import { sessionRouter } from "./session";
import { userRouter } from "./user";

export const appRouter = router({
  message: messageRouter,
  session: sessionRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;