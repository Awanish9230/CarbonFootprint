import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import SkeletonLoader from '../components/SkeletonLoader';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [loading, setLoading] = useState(false);

  const currentUserId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  // Load posts
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/community/posts');
      setPosts(res.data || []);
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Create new post
  const create = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await api.post('/community/posts', { content: content.trim() });
      setContent('');
      load();
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  // Like post
  const like = async (id) => {
    try {
      await api.post(`/community/posts/${id}/like`);
      load();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  // Start editing
  const startEdit = (post) => {
    setEditingPostId(post._id);
    setEditingContent(post.content);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingPostId(null);
    setEditingContent('');
  };

  // Save edited post
  const saveEdit = async (id) => {
    if (!editingContent.trim()) return;
    try {
      await api.put(`/community/posts/${id}`, { content: editingContent.trim() });
      setEditingPostId(null);
      setEditingContent('');
      load();
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  // Delete post
  const removePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/community/posts/${id}`);
      load();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  // Add comment
  const comment = async (id, text) => {
    if (!text.trim()) return;
    try {
      await api.post(`/community/posts/${id}/comments`, { content: text.trim() });
      load();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Community</h2>

      {/* Create Post */}
      <form onSubmit={create} className="flex gap-2">
        <input
          className="input flex-1 border p-2 rounded dark:bg-gray-700 dark:text-white"
          placeholder="Share something eco-friendly..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Post
        </button>
      </form>

      {/* Posts */}
      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500">No posts yet. Be the first!</div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {posts.map((p) => {
            const authorId = typeof p.user === 'object' ? p.user?._id : p.user;
            const isOwner = currentUserId && authorId && authorId === currentUserId;
            const isEditing = editingPostId === p._id;

            return (
              <div
                key={p._id}
                className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                      {(p.user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{p.user?.name || 'User'}</div>
                      <div className="text-xs text-gray-500">
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleString()
                          : ''}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => like(p._id)}
                    className="px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-700"
                  >
                    ❤ {p.likes?.length || 0}
                  </button>
                </div>

                {/* Content */}
                <div className="mt-2">
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        className="w-full p-2 border rounded text-sm dark:bg-gray-700"
                        rows={2}
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end text-xs">
                        <button
                          type="button"
                          onClick={() => saveEdit(p._id)}
                          className="px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-gray-800 dark:text-gray-200 break-words">
                        {p.content}
                      </p>
                      {isOwner && (
                        <div className="flex gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => startEdit(p)}
                            className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removePost(p._id)}
                            className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Comments */}
                <div className="mt-3 space-y-1">
                  {(p.comments || []).map((c, i) => {
                    const commentUserName =
                      typeof c.user === 'object'
                        ? c.user?.name || 'User'
                        : 'User';
                    return (
                      <div
                        key={i}
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        •{' '}
                        <span className="font-semibold">
                          {commentUserName}
                        </span>
                        : {c.content}{' '}
                        {c.createdAt && (
                          <span className="text-xs text-gray-500">
                            · {new Date(c.createdAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  <CommentBox onSubmit={(text) => comment(p._id, text)} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CommentBox({ onSubmit }) {
  const [text, setText] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit(text);
        setText('');
      }}
      className="flex gap-2 mt-1"
    >
      <input
        className="input flex-1 border p-2 rounded dark:bg-gray-700 dark:text-white"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Reply
      </button>
    </form>
  );
}
