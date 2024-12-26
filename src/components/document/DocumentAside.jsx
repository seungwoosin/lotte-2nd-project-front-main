import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {CustomSearch} from '@/components/Search'
import { Modal } from "../Modal";
import NewDrive from "./NewDrive";
import useUserStore from "../../store/useUserStore";
import axiosInstance from '@/services/axios.jsx'
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaTrash, FaDownload, FaEdit, FaStar, FaShareAlt, FaBarcode } from 'react-icons/fa';
import ContextMenu from "./ContextMenu";
import useStorageStore from "../../store/useStorageStore";
import useOnClickOutSide from "@/components/message/useOnClickOutSide";
import { Settings, Settings2, Trash2, TrashIcon } from "lucide-react";
import CustomAlert from "./CustomAlert";
import { useDriveSettingsStore } from "../../store/useDriveStore";
import useWebSocketProgress from "../../util/useWebSocketProgress";


const customAlertInitData = {
    visible: false,
    type: "info",
    title: "",
    message: "",
    subMessage: "" , 
    onConfirm: "", 
    onCancel: "", 
    confirmText: '확인', 
    cancelText: '취소',
    showCancel: false
}

export default function DocumentAside({onStorageInfo}){

    const { notifications } = useDriveSettingsStore();
    
    // const [folders, setFolders] = useState([]); // 폴더 목록 상태
    const [drive, setDrive] = useState(false);
    const makeDrive = () => {
        setDrive(true)
    }
    const navigate = useNavigate();

    const [isPinnedOpen, setIsPinnedOpen] = useState(true); // State to track "My Page" section visibility    
    const [isSharedOpen, setIsSharedOpen] = useState(true);

    const [usedSize, setUsedSize] = useState(0);
    const [remainingSize, setRemainingSize] = useState(0);
    const [usedPercentage, setUsedPercentage] = useState(0);
    
    const [folders, setFolders] = useState([]); // 폴더 목록 상태
    const [pinnedFolders, setPinnedFolders] = useState([]); // Pinned 폴더
    const queryClient = useQueryClient();
    const location = useLocation(); // 현재 경로 가져오기

    const [trashAlert,setTrashAlert] = useState(false);
    const handleCloseTrashAlert = () => setTrashAlert(false);
    const user = useUserStore((state)=>state.user);
    const trashSettingRef = useRef();
    const [isCustomAlert, setIsCustomAlert] = useState({ customAlertInitData});

    const customAlertCancelHandler = ()=>{
        setIsCustomAlert(customAlertInitData);
        setTrashAlert(false);
    }

  // React Query를 사용하여 폴더 데이터 가져오기
    const { data: folderResponse = { folderDtoList: [],shareFolderDtoList:[], uid: "" }, isLoading, isError } = useQuery({
        queryKey: ["driveList", user.uid],
        queryFn: async () => {
            const response = await axiosInstance.get("/api/drive/folders");
            return response.data; // 백엔드의 데이터 구조 반환
        },
        staleTime: 300000, // 데이터 신선 유지 시간 (5분)+
    });


    const { 
        isConnected, 
        notification,
    } = useWebSocketProgress({
        initialDestination: `/topic/folder/updates/${user.id}`,
        initialMessage: 'Hello, WebSocket!',
        initialUserId: user.id,
        initialUserUid: user.uid,
    });



    const calculateUsagePercentage = (currentUsedSize, maxSize) => {
        return (currentUsedSize / maxSize) * 100;
    };

    const { data: size , isDataLoading, isDataError } = useQuery({
        queryKey: ["driveSize", user.uid],
        queryFn: async () => {
            const response = await axiosInstance.get("/api/drive/size");
            return response.data; // 백엔드의 데이터 구조 반환
        },
        staleTime: 300000, // 데이터 신선 유지 시간 (5분)+
        onSuccess: (data) => {
            // 데이터 성공적으로 로드 시 스토리지 정보 업데이트
            const sizeInBytes = data.size * 1024;
            const currentUsedSize = sizeInBytes;
            const currentRemainingSize = maxSize - currentUsedSize;
    
            setStorageInfo({
                maxSize,
                currentUsedSize,
                currentRemainingSize,
            });
            const percent = calculateUsagePercentage(currentUsedSize,maxSize);
            if(notifications.storageAlerts && percent >= 90 ){
               console.log("스토리지 초과!!! ",percent)
                // WebSocket 알림 전송
                axiosInstance.post("/api/drive/notify", {
                    message: `스토리지 사용량 90%: ${percent.toFixed(2)}%`,
                    percent,
                });
              
            }
        },
    });

    console.log("Current user:", user.grade);
    // 폴더 필터링 (공유 및 개인)
    const sharedFolderDtoList = folderResponse?.shareFolderDtoList || [];
    const filteredSharedFolders = sharedFolderDtoList.filter(
        (folder) =>
            folder.ownerId !== user.uid && // 현재 사용자가 소유한 폴더 제외
            !sharedFolderDtoList.some(
                (parent) =>
                    folder.path !== parent.path && folder.path.startsWith(parent.path)
            )
    );

    const personalFolders = folderResponse?.folderDtoList || [];

    const setStorageInfo = useStorageStore((state) => state.setStorageInfo);
    const totalSize = filteredSharedFolders.length+ personalFolders.length;
 
    const userGrade = user?.grade || 1;    // 기본값 1
    let maxSize = 0;
        if (userGrade === 1 || userGrade  === null) {
            maxSize = 524288000; // 500 MB
        } else if (userGrade  === 2) {
            maxSize = 1048576000; // 1 GB
        } else {
            maxSize = 10485760000; // 10 GB
        }

    useEffect(() => {
          // KB 단위의 size를 Byte로 변환
         const sizeInBytes = size * 1024;
    
        const currentUsedSize = sizeInBytes;
        const currentRemainingSize = maxSize - currentUsedSize;
        const currentUsedPercentage = (currentUsedSize / maxSize) * 100;
    
        setUsedSize(currentUsedSize);
        setRemainingSize(currentRemainingSize);
        setUsedPercentage(currentUsedPercentage);
        setStorageInfo({
            maxSize,
            currentUsedSize,
            currentRemainingSize,
        });
        const percent = calculateUsagePercentage(currentUsedSize,maxSize);
        console.log("ㅠㅓ센테지:::",percent);
        console.log("notifications!!!",notifications.storageAlerts);
        if(notifications.storageAlerts && percent >= 80 ){
           console.log("스토리지 초과!!! ",percent);
            // WebSocket 알림 전송
            axiosInstance.post("/api/drive/notify", {
                message: `스토리지 사용량 90%: ${percent.toFixed(2)}%`,
                percent,
            });
          
        }


    }, [size]); // `size`와 `userGrade`가 변경될 때 계산
   

    const togglePinnedSection = () => {
      setIsPinnedOpen((prev) => !prev); // Toggle the section
    };
  
    const toggleSharedSection = () => {
        setIsSharedOpen((prev) => !prev);
    }

    const [contextMenu, setContextMenu] = useState({
        visible: false,
        position: { top: 0, left: 0 },
        folder: null,
    });
    const contextMenuRef = useRef(null); // 메뉴 DOM 참조


    const handleContextMenu = (e, folder) => {
        e.preventDefault(); // 기본 컨텍스트 메뉴 방지
        setContextMenu({
            visible: true,
            position: { top: e.clientY, left: e.clientX },
            folder,
            folderId : folder.id,
            isPinned : folder.isPinned,
            folderName: folder.name,
            path: folder.path,

        });
    };
    const handleCloseMenu = () => {
        setContextMenu({ visible: false, position: { top: 0, left: 0 }, folder: null });
    };

    const trashHandler= () =>{
        setTrashAlert(false)
    }

    useOnClickOutSide(trashSettingRef, trashHandler);


    const handleMenuAction = (action) => {
        console.log(`${action} clicked for folder:`, contextMenu.folder);
        setContextMenu({ visible: false, position: { top: 0, left: 0 }, folder: null });
    };

    const handleDelete = async (item) => {
        try {
            const response = await axiosInstance.delete(
                `/api/drive/folder/delete/${item.id}`, // 폴더 또는 파일의 타입과 ID 사용
                { params: { path: item.path } } // 경로 전달
            );
    
            if (response.status === 200) {
                console.log(`${item.type} 삭제 성공:`, item.id);
                queryClient.invalidateQueries(['folderContents', folderId]);
                alert(`${item.type === 'folder' ? '폴더' : '파일'}가 삭제되었습니다.`);
            } else {
                console.error('삭제 실패:', response.data);
                alert('삭제에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    const handleclean = async ()=> {

        try{
            const response = await axiosInstance.delete('/api/drive/cleanAll');

            if(response.status === 200){
                queryClient.invalidateQueries(['trash']);
                setIsCustomAlert({
                    visible:true,
                    type: "info",
                    title: "휴지통 비우기 완료",
                    message: "",
                    subMessage: "" , 
                    onConfirm: customAlertCancelHandler, 
                    onCancel: customAlertCancelHandler, 
                    showCancel: false,       
                })
            }else if (response.status === 417) { // 변경된 부분
                setIsCustomAlert({
                    visible:true,
                    type: "info",
                    title: "휴지통이 비어있습니다.",
                    message: "",
                    subMessage: "" , 
                    onConfirm: customAlertCancelHandler, 
                    onCancel: customAlertCancelHandler, 
                    showCancel: false,       
                })

            }

        }catch(error){
            console.error('삭제중 오류 발생',error);
            setIsCustomAlert({
                visible:true,
                type: "info",
                title: "휴지통 비우기 실패",
                message: "삭제 중 오류가 발생했습니다.",
                subMessage: "" , 
                onConfirm: customAlertCancelHandler, 
                showCancel: false,       

            })
        }
    }

    const AllCleanHandler=()=>{
        console.log("휴지통 비우기 되나?");
        setIsCustomAlert({
                visible:true,
                type: "warning",
                title: "휴지통을 비우시겠습니까?",
                message: "다시 복원할 수 없습니다.",
                subMessage: "" , 
                onConfirm: handleclean, 
                onCancel: customAlertCancelHandler, 
                confirmText: '확인', 
                cancelText: '취소',
                showCancel: true
        })



    }

   


    const [selectedAction, setSelectedAction] = useState(null);

    const actions = [
        {
            id: 'trash',
            label: '휴지통',
            icon: FaTrash,
            color: 'text-red-500',
        },
        {
            id: 'download',
            label: '다운로드',
            icon: FaDownload,
            color: 'text-blue-500',
        },
        {
            id: 'rename',
            label: '이름 바꾸기',
            icon: FaEdit,
            color: 'text-green-500',
        },
        {
            id: 'favorite',
            label: '즐겨찾기',
            icon: FaStar,
            color: 'text-yellow-500',
        },
        {
            id: 'share',
            label: '드라이브 공유',
            icon: FaShareAlt,
            color: 'text-purple-500',
        },
    ];
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const handleActionClick = (actionId, event) => {
        setSelectedAction(actionId === selectedAction ? null : actionId);
        setMenuPosition({ x: event.clientX, y: event.clientY });
    };

        // 로딩 상태 처리
        if (isLoading || isDataLoading) {
            return <div>Loading data...</div>;
        }
        
        if (isError || isDataError) {
            return <div>Error loading data.</div>;
        }

   
        
    

   



    return(<>
    
    <aside className='document-aside1 overflow-scroll flex flex-col scrollbar-none'>
                <section className='flex justify-between mb-8'>
                    <div></div>
                    <Link to="/document" className='text-lg'>드라이브 ({totalSize})</Link>
                    <button
                        onClick={() => navigate('/document/settings')}
                        className="hover:bg-gray-100 rounded-full"
                        title="드라이브 설정"
                    >
                        <Settings2 className="w-5 h-5" />
                    </button>

                </section>
                <section className='flex justify-center mb-8 w-26'>
                    <select className='outline-none border rounded-l-md opacity-80 h-11 w-24 text-center text-sm'>
                        <option>참여자</option>
                        <option>부장</option>
                        <option>담당업무</option>
                    </select>
                    <CustomSearch
                        width1='24'
                        width2='40'
                    />
                </section>
                <section className="py-[0px] px-[20px] mb-10">
                    <div className='flex gap-4 items-center opacity-60 mb-[10px]'>
                        <img className='w-6 h-6' src='/images/document-star.png'></img>
                        <Link   to={'/document/favorite'}
                                state={{ folderName: "즐겨찾기" }} // folder.name 전달 
                        >
                            <p>즐겨찾기</p>
                        </Link>
                    </div>
                    <div className='flex gap-4 items-center opacity-60 mb-[10px]'>
                        <img  className='w-6 h-6' src='/images/document-recent.png'></img>
                        <Link  to={'/document/latest'}
                                state={{ folderName: "최근문서" }} // folder.name 전달 
                        >
                             <p>최근문서</p>
                        </Link>
                    </div>
                    <div className='flex gap-4 items-center opacity-60 relative mb-[10px]'>
                        <img  className='w-6 h-6' src='/images/trash.png'></img>
                        <Link  to={'/document/trash'}
                                state={{ folderName: "휴지통" }} // folder.name 전달 
                        >
                             <p>휴지통</p>
                        </Link>
                      
                            <img 
                                src="/images/setting.png" 
                                className="w-[20px] ml-[90px] cursor-pointer " alt="" 
                                onClick={() => {
                                    console.log("휴지통 설정 클릭");
                                    setTrashAlert(true);
                                  }}                            />
                            {trashAlert && (
                                    <div
                                        className="bg-white-100 opacity-100 rounded-xl shadow-md p-4 absolute  z-[999]"
                                        style={{
                                            
                                            backgroundColor:"white",
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                            padding: "10px",
                                            borderRadius: "4px",
                                        }}
                                    >
                                        <div className="space-y-4">
                                            <div
                                                ref={trashSettingRef}  
                                                onClick={AllCleanHandler}
                                                className="flex items-center justify-between rounded-lg p-1 cursor-pointer transition-all duration-300 hover:bg-gray-200 hover:shadow-lg"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-3 rounded-lg bg-opacity-20`}>
                                                        <TrashIcon className={`w-5 h-5`} />
                                                    </div>
                                                    <span className="font-semibold">휴지통 비우기</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}   
                        
                    </div>

                </section>


                <section className='flex justify-between items-center p-4 mb-2'>
                    <div>
                        <p className='text-2xl font-bold'>나의 드라이브 <span className='text-xs font-normal opacity-60'>(  {personalFolders.length})</span></p>
                        
                    </div>
                    <div>
                        <img
                            className={`cursor-pointer hover:opacity-20 w-[15px] h-[10px] opacity-60 transform transition-transform duration-300 ${
                                isPinnedOpen ? "rotate-0" : "-rotate-90"
                            }`}
                            src="/images/arrow-bot.png"
                            alt="Toggle"
                            onClick={togglePinnedSection}
                            />                    
                    </div>
                </section>


                <section className={`mypageArea flex flex-col px-8  overflow-scroll scrollbar-none transition-all duration-300 ${
                isPinnedOpen ? "max-h-[180px]" : "max-h-0"
                    }`}>
                    {personalFolders.map((folder) => (
                    <div className="flex items-center mb-1 justify-between relative" key={folder.id} onContextMenu={(e) => handleContextMenu(e, folder)}>
                        <Link   to={`/document/list/${folder.id}`}
                                state={{ folderName: folder.name }} // folder.name 전달
                                className="flex gap-4 items-center mb-1 ">
                            <div>
                                {folder.sharedUsers?.length > 0 ? (<><img src="/images/folder_shared.svg" className="opacity-60 pt-1 " /></> ): (<>                                
                                <img src="/images/folder_24dp.svg" alt="Folder Icon"  className="opacity-60 pt-1" />
                                    </>)}
                            </div>
                            <p className="opacity-60 pt-1">{folder.name}</p>
                        </Link>

                    </div>
                    ))}  
                    {personalFolders.length === 0 && <p className="opacity-60"> 폴더가 없습니다.</p>}
                </section>
                <section className='flex justify-between items-center p-4 mb-2 mt-4'>
                    <div>
                        <p className='text-2xl font-bold'>공유 드라이브 <span className='text-xs font-normal opacity-60'>({filteredSharedFolders.length})</span></p>
                    </div>
                    <div>
                    <img
                        className={`cursor-pointer hover:opacity-20 w-[15px] h-[10px] opacity-60 transform transition-transform duration-300 ${
                            isSharedOpen ? "rotate-0" : "-rotate-90"
                        }`}
                        src="/images/arrow-bot.png"
                        alt="Toggle"
                        onClick={toggleSharedSection}
                        />
                    </div>
                </section>
                <section
                        className={`mypageArea flex flex-col px-8  overflow-scroll scrollbar-none transition-all duration-300 ${
                            isSharedOpen ? "max-h-[180px] " : "max-h-0"
                        }`}>
                     {filteredSharedFolders.map((folder) => (
                        <div className="flex gap-4 items-center mb-1" key={folder.id}  onContextMenu={(e) => handleContextMenu(e, folder)}>
                            <Link   to={`/document/list/${folder.id}`}
                                    state={{ folderName: folder.name }} // folder.name 전달
                                    className="flex gap-4 items-center mb-1">
                                <img src="/images/folder_shared.svg" className="opacity-60 pt-1" />
                                <p className="opacity-60 pt-1">{folder.name}</p>
                            </Link>
                        </div>
                        ))}  
                        {filteredSharedFolders.length === 0 && <p className="opacity-60">Shared 폴더가 없습니다.</p>}
                </section>

                
                <section className='mt-auto flex flex-col gap-5'>
                    <div className="bg-gray-100 rounded-md p-4 text-gray-600 text-sm">
                        <p>사용량: {(usedSize / 1024 / 1024).toFixed(2)} MB / {(maxSize / 1024 / 1024).toFixed(2)} MB</p>
                        <div className="w-full bg-gray-300 rounded-full h-2.5 my-2">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${usedPercentage}%` }}></div>
                        </div>
                        <p>남은 용량: {(remainingSize / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button onClick={makeDrive} className='bg-purple white h-8 rounded-md'>드라이브 생성</button>
                      {/* 설정 아이콘 추가 */}
                   
                </section>


               {/*  <section className='mt-auto flex flex-col gap-5'>
                    <button onClick={makeDrive} className='bg-purple white h-8 rounded-md'>드라이브 생성</button>
                </section> */}
                <div className='drive-modal'>
                    <NewDrive 
                       order={folderResponse?.folderDtoList?.length}
                       isOpen={drive}
                       onClose={() => setDrive(false)}
                       user={user}
                       text="드라이브 만들기"
                    />
                </div>

                {/* ContextMenu 컴포넌트 */}
                <ContextMenu
                    visible={contextMenu.visible}
                    position={contextMenu.position}
                    onClose={handleCloseMenu}
                    actions={actions}
                    folder={contextMenu.folder}
                    isPinned={contextMenu.isPinned}
                    folderName={contextMenu.folderName}
                    folderId={contextMenu.folderId}
                                        path={contextMenu.path}

                />
            </aside>

            {isCustomAlert.visible &&(

                <CustomAlert
                    type = {isCustomAlert.type} 
                    title={isCustomAlert.title} 
                    message={isCustomAlert.message} 
                    subMessage={isCustomAlert.subMessage} 
                    onConfirm={isCustomAlert.onConfirm} 
                    onCancel={isCustomAlert.onCancel} 
                    showCancel = {isCustomAlert.showCancel}
                />
            )}
           
    </>)
}