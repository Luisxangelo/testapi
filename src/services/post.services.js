const { ref, getDownloadURL } = require('firebase/storage');
const postImg = require('../models/postImg.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const appError = require('../utils/app.error');
const storage = require('../utils/firebase');

class PostService {
  async findPost(id) {
    try {
      const post = await Post.findOne({
        where: {
          id,
          status: 'Active',
        },
        attributes: {
          exclude: ['userId', 'status'],
        },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'profileImgUrl', 'description'],
          },
          {
            model: postImg,
          },
        ],
      });

      if (!post) {
        throw new appError(`Post with id: ${id} not found`, 404);
      }
      return post;
    } catch (error) {
      throw new Error(error);
    }
  }

  async downloadImgPost(post) {
    try {
      const imgRefUserProfile = ref(storage, post.user.profileImgUrl);
      const urlProfileUser = await getDownloadURL(imgRefUserProfile);

      post.user.profileImgUrl = urlProfileUser;

      const postImgPromises = post.postImgs.map(async (postImg) => {
        const imgRef = ref(storage, postImg.postImgUrl);
        const url = await getDownloadURL(imgRef);

        postImg.postImgUrl = url;
        return postImg;
      });

      await Promise.all(postImgPromises);
      return post;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = PostService;
