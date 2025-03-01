
const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const blogLikes = blogs.map(blog => blog.likes)
    const mostliked = blogLikes.indexOf(Math.max(...blogLikes))
   
    return {
        title: blogs[mostliked].title,
        author: blogs[mostliked].author,
        likes: blogs[mostliked].likes
    }
}

const mostBlogs = (blogs) => {
    const authorAndblogCount = blogs.reduce((accumulator, blog) => {
        const author = blog.author;
        if (!accumulator[author]) {
            accumulator[author] = 0;
        }
        accumulator[author] += 1;
        return accumulator;
    }, {});

    const blogCount = Object.values(authorAndblogCount)
    const blogAuthors = Object.keys(authorAndblogCount)
    const position = blogCount.indexOf(Math.max(...blogCount))

    return {
        author: blogAuthors[position],
        blogs: blogCount[position]
    }
}

const mostLikes = (blogs) => {
    const authorAndLikeCount = blogs.reduce((accumulator, blog) => {
        const author = blog.author;
        if (!accumulator[author]) {
            accumulator[author] = 0;
        }
        accumulator[author] += blog.likes;
        return accumulator;
    }, {});

    const LikeCount = Object.values(authorAndLikeCount)
    const blogAuthors = Object.keys(authorAndLikeCount)
    const position = LikeCount.indexOf(Math.max(...LikeCount))

    return {
        author: blogAuthors[position],
        likes: LikeCount[position]
    }
}

module.exports = {
    dummy, 
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }