import { Request, Response } from "express";
import { postService } from "./post.service";


const createPost  = async(req:Request,res:Response)=>{
    try {
        const result = await postService.createPost (req.body)
res.status(201).json(result)
    } catch (error) {
       res.status(500).send(error)
    }
}
const   getAllPosts = async(req:Request,res:Response)=>{
    try {
        const page= Number(req.query.page) || 1;
        const limit= Number(req.query.limit)|| 10;
        const search= (req.query.search as string )|| ""; 
     const isFeatured= req.query.isFeatured?req.query.isFeatured ==="true":undefined;
const tags = req.query.tags?(req.query.tags as string).split(","):[]
const sortBy = (req.query.sortBy as string)|| "createdAt";
const sortOrder = (req.query.sortOrder as string)|| "desc"

        const result = await postService.getAllPosts ({page,limit,search,isFeatured,tags,sortBy,sortOrder})
res.status(201).json(result)
    } catch (error) {
       res.status(500).send(error)
    }
}

//id
const  getPostsById  = async(req:Request,res:Response)=>{
    try {
        const result = await postService.getPostsById  (Number(req.params.id))
res.status(201).json(result)
    } catch (error) {
       res.status(500).send(error)
    }
}
//deleted
const   postDeleted  = async(req:Request,res:Response)=>{
    try {
        const result = await postService. postDeleted  (Number(req.params.id))
res.status(201).json(result)
    } catch (error) {
       res.status(500).send(error)
    }
}
//deleted
const   postUpdated = async(req:Request,res:Response)=>{
    try {
        const result = await postService. postUpdated  (Number(req.params.id),req.body)
res.status(201).json(result)
    } catch (error) {
       res.status(500).send(error)
    }
}



export const postController={
    createPost ,
    getAllPosts,
    getPostsById,
    postDeleted,
    postUpdated
   
}