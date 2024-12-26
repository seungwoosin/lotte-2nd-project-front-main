import React from "react";
import { Link } from "react-router-dom";

// TableView 컴포넌트
export const TableView = ({
  paginatedData,
  currentPage,
  itemsPerPage,
  boardId,
  selectedPosts,
  onSelectAll,
  onSelectPost,
  selectAll,
}) => (
  <table className="list-table">
    <thead>
      <tr>
        <th>
          <input
            type="checkbox"
            checked={selectAll}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="checkbox-input"
          />
        </th>
        <th>번호</th>
        <th>제목</th>
        <th>작성자</th>
        <th>작성일</th>
        <th>조회수</th>
      </tr>
    </thead>
    <tbody>
      {paginatedData.map((item, index) => (
        <tr key={item.postId}>
          <td>
            <input
              type="checkbox"
              checked={selectedPosts.includes(item.postId)}
              onChange={(e) => onSelectPost(item.postId, e.target.checked)}
            />
          </td>
          <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
          <td>
            <Link to={`/community/${boardId}/view/${item.postId}`}>
              {item.title}
            </Link>
          </td>
          <td>{item.writer}</td>
          <td>{item.createdAt.split("T")[0]}</td>
          <td>{item.hit}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// GridView 컴포넌트
export const GridView = ({ paginatedData, boardId }) => (
  <div className="grid-view">
    {paginatedData.map((item) => (
      <div key={item.postId} className="grid-item">
        <Link to={`/community/${boardId}/view/${item.postId}`}>
          <h3>{item.title}</h3>
          <p className="writer">{item.writer}</p>
          <p className="date">{item.createdAt.split("T")[0]}</p>
        </Link>
      </div>
    ))}
  </div>
);
