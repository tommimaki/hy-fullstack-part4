const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).json({
      error: "Title and URL are required",
    });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
  });

  const result = await blog.save();
  response.status(201).json(result);
});

blogRouter.delete("/:id", async (request, response) => {
  const result = await Blog.findByIdAndDelete(request.params.id);
  if (!result) {
    return response.status(404).json({
      error: "Blog post not found",
    });
  }
  response.status(204).end();
});

blogRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true });
  res.json(updatedBlog.toJSON());
});

module.exports = blogRouter;
