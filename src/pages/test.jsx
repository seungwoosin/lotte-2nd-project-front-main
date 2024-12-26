import React, { useEffect, useState } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';

export default function TestIndex() {
  const [showAllCards, setShowAllCards] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [cards, setCards] = useState([
    '캘린더',
    '게시판',
    '자료실',
    '커뮤니티',
    '프로젝트',
    '채팅',
  ]); // 카드 데이터

  useEffect(() => {
    Aos.init({
      duration: 1000, // 애니메이션 지속 시간 간소화
      easing: 'ease-in-out', // 부드러운 애니메이션 효과
      once: true, // 한 번만 실행
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (window.scrollY > 100) {
        header.classList.add('hidden');
      } else {
        header.classList.remove('hidden');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // 새로고침 시 페이지 최상단으로 이동
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  const handleShowMore = () => {
    setShowAllCards(!showAllCards); // 더보기/숨기기 버튼 토글
  };

  const handleMenuClick = (index) => {
    if (activeMenu === index) {
      setActiveMenu(null);
      setCards(['캘린더', '게시판', '자료실', '커뮤니티', '프로젝트', '채팅']);
      setShowAllCards(false);
    } else {
      setActiveMenu(index);
      const selectedCard = cards[index];
      const reorderedCards = [
        selectedCard,
        ...cards.filter((_, i) => i !== index),
      ];
      setCards(reorderedCards);
    }
  };

  return (
    <div id="landing" className="font-sans bg-gradient-to-r from-[#f3f7ff] via-[#f3f7ff] to-[#f3f7ff] text-gray-800 overflow-x-hidden">
      {/* Main Content */}
      <main className="mt-32 px-4">
        {/* Top Section */}
        <section className="text-center py-20 bg-white shadow-lg rounded-md" data-aos="fade-up">
          <h2 className="text-5xl font-extrabold text-[#333366] hover:text-[#b3b8ff] transition-colors duration-300 transform hover:scale-110">
            아이디어의 씨앗을 심고, <span className="text-[#b3b8ff]">
              <li>성장과 수확을 경험하세요.</li></span>
          </h2>
          <p className="mt-6 text-gray-600 text-xl">
            <em>업무플랫폼</em> <em className="text-[#b3b8ff]">Plantry</em>
          </p>
          <div className="mt-10" data-aos="fade-up" data-aos-delay="400">
            <img
              src="/images/plantry_logo(purple).png"
              alt="Plantry 로고"
              className="w-32 mx-auto rounded-full hover:rotate-6 transition-transform duration-700 hover:scale-125"
            />
            <h3 className="mt-8 text-gray-700 font-semibold text-lg">
              PLANTY INFORMATION & ONLINE NETWORK
            </h3>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-24 bg-[#f3f7ff] relative z-0 feature-section" data-aos="fade-up" data-aos-delay="200">
          <div className="text-center">
            <img
              src="/images/rending_background.png"
              alt="배너이미지"
              className="w-full max-w-4xl mx-auto rounded-3xl shadow-2xl mb-12"
              style={{ position: 'relative', zIndex: -1 }}
            />
            <h2 className="text-4xl font-extrabold hover:text-[#4b52ff] transition-colors duration-300 transform hover:scale-110 cursor-pointer">
              Plantry 하나면 <br className="block sm:hidden" /> 충분해요!
            </h2>
          </div>

          {/* 메뉴 버튼 */}
          <div className="flex justify-center flex-wrap gap-8 mt-12">
            {['캘린더', '게시판', '자료실', '커뮤니티', '프로젝트', '채팅'].map((menu, index) => (
              <button
                key={index}
                className={`px-6 py-4 rounded-full border-2 transition-transform duration-300 ${
                  activeMenu === index
                    ? 'bg-[#b3b8ff] text-white border-[#b3b8ff]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-[#b3b8ff] hover:text-white'
                } hover:scale-110 transform hover:-translate-y-2 hover:shadow-xl`}
                onClick={() => handleMenuClick(index)}
              >
                {menu}
              </button>
            ))}
          </div>

          {/* 카드 목록 */}
          <div className="flex flex-wrap justify-center gap-8 px-4 mt-16 card-list">
  {cards.slice(0, 4).map((title, index) => (
    <div
      key={index}
      className={`bg-white shadow-lg rounded-xl p-6 transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl border-t-8 border-[#b3b8ff] hover:bg-[#f9f9ff] hover:border-b-8 hover:border-[#c9d2ff] card-item`}
      data-aos={index % 2 === 0 ? 'fade-left' : 'fade-right'}
      data-aos-delay={300 + index * 100}
    >
      <h3 className="text-xl font-bold text-[#333366] mb-4 hover:text-[#b3b8ff] transition-colors duration-300 text-center">
        {title}
      </h3>
      <p className="text-lg text-gray-700 mb-4 text-center">
        {title}에 대한 설명입니다.
      </p>
      <Link
        to={`/${title.toLowerCase()}`}
        className="text-[#b3b8ff] underline text-lg font-semibold hover:text-[#4b52ff] transition-colors duration-300 block text-center"
      >
        자세히 보기
      </Link>
    </div>
  ))}
</div>

          <div className="flex justify-center mt-16">
            <button
              className="px-8 py-4 bg-[#b3b8ff] text-white rounded-full shadow-lg hover:bg-[#a3a9ff] transition-transform duration-300 transform hover:-translate-y-3 hover:shadow-2xl hover:scale-110"
              onClick={handleShowMore}
            >
              {showAllCards ? '접기' : '더보기'}
            </button>
          </div>
        </section>

        {/* Summary Section */}
        <section className="py-28 bg-gradient-to-b from-[#f3f7ff] to-[#f9f9ff]" data-aos="fade-up" data-aos-delay="600">
          <h2 className="text-5xl font-extrabold text-center mb-14 text-[#333366]">
            Plantry 가 더 특별한 이유
          </h2>
          <p className="text-center text-gray-700 max-w-4xl mx-auto mb-20 text-xl">
            Plantry 는 자체 개발 기능, 무상업그레이드 정책, 타 서비스와의 폭 넓은 체류로 차별성을 더합니다.
          </p>
          <div className="mt-14 flex justify-center flex-wrap gap-14">
            <div
              className="bg-white shadow-lg rounded-2xl p-10 w-96 transition-transform duration-300 transform hover:scale-110 hover:shadow-2xl hover:bg-[#d1d5ff] hover:border-b-8 hover:border-[#c9d2ff] hover:rotate-1 hover:skew-y-2"
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <h3 className="text-2xl font-extrabold text-[#b3b8ff] mb-8 text-center">
                자주 묻는 질문
              </h3>
              <ul className="text-md text-gray-700 list-disc space-y-4">
                <li>그룹웨어 설정은 어떻게 하나요?</li>
                <li>공유 캘린더는 어떻게 사용할 수 있나요?</li>
                <li>팀 프로젝트 관리 기능이 있나요?</li>
              </ul>
            </div>
            <div
              className="bg-white shadow-lg rounded-2xl p-10 w-96 transition-transform duration-300 transform hover:scale-110 hover:shadow-2xl hover:bg-[#d1d5ff] hover:border-b-8 hover:border-[#c9d2ff] hover:rotate-1 hover:skew-y-2"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <h3 className="text-2xl font-extrabold text-[#b3b8ff] mb-8 text-center">
                최근 소식
              </h3>
              <ul className="text-md text-gray-700 list-disc space-y-4">
                <li>새로운 업그레이드 기능 발표</li>
                <li>고객 사례 연구 발표</li>
                <li>서비스 안정성 강화</li>
              </ul>
            </div>
            <div
              className="bg-white shadow-lg rounded-2xl p-10 w-96 transition-transform duration-300 transform hover:scale-110 hover:shadow-2xl hover:bg-[#d1d5ff] hover:border-b-8 hover:border-[#c9d2ff] hover:rotate-1 hover:skew-y-2"
              data-aos="fade-left"
              data-aos-delay="500"
            >
              <h3 className="text-2xl font-extrabold text-[#b3b8ff] mb-8 text-center">
                안정성
              </h3>
              <ul className="text-md text-gray-700 list-disc space-y-4">
                <li>24/7 보안 모니터링</li>
                <li>업무 데이터를 안전하게 보호</li>
                <li>신뢰성 높은 클라우드 환경</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
