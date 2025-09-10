// import { router, publicProcedure } from "../trpc"
// import { z } from "zod"

// export const sessionRouter = router({
//   list: publicProcedure.query(async ({ ctx }) => {
//     return ctx.db.session.findMany({
//       orderBy: { createdAt: "desc" },
//     })
//   }),

//   create: publicProcedure
//     .input(z.object({ title: z.string().min(1) }))
//     .mutation(async ({ ctx, input }) => {
//       return ctx.db.session.create({
//         data: { title: input.title },
//       })
//     }),
// })
