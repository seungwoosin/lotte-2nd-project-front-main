import React, { useEffect, useState } from "react";
import Sidebar from "@/components/community/CommunitySidebar";
import "@/pages/community/Community.scss";
import CommunityCard2 from "../../components/community/CommunityCard2";
import useUserStore from "../../store/useUserStore";
import axiosInstance from "@/services/axios";

export default function CommunityIndex() {
  const user = useUserStore((state) => state.user);
  const [boards, setBoards] = useState([]); // DB에서 불러올 게시판 데이터를 저장할 상태
  const [boardPosts, setBoardPosts] = useState({});

  // 게시판 데이터 불러오기
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axiosInstance.get("/api/community/boards");
        setBoards(response.data);
      } catch (error) {
        console.error("게시판 데이터 불러오기 실패:", error);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div id="community-container" className="flex">
      {/* Sidebar */}
      <Sidebar currentUser={user} />

      {/* Main Content */}
      <div className="community-main flex-1 p-4">
        <div className="flex flex-col space-y-6">
          {/* 첫 번째 줄의 카드 */}
          <div className="flex flex-row justify-evenly w-full gap-4 mb-6">
            {boards.slice(0, 3).map((board) => (
              <CommunityCard2
                key={board.boardId}
                title={board.boardName}
                content={board.content || "게시판 설명이 없습니다."}
                boardId={board.boardId}
                posts={boardPosts[board.boardId] || []}
              />
            ))}
          </div>

          {/* 두 번째 줄의 카드 */}
          <div className="flex flex-row justify-evenly w-full gap-4">
            {boards.slice(3).map((board) => (
              <CommunityCard2
                key={board.boardId}
                title={board.boardName}
                content={board.description || "게시판 설명이 없습니다."}
                boardId={board.boardId}
                posts={boardPosts[board.boardId] || []}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
