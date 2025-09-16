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
    page=1,
    limit =10,
    search,
    isFeatured,
    tags
}:{
    page?:number,
    limit?:number,
    search?:string,
    isFeatured?:boolean,
    tags?:string[]
})=>{

const skip = (page-1) * limit
console.log({tags})
const where:any={
    AND:[
        search && {
            OR:[
        {
            title:{
                contains:search,
                mode:"insensitive"
            }
        },
           {
            content:{
                contains:search,
                mode:"insensitive"
            }
        }
    ]
        },
        typeof isFeatured==="boolean" && {isFeatured},
        tags && tags.length > 0 && {tags:{hasEvery:tags}}
    ].filter(Boolean)
}
const result = await prisma.post.findMany({
skip,
take:limit,
where
})
return result
};

// id
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
