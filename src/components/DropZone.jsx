import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axiosInstance from '@/services/axios.jsx';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import CustomAlert from './Alert';
import useStorageStore from '../store/useStorageStore';
import { Stomp } from '@stomp/stompjs';
import useWebSocketProgress from '../util/useWebSocketProgress';
import { FileTextIcon, UploadCloudIcon, XIcon } from 'lucide-react';


const MyDropzone = ({ 
  folderId ,
  fileMaxOrder, 
  folderMaxOrder,  
  uid, 
  onUploadProgress,
  onUploadStart, 
  onUploadComplete ,
  triggerAlert,  
  
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]); // 업로드된 파일 목록
  const [isUploading, setIsUploading] = useState(false); // 업로드 중 상태
  const [isPopupVisible, setIsPopupVisible] = useState(false); // 팝업 상태
  const queryClient = useQueryClient();
  const storageInfo = useStorageStore((state) => state.storageInfo);
  const [uploadProgress,setUploadProgress]= useState(0);
  const [alert,setAlert] =useState(false); 
 
  const { stompClient, isConnected, updateUserId, updateFolderId, messages, progress } = useWebSocketProgress({});

  useEffect(()=>{
    setUploadProgress(progress);
    onUploadProgress(progress);
  },[messages,progress])



  // 파일 업로드 함수
  const uploadFiles = async (files) => {
   
    const totalFileSize = files.reduce((total, file) => total + file.size, 0); // 파일 크기 합계 (Byte)
    const remainingSize = storageInfo.currentRemainingSize/1024;

    console.log("파일 크기(Byte):", files.map(file => file.size)); // 각 파일 크기
    console.log("업로드 파일 총 크기(Byte):", totalFileSize);
    console.log("남은 용량(Byte):", remainingSize);

    if (totalFileSize > remainingSize) {
      triggerAlert(
        'warning',
        '용량 초과',
        `남은 용량(${storageInfo.currentRemainingSize} bytes)보다 큰 파일은 업로드할 수 없습니다.`
      );
      return;
    }

    onUploadStart(); // 업로드 시작 알림
    setIsUploading(true);
  
    const formData = new FormData();
    const fileStructure = {};

    files.forEach((file) => {
      // 파일 경로 분리
      const path = file.path || file.name; // `path`가 없으면 파일 이름 사용
      const segments = path.split('/');
      const folderPath = segments.slice(0, -1).join('/'); // 폴더 경로만 추출
      // 폴더 경로에 따라 파일 그룹화
      if (!fileStructure[folderPath]) {
        fileStructure[folderPath] = [];
      }
      fileStructure[folderPath].push(file);

      formData.append('files', file);
      formData.append('relativePaths', folderPath); // 경로를 서버로 전송
    });
    formData.append("fileMaxOrder", fileMaxOrder);
    formData.append("folderMaxOrder", folderMaxOrder);
    formData.append("uid",uid);
    console.log("FormData before sending:", formData); // FormData 확인

    setIsUploading(true); // 업로드 중 상태로 설정
    updateUserId(uid);
    updateFolderId(folderId);
    try {
      const response = await axiosInstance.post(`/api/drive/upload/${folderId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      queryClient.invalidateQueries(['folderContents']);
      onUploadComplete();
      console.log("업로드 성공:", response.data);

      // 업로드 성공 시 파일 목록 업데이트
      setUploadedFiles((prevFiles) => [
        ...prevFiles,
        ...files.map((file) => ({
          name: file.name,
          size: file.size,
        })),
      ]);

      // 팝업 상태 활성화
      setIsPopupVisible(true);
    } catch (error) {
      console.error("업로드 실패:", error);
      // 서버 응답에 따라 알림 메시지 설정
        const errorMessage = error.response?.data || '파일 업로드 중 오류가 발생했습니다. 다시 시도해주세요.';
        const errorType = error.response?.status === 400 ? 'warning' : 'error'; // 상태 코드에 따라 타입 분기

        console.log('업로드 실패!!');
        triggerAlert(errorType, '업로드 실패', errorMessage);


    } finally {

      setIsUploading(false); // 업로드 완료 상태로 설정
    }
  };

  // 드롭존 설정
  const { getRootProps, getInputProps, isDragActive  } = useDropzone({
    onDrop: (acceptedFiles) => {
      const folderStructure = {};
      acceptedFiles.forEach((file) => {
        console.log('File Path:', file.path || file.name); // 경로 확인
        const filePath = file.path; // 상대 경로
        folderStructure[filePath] = file;
        console.log("File name:", file.name);
        console.log("Relative path:", file.webkitRelativePath); // 여기서 값이 출력되는지 확인
      });
      console.log("받은 파일들:", acceptedFiles);
      uploadFiles(acceptedFiles); // 파일 업로드 함수 호출
    },
  });
  const closeAlert = () => setAlert({ isVisible: false });

  // 팝업 닫기
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <>
    <div className="max-w-xl mx-auto p-4">
      {/* 드래그 앤 드롭 영역 */}
      <div
        {...getRootProps()} 
        className={`
          relative flex flex-col items-center justify-center 
          p-10 border-2 border-dashed rounded-2xl 
          transition-all duration-300 
          ${isDragActive 
            ? 'border-purple-500 bg-purple-50 shadow-xl' 
            : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50/30'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="text-center">
          <UploadCloudIcon 
            className={`mx-auto mb-4 ${isDragActive ? 'text-purple-500' : 'text-gray-400'}`} 
            size={48} 
            strokeWidth={1.5}
          />
          
          <p className="text-gray-600 mb-2">
            파일을 여기에 드래그하거나 
          </p>
          <p className="text-purple-600 font-semibold cursor-pointer hover:underline">
            클릭하여 업로드하세요
          </p>
        </div>
      </div>

      {/* 업로드 진행 상태 */}
      {isUploading && (
        <div className="mt-4 bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-600 font-medium">파일 업로드 중</span>
            <span className="text-gray-600">{uploadProgress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2.5">
            <div 
              className="bg-purple-500 h-2.5 rounded-full" 
              style={{width: `${uploadProgress}%`}}
            ></div>
          </div>
        </div>
      )}

      {/* 업로드된 파일 팝업 */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">업로드된 파일</h3>
              <button 
                onClick={closePopup} 
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon size={24} />
              </button>
            </div>
            
            <div className="max-h-64 overflow-y-auto p-4">
              {uploadedFiles.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between py-3 border-b last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <FileTextIcon className="text-purple-500" size={24} />
                    <span className="text-gray-700">{file.name}</span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
     {alert.isVisible && (
      <CustomAlert
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={() => setAlert({ isVisible: false })}
      />
    )}
    
    </>
  );
};

const styles = {
  dropzone: {
    border: "1px dashed black",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    height: "170px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

export default MyDropzone;
