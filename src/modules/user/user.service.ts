import { Prisma, User } from "@prisma/client";
import { prisma } from "../../config/db";

const createUser = async (payload: Prisma.UserCreateInput): Promise<User> => {
  const createdUser = await prisma.user.create({
    data: payload,
  });
  return createdUser;
};

// get all users
const getAllFromDB = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      picture: true,
      createdAt: true,
      updatedAt: true,
      role: true,
      status: true,
      posts:true
    },
    orderBy:{
        createdAt:"asc"
    }
  });
  return result;
};


// user by id
const getUserById = async(id:number)=>{
    const result= await prisma.user.findUnique({
        where:{
            id
        },
        select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      picture: true,
      createdAt: true,
      updatedAt: true,
      role: true,
      status: true,
      posts:true
    },
    })
    return result
}


export const UserService = {
  createUser,
  getAllFromDB,
  getUserById
};
