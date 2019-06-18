const Post = require("../models/post");

exports.savePost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    text: req.body.text,
    imagePath: url + "/images/" + req.file.filename,
    creatorId: req.userData.userId,
    creatorName: req.userData.userName,
    creatorNickname: req.userData.userNickname,
    date: Date()
  });
  console.log(post);
  post
    .save()
    .then(savedPost => {
      res.status(201).json({
        ...savedPost,
        id: savedPost._id
      });
      console.log("saved post: " + savedPost);
    })
    .catch(err => {
      res.status(500).json({ message: "Error saving post" });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Fetching post failed" });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const postQuery = Post.find().sort({ _id: -1 });
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(posts => {
      fetchedPosts = posts;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Fetching posts failed"
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creatorId: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "deletion successfull" });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
      console.log(result);
    })
    .catch(err => {
      res.status(500).json({ message: "Deleting post failed" });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  //   const post = new Post({
  //     _id: req.params.id,
  //     title: req.body.title,
  //     content: req.body.content,
  //     imagePath: imagePath
  //   });
  Post.updateOne(
    { _id: req.params.id, creatorId: req.userData.userId },
    { $set: { text: req.body.text, imagePath: imagePath } }
  ).then(result => {
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({ message: "update successfull" });
    } else {
      res.status(401).json({ message: "not authorized" });
    }
    console.log(result);
  });
};
