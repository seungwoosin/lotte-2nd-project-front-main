import React, { useEffect, useState } from "react";
import "@/pages/community/Community.scss";
import { CustomSearch } from "@/components/Search";
import CommunityCard2 from "@/components/community/CommunityCard2";

export default function Community() {
  const [selectOption, setSelectOption] = useState(0);
  const [favorites, setFavorites] = useState({
    notice: false,
    archive: false,
    freeBoard: false,
    anonymousBoard: false,
    menuToday: false,
    production: false,
    management: false,
    sales: false,
  });
  const optionChanger = (e) => {
    setSelectOption(Number(e.target.value));
    console.log(selectOption);
  };

  const toggleFavorite = (key) => {
    setFavorites((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div id="community-container">
      <aside className="community-aside overflow-scroll flex flex-col scrollbar-none">
        <section className="flex justify-center">
          <p className="text-lg"></p>
        </section>
        <section className="flex justify-center w-26">
          <CustomSearch w1="100" w2="30" />
        </section>
        <section className="mb-6">
          <div id="community-container">
            <aside className="community-aside overflow-scroll flex flex-col scrollbar-none">
              {/* 상단 아이콘 섹션 */}
              <div className="flex justify-around items-center  px-6">
                <div className="flex flex-col items-center">
                  <img
                    src="/images/checkbox.png"
                    alt="최신글"
                    className="w-6 h-6 mb-1"
                  />
                  <span className="text-sm">최신글</span>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src="/images/alert-circle.png"
                    alt="필독"
                    className="w-6 h-6 mb-1"
                  />
                  <span className="text-sm">필독</span>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src="/images/account-check.png"
                    alt="내 게시글"
                    className="w-6 h-6 mb-1"
                  />
                  <span className="text-sm">내 게시글</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-[15px] px-6">
                <p className="font-semibold">즐겨찾기</p>
                <img
                  className="w-3 h-2"
                  src="/images/arrow-top.png"
                  alt="toggle"
                />
              </div>
              <div className="flex justify-between items-center px-8 mt-2">
                <p>
                  게시판명 옆의{" "}
                  <img
                    src="/images/star_on.png"
                    alt="star"
                    className="inline-block w-4 h-4 mx-1"
                  />{" "}
                  을 <br />
                  선택해서 추가 해주세요.
                </p>{" "}
              </div>
            </aside>
          </div>
        </section>
        <section className="mb-6">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center">
              <img
                src="/images/document_text.png"
                alt="icon"
                className="w-5 h-5 mr-3"
              />
              <p>전체 게시판</p>
            </div>
            <img className="w-3 h-2" src="/images/arrow-top.png" alt="toggle" />
          </div>

          {/* 게시판 항목들 */}
          {[
            {
              key: "notice",
              label: "공지사항",
              icon: "/images/document_text.png",
            },
            { key: "archive", label: "자료실" },
            { key: "freeBoard", label: "자유게시판" },
            { key: "anonymousBoard", label: "익명 게시판" },
            { key: "menuToday", label: "오늘의 식단" },
          ].map((board) => (
            <div
              key={board.key}
              className="flex items-center justify-between px-8 py-1 group"
            >
              <img
                src="/images/document_text.png"
                alt="common icon"
                className="w-5 h-5 mr-[5px]"
              />
              <p className="flex-grow">{board.label}</p>
              <img
                src={
                  favorites[board.key]
                    ? "/images/star_on.png"
                    : "/images/star_off.png"
                }
                alt="star"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={() => toggleFavorite(board.key)}
              />
            </div>
          ))}
        </section>

        <section className="mb-6">
          <div className="flex justify-between items-center">
            <p>부서별 게시판</p>
            <img className="w-3 h-2" src="/images/arrow-top.png" />
          </div>
          {[
            { key: "production", label: "생산팀" },
            { key: "management", label: "관리팀" },
            { key: "sales", label: "영업팀" },
          ].map((board) => (
            <div
              key={board.key}
              className="flex justify-between items-center px-8 mt-[10px] group"
            >
              <img
                src="/images/document_text.png"
                alt="common icon"
                className="w-5 h-5 mr-[5px]"
              />
              <p className="flex-grow">{board.label}</p>
              <img
                src={
                  favorites[board.key]
                    ? "/images/star_on.png"
                    : "/images/star_off.png"
                }
                alt="star"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={() => toggleFavorite(board.key)}
              />
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex justify-start items-center px-8 mt-[10px] gap-2">
            <img src="/images/trash.png" alt="trash icon" className="w-6 h-6" />
            <p className="text-lg font-semibold">휴지통</p>
          </div>
        </section>

        <section className="mt-auto flex flex-col gap-5">
          <button className="bg-blue text-white h-10 rounded-md flex items-center justify-center px-4 space-x-2">
            <img src="/images/component.png" alt="icon" className="w-6 h-6" />
            <span>새 게시글 작성</span>
          </button>
        </section>

        <section className="mt-[10px] flex flex-col gap-5">
          <button className="bg-blue text-white h-10 rounded-md flex items-center justify-center px-4 space-x-5">
            <img src="/images/Vector.png" alt="icon" className="w-6 h-6" />
            <span>게시판 생성</span>
          </button>
        </section>
      </aside>

      <div className="flex flex-col justify-evenly w-full">
        <div className="flex flex-row justify-evenly w-full">
          <CommunityCard2 />
          <CommunityCard2 />
          <CommunityCard2 />
        </div>

        <div className="flex flex-row justify-evenly w-full">
          <CommunityCard2 />
          <CommunityCard2 />
          <CommunityCard2 />
        </div>
      </div>
    </div>
  );
}
