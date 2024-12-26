import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  X, 
  FolderPlus, 
  UserPlus, 
  Trash2, 
  Share2, 
  Lock, 
  ChevronDown 
} from "lucide-react";
import axiosInstance from '@/services/axios.jsx';
import GetAddressModal from "../calendar/GetAddressModal";
import useUserStore from "../../store/useUserStore";

const PERMISSIONS = {
  READING: "읽기",
  WRITING: "수정",
  FULL: "모든"
};

export default function NewDrive({ order, isOpen, onClose, user }) {
  const [authType, setAuthType] = useState("0");
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    description: "",
    order: order,
    sharedUsers: [],
    isShared: 0,
    status: 1,
    linkSharing: "0",
    permissions: 7,
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [openAddress, setOpenAddress] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setAuthType(value);
    setFormData({ ...formData, isShared: value });
  };

  const handleAddEmail = () => {
    if (currentEmail.trim() && !formData.sharedUsers.some((u) => u.email === currentEmail)) {
      setFormData((prev) => ({
        ...prev,
        sharedUsers: [...prev.sharedUsers, { email: currentEmail }],
      }));
      setCurrentEmail("");
    }
  };

  useEffect(() => {
    // selectedUsers를 SharedUser 형식으로 변환
    const sharedUsers = selectedUsers.map((u) => ({
      id: u.id || null,
      name: u.name || "",
      email: u.email || "",
      group: u.group || "",
      uid: u.uid || "",
      authority: u.authority || "",
      permission: PERMISSIONS.READING, // 기본값: 읽기
      profile: u.profile || "",
    }));
  
    setFormData((prev) => ({
      ...prev,
      sharedUsers: sharedUsers,
    }));
  }, [selectedUsers]);

  useEffect(()=>{
    console.log("selectedUserS!!!",selectedUsers);
  },[selectedUsers])

  const handleRemoveUser = (email) => {
    setFormData((prev) => ({
      ...prev,
      sharedUsers: prev.sharedUsers.filter((u) => u.email !== email),
    }));
  };


  const cancleSelectedUsersHandler = (e, user) => {
    setSelectedUsers((prev) => {
      return prev.filter((selectedUser) => selectedUser.id !== user.id);
    });
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: async (newDriveData) => {
      const response = await axiosInstance.post("/api/drive/newDrive", newDriveData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['driveList', user.uid] });
      onClose();
    },
    onError: (error) => {
      console.error("Error creating drive:", error);
    },
  });

  const handleSubmit = () => {
    console.log("최종 제출 ",formData);
    mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-[600px] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 ease-in-out scale-100 opacity-100">
        {/* Elegant Header */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-5 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <FolderPlus className="text-purple-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">새 드라이브 생성</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 hover:rotate-90 transition-all duration-300 p-2"
          >
            <X size={28} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Name Input with Elegant Design */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FolderPlus size={16} className="text-purple-500" />
              드라이브 이름
            </label>
            <div className="relative">
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="드라이브 이름을 입력해주세요"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Share2 size={16} className="text-indigo-500" />
              설명
            </label>
            <input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="드라이브에 대한 간단한 설명을 추가해주세요"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 transition-all duration-300 text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Sharing Options with Enhanced Design */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lock size={16} className="text-green-500" />
              공유 설정
            </label>
            <div className="flex gap-4 bg-gray-50 p-2 rounded-xl">
              <label className="flex-1 relative">
                <input
                  type="radio"
                  value="0"
                  checked={authType === "0"}
                  onChange={handleRadioChange}
                  className="absolute opacity-0 peer"
                />
                <div className="text-center py-2 rounded-lg cursor-pointer transition-all duration-300 peer-checked:bg-white peer-checked:shadow-md peer-checked:text-purple-600">
                  나만 사용
                </div>
              </label>
              <label className="flex-1 relative">
                <input
                  type="radio"
                  value="1"
                  checked={authType === "1"}
                  onChange={handleRadioChange}
                  className="absolute opacity-0 peer"
                />
                <div className="text-center py-2 rounded-lg cursor-pointer transition-all duration-300 peer-checked:bg-white peer-checked:shadow-md peer-checked:text-purple-600">
                  공유하기
                </div>
              </label>
            </div>
          </div>

          {/* Sharing Content */}
          {authType === "1" && (
            <div className="space-y-4 animate-fade-in">
              {user?.company ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setOpenAddress(true)}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-600 py-3 rounded-xl hover:from-purple-100 hover:to-indigo-100 transition-all duration-300"
                  >
                    <UserPlus size={20} />
                    조직 주소록에서 선택
                  </button>

                  {/* Selected Users List */}
                  {selectedUsers?.length > 0 && (
                    <div className="max-h-[250px] overflow-y-auto space-y-3">
                      {selectedUsers?.map((u, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={u.profile || "/images/admin-profile.png"}
                              alt="User Profile"
                              className="w-12 h-12 rounded-full object-cover border-2 border-purple-100"
                            />
                            <div>
                              <p className="font-semibold text-gray-800">{u.name || u.email}</p>
                              <p className="text-sm text-gray-500">{u.email}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleRemoveUser(u.email)}
                            className="text-red-500 hover:text-red-700 hover:scale-110 transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="email"
                        placeholder="공유할 이메일 주소 입력"
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 transition-all duration-300 pr-10"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <UserPlus size={20} className="text-gray-400" />
                      </div>
                    </div>
                    <button
                      onClick={handleAddEmail}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
                    >
                      추가
                    </button>
                  </div>

                  {formData.sharedUsers?.length > 0 && (
                    <div className="space-y-3 max-h-[200px] overflow-y-auto">
                      {formData.sharedUsers?.map((u, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-purple-100 p-2 rounded-full">
                              <UserPlus size={16} className="text-purple-600" />
                            </div>
                            <span className="text-gray-700 font-medium">{u.email}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveUser(u.email)}
                            className="text-red-500 hover:text-red-700 hover:scale-110 transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="bg-gray-50 px-8 py-6 flex justify-end gap-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-300"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">◌</span>
                생성 중...
              </>
            ) : (
              '드라이브 만들기'
            )}
          </button>
        </div>

        
      </div>
              {/* Address Modal */}

      <GetAddressModal
          isOpen={openAddress}
          onClose={() => setOpenAddress(false)}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          cancleSelectedUsersHandler={cancleSelectedUsersHandler}
        />
    </div>
  );
}