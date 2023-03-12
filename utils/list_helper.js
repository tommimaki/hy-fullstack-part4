const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let likes = 0;
  blogs.forEach((blog) => {
    likes += blog.likes;
  });
  return likes;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  return blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max;
  });
};

const mostBlogs = (blogs) => {
  const authorCounts = {};
  if (blogs.length === 0) {
    return null;
  }

  blogs.forEach((blog) => {
    const author = blog.author;
    authorCounts[author] = (authorCounts[author] || 0) + 1;
  });

  let topAuthor = "";
  let topCount = 0;

  Object.keys(authorCounts).forEach((author) => {
    if (authorCounts[author] > topCount) {
      topAuthor = author;
      topCount = authorCounts[author];
    }
  });

  return {
    author: topAuthor,
    blogs: topCount,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const likesByAuthor = {};
  blogs.forEach((blog) => {
    if (likesByAuthor[blog.author]) {
      likesByAuthor[blog.author] += blog.likes;
    } else {
      likesByAuthor[blog.author] = blog.likes;
    }
  });

  let mostLikes = 0;
  let mostLikedAuthor = "";
  Object.entries(likesByAuthor).forEach(([author, likes]) => {
    if (likes > mostLikes) {
      mostLikes = likes;
      mostLikedAuthor = author;
    }
  });

  return {
    author: mostLikedAuthor,
    likes: mostLikes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
