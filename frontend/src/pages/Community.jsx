import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  const load = async () => {
    const res = await api.get('/community/posts');
    setPosts(res.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/community/posts', { content });
    setContent('');
    load();
  };

  const like = async (id) => {
    await api.post(`/community/posts/${id}/like`);
    load();
  };

  const comment = async (id, text) => {
    if (!text) return;
    await api.post(`/community/posts/${id}/comments`, { content: text });
    load();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Community</h2>
      <form onSubmit={create} className="flex gap-2">
        <input className="input flex-1" placeholder="Share something eco-friendly..." value={content} onChange={(e) => setContent(e.target.value)} />
        <button className="px-3 py-1 rounded bg-blue-600 text-white">Post</button>
      </form>
      <div className="grid grid-cols-1 gap-3">
        {posts.map((p) => (
          <div key={p._id} className="p-3 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{p.user?.name || 'User'}</div>
              <button onClick={() => like(p._id)} className="px-2 py-1 rounded bg-rose-600 text-white">❤ {p.likes?.length || 0}</button>
            </div>
            <div className="mt-2">{p.content}</div>
            <div className="mt-2 space-y-1">
              {(p.comments || []).map((c, i) => (
                <div key={i} className="text-sm text-gray-600 dark:text-gray-300">• {c.content}</div>
              ))}
              <CommentBox onSubmit={(text) => comment(p._id, text)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentBox({ onSubmit }) {
  const [text, setText] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(text); setText(''); }} className="flex gap-2">
      <input className="input flex-1" placeholder="Write a comment..." value={text} onChange={(e) => setText(e.target.value)} />
      <button className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">Reply</button>
    </form>
  );
}
