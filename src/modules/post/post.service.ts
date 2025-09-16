import { Post, Prisma } from "@prisma/client";
import { prisma } from "../../config/db";

const createPost = async (payload: Prisma.PostCreateInput): Promise<Post> => {
  const createdPost = await prisma.post.create({
    data: payload,
    include:{
        author:{
            select:{
                id:true,
                name:true,
                email:true
            }
        }
    }
  });
  return createdPost 
};

const getAllPosts= async ({
    page,
    limit
}:{
    page:number,
    limit:number
})=>{

    console.log({page,limit})
const result = await prisma.post.findMany({})
return result
};
const getPostsById = async (id:number)=>{
const result = await prisma.post.findUnique({
    where:{
        id
    }
})
return result
};
// delete
const postDeleted = async (id:number)=>{
const result = await prisma.post.delete({
    where:{
        id
    }
})
return result
};
const postUpdated = async (id:number,data:Partial<any>)=>{
const result = await prisma.post.update({
    where:{id}, data
})
return result
};


export const postService = {
  createPost ,
  getAllPosts,
  getPostsById,
   postDeleted ,
   postUpdated

};
