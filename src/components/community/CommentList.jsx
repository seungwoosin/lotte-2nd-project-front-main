import React from "react";
import CommunityComment from "./CommunityComment";

const CommentList = ({
  comments,
  postId,
  user,
  handleCommentLike,
  handleCommentDelete,
  handleCommentEdit,
  handleReplySubmit,
  getInitial,
  formatDate,
  newReply,
  setNewReply,
  replyingTo,
  setReplyingTo,
}) => {
  return (
    <div className="comment-list">
      {comments.length === 0 ? (
        <p className="no-comments">첫 번째 댓글을 작성해보세요!</p>
      ) : (
        comments.map((comment) => (
          <CommunityComment
            key={comment.commentId}
            comment={comment}
            postId={postId}
            user={user}
            handleCommentLike={handleCommentLike}
            handleCommentDelete={handleCommentDelete}
            handleCommentEdit={handleCommentEdit} // 추가
            handleReplySubmit={handleReplySubmit}
            getInitial={getInitial}
            formatDate={formatDate}
            newReply={newReply}
            setNewReply={setNewReply}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
          />
        ))
      )}
    </div>
  );
};

export default CommentList;
