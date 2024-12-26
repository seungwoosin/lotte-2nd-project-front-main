import React, { useEffect, useState } from "react";
import DocumentAside from "../../components/document/DocumentAside";
import { useAuthStore } from "../../store/useAuthStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../services/axios";
import { useLinkClickHandler, useLocation, useNavigate } from "react-router-dom";
import { CustomSVG } from "@/components/project/_CustomSVG";
import ErrorBoundary from "@/services/ErrorBoundary";
import FileDetails from "../../components/document/FileDetails";
import FolderDetails from "../../components/document/FolderDetails";
import { useDriveSettingsStore } from '@/store/useDriveStore';


export default function DocumentLayout({children, isDetailVisible , selectedFolder, selectedFile, shared ,parentfolder, path, uid ,closeDetailView ,sharedUsers, storageInfo}){

    const { notifications } = useDriveSettingsStore();

    const navigate = useNavigate();

    const enhancedChildren = React.Children.map(children, (child) => {
        // React 요소인지 확인 후 클론
        return React.isValidElement(child)
          ? React.cloneElement(child, {
              notifications, // 전달할 props
            })
          : child; // 유효하지 않은 경우 그대로 반환
      });


    // 액세스 권한 메시지 결정 함수
  const getAccessMessage = () => {
    if (!selectedFolder) return null;

    if (selectedFolder.isShared === 0 && selectedFolder.ownerId === uid) {
      return "나(비공개)";
    }

    if (selectedFolder.isShared === 1 && selectedFolder.ownerId !== uid) {
      return "항목의 공유 정보를 볼 권한이 없습니다.";
    }

    if (selectedFolder.isShared === 1 && selectedFolder.ownerId === uid) {
      return "나, 홍합";
    }

    return null;
  };

  const linkHandler = (selectedFolder) => {
    if (!selectedFolder || !selectedFolder.path) {
        console.error("selectedFolder 또는 path가 유효하지 않습니다.");
        return;
    }

    const pathParts = selectedFolder.path.split('/');
    console.log("여기", pathParts);

    // 조건에 따라 'mydrive' 또는 다른 경로로 설정
    if (pathParts[2] === uid && pathParts.length === 4) {
        // 'mydrive' 조건에 해당하면 /document로 이동
        console.log("mydrive 조건 만족");
        navigate('/document');
    } else {
        // 그 외의 경우 parentId를 기준으로 이동
        const lastFolderName = pathParts[pathParts.length - 2]; 
        console.log("parentId 경로로 이동");
        navigate(`/document/list/${selectedFolder.parentId}`,{
            state:{
                folderName: lastFolderName
            }
        });
    }
};

    return (<>
        <div id='document-container1'>
            <ErrorBoundary>
            <DocumentAside/>

            <section  className={`document-main1 ${isDetailVisible ? 'reduced' : ''}`}>
                    {enhancedChildren}
            </section>
            {isDetailVisible && (
                    <section className="document-detail border border-color-[#ddd]">
                        {selectedFolder && !selectedFile && (
                            <FolderDetails
                                folder={selectedFolder}
                                folderName={selectedFolder.name}
                                parentfolder = {parentfolder}
                                uid={uid}
                                closeDetailView={closeDetailView}
                                shared={shared}
                                navigate={navigate}
                            />
                        )}
                        {selectedFile && !selectedFolder && (
                            <FileDetails
                                file={selectedFile}
                                folder={parentfolder}
                                path={path}
                                uid={uid}
                                closeDetailView={closeDetailView}
                            />
                        )}
                    </section>
                )}
                            </ErrorBoundary>

        </div>
    </>);
}