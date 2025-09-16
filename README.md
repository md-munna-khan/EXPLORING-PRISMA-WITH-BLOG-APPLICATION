# EXPLORING-PRISMA-WITH-BLOG-APPLICATION-PART-2
Previous Module Task Solution: https://github.com/Apollo-Level2-Web-Dev/next-blog-server/tree/task



GitHub Link: https://github.com/Apollo-Level2-Web-Dev/next-blog-server/tree/part-2


## 50-1 Prisma Pagination Explained
- Prisma Client supports both offset pagination and cursor-based pagination.

#### Offset pagination
-  Offset pagination uses skip and take to skip a certain number of results and select a limited range. The following query skips the first 3 Post records and returns records 4 - 7:

```ts
const results = await prisma.post.findMany({
  skip: 3,
  take: 4,
})
```

![alt text](image-1.png)

#### Cursor Based Pagination 

- Cursor-based pagination uses cursor and take to return a limited set of results before or after a given cursor. A cursor bookmarks your location in a result set and must be a unique, sequential column - such as an ID or a timestamp.

The following example returns the first 4 Post records that contain the word "Prisma" and saves the ID of the last record as myCursor:

```ts 
const firstQueryResults = await prisma.post.findMany({
  take: 4,
  where: {
    title: {
      contains: 'Prisma' /* Optional filter */,
    },
  },
  orderBy: {
    id: 'asc',
  },
})
```
![alt text](image-2.png)
// Bookmark your location in the result set - in this
// case, the ID of the last post in the list of 4.

- we will hit in postman 

```sql
{{url}}/post?page=1&limit=3
```
- lets make it work 

## 50-2 Pagination & Searching



- pagination logic 
![alt text](image-3.png)


- post.controller.ts 

```ts
const getAllPosts = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await PostService.getAllPosts({page,limit});
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch posts", details: err });
    }
};
```

- post.service.ts 

```ts 
const getAllPosts = async ({ page, limit }: { page: number, limit: number }) => {
    console.log(page, limit)
    const skip = (page - 1) * limit
    const result = await prisma.post.findMany({
        skip,
        take: limit
    });
    return result;
};
```
#### now lets figure out the searching 

- postman hit 

```
{{url}}/post?page=1&limit=3&search=Deploying
```
- post.controller.ts 

```ts 
const getAllPosts = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = (req.query.search as string) || ""

        const result = await PostService.getAllPosts({page,limit, search});
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch posts", details: err });
    }
};

```
- post.service.ts 

```ts 
const getAllPosts = async ({ page, limit, search }: { page: number, limit: number, search :string }) => {
    console.log(page, limit)
    const skip = (page - 1) * limit
    const result = await prisma.post.findMany({
        skip,
        take: limit,
        where  :{
            OR : [
                {
                    title : {
                        contains : search,
                        mode: 'insensitive'
                    }
                },
                {
                    content : {
                        contains : search,
                        mode: 'insensitive'
                    }
                }
            ]
        }
    });
    return result;
};
```