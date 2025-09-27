const express = require('express');
const Joi = require('joi');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const CommunityPost = require('../models/CommunityPost');

const router = express.Router();

const postSchema = Joi.object({ content: Joi.string().min(1).required() });
const commentSchema = Joi.object({ content: Joi.string().min(1).required() });

router.get('/posts', async (req, res) => {
  const posts = await CommunityPost.find().populate('user', 'name').sort({ createdAt: -1 }).limit(100);
  res.json(posts);
});

router.post('/posts', auth, validate(postSchema), async (req, res) => {
  const post = await CommunityPost.create({ user: req.user.id, content: req.body.content });
  res.json(post);
});

router.post('/posts/:id/like', auth, async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  const idx = post.likes.findIndex((u) => String(u) === req.user.id);
  if (idx >= 0) post.likes.splice(idx, 1);
  else post.likes.push(req.user.id);
  await post.save();
  res.json(post);
});

router.post('/posts/:id/comments', auth, validate(commentSchema), async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  post.comments.push({ user: req.user.id, content: req.body.content });
  await post.save();
  res.json(post);
});

module.exports = router;
