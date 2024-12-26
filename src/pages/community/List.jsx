import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "@/pages/community/Community.scss";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import { TableView, GridView } from "@/components/community/CommunityView";
import useUserStore from "../../store/useUserStore";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../services/axios";

function CommunityList() {
  const location = useLocation();
  const { boardId, postId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("list");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [boardName, setBoardName] = useState(
    location.state?.boardName || "게시판"
  );
  const currentUser = useUserStore((state) => state.user);

  const itemsPerPage = 5;
  const navigate = useNavigate();

  // 전체 선택 핸들러
  const handleSelectAll = (checked) => {
    if (checked) {
      const allPostIds = paginatedData.map((post) => post.postId);
      setSelectedPosts(allPostIds);
    } else {
      setSelectedPosts([]);
    }
    setSelectAll(checked);
  };

  // 개별 체크박스 핸들러
  const handleSelectPost = (postId, checked) => {
    setSelectedPosts((prev) => {
      const updatedSelection = checked
        ? [...prev, postId] // 선택된 항목 추가
        : prev.filter((id) => id !== postId); // 선택 해제

      setSelectAll(updatedSelection.length === paginatedData.length); // 전체 선택 여부 업데이트
      return updatedSelection;
    });
  };
  useEffect(() => {
    if (!location.state?.boardName) {
      const fetchBoardName = async () => {
        try {
          const response = await axiosInstance.get(
            `/api/community/boards/${boardId}`
          );
          setBoardName(response.data.boardName || "알 수 없음");
        } catch (error) {
          console.error("게시판 이름 가져오기 실패:", error);
          setBoardName("알 수 없음");
        }
      };

      fetchBoardName();
    } else {
      setBoardName(location.state.boardName);
    }
  }, [location.state?.boardName, boardId]);

  // 검색 필드 옵션
  const searchOptions = [
    { value: "title", label: "제목" },
    { value: "content", label: "내용" },
    { value: "writer", label: "작성자" },
  ];

  // 글 목록을 가져오는 함수
  const fetchPosts = async () => {
    const response = await axiosInstance.get(
      `/api/community/posts?boardId=${boardId}`
    );
    console.log("Fetched Posts:", response.data); // 데이터 확인

    return response.data;
  };

  // React Query로 데이터 가져오기
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["posts", boardId],
    queryFn: fetchPosts,
    enabled: !!boardId,
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (isError) return <div>에러 발생: {error.message}</div>;
  if (!data) return <div>데이터가 없습니다.</div>;

  // 검색 필터링 로직 수정
  const filteredData = data.filter((item) => {
    // 검색어가 비어있으면 모든 데이터 표시
    if (!searchQuery.trim()) return true;

    const searchLower = searchQuery.toLowerCase().trim();

    switch (searchField) {
      case "title":
        return item.title?.toLowerCase().includes(searchLower);
      case "content":
        return item.content?.toLowerCase().includes(searchLower);
      case "writer":
        return (
          item.writer?.toLowerCase().includes(searchLower) ||
          item.writerName?.toLowerCase().includes(searchLower)
        );
      default:
        return false;
    }
  });
  // 페이지네이션 데이터 계산
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleBoardChange = () => {
    setCurrentPage(1);
    setSearchQuery("");
    setSearchField("title"); // 필드 초기화
  };

  return (
    <div id="community-container">
      <CommunitySidebar
        currentUser={currentUser}
        boardId={boardId}
        onBoardChange={handleBoardChange}
      />

      <div className="list-container">
        <div className="list-container2">
          <h2>{boardName}</h2>

          <div className="list-header">
            <div className="search-wrapper">
              {/* 검색 필드 선택 드롭다운 */}
              <div className="search-select">
                <div
                  className="select-display"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span>
                    {
                      searchOptions.find((opt) => opt.value === searchField)
                        ?.label
                    }
                  </span>
                  <span className={`arrow ${isOpen ? "open" : ""}`}>▼</span>
                </div>

                {isOpen && (
                  <div className="select-list">
                    {searchOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`select-item ${
                          searchField === option.value ? "active" : ""
                        }`}
                        onClick={() => {
                          setSearchField(option.value);
                          setIsOpen(false);
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 검색 입력창 */}
              <input
                type="text"
                placeholder="검색어를 입력하세요!"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="view-toggle">
              <span>View:</span>
              <button
                className={`view-button ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                ☰
              </button>
              <button
                className={`view-button ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                ▦
              </button>
            </div>
          </div>

          {/* 테이블/그리드 보기 */}
          {viewMode === "list" ? (
            <TableView
              paginatedData={paginatedData}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              boardId={boardId}
              selectedPosts={selectedPosts}
              onSelectAll={handleSelectAll}
              onSelectPost={handleSelectPost}
              selectAll={selectAll}
            />
          ) : (
            <GridView paginatedData={paginatedData} boardId={boardId} />
          )}

          {/* 페이지네이션 및 삭제/글쓰기 */}
          <div className="list-footer">
            <button
              onClick={async () => {
                if (window.confirm("게시글을 삭제하시겠습니까?")) {
                  try {
                    await axiosInstance.delete(
                      `/api/community/posts/${boardId}/view/${postId}`
                    );
                    alert("게시글이 삭제되었습니다!");
                    navigate(`/community/${boardId}/list`);
                  } catch (error) {
                    console.error("게시글 삭제 실패:", error);
                    alert("게시글 삭제를 실패했습니다.");
                  }
                }
              }}
              className="delete-button"
            >
              삭제
            </button>
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
            <button
              className="create-button"
              onClick={() => navigate(`/community/${boardId}/write`)}
            >
              <img
                src="/images/component.png"
                alt="새 게시글"
                className="button-icon"
              />
              글쓰기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityList;
