const listHelper = require("../utils/list_helper");

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
