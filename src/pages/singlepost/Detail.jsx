import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';
import parse from 'html-react-parser';
import draftToHtml from 'draftjs-to-html';

import {
  doc, getDoc, updateDoc, getDocs, collection, query, where,
  orderBy, limit, serverTimestamp, Timestamp
} from 'firebase/firestore';
import { db } from '../../firebase';

import Spinner from '../../components/Spinner';
import Like from '../../components/singlepost/Like';
import Tags from '../../components/tags/Tags';
import CommentBox from '../../components/singlepost/CommentBox';
import Comments from '../../components/singlepost/Comments';
import MostPopular from '../../components/mostpopular/MostPopular';
import RelatedPosts from '../../components/relatedposts/RelatedPosts';
import { sendNotification } from '../../utils/sendNotification';



const Detail = ({ user, setActive }) => {
  const { id } = useParams();
  const userId = user?.uid;

  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blogRef = doc(db, "blogs", id);
        const snap = await getDoc(blogRef);
        if (snap.exists()) {
          const data = snap.data();
          setBlog(data);
          setComments(data.comments || []);
          setLikes(data.likes || []);
          setActive(null);
          await fetchRelatedBlogs(data.tags || []);
        } else {
          toast.error("Blog not found");
        }
      } catch (err) {
        toast.error("Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    };

    const fetchRecent = async () => {
      const q = query(collection(db, "blogs"), orderBy("timestamp", "desc"), limit(5));
      const snap = await getDocs(q);
      setRecentBlogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchTagsList = async () => {
      const snap = await getDocs(collection(db, "blogs"));
      const allTags = snap.docs.flatMap(doc => doc.data().tags || []);
      setTagsList([...new Set(allTags)]);
    };

    if (id) {
      loadBlog();
      fetchRecent();
      fetchTagsList();
    }
  }, [id]);

  const fetchRelatedBlogs = async (tags = []) => {
    if (tags.length === 0) return;
    const q = query(collection(db, "blogs"), where("tags", "array-contains-any", tags), limit(5));
    const snap = await getDocs(q);
    const related = snap.docs
      .filter(doc => doc.id !== id)
      .map(doc => ({ id: doc.id, ...doc.data() }));
    setRelatedBlogs(related);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!userId || !userComment.trim()) return;

    const newComment = {
      userId,
      name: user.displayName,
      body: userComment.trim(),
      createdAt: Timestamp.now(),
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setUserComment("");

    await updateDoc(doc(db, "blogs", id), {
      ...blog,
      comments: updatedComments,
      timestamp: serverTimestamp(),
    });

    // ✅ Send notification to post author if not self-comment
    if (blog.userId !== userId) {
      await sendNotification({
        toUserId: blog.userId,
        fromUserId: userId,
        fromUserName: user.displayName,
        postId: id,
        type: "comment",
        message: `${user.displayName} commented on your post "${blog.title}"`,
      });
    }

    toast.success("Comment added");
  };




  const handleLike = async () => {
    if (!userId) return toast.error("Login to like this post");

    const hasLiked = likes.includes(userId);
    const updatedLikes = hasLiked
      ? likes.filter(uid => uid !== userId)
      : [...likes, userId];

    setLikes(updatedLikes);

    await updateDoc(doc(db, "blogs", id), {
      ...blog,
      likes: updatedLikes,
      timestamp: serverTimestamp(),
    });

    // ✅ Send notification only if it's a new like
    if (!hasLiked && blog.userId !== userId) {
      await sendNotification({
        toUserId: blog.userId,
        fromUserId: userId,
        fromUserName: user.displayName,
        postId: id,
        type: "like",
        message: `${user.displayName} liked your post "${blog.title}"`,
      });
    }
  };


  if (loading || !blog) return <Spinner />;

  const formattedDate = blog.timestamp?.toDate().toDateString();
  const parsedContent = blog.description
    ? parse(draftToHtml(typeof blog.description === "string"
        ? JSON.parse(blog.description)
        : blog.description))
    : "No content available.";

  return (
    <div className="single mt-4">
      <div className="blog-title-box" style={{ backgroundImage: `url('${blog.imgUrl}')` }}>
        <div className="overlay" />
        <div className="blog-title text-light">
          <span>{formattedDate}</span>
          <h2>{blog.title}</h2>
          <h5>{blog.category}</h5>
        </div>
      </div>

      <div className="container-fluid pb-4 pt-4 blog-single-content">
        <div className="container">
          <div className="row mx-0">
            <div className="col-md-8">
              <div className="meta-info mb-2">
                <p>
                  <strong>By:</strong> {blog.author} | {formattedDate}
                </p>
              </div>

              <Like handleLike={handleLike} likes={likes} userId={userId} />

              <div className="mt-3">{parsedContent}</div>

              {/* Audio Preview */}
              {blog.audioUrl && (
                <div className="mt-4">
                  <h6>Audio</h6>
                  <audio controls src={blog.audioUrl} className="w-100" />
                </div>
              )}

              {/* Video Preview */}
              {blog.videoUrl && (
                <div className="mt-4">
                  <h6>Video</h6>
                  {blog.videoUrl.includes("youtube.com") ? (
                    <iframe
                      width="100%"
                      height="400"
                      src={`https://www.youtube.com/embed/${blog.videoUrl.split("v=")[1]}`}
                      frameBorder="0"
                      allowFullScreen
                    />
                  ) : (
                    <video controls src={blog.videoUrl} className="w-100" />
                  )}
                </div>
              )}

              <div className="mt-4 text-start">
                <strong>Tags:</strong> <Tags tags={blog.tags} />
              </div>

              <div className="custombox mt-5">
                <h4 className="small-title">{comments.length} Comment(s)</h4>
                <div className="scroll">
                  {isEmpty(comments) ? (
                    <Comments msg="No comments yet. Be the first to comment." />
                  ) : (
                    comments.map((c, i) => <Comments key={i} {...c} />)
                  )}
                </div>
              </div>

              <CommentBox
                userId={userId}
                userComment={userComment}
                setUserComment={setUserComment}
                handleComment={handleComment}
              />
            </div>

            <div className="col-md-3 offset-md-1">
              <div className="blog-heading text-start py-1 mb-4">Tags</div>
              <Tags tags={tagsList} />
              <MostPopular title="Recent Posts" blogs={recentBlogs} />
            </div>
          </div>

          <div className="col-md-12 mt-5">
            <RelatedPosts id={id} blogs={relatedBlogs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
