import React, { useEffect, useRef, useState } from 'react';
import '@/components/document/DocumentCard1.scss';
import { Link, useNavigate } from 'react-router-dom';
import RenameModal from './ChangeName';
import CustomAlert from './CustomAlert';
import axiosInstance from '../../services/axios';
import { useQueryClient } from '@tanstack/react-query';
import { MenuToggle } from './MenuToggle';
import ContextMenu from './ContextMenu';
import { Star } from 'lucide-react';

export const DocumentCard1 = ({
    cnt,
    folderName,
    setSelectedFolder,
    folderId,
    folder,
    path,
    onDragStart, 
    onDragOver, 
    onDrop,
    updatedAt,
    onContextMenu,
    downloadHandler,
    togglePin,
    isFavorite,
    setIsFavorite,
    handleDelete,
    type,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 토글 상태 관리
    // const [isAlertOpen, setIsAlertOpen] = useState(false);
    const queryClient = useQueryClient(); // Access query client

    const navigate = useNavigate();
    const menuRef = useRef(null); // 메뉴 DOM 참조
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false); // RenameModal 상태
    const [newName, setNewName] = useState(folderName); // 폴더 이름 상태
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 }); // 메뉴 위치

    const [alert, setAlert] = useState(null); // 알림 상태 관리
    const [dragZone, setDragZone] = useState(null);
    const handleDragOver = (e, zone) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const rectHeight = rect.height || 1; // 기본값 추가
        const rectWidth = rect.width || 1;  // 가로 방향 계산을 위해 추가
        const mouseY = e.clientY - rect.top;
        const mouseX = e.clientX - rect.left;
    
    
        if (mouseY < rectHeight * 0.25 && mouseX < rectWidth * 0.25) {
            setDragZone('before'); // 왼쪽 상단
        } else if (mouseY < rectHeight * 0.25 && mouseX > rectWidth * 0.75) {
            setDragZone('before'); // 오른쪽 상단
        } else if (mouseY > rectHeight * 0.75 && mouseX < rectWidth * 0.25) {
            setDragZone('after'); // 왼쪽 하단
        } else if (mouseY > rectHeight * 0.75 && mouseX > rectWidth * 0.75) {
            setDragZone('after'); // 오른쪽 하단
        } else if (mouseY < rectHeight * 0.25) {
            setDragZone('before'); // 상단
        } else if (mouseY > rectHeight * 0.75) {
            setDragZone('after'); // 하단
        } else if (mouseX < rectWidth * 0.25) {
            setDragZone('before'); // 왼쪽
        } else if (mouseX > rectWidth * 0.75) {
            setDragZone('after'); // 오른쪽
        } else {
            setDragZone('inside'); // 가운데
        }
    };

    const handleDragLeave = () => {
        setDragZone(null);
    };

    const handleDrop = (e, zone) => {
        e.preventDefault();
        e.stopPropagation();
    
        if (zone) {
            console.log(`Dropped in zone: ${zone}`);
            onDrop(folder, zone);
        }
        setDragZone(null);
    };
    const handleFavoriteToggle = async () => {
        const newFavoriteState = !isFavorite; // 새로운 상태
        setIsFavorite(newFavoriteState); // UI 업데이트
    
        try {
            const response = await axiosInstance.put(`/api/drive/folder/${folderId}/favorite`, {
                isPinned: newFavoriteState ? 1 : 0, // 백엔드에 맞는 값으로 변환하여 전송
            });
    
            if (response.status === 200) {
                console.log('즐겨찾기 상태 업데이트 성공');
                if(response.data.result === 1){
                    setAlert({
                        type: 'success',
                        title: '즐겨찾기 성공',
                        message: `폴더 "${folderName}"가 즐겨찾기에 추가되었습니다.`,
                        onConfirm: () => setAlert(null), // 알림 닫기
                    });
                    queryClient.invalidateQueries(['favorite'])
                }else{
                    setAlert({
                        type: 'success',
                        title: '즐겨찾기 해제성공',
                        message: `폴더 "${folderName}"가 즐겨찾기 해제되었습니다.`,
                        onConfirm: () => setAlert(null), // 알림 닫기
                    });
                    queryClient.invalidateQueries(['favorite'])

                }
                
            } else {
                console.error('즐겨찾기 상태 업데이트 실패:', response.data);
                setAlert({
                    type: 'error',
                    title: '즐겨찾기 실패',
                    message: '즐겨찾기 상태를 업데이트하지 못했습니다. 다시 시도해주세요.',
                    onConfirm: () => setAlert(null),
                });
                setIsFavorite(!newFavoriteState); // 실패 시 상태 원복
            }
        } catch (error) {
            console.error('즐겨찾기 상태 업데이트 중 오류 발생:', error);
            setAlert({
                type: 'error',
                title: '오류 발생',
                message: '즐겨찾기 상태를 업데이트하는 중 오류가 발생했습니다.',
                onConfirm: () => setAlert(null),
            });
            setIsFavorite(!newFavoriteState); // 실패 시 상태 원복
        }
    };

    const toggleMenu = (e) => {
        e.preventDefault(); // 기본 컨텍스트 메뉴 방지
        console.log('Folder for context menu:', folder); // 디버깅용
        setSelectedFolder(folder); // Set the selected folder

        setMenuPosition({ top: e.clientY, left: e.clientX }); // 클릭 위치 기반으로 위치 설정
        setIsMenuOpen(true); // 메뉴 열기
    };
    const openRenameModal = () => {
        setIsRenameModalOpen(true);
        setIsMenuOpen(false); // 메뉴 닫기
    };

    const closeRenameModal = () => {
        setIsRenameModalOpen(false);
    };

    const handleRename = (newName) => {
        console.log('Renaming folder to:', newName);
        setNewName(newName);
        setIsRenameModalOpen(false);
        // 실제 이름 변경 로직
    };

    const navigateHandler = () =>{
        if (type !== 'trash') {
            navigate(`/document/list/${folderId}`,{
                state: {
                    cnt,
                    folderName,
                    folderId,
                    updatedAt,
                }
            });
        }
    
    }


     // 메뉴 바깥 클릭 시 닫기
   /*   useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []); */

    // const handleDelete = () => {
    //     console.log('Delete folder:', folderId);
    //     setIsAlertOpen(true); // CustomAlert 열기

    //     // 폴더 삭제 로직
    // };

    // const handleConfirm = async() => {
    //     console.log('Deleting folder:', folderId);
    //     setIsAlertOpen(false); // CustomAlert 닫기
    
    //     // 폴더 삭제 로직
    //     try {
    //         // 실제 삭제 API 호출
    //        const response =  await axiosInstance.delete(`/api/drive/folder/delete/${folderId}`,
    //         { params: { path } } // 쿼리 매개변수로 path 전달
    //        );
    //        if (response.status === 200) {
    //         queryClient.invalidateQueries(['folderContents']); // Replace with the relevant query key
    //         alert('휴지통으로 이동  성공');
    //       } else {
    //         console.error('삭제 실패:', error);
    //         alert('폴더 삭제에 실패했습니다. 다시 시도해주세요.');
    //       }
    //     } catch (error) {
    //         console.error('폴더 삭제 중 오류 발생:', error);

    //     }
    //             /* .then((response) => {
    //                 if (response.status === 200) {
    //                     alert('폴더가 삭제되었습니다.');
    //                     // QueryClient로 폴더 목록 업데이트
    //                     queryClient.invalidateQueries(['folderContents']);
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error('삭제 실패:', error);
    //                 alert('폴더 삭제에 실패했습니다. 다시 시도해주세요.');
    //             });
    //     } catch (error) {
    //         console.error('폴더 삭제 중 오류 발생:', error);
    //     } */
    // };
    
    // const handleCancel = () => {
    //     setIsAlertOpen(false); // CustomAlert 닫기
    // };

    const handleShare = () => {
        console.log('Share folder:', folderId);
        // 폴더 공유 로직
    };
    

    return (<>
           <div className="relative w-full max-w-[400px] mx-2 my-2"
                  onDragOver={(e) => handleDragOver(e)}
                  onDragLeave={() => setDragZone(null)}
                  onDrop={(e) => handleDrop(e, dragZone)}
           >
            {/* Before drop zone */}
             {/* Drop indicators */}
             {dragZone === 'before' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 transform -translate-y-1" />
            )}
            
            {/* Main card */}
            <div 
                className={`flex items-center p-3 bg-white rounded-lg
                    ${dragZone === 'inside' ? 'border-2 border-blue-400 bg-blue-50' : 'border border-gray-200'}
                    hover:shadow transition-all duration-200`}
                draggable
                onDragStart={(e) => onDragStart(folder)}
                onContextMenu={(e) => onContextMenu(e, folder)}
                onClick={() => setSelectedFolder(folder)}
            >
                <img 
                    className="w-10 h-10 mr-3" 
                    src="/images/document-open-folder.png" 
                    alt="folder"
                    onClick={navigateHandler}
                />
                
                <div className="flex-1 cursor-pointer" onClick={navigateHandler}>
                    <h3 className="text-gray-800">{folderName}</h3>
                </div>

                <Star 
                    className={`w-5 h-5 cursor-pointer
                        ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteToggle();
                        setIsFavorite(!isFavorite);
                    }}
                />
            </div>

            {dragZone === 'after' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform translate-y-1" />
            )}


            {isMenuOpen && (
                 <ContextMenu
                    type={"folder"}
                    visible={true}
                    position={menuPosition}
                    folder={folder}
                    name={folderName}
                    Id={folderId}
                    path={path}
                    downloadHandler={(folderId) => downloadHandler(folderId)} // Pass selectedFolder
                    // handleDelete={handleDelete}
                    />
            )}

            {alert && (
            <CustomAlert
                type={alert.type}
                title={alert.title}
                message={alert.message}
                confirmText="확인"
                onConfirm={alert.onConfirm}
            />
             )}
                       


        </div>
       
        </>
    );
};
