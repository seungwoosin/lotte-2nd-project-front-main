import React from "react";
import { useNavigate } from "react-router-dom";
import "@/pages/community/Community.scss";

export default function CommunityCard2({ title, content, boardId }) {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Navigating to boardId:", boardId); // 디버깅용 로그 추가

    navigate(`/community/${boardId}/list`, { state: { boardName: title } });
  };

  return (
    <div
      className="communityCard2 flex flex-col justify-between items-start p-4 w-[400px] h-[350px] border bg-white shadow-md rounded-lg cursor-pointer"
      onClick={handleClick}
    >
      {/* 카드 헤더 */}
      <div className="title_link flex flex-row justify-between w-full">
        <span className="title text-lg font-bold">{title}</span>
        <img
          src="/images/notice_Icon.png"
          alt="link"
          className="linkImg w-7 h-7"
        />
      </div>
      {/* 카드 내용 */}
      <div className="communityCard2Content mt-4">
        <span className="text-gray-600 text-sm">{content}</span>
      </div>
    </div>
  );
}
