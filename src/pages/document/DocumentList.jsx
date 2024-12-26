import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '@/pages/document/Document.scss';
import { CustomSearch } from '@/components/Search';
import { DocumentCard1 } from '../../components/document/DocumentCard1';
import { DocumentCard2 } from '../../components/document/DocumentCard2';
import DocumentLayout from '../../layout/document/DocumentLayout';
import axiosInstance from '@/services/axios.jsx';
import NewFolder from '../../components/document/NewFolder';
import useUserStore from '../../store/useUserStore';
import { Modal } from '../../components/Modal';
import FileUploads from '../../components/document/FileUploads';
import RenameModal from '../../components/document/ChangeName';
import ContextMenu from '../../components/document/ContextMenu';
import ContextFileMenu from '../../components/document/ContextFileMenu';
import CustomAlert from '../../components/document/CustomAlert';
import MyDropzone from '../../components/DropZone';
import useStorageStore from '../../store/useStorageStore';
import ShareMember from "@/components/ShareMember";
import { AddProjectModal } from '../../components/project/_Modal';
import { AddDocumentModal } from '../../components/document/addDocumentModal';
import DriveShareModal from '../../components/document/documentShareMenu';
import { Check, X } from 'lucide-react';



const PERMISSIONS = {
    READING: "읽기",
    WRITING: "수정",
    FULL: "모든"
  };

export default function DocumentList() {
    const [viewType, setViewType] = useState('box'); // Default to 'box'
    const [isOpen, setIsOpen] = useState(false);
    const [folder, setFolder] = useState(false);
    const [editing, setEditing] = useState(false); // 이름 변경 모드
    const [newFolderName, setNewFolderName] = useState(''); // 새로운 폴더 이름
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false); // 모달 열림 상태
    const [isFavorite,setIsFavorite] = useState(0);
    const [shareMenu,setShareMenu] = useState(false);
    const [saveCoworker,setSaveCoworker] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [isTokenValid, setIsTokenValid] = useState(null); // null: 초기 상태, true: 유효, false: 무효
    // URL에서 folderId 추출
    const folderId = decodeURIComponent(location.pathname.split('/').pop());
    // URL에서 token 추출
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const [isTokenLoading, setIsTokenLoading] = useState(null);
    const [draggedFile, setDraggedFile] = useState(null); // 드래그된 파일 상태

    const user = useUserStore((state) => state.user);

    const handleFileDragStart = (file) => {
        setDraggedFile(file); // 드래그된 파일 정보 저장
    };
    // URL에서 token 추출
    const queryClient = useQueryClient();
    const [draggedFolder, setDraggedFolder] = useState(null); // 드래그된 폴더
    const fileServerBaseUrl = `http://3.35.170.26:90/download/`;

    const [isDetailVisible, setIsDetailVisible] = useState(false); // 상세 정보 표시 상태 추가
    const [selectedFolder, setSelectedFolder] = useState(null); // 선택된 폴더 정보 상태 추가
    const [selectedFile, setSelectedFile] = useState(null); // 선택된 폴더 정보 상태 추가
    const [alert, setAlert] = useState({
        isVisible: false,
        type: "",
        title: "",
        message: "",
        onConfirm: null, // 기본값은 null
      });
     
     
      const triggerAlert = (type, title, message, onConfirm, showCancel) => {
        setAlert({
            isVisible: true,
            type,
            title,
            message,
            onConfirm, // 콜백 저장
            showCancel,
        });
    };
    
    // 확인 버튼 클릭 시 onConfirm 실행
    const handleAlertConfirm = () => {
        if (alert.onConfirm) {
            alert.onConfirm(); // 콜백 실행
        }
        setAlert({ isVisible: false });
    };

      const closeAlert = () => {
        setAlert({ isVisible: false });
      };
    const handleDetailToggle = (folder) => {
        console.log("handleDetailToggle",folder)
        setSelectedFile(null);

        setSelectedFolder(folder); // 선택된 폴더 정보 설정
        setIsDetailVisible(!isDetailVisible);
    };

    const closeDetailView = () => {
        setIsDetailVisible(false);
        setSelectedFolder(null);
        setSelectedFile(null)
      };

      const handleDetailFileToggle = (file) => {
        console.log("handleDetailFileToggle",file)
        setSelectedFolder(null);
    
        setSelectedFile(file); // 선택된 폴더 정보 설정
        setIsDetailVisible(!isDetailVisible);
    };

    const closeDetailFileView = () => {
        setIsDetailVisible(false);
        setSelectedFile(null);
      };

    const handleShare = (type,selected)=>{
        if (type === "folder") {
            setSelectedFolder(selected); // 폴더 선택 상태 업데이트
            setSelectedFile(null); // 파일 선택 초기화
        } else if (type === "file") {
            setSelectedFile(selected); // 파일 선택 상태 업데이트
            setSelectedFolder(null); // 폴더 선택 초기화
        }
        setIsModalOpen(true);
    }

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedFolder(null);
        setSelectedFile(null);
    };


    const [menuState, setMenuState] = useState({
        isMenuOpen: false,
        position: { top: 0, left: 0 },
        activeFolder: null, // 현재 활성화된 폴더
    });

    const closeMenu = () => {
        setMenuState((prev) => ({ ...prev, isMenuOpen: false, activeFolder: null }));
    };

    const toggleMenu = (e, folder) => {
        e.preventDefault(); // 기본 컨텍스트 메뉴 방지
        setMenuState({
            isMenuOpen: true,
            position: { top: e.clientY, left: e.clientX },
            activeFolder: folder,
        });
    };

    console.log(location);

    // 폴더 및 파일 데이터 가져오기
    const { data, isLoading, isError } = useQuery({
        queryKey: ['folderContents', folderId],
        queryFn: async () => {
            const response = await axiosInstance.get(
                `/api/drive/folder-contents?folderId=${folderId}`
            );
        
            return response.data;
        },
        staleTime: 300000, // 데이터가 5분 동안 신선하다고 간주
        onSuccess: (fetchedData) => {
            handleValidate(fetchedData);

        },
        onError: (error) => {
            console.error("Error fetching folder contents:", error);
            setIsTokenLoading(false);
            setIsTokenValid(false);
        },
    });
    const parentFolder = (data?.parentFolder || []);
    console.log(parentFolder);
    const [parsedSharedUsers, setParsedSharedUsers] = useState([]);

    useEffect(() => {
        const validateToken = async () => {
          if (token) {
            try {
              const response = await axiosInstance.post("/api/share/token/validate", { token });
              if (response.status === 200) {
                setIsTokenValid(true); // 토큰 유효
              } else {
                setIsTokenValid(false); // 토큰 무효
              }
            } catch (error) {
              console.error("Token validation failed:", error);
              setIsTokenValid(false); // 토큰 무효
            }
          }else{
            handleValidate(data);
          }
          setIsTokenLoading(false); // 로딩 상태 종료
        };
    
        validateToken();
    }, [token, folderId,data,navigate]);

    const handleValidate = (fetchedData) => {
        
        // parentFolder와 관련된 로직 초기화
        if (fetchedData?.parentFolder) {
            const isUserShared = fetchedData.parentFolder.sharedUsers?.some(
                (u) => u.id === user.id
            );

            // 유효성 검사 로직
            if (fetchedData.parentFolder.ownerId === user.uid || isUserShared) {
                setIsTokenValid(true);
            } else {
                setIsTokenValid(false);
            }
            setIsTokenLoading(false); // 로딩 상태 종료
        }

    }


      useEffect(() => {
        if (isTokenValid === false && !isTokenLoading) {
            triggerAlert(
                "warning",
                "허용되지 않은 사용자입니다.",
                "해당 폴더에 접근할 수 없습니다.",
                () => navigate("/document")
            );
        }
    }, [isTokenValid, isTokenLoading]);
    

    

     useEffect(()=>{
        setSelectedFolder(null);
        setSelectedFile(null);
      },[])

    

    // 폴더 이름 변경 Mutation
    const renameFolderMutation = useMutation({
        mutationFn: async (newName) => {
            if (!newName) throw new Error('Folder name cannot be empty');
            await axiosInstance.put(`/api/drive/rename`, { 
                id: folderId,
                type: "folder",
                newName,
             });
        },
        onError: (error) => {
            console.error('Failed to rename folder:', error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['folderContents', folderId, user.uid]);
            setNewFolderName('');
            setEditing(false);
        },
    });


    // 이름 변경 핸들러
    const handleRename = () => {
        if (newFolderName.trim() && newFolderName !== location.state?.folderName) {
            renameFolderMutation.mutate(newFolderName);
        }
    };

    // 드래그 시작 핸들러
    const handleDragStart = (folder) => {
        console.log("handelDragStart ",folder)
        setDraggedFolder(folder); // 드래그된 폴더 저장
    }
     
     // 드래그 오버 핸들러 (드롭 가능 영역 활성화)
     const handleDragOver = (e) => {
        e.preventDefault(); // 기본 동작 방지
        e.currentTarget.classList.add('drag-over');

    };

    const handleDragLeave = (e) => {
        setIsDragging(false); // 드래그 중 상태 해제
        e.currentTarget.classList.remove('drag-over');
    };

    // 폴더 이동 Mutation
    const moveFolderMutation = useMutation({
        mutationFn: async ({ folderId, targetFolderId, newOrder,orderBefore,position,fileId }) => {
            const response = await axiosInstance.put(`/api/drive/move`, {
                folderId,
                targetFolderId,
                order: newOrder,
                currentOrder: orderBefore,
                position,
                fileId,
            });
            return response; // Axios response 반환
        },
        onSuccess: (response) => {
             // 서버의 응답 메시지를 확인
        if (response.status === 200) {
            console.log(response.data); // "Folder updated successfully"
            
            triggerAlert(
                "info",
                "이동 성공",
            );
            queryClient.invalidateQueries(['folderContents']);
        } else {
            alert("폴더 이동 실패: " + response.data);
        }
        },
        onError: (error) => {
            console.error('Failed to move folder:', error.message);
            alert('폴더 이동 실패!');
        },
        isLoading: (loading) => {
            // Show loading spinner
        },
    });

    

    const handleDrop = (targetFolder, position) => {
        console.log("handleDrop called with:", { targetFolder, position });
        console.log("포지션!!",position);
        console.log("draggedFile",draggedFile);
        // 유효성 검사
        if (!targetFolder || (!draggedFolder && !draggedFile)) {
            console.error("Invalid target ", targetFolder," dragged folder:", draggedFolder);
            return;
        }
          // Handle file drop
          if (draggedFile) {
            console.log("Dropping file into folder:", targetFolder.name);
            triggerAlert(
                "warning",
                "폴더 이동 확인",
                `${targetFolder.name} 폴더 안으로 이동하시겠습니까?`,
                () => {
                    console.log("Callback executed for moveFolderMutation",draggedFile.id);
                    moveFolderMutation.mutate({
                        targetFolderId: targetFolder.id,
                        newOrder: 0,
                        currentOrder: 0,
                        position,
                        fileId: draggedFile.id,
                    });
                },
                true,
            );
            return;
        }
        // 자기 자신 위로 드롭하는 경우 무시
        if (draggedFolder.id === targetFolder.id ) {
            console.warn("Cannot drop folder onto itself");
            return;
        }

         // 폴더 안으로 드롭했을 때
         if (position === "inside") {
            console.log("Position is inside");
            triggerAlert(
                "warning",
                "폴더 이동 확인",
                `${targetFolder.name} 폴더 안으로 이동하시겠습니까?`,
                () => {
                    console.log("Callback executed for moveFolderMutation");
                    moveFolderMutation.mutate({
                        folderId: draggedFolder.id ,
                        targetFolderId: targetFolder.id,
                        newOrder: 0,
                        currentOrder: 0,
                        position,
                    });
                },
                true,
            );
            return;
        } 

    
        // 타겟 폴더의 인덱스 찾기
        const targetIndex = subFolders.findIndex((folder) => folder.id === targetFolder.id);
        if (targetIndex === -1) {
            console.error("Target folder not found in subFolders:", targetFolder);
            return;
        }
    
        // 정렬 계산
        let orderBefore = 0;
        let orderAfter = 0;
    
        if (position === "before") {
            // 타겟 폴더 이전 폴더와 타겟 폴더 사이의 값 계산
            if (targetIndex > 0) {
                orderBefore = subFolders[targetIndex - 1]?.order || 0;
            }
            orderAfter = subFolders[targetIndex]?.order || (orderBefore + 1);
        } else if (position === "after") {
            // 타겟 폴더와 타겟 폴더 이후의 폴더 사이의 값 계산
            orderBefore = subFolders[targetIndex]?.order || 0;
            if (targetIndex < subFolders.length - 1) {
                orderAfter = subFolders[targetIndex + 1]?.order || (orderBefore + 1);
            } else {
                orderAfter = orderBefore + 1; // 마지막 위치로 추가
            }
        }
    
        // 새로운 order 값 계산
        const newOrder = (orderBefore + orderAfter) / 2.0;
        console.log("orderBefore {} ",orderBefore," orderAfter ",orderAfter);
    
        console.log("Calculated order values:", { orderBefore, orderAfter, newOrder });
    
        // 폴더 이동 Mutation 호출
        moveFolderMutation.mutate({
            folderId: draggedFolder.id,
            targetFolderId: targetFolder.id,
            newOrder,
            currentOrder: draggedFolder.order,
            position,
        });
    
        // 드래그 상태 초기화
        setDraggedFolder(null);
        e.currentTarget.classList.remove('drag-over');

    };

   

    //선택 삭제

    const [selectedItems, setSelectedItems] = useState({
        folders: [],
        files: [],
      });
    const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false); // 삭제 진행 중 상태
   
    
    // 선택 토글 함수
    const toggleSelectItem = (e,item) => {
        const isFolder = item.type === "folder";
        const itemId = item.id;
         setSelectedItems((prev) => {
    const updatedItems = { ...prev };
    if (e.target.checked) {
      // 체크박스 선택
      if (isFolder) {
        updatedItems.folders.push(itemId);
      } else {
        updatedItems.files.push(itemId);
      }
    } else {
      // 체크박스 선택 해제
      if (isFolder) {
        updatedItems.folders = updatedItems.folders.filter((id) => id !== itemId);
      } else {
        updatedItems.files = updatedItems.files.filter((id) => id !== itemId);
      }
    }
    return updatedItems;
  });
    };
    
    // 전체 선택/해제
    const toggleSelectAll = () => {
        const allFolders = subFolders.map((folder) => folder.id);
        const allFiles = files.map((file) => file.id);
      
        setSelectedItems((prev) => {
          const isAllSelected =
            prev.folders.length === allFolders.length &&
            prev.files.length === allFiles.length;
      
          return isAllSelected
            ? { folders: [], files: [] } // 전체 해제
            : { folders: allFolders, files: allFiles }; // 전체 선택
        });
      };


    const confirmDelete = async () => {
        setIsDeleting(true); // 진행 상태 시작
        try {
          const response = await axiosInstance.delete("/api/drive/selected/delete",             
            {data: selectedItems}, // 직접 전달
          );
      
          if (response.status === 200) {
            queryClient.invalidateQueries(["folderContents"]);
            setSelectedItems([]); // 선택 상태 초기화
          } else {
            console.log("삭제에 실패했습니다.");
          }
        } catch (error) {
          console.error("삭제 중 오류:", error);
        } finally {
            setIsDeleting(false); // 진행 상태 종료
            setIsDeleteAlertVisible(false);
        }
      };
      
      const cancelDelete = () => {
        setIsDeleteAlertVisible(false);
      };




    //즐겨찾기
    const [folders, setFolders] = useState([]); // 폴더 데이터 관리
    const [favoritfiles , setFiles] = useState([]);

    
    
    // Folder Context Menu State
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        position: { top: 0, left: 0 },
        folder: null,
    });

    // File Context Menu State
    const [contextFileMenu, setContextFileMenu] = useState({
        visible: false,
        position: { top: 0, left: 0 },
        file: null,
    });

// Close Handlers
const contextMenuRef = useRef(null); // 메뉴 DOM 참조
const contextFileMenuRef = useRef(null); // 메뉴 DOM 참조

const handleCloseMenu = () => {
    setContextMenu({ visible: false, position: { top: 0, left: 0 }, folder: null });
};
const handleCloseFileMenu = () => {
    setContextFileMenu({ visible: false, position: { top: 0, left: 0 }, file: null })
};


    const handleContextMenu = (e, folder) => {
        e.preventDefault(); // 기본 컨텍스트 메뉴 방지

         // 화면 크기 가져오기
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const menuWidth = 400; // 예상 메뉴 너비
        const menuHeight = 150; // 예상 메뉴 높이

        // 화면 경계를 초과하지 않도록 위치 조정
        const adjustedX = clientX + menuWidth > innerWidth ? innerWidth - menuWidth : clientX;
        const adjustedY = clientY + menuHeight > innerHeight ? innerHeight - menuHeight : clientY;

    // ContextMenu 상태 업데이트
        setContextMenu({
            visible: true,
            position: { top: adjustedY, left: adjustedX },
            folder,
            folderId : folder.id,
            isPinned : folder.isPinned,
            folderName: folder.name,
            path: folder.path,
        });
    };

    const handleContextFileMenu = (e, file) => {
        e.preventDefault(); // 기본 컨텍스트 메뉴 방지
        setContextFileMenu({
            visible: true,
            position: { top: e.clientY, left: e.clientX },
            file,
            fileId : file.id,
            fileName: file.name,
            path: file.path,
        });
    };


    
    


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleRename();
        }
    };

    //파일 다운로드 핸들러
    const downloadHandler = (file) => {
        if (!file || !file.id) {
            console.error('Invalid file:', file);
            return;
        }
        const downloadUrl = `${fileServerBaseUrl}${file.path}`;
    
        // 다운로드 요청
       /*  window.open(downloadUrl, file.savedName); */
        // 가상의 크 생성
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', file.originalName); // 원본 파일명으로 다운로드
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    };

    //폴더 zip 다운로드 핸들러
    const zipDownloadHandler = async (folder) => {
        console.log('Selected folder for zip download:', folder); // Debugging log
        const id = contextMenu.folderId;
        
        try {
            const response = await axiosInstance.get(`/api/drive/generateZip/${id}`);
    
            if (response.status === 200) {
                console.log('zip 파일 생성 성공');
                const zipName = response.data.zipName;
                const downloadUrl = `${fileServerBaseUrl}uploads/zip/${zipName}`;
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', folder.name); // 원본 파일명으로 다운로드
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('zip 파일 생성 실패:', response.data);
            }
        } catch (error) {
            console.error('zip 파일 생성 업데이트 중 오류 발생:', error);
        }
    }

    //폴더 삭제
    const [isDeleteAlert, setIsDeleteAlertOpen] = useState(false);

    const handleDelete = () => {
        setIsDeleteAlertOpen(true); // CustomAlert 표시
        handleCloseMenu(); // ContextMenu 닫기
    };

    const handleCancel = () => {
        setIsDeleteAlertOpen(false);
    };

    const handleDeleteConfirm = async() => {
        try {
            const response = await axiosInstance.delete(`/api/drive/folder/delete/${contextMenu.folderId}`,
                { params: { path: contextMenu.path } }
            );
            if (response.status === 200) {
                queryClient.invalidateQueries(['folderContents']);
                alert('휴지통으로 이동 성공');
            }
        } catch (error) {
            console.error('폴더 삭제 중 오류 발생:', error);
        } finally {
            setIsDeleteAlertOpen(false);
        }
    };


  

    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isShareModalOpen,setIsShareModalOpen] = useState(false);


   


    useEffect(() => {
        console.log("isDeleteAlert 상태 변경:", isDeleteAlert);
    }, [isDeleteAlert]);

    const [isDragging, setIsDragging] = useState(false); // 드래그 중인지 상태 관리
    const [isUploading,setIsUploading] = useState(false);
    const storageInfo = useStorageStore((state) => state.storageInfo) || { currentRemainingSize: 0, totalSize: 0 };

    const [uploadProgress, setUploadProgress] = useState(null); // 업로드 진행 상황 상태
    const [isUploadInProgress, setIsUploadInProgress] = useState(false);
    const handleUploadStart = () => {
      setIsUploadInProgress(true);
      setUploadProgress(0); // 초기화
    };
  
    const handleUploadComplete = () => {
      setIsUploadInProgress(false);
      setUploadProgress(null); // 초기화
  
    };

    const handleFolderDragOver = (e) => {
        e.preventDefault(); // 기본 동작 방지
        e.currentTarget.classList.add("drag-over"); // 시각적 피드백
    };

    const handleFileDrop = async (targetFolder) => {
        if (!draggedFile) {
            console.error("드래그된 파일이 없습니다.");
            return;
        }
    
        try {
            // 서버 API 호출
            const response = await axiosInstance.put(`/api/drive/file/move`, {
                fileId: draggedFile.id,
                targetFolderId: targetFolder.id,
            });
    
            if (response.status === 200) {
                console.log("파일 이동 성공");
                queryClient.invalidateQueries(["folderContents"]); // 데이터 새로고침
            } else {
                console.error("파일 이동 실패:", response.data);
            }
        } catch (error) {
            console.error("파일 이동 중 오류:", error);
        } finally {
            setDraggedFile(null); // 상태 초기화
        }
    };

 
   // 파일 업로드 Mutation
   const uploadFileMutation = useMutation({
    mutationFn: async (files) => {
      const totalFileSize = files.reduce((total, file) => total + file.size, 0);
      if (totalFileSize > storageInfo.currentRemainingSize) {
        throw new Error(`남은 용량(${storageInfo.currentRemainingSize} bytes)보다 큰 파일은 업로드할 수 없습니다.`);
      }
  
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
  
      formData.append('fileMaxOrder', fileMaxOrder);
      formData.append('folderMaxOrder', folderMaxOrder);
      formData.append('uid', user.uid);
  
      console.log('FormData before sending:', formData);
  
      return axiosInstance.post(`/api/drive/upload/${folderId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total > 0) {
            const percentCompleted = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(percentCompleted); // 진행률 업데이트
          } else {
            console.warn('총 파일 크기를 알 수 없습니다.');
            setUploadProgress(0);
          }
        },
      });
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries(['folderContents']);
      triggerAlert('success', '업로드 성공', `${variables.length}개의 파일이 성공적으로 업로드되었습니다.`);
      console.log('업로드 성공:', response.data);
    },
    onError: (error) => {
      const errorMessage = error.response?.data || '파일 업로드 중 오류가 발생했습니다. 다시 시도해주세요.';
      const errorType = error.response?.status === 400 ? 'warning' : 'error';
      triggerAlert(errorType, '업로드 실패', errorMessage);
    },
    onSettled: () => {
      setIsUploading(false); // 업로드 상태 초기화
    },
  });
  
    const handleDropDragOver = (e) => {
        e.preventDefault(); // 기본 동작 방지
        setIsDragging(true); // 드래그 중 상태로 설정
    };


    const handleD_Drop = (e) => {
        e.preventDefault(); // 기본 동작 방지
        setIsDragging(false); // 드래그 상태 해제
      
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
          setIsUploading(true); // 업로드 상태 설정
          uploadFileMutation.mutate(files); // Mutation 호출
        }
    };

    const subFolders = (data?.subFolders || [])
    .map((folder) => ({
        ...folder,
        type: 'folder',
        order: folder.order || 0, // 기본값 설정
    }))
    .sort((a, b) => (a.order || 0) - (b.order || 0)); // order 기준 정렬
   
    const linkToken = selectedFolder?.sharedToken || selectedFile?.sharedToken || parentFolder?.sharedToken || null;
    const isLinkTokenAvailable = !!linkToken; // true if token exists, false otherwise

    
    const files = (data?.files || [])
    .map((file) => ({
        ...file,
        type: 'file', // 파일 타입 추가
    }));

    const folderMaxOrder = subFolders.length;
    const fileMaxOrder = files.length;

    
  


    
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading folder contents.</div>;

    return (
        <DocumentLayout isDetailVisible={isDetailVisible} selectedFolder={selectedFolder} selectedFile={selectedFile} path={location.pathname} parentfolder={location.state?.folderName} shared={selectedFolder?.sharedUsers || selectedFile?.shareDepts }  uid={data.uid} closeDetailView={closeDetailView}>
    
           <div   
                className={`document-list-container ${isDragging ? 'dragging' : ''}`}
                onDrop={handleD_Drop} // 파일 드롭 이벤트
                style={{
                    border: isDragging ? '2px dashed #0066cc' : 'none',
                    backgroundColor: isDragging ? '#f0f8ff' : 'transparent',
                }}>
            <section className="flex gap-4 items-center justify-between">
            {editing ? (
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                className="w-full px-4 py-2 text-xl font-medium bg-gray-50 
                                         border-2 border-[#7e7edf]-100 rounded-lg outline-none
                                         transition-all duration-200 focus:border-blue-400
                                         focus:bg-white"
                                value={newFolderName}
                                placeholder={parentFolder?.name}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                onBlur={handleRename}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleRename}
                                className="inline-flex items-center px-3 py-2 text-sm 
                                         bg-[#7e7edf] text-white rounded-lg hover:bg-purple-600
                                         transition-colors duration-200"
                            >
                                <Check className="w-4 h-4 mr-1" />
                                확인
                            </button>
                            <button
                                onClick={() => {
                                    setEditing(false);
                                    setNewFolderName(parentFolder?.name || '');
                                }}
                                className="inline-flex items-center px-3 py-2 text-sm
                                         bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200
                                         transition-colors duration-200"
                            >
                                <X className="w-4 h-4 mr-1" />
                                취소
                            </button>
                        </div>
                    </div>
                    ) : (
                        <>
                            <div className='flex items-center gap-4 ml-[25px]'>
                            <span className="text-[25px]">{ parentFolder.name}</span>
                            <img
                                className="w-6  h-6 cursor-pointer"
                                src="/images/document-pen.png"
                                alt="Rename"
                                onClick={() => setEditing(true)}
                            />
                             {user.uid !== parentFolder?.ownerId && (<>
                                <span>소유자 : {parentFolder?.ownerId} </span>
                            </>)}
                            </div>

                        </>
                    )}
                    <div>
                    <ShareMember
                         listName="작업자"
                         isShareOpen={isModalOpen}
                         setIsShareOpen={setIsModalOpen}
                         members={parentFolder?.sharedUsers}
                    >
                        <DriveShareModal
                            isModalOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                            selectedFolder={selectedFolder}
                            selectedFile={selectedFile}
                            company={user.company}
                            user={user}
                            ownerId={parentFolder?.ownerId || selectedFolder?.ownerId || selectedFile?.ownerId}
                            id={selectedFolder?.id || parentFolder?.id}
                            type={selectedFolder?.type || selectedFile?.type || "folder"}
                            name={selectedFolder?.name || parentFolder?.name} // 선택된 폴더나 파일 이름 전달
                            sharedMember = {selectedFolder?.sharedUser || selectedFile?.sharedUser || parentFolder?.sharedUsers}
                            sharedDept = {selectedFolder?.sharedDept || selectedFile?.sharedDept || parentFolder?.shareDepts}
                            linkToken={linkToken} // 토큰 전달
                            isLinkTokenAvailable={isLinkTokenAvailable}
                            >
                        </DriveShareModal>
                    </ShareMember>
                    </div>
                    
                
                </section>
                
            <section className="flex justify-between mt-[22px] mb-6">
                <div className="flex gap-4 mx-[15px] w-[98%] items-center">
                    <CustomSearch width1="20" width2="80" />
                    <p className="ml-4">View :</p>
                    <button
                            className={`list ${viewType === 'list' ? 'active' : ''}`} // Add active class for styling
                            onClick={() => setViewType('list')}> 
                            <img className={`list ${viewType === 'list' ? 'active' : ''}`} src='/images/document-note.png'
                                  style={{
                                    filter: viewType === 'list' 
                                        ? 'invert(29%) sepia(96%) saturate(748%) hue-rotate(180deg) brightness(89%) contrast(101%)' 
                                        : 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(0%)', // 블랙 필터
                                }}
                            ></img>

                            </button>
                        <button
                            className={`box ${viewType === 'box' ? 'active' : ''}`} // Add active class for styling
                            onClick={() => setViewType('box')}>                       
                            <img className={`list ${viewType === 'list' ? 'active' : ''}`} 
                                 style={{
                                    filter: viewType === 'box'
                                        ? 'invert(29%) sepia(96%) saturate(748%) hue-rotate(180deg) brightness(89%) contrast(101%)'
                                        : 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(0%)', // 블랙 필��
                                }}
                                src='/images/document-menu.png' />
                            </button>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFolder(true)}
                        className="bg-purple white w-20 h-8 rounded-md text-xs"
                    >
                        폴더 생성
                    </button>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-purple white w-20 h-8 rounded-md text-xs"
                    >
                        업로드
                    </button>
                   
                </div>
            </section>
          

            {viewType === 'box' ? (
                <div className='h-[600px] mx-[30px] w-[97%] overflow-scroll scrollbar-none'>
                   {subFolders?.length === 0 || subFolders === null ? (
                       <div></div>
                        ) : (
                        <>
                            <div className='sticky pb-[5px] h-[26px] my-[10px] text-[15px] top-0 z-10 bg-white'>폴더</div>
                            <section className="flex items-center flex-wrap relative">
                            {subFolders.map((folder) => (
                                <DocumentCard1
                                key={folder.id}
                                folder={folder}
                                folderId={folder.id}
                                folderName={folder.name}
                                setSelectedFolder={setSelectedFolder}
                                path={folder.path}
                                cnt={folder.cnt}
                                updatedAt={folder.updatedAt}
                                isFavorite={folder.isPinned}
                                setIsFavorite={setIsFavorite}
                                onDragStart={handleDragStart}
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onDragLeave={handleDragLeave}
                                onContextMenu={handleContextMenu}
                                downloadHandler={zipDownloadHandler} // 수정: folder 객체 전달
                                onClick={() => {
                                    console.log('Selected folder:', folder);
                                    setSelectedFolder(folder);
                                }}
                                />
                            ))}
                            </section>
                        </>
                    )}
                   {files?.length ===0 || files===null? (
                                            <div></div>

                    )
                   :(<>
                         <div className='text-[15px] my-[20px]'>file</div>
                            <section className="inline-block ">
                                {files.map((file) => (
                                    <DocumentCard2                                 
                                        onContextMenu={handleContextFileMenu}
                                        key={file.id} 
                                        file={file} 
                                        fileName={file.originalName} 
                                        path={file.path} 
                                        savedName={file.savedName}
                                        setSelectedFile={setSelectedFile}
                                        downloadHandler={() => downloadHandler(file)}
                                        onDragStart={() => handleFileDragStart(file)} // 드래그 시작 핸들러
                                        />
                                ))}
                            </section>
                   </>)}
                   
                </div>
            ) : (<>
                <div  className="h-[570px] overflow-scroll scrollbar-none">
                    <table className="docList mx-[20px] w-[98%]">
                    <thead className="h-[48px] bg-[#F2F4F8] sticky top-0 z-10">
                        <tr className='text-left'>
                            <th className='pl-[20px]'>
                            <input
                                type="checkbox"
                                onChange={toggleSelectAll}
                                checked={
                                  subFolders.length > 0 &&
                                  files.length > 0 &&
                                  selectedItems.folders.length === subFolders.length &&
                                  selectedItems.files.length === files.length
                                }                           
                                />
                            </th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Size</th>
                            <th>Owner</th>
                            <th>Last Modified</th>
                        </tr>
                    </thead>
                    <tbody >
                    {[...subFolders, ...files].map((item) => {
                        console.log("아이템!!",item);
                        const isFolder = item.type === "folder"; // Assume `type` differentiates folder/file
                        return (
                        <tr 
                            key={item.id}
                            draggable
                            onDragStart={() => handleDragStart(item)} // 드래그 시작 핸들러
                            onDragOver={(e) => handleDragOver(e)} // 드래그 오버 핸들러
                            onDrop={(e) => handleDrop(item, "before")} // 드롭 시 동작 (리스트에서는 기본적으로 "before")
                            className="draggable-row text-left"
                            onContextMenu={(e) =>
                                isFolder ? handleContextMenu(e, item) : handleContextFileMenu(e, item)
                              } // Wrap in a function                           
                        >
                            <td  className='pl-[20px]'>
                            <input
                                type="checkbox"
                                checked={
                                    item.type === "folder"
                                      ? selectedItems.folders.includes(item.id)
                                      : selectedItems.files.includes(item.id)
                                  }
                                  onChange={(e) => toggleSelectItem(e, item)}
                                />
                            </td>
                            <td className='text-left'>
                            {isFolder ? (
                                <Link to={`/document/list/${item.id}`} state={{ folderName: item.name }}>
                                📁 {item.name} {/* Add a folder icon */}
                                </Link>
                            ) : (
                                <span>
                                📄 {item.originalName} {/* Add a file icon */}
                                </span>
                            )}
                            </td>
                            <td>{isFolder ? "Folder" : "File"}</td>
                            <td>{item.size || "-"}</td>
                            <td>{item.ownerId}</td>
                            <td  className='w-[2
                            00px]'>{item.updatedAt || "Unknown"}</td>
                        </tr>
                        );
                    })}
                                        
                </tbody>
                </table>
                
                </div>
                <button onClick={()=> setIsDeleteAlertVisible(true)}>선택삭제</button>
                </>

            )}
           </div>
            

            <FileUploads isOpen={isOpen} onClose={() => setIsOpen(false)} folderId={folderId} fileMaxOrder={fileMaxOrder} folderMaxOrder={folderMaxOrder} uid={user.uid} triggerAlert={triggerAlert} />
            <NewFolder isOpen={folder} onClose={() => setFolder(false)} parentId={folderId} user={user}    maxOrder={subFolders.length} triggerAlert={triggerAlert}
            />
             {/* ContextMenu 컴포넌트 */}
             <ContextMenu
                    parentId={parentFolder.id}
                    visible={contextMenu.visible}
                    position={contextMenu.position}
                    onClose={handleCloseMenu}
                    folder={contextMenu.folder}
                    isPinned={contextMenu.isPinned}
                    folderName={contextMenu.folderName}
                    folderId={contextMenu.folderId}
                    path={contextMenu.path}
                    onShare={handleShare}
                    onDetailToggle={() => handleDetailToggle(contextMenu.folder)} // 상세 정보 토글 함수 전달
                    downloadHandler={() => zipDownloadHandler(contextMenu.folder)}
                    selectedFolder = {setSelectedFolder}
                    triggerAlert={triggerAlert}
                />
              <ContextFileMenu
                    parentId={parentFolder.id}
                    visible={contextFileMenu.visible}
                    position={contextFileMenu.position}
                    onClose={handleCloseFileMenu}
                    isPinned={contextFileMenu.file?.isPinned}
                    file={contextFileMenu.file}
                    fileName={contextFileMenu.file?.name} // Use optional chaining to avoid errors
                    fileId={contextFileMenu.file?.id}
                    path={contextFileMenu.file?.path}
                    onDetailToggle={() => handleDetailFileToggle(contextFileMenu.file)}
                    downloadHandler={downloadHandler}
                    triggerAlert={triggerAlert}

                />

        
                  {alert.isVisible  && (
                    <CustomAlert
                        type={alert.type}
                        title={alert.title}
                        message={alert.message}
                        confirmText="확인"
                        onConfirm={alert.onConfirm || closeAlert}
                        showCancel={alert.showCancel || false}
                        onCancel={alert.onCancel || closeAlert}
                    />
                    )}
                    {isDeleteAlert  && (
                                
                        <CustomAlert
                            type="warning" // success, error, warning, info 중 선택
                            title="확인"
                            message="폴더를 삭제하시겠습니까?"
                            subMessage="해당 폴더 삭제시 폴더 안의 파일 까지 삭제됩니다."
                            onConfirm={handleDeleteConfirm} // 확인 버튼 클릭 핸들러
                            onCancel={handleCancel} // 취소 버튼 클릭 핸들러
                            confirmText="예"
                            cancelText="아니오"
                            showCancel={true} // 취소 버튼 표시 여부
                        />
                    )}
                    {isDeleteAlertVisible && (
                        <CustomAlert
                            type="warning" // success, error, warning, info 중 선택
                            title="삭제 확인"
                            message={`총 ${selectedItems.folders.length+selectedItems.files.length}개의 항목을 삭제하시겠습니까?`}
                            subMessage="삭제된 항목은 복구할 수 없습니다."
                            onConfirm={confirmDelete} // 확인 버튼 클릭 시 실행
                            onCancel={cancelDelete} // 취소 버튼 클릭 시 실행
                            confirmText="삭제"
                            cancelText="취소"
                            showCancel={true} // 취소 버튼 표시
                        />
                        )}

                {isDeleting && (
                    <Modal>
                        <div className="deleting-modal">
                            <p>삭제 진행 중입니다...</p>
                            <p>완료될 때까지 기다려주세요.</p>
                        </div>
                    </Modal>
                )}
                    <DriveShareModal
                            isModalOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                            selectedFolder={selectedFolder}
                            selectedFile={selectedFile}
                            company={user.company}
                            user={user}
                            ownerId={parentFolder?.ownerId || selectedFolder?.ownerId || selectedFile?.ownerId}
                            id={selectedFolder?.id || parentFolder?.id || selectedFile?.id }
                            type={selectedFolder?.type || selectedFile?.type || "folder"}
                            name={selectedFolder?.name || parentFolder?.name} // 선택된 폴더나 파일 이름 전달
                            sharedMember = {selectedFolder?.sharedUser || selectedFile?.sharedUser || parentFolder?.sharedUsers}
                            sharedDept = {selectedFolder?.sharedDept || selectedFile?.sharedDept || parentFolder?.shareDepts}
                            linkToken={linkToken} // 토큰 전달
                            isLinkTokenAvailable={isLinkTokenAvailable}
                            >
                        </DriveShareModal>


                   
        </DocumentLayout>
    );
}
