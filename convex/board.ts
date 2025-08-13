import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createBoard = mutation({
  args: { 
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
   const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.insert("boards", {
      orgId: args.orgId,
      title: args.title,
      authorId: identity.subject,
      authorName: identity.name || "Anonymous",
    });

    return board;
  },
});

export const getBoardList = query({
    args: { orgId: v.string() },
    handler: async (ctx, args) => { 
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        return await ctx.db.query("boards").filter(
            (q) => q.eq(q.field("orgId"), args.orgId)
        ).collect();
    }
})

export const editBoard = mutation({
  args: {
    boardId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const boardId = ctx.db.normalizeId("boards", args.boardId);
    if (!boardId) {
      throw new Error("Invalid boardId");
    }
    const board = await ctx.db.patch(boardId, {
      title: args.title,
      authorId: identity.subject,
      authorName: identity.name || "Anonymous",
    });

    return board;
  }
});

