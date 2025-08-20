import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


const RANDOM_IMAGES = [
 "/placeholders/placeholder2.jpg",
 "/placeholders/placeholder4.jpg",
];

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * RANDOM_IMAGES.length);
  return RANDOM_IMAGES[randomIndex];
};

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
      imageUrl: getRandomImage()
    });

    return board;
  },
});

export const deleteBoard = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(args.id);
    if (!board) {
      throw new Error("Board not found");
    }

    if (board.authorId !== identity.subject) {
      throw new Error("Forbidden");
    }

    await ctx.db.delete(args.id);
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

export const get = query({
  args:{id: v.id("boards")},
  handler:async (ctx,args)=>{
    const board = await ctx.db.get(args.id)
    if(!board){
      throw new Error("Board not found")
    }
    return board
  }
})


