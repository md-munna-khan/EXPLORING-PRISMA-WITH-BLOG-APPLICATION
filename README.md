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
![alt text](image-2.png)
// Bookmark your location in the result set - in this
// case, the ID of the last post in the list of 4.

- we will hit in postman 

```
{{url}}/post?page=1&limit=3
```
- lets make it work 
