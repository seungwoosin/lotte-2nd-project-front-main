import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DocumentLayout from '@/layout/document/DocumentLayout';
import { useDriveSettingsStore } from '../../store/useDriveStore';
import { HardDrive, Share } from 'lucide-react';
import { FaGoogleDrive } from 'react-icons/fa';

const DriveSettings = () => {
  
  const { notifications, updateNotification, fetchSettings } = useDriveSettingsStore();
  useEffect(() => {
    // 백엔드에서 초기 설정값을 가져옴
    fetchSettings();
  }, [fetchSettings]);

  const handleNotificationChange = (setting) => {
    updateNotification(setting, !notifications[setting]); // 상태 및 백엔드 동기화
  };

  return (
    <DocumentLayout>
                                 

      <div className="p-6  mx-auto">
        <h1 className="text-2xl font-bold mb-6">드라이브 설정</h1>

        <div className="bg-white shadow-md rounded-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">알림 설정</h2>
          <div className="space-y-6">
            {/* 파일 업데이트 알림 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium">파일 업데이트 알림</p>
                <p className="text-sm text-gray-500">
                  공유된 파일이 업데이트될 때 알림을 받습니다.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications.fileUpdates}
                  onChange={() => handleNotificationChange('fileUpdates')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            {/* 공유 알림 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium">공유 알림</p>
                <p className="text-sm text-gray-500">
                  새로운 파일이나 폴더가 공유될 때 알림을 받습니다.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications.shareNotifications}
                  onChange={() => handleNotificationChange('shareNotifications')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

    
            {/* 저장소 용량 알림 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium">저장소 용량 알림</p>
                <p className="text-sm text-gray-500">
                  저장소 용량이 90% 이상 찼을 때 알림을 받습니다.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications.storageAlerts}
                  onChange={() => handleNotificationChange('storageAlerts')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </DocumentLayout>
  );
};

export default DriveSettings;
