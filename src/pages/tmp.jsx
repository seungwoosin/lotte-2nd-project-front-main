import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader2Icon, AlertTriangleIcon } from 'lucide-react';
import useUserStore from '../store/useUserStore';
import axiosInstance from '../services/axios';

function ValidateLinkPage() {
    const { invitationId } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const user = useUserStore((state) => state.user); // 로그인 상태 확인
    const [errorMessage,setErrorMessage] = useState(null);


    useEffect(() => {
        const validateLink = async () => {

            if(!user){
                const redirectPath = encodeURIComponent(`/accept-invitation/${invitationId}`);
                navigate(`/user/login?redirect=${redirectPath}`);
                return;
            }

            try {

                const response = await axiosInstance.get(`/api/invite/validate/${invitationId}`);
                const { status, message, sharedId } = response.data; // sharedId 가져오기

                if (status === 'success') {
                    // 성공 시 이동 (redirectPath 예시로 지정)
                    navigate(`/document/list/${sharedId}`);
                } else {
                    console.log("메세세세지",message);
                    // 실패 메시지를 보여줌
                    setStatus('invalid');
                    setErrorMessage(message);
                }
            } catch (error) {
                console.error('Error validating invitation:', error);
                setStatus('error');
                setErrorMessage("An unexpected error occurred. Please try again.");
            }
        };

        validateLink();
    }, [invitationId, navigate]);

    if (status === 'loading') {
        return (
            <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br  p-4">
                <div className="bg-white shadow-2xl rounded-2xl p-8 text-center w-full max-w-md">
                    <div className="flex items-center justify-left mb-[40px]">
                        <img 
                            src="/images/plantry_logo(purple).png"
                            alt="Plantry Logo" 
                            className="w-[40px] h-auto mr-2"
                        />
                        <h1 className="text-2xl font-bold text-[#333366]">Plantry</h1>
                    </div>

                    <div className="mb-6">
                        <div className="mx-auto w-24 h-24 mb-4 flex items-center justify-center">
                            <Loader2Icon 
                                className="animate-spin text-purple-500" 
                                size={48} 
                                strokeWidth={2} 
                            />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            초대 링크 확인 중
                        </h2>
                        <p className="text-gray-600 text-sm">
                            잠시만 기다려 주세요. 링크의 유효성을 검증하고 있습니다.
                        </p>
                    </div>

                    <div className="w-full bg-purple-100 rounded-full h-2.5">
                        <div className="bg-purple-500 h-2.5 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'invalid') {
        return (
            <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br  p-4">
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse"></div>
                <div className="bg-white shadow-2xl rounded-2xl p-8 text-center w-full max-w-md">
                    <div className="flex items-center justify-left mb-[40px]">
                        <img 
                            src="/images/plantry_logo(purple).png"
                            alt="Plantry Logo" 
                            className="w-[40px] h-auto mr-2"
                        />
                        <h1 className="text-2xl font-bold text-[#333366]">Plantry</h1>
                    </div>
                    
                    <div className="text-red-500 mb-2">
                        <AlertTriangleIcon 
                            className="mx-auto w-[50px] h-[50px] stroke-[1.5]" 
                        />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        
                    </h2>
                    
                    <p className="text-gray-600 text-base w-[380px] leading-relaxed">
                    {errorMessage !== null && (<>{errorMessage}</>)}
                        <br />
                        다시 한 번 확인해 주세요.
                    </p>
                    
                    <div className="mt-[70px]">
                       
                        <button 
                            onClick={() => window.location.href = '/'}
                            className="w-full py-3 bg-[#666bff] text-white rounded-lg hover:bg-[#e5e7eb] hover:text-[#fb0000] transition-colors"
                        >
                            메인 페이지로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default ValidateLinkPage;