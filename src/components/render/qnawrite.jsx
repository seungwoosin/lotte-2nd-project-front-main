import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 추가
import axios from 'axios';  // axios import 추가

export default function QNAWrite() {
  const [formData, setFormData] = useState({
    category: "",
    priority: "",
    title: "",
    content: "",
    email: "",
    name: "",
    attachments: null,
  });

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'attachments' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.category || !formData.priority || !formData.title || 
        !formData.content || !formData.email || !formData.name) {
      alert("모든 필드를 채워주세요.");
      return;
    }

    // FormData 객체 생성 (파일 업로드를 위해)
    const formDataToSend = new FormData();
    
    // 일반 데이터 추가
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    // 파일이 있다면 추가
    if (formData.attachments) {
      formDataToSend.append('attachments', formData.attachments);
    }

    try {
      const response = await fetch('http://13.124.94.213:90/api/send-qna', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Origin': 'http://localhost:8010'
        },
        mode: 'cors',
        body: formDataToSend  // FormData 사용
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('서버 응답:', data);
      
      // 성공 시 자동 응답 이메일 전송
      try {
        const autoReplyResponse = await fetch('http://13.124.94.213:90/api/send-auto-reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': 'http://localhost:8010'
          },
          mode: 'cors',
          body: JSON.stringify({ email: formData.email })
        });

        if (!autoReplyResponse.ok) {
          console.error('자동 응답 이메일 전송 실패');
        }
      } catch (autoReplyError) {
        console.error('자동 응답 이메일 전송 중 오류:', autoReplyError);
      }

      alert('문의가 성공적으로 전송되었습니다.');
      
      // 폼 초기화
      setFormData({
        category: "",
        priority: "",
        title: "",
        content: "",
        email: "",
        name: "",
        attachments: null
      });

    } catch (error) {
      console.error('문의 전송 실패:', error);
      alert(`문의 전송에 실패했습니다: ${error.message}`);
    }
  };

  const menus = [
    { title: "PAYMENT", icon: "/images/paymentIcon_gray.png", path: "/faq/write/payment" },
    {
      title: "CANCELLATION & RETURN",
      icon: "/images/return.png",
      path: "/faq/write/cancellation",
    },
    { title: "QNA", icon: "/images/CardGiftcard.png", path: "/faq/write/qna" },
    {
      title: "PRODUCT & SERVICES",
      icon: "/images/Settings.png",
      path: "/faq/write/services",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(2);

  const handleMenuClick = (index, path) => {
    setActiveIndex(index);
    navigate(path); // 클릭 시 페이지 이동
  };

  return (
    <>
      {/* 상단 섹션 */}
      <section
        className="relative min-h-[300px] flex justify-center items-center overflow-hidden"
        style={{
          background: "url('/images/rending_background.png') no-repeat center",
          backgroundSize: "cover",
        }}
      >
        <div className="text-center z-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Questions & Answers
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Have a question? We're here to provide the answers you need.
          </p>
        </div>
      </section>

      {/* 사이드바 & 폼 영역 */}
      <section className="flex justify-center my-12">
        <div className="w-full max-w-screen-lg flex flex-wrap lg:flex-nowrap">
          {/* 사이드바 */}
          <aside className="w-full lg:w-1/4 bg-white rounded-lg shadow-lg p-4">
            <ul className="space-y-2">
              {menus.map((menu, index) => (
                <li
                  key={index}
                  className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-[#666bff] text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleMenuClick(index, menu.path)}
                >
                  <span className="text-2xl mr-3">
                    {index === 0 && "💳"} {/* PAYMENT */}
                    {index === 1 && "↩️"} {/* CANCELLATION & RETURN */}
                    {index === 2 && "❓"} {/* QNA */}
                    {index === 3 && "⚙️"} {/* PRODUCT & SERVICES */}
                  </span>
                  <span className="text-base font-medium">{menu.title}</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* 폼 영역 */}
          <article className="w-full lg:w-3/4 bg-white rounded-lg shadow-lg p-8 ml-6">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Questions & Answers Inquiry Form
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Question Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select question category</option>
                  <option value="account">Account Related</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing & Pricing</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="general">General Question</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority Level</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select priority level</option>
                  <option value="low">Low - General Question</option>
                  <option value="medium">Medium - Need Help Soon</option>
                  <option value="high">High - Urgent Issue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Question Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your question title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Question Details</label>
                <textarea
                  name="content"
                  rows="5"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Please describe your question in detail"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Attachments</label>
                <input
                  type="file"
                  name="attachments"
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Supported files: PDF, DOC, DOCX, JPG, PNG (Max size: 5MB)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-[#666bff] text-white font-semibold rounded-lg hover:bg-[#5555ee] transition duration-300"
              >
                Submit Question
              </button>
            </form>
          </article>
        </div>
      </section>
    </>
  );
}
