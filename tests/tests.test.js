const listHelper = require("../utils/list_helper");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

const blogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "favourite is this",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 10,
  },
];

describe("Api tests", () => {
  test("blogs are returned as json", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    console.log(response.body);
  });

  test("returns correct amount of blogs", async () => {
    // Retrieve blogs from MongoDB database using Mongoose
    const blogsInDB = await Blog.find({});

    // Retrieve blogs from API endpoint
    const response = await api
      .get("/api/blogs/")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Compare the length of the blogs returned by the API against the length of the blogs in the database
    expect(response.body.length).toBe(blogsInDB.length);
  });

  test("blog posts have the unique identifier property named 'id'", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body[0].id).toBeDefined();
  });

  test("a new blog post is created successfully", async () => {
    const initialBlogs = await api.get("/api/blogs");
    const newBlog = {
      title: "New Blog Post",
      author: "John Doe",
      url: "https://example.com/new-blog",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const updatedBlogs = await api.get("/api/blogs");
    expect(updatedBlogs.body).toHaveLength(initialBlogs.body.length + 1);

    const titles = updatedBlogs.body.map((blog) => blog.title);
    expect(titles).toContain("New Blog Post");
  });

  test("likes default to 0 if missing from request", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "John Doe",
      url: "https://testblog.com",
    };

    const response = await api.post("/api/blogs").send(newBlog);
    expect(response.status).toBe(201);
    expect(response.body.likes).toBe(0);
  });

  test("returns 400 Bad Request if title is missing", async () => {
    const newBlog = {
      author: "John Doe",
      url: "https://testblog.com",
      likes: 5,
    };

    const response = await api.post("/api/blogs").send(newBlog);
    expect(response.status).toBe(400);
  });

  test("returns 400 Bad Request if url is missing", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "John Doe",
      likes: 5,
    };

    const response = await api.post("/api/blogs").send(newBlog);
    expect(response.status).toBe(400);
  });
  test("delete a blog post", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "John Doe",
      url: "https://testblog.com",
      likes: 5,
    };
    const initialBlogs = await api.get("/api/blogs");
    const response = await api.post("/api/blogs").send(newBlog);
    const blogId = response.body.id;

    await api.delete(`/api/blogs/${blogId}`).expect(204);
    const blogs = await Blog.find({});
    expect(blogs).toHaveLength(initialBlogs.body.length);
  });

  test("update a blog post", async () => {
    const initialBlogs = await api.get("/api/blogs");
    const blogToUpdate = initialBlogs.body[0];
    const updatedBlogData = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.likes).toBe(blogToUpdate.likes + 1);
  });
});

test("dummy returns one", () => {
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });
});

describe("total likes", () => {
  const listWithtwoBlogs = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422aa71b54a446234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 10,
      __v: 0,
    },
  ];

  const listWithEmpty = [];

  test("of empty is zero", () => {
    const result = listHelper.totalLikes(listWithEmpty);
    expect(result).toBe(0);
  });

  test("when list has 2 blogs, adds the likes of those", () => {
    const result = listHelper.totalLikes(listWithtwoBlogs);
    expect(result).toBe(15);
  });
});

describe("favorite blog", () => {
  test("of empty list is null", () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBe(null);
  });

  test("of a single blog is the blog itself", () => {
    const result = listHelper.favoriteBlog([blogs[0]]);
    expect(result).toEqual(blogs[0]);
  });

  test("of many blogs is the blog with the most likes", () => {
    const result = listHelper.favoriteBlog(blogs);
    console.log(result);
    expect(result).toEqual(blogs[2]);
  });
});

describe("most blogs", () => {
  test("of empty is null", () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBe(null);
  });

  test("of a single blog is the author of the blog itself", () => {
    const result = listHelper.mostBlogs([blogs[0]]);
    expect(result).toEqual({ author: "Michael Chan", blogs: 1 });
  });

  test("of many blogs is the author with the most blogs", () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({ author: "Edsger W. Dijkstra", blogs: 2 });
  });
});

describe("most likes", () => {
  test("of empty is null", () => {
    const result = listHelper.mostLikes([]);
    expect(result).toBe(null);
  });

  test("of a single blog is the author of the blog itself", () => {
    const result = listHelper.mostLikes([blogs[0]]);
    expect(result).toEqual({ author: "Michael Chan", likes: 7 });
  });

  test("of many blogs is the author with the most likes", () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({ author: "Edsger W. Dijkstra", likes: 15 });
  });

  test("of many blogs with multiple top authors returns one of them", () => {
    const blogsWithTie = [
      {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
      },
      {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
      },
      {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 10,
      },
    ];
    const result = listHelper.mostLikes(blogsWithTie);
    expect(result).toEqual({ author: "Edsger W. Dijkstra", likes: 15 });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
