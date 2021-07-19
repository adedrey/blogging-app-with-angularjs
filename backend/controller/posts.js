const Post = require('../models/posts.model');
exports.getPost = (req, res, next) => {

  const postQuery = Post.find();
  const postSizeOptions = +req.query.postSizeOptions;
  const currentPage = +req.query.currentPage;
  if (postSizeOptions && currentPage) {
    postQuery.skip((currentPage - 1) * postSizeOptions)
      .limit(postSizeOptions);
  }
  postQuery
    .then(posts => {
      return Post.countDocuments()
        .then(totalPosts => {
          res.status(200).json({
            message: 'Posts fetched successfully',
            posts: posts,
            totalPosts: totalPosts
          })
        })
        .catch(err => {
          res.status(500).json({
            message: err
          })
        })
    })
    .catch(err => {
      res.status(500).json({
        message: err
      })
    })

}
exports.postPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: url + '/images/' + req.file.filename,
    userId: req.userData.userId
  });
  return post.save()
    .then(postData => {
      res.status(201).json({
        message: 'Post was shared successfully',
        post: postData
      })
    })
    .catch(err => {
      res.status(500).json({
        message: err
      })
    })
}
exports.updatePost = (req, res, next) => {
// console.log(req.file)
// console.log(req.userData.userId)
let image = req.body.image
if (req.file) {
  const url = req.protocol + '://' + req.get("host");
  image = url + '/images/' + req.file.filename;
}

const title = req.body.title;
const content = req.body.content;
const id = req.body._id;
Post.findOne({
    _id: id,
    userId: req.userData.userId
  })
  .then(post => {
    if (!post) {
      return res.status(401).json({
        message: 'User not Authorized'
      })
    }
    post.title = title;
    post.content = content;
    post.image = image;
    post.save()
      .then(updatedPost => {
        // console.log(updatedPost)
        return res.status(200).json({
          message: "Post updated",
          post : post
        })
      })
      .catch(err => {
        // console.log(err);
        res.status(500).json({
          message: 'Unable to save'
        })
      })

  })
  .catch(err => {
    // console.log(err);
    res.status(500).json({
      message: 'Unable to update'
    })
  })
}

exports.getPostById = (req, res, next) => {
  Post.findOne({
      _id: req.params.id
    })
    .then(post => {
      if (!post) {
        return res.status(404).json({
          message: 'Unable to find user',
          post: null
        })
      }
      res.status(200).json({
        message: 'Post found',
        post: post
      })
    })
    .catch(err => {
      res.status(500).json({
        message: err
      })
    })
}
exports.deletePost = (req, res, next) => {
  const id = req.params.id;
  Post.findOneAndDelete({
      _id: id,
      userId: req.userData.userId
    })
    .then(result => {
      // console.log(result)
      if (!result) {
        return res.status(401).json({
          message: 'Unauthorized Access'
        })

      }
      res.status(200).json({
        message: 'Post Deleted'

      })
    })
    .catch(err => {
      res.status(500).json({
        message: err
      })
    })


}
