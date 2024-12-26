import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import CustomAlert from "../Alert";

const profileURL = 'http://3.35.170.26:90/profileImg/';
const MyProfile = (data) => {

    if(data){
        return (<>
        <span>로딩 중입니다...</span>
        </>);
    }
    const userData = data?.userData || { profileImgPath: '', profileMessage: '' };
    console.log("마이프로필 내부 "+JSON.stringify(userData))
    console.log("프로필 이미지 "+userData.profileImgPath)
    const [alertClass, setAlertClass] = useState("");
    const [alert, setAlert] = useState({ message: '', type: '', isOpen: false, onClose: false });

    const closeAlert = () => {
        setAlert({ message: '', type: '', isOpen: false, onClose: false });
    };
    useEffect(() => {
        if (alert.isOpen) {
            let timer = setTimeout(() => {
                setAlertClass("fade-out"); // fade-out 클래스 추가
                setTimeout(() => {
                    setAlert({ message: '', type: '', isOpen: false, onClose: false });
                }, 300); // 애니메이션 후 alert 닫기
            }, 500); // 3초 뒤 애니메이션 시작

            return () => clearTimeout(timer); // 타이머 정리
        }
    }, [alert.isOpen]);
    const showAlert = (message, type = 'success') => {
        setAlert({
            message,
            type,
            isOpen: true,
            onClose: false,
        });
        setAlertClass(''); // fade-out 클래스 제거
    };

    const [file, setFile] = useState(null); // 선택한 파일 상태
    const [selectedFileName, setSelectedFileName] = useState(""); //선택한 파일의 이름
      
    // 파일 선택 핸들러
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if(selectedFile){
            setSelectedFileName(selectedFile.name);
            setFile(selectedFile);
        }
    };
    // 프로필 업로드 핸들러
    const profileUploadHandler = async (event) => {
        event.preventDefault();
        if (!file) {
            alert('업로드할 파일을 선택하세요.');
            return;
        }
        console.log("파일 전송 전 "+file);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosInstance.post('/api/my/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true, // 인증 정보 포함
            });
            console.log(response.data);
            if (response.status === 200) {
                setAlert({message: '프로필 이미지가 성공적으로 업로드되었습니다.', isOpen: true, type:'success', onClose: false})
                setSelectedFileName("JPG, GIF 혹은 PNG 등록 가능, 10MB 지원")
                window.location.reload();
            } else {
                setAlert({message: '업로드 중 오류가 발생했습니다.', isOpen: true, type:'error', onClose: false})
            }
        } catch (error) {
            // setUploadStatus('error');
            console.error('업로드 실패:', error);
            setAlert({message: '업로드 중 오류가 발생했습니다. 다시 시도해 주세요.', isOpen: true, type:'error', onClose: false})
        }
    };

    const [message, setMessage] = useState('');

    const handleMessageChange = (e) => {
        setMessage(e.target.value); // 입력값으로 메시지 상태 업데이트
    };
    const updateMessage = async (e) => {
        e.preventDefault();
        try{
            const response = await axiosInstance.post('/api/my/message', message, {
                headers: {
                    'Content-Type': 'text/plain', // 문자열을 그대로 전달
                },
            });
            console.log(response.status)
            if (response.status === 200) {
                setAlert({ message: '메시지가 성공적으로 업데이트되었습니다.', type: 'success', isOpen: true });
            }
        }catch(err){
            console.log(err.message);
            setAlert({ message: '메시지 업데이트 중 오류가 발생했습니다.', type: 'error', isOpen: true });
        }
    }

    useEffect(() => {
        if (userData?.profileMessage) {
            setMessage(userData?.profileMessage||'');
        }
    }, [userData]);
    
    return (
        <>
            <div className={`alert-container ${alertClass}`}>
                <CustomAlert
                    type={alert.type}
                    message={alert.message}
                    isOpen={alert.isOpen}
                    onClose={closeAlert}
                />
            </div>
            <div className='upload-photo flex items-center'>
                <div className='w-[200px] h-[200px] bg-white drop-shadow-lg flex items-center justify-center overflow-hidden rounded-full'>
                <img
                    className='w-full h-full object-cover flex items-center between-center'
                    src={`${profileURL}${userData?.profileImgPath || 'default-profile.png'}`}
                    alt="프로필 이미지" 
                />
                </div>
                <div className='ml-[50px] flex flex-col w-[500px]'>
                    <span className='text-xs bg-white relative top-2 text-center w-[80px] text-gray-500 ml-10'>프로필 메세지</span>
                    <div className=' mb-10 h-[60px] flex items-center border border-gray-300 rounded-r-lg rounded-t-lg resize-none'>
                        <input placeholder='프로필 메세지를 설정해 보세요!'
                        className=' w-full rounded-lg indent-4'
                        value={message}
                        onChange={handleMessageChange}
                        />
                        <button onClick={updateMessage}
                        className='bg-indigo-500 text-white rounded w-[70px] h-[40px] mr-2 hover:bg-indigo-600'>변경</button>
                    </div>
                    <div className='flex mt-10'>
                        <label for="file" className='mr-10'>
                            <div  className='rounded-md h-[40px] flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white px-8'>
                                프로필 선택
                            </div>
                        </label>
                        <button onClick={profileUploadHandler}
                        className='rounded-md h-[40px] flex items-center justify-center border border-indigo-500 hover:bg-indigo-50 text-indigo-700 px-8'
                        >프로필 등록</button>
                        {/* <button className='btn-profile border border-red-400 text-red-400'>RESET</button> */}
                    </div>
                    <span className='text-sm text-gray-400 font-light mt-1'>
                        {selectedFileName || "JPG, GIF 혹은 PNG 등록 가능, 10MB 지원"}
                    </span>
                    <input type="file" id='file' 
                        onChange={handleFileChange}
                        className='hidden-inp'
                    />
                </div>
            </div>
        </>
    )
}

export default MyProfile;