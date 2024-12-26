import { create } from "zustand";
import axiosInstance from "@/services/axios.jsx";

export const useDriveSettingsStore = create((set) => ({
  notifications: {
    fileUpdates: true,
    shareNotifications: true,
    commentNotifications: true,
    storageAlerts: true,
  },
  updateNotification: async (setting, value) => {
    try {
      // 백엔드에 상태 업데이트 요청
      await axiosInstance.post("/api/drive/settings/update", {
        setting,
        value,
      });

      // 상태 업데이트
      set((state) => ({
        notifications: {
          ...state.notifications,
          [setting]: value,
        },
      }));
    } catch (error) {
      console.error("Failed to update notification setting:", error);
    }
  },
  fetchSettings: async () => {
    try {
      // 초기 설정값을 백엔드에서 가져오기
      const response = await axiosInstance.get("/api/drive/settings");
      const backendSettings = response.data;

      // 백엔드 변수 이름을 프론트엔드 이름으로 변환
      const transformedSettings = {
        fileUpdates: backendSettings.drive_updates,
        shareNotifications: backendSettings.share_notifications,
        storageAlerts: backendSettings.storage_alerts,
      };

      // 상태 초기화
      set(() => ({
        notifications: transformedSettings,
      }));
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  },
}));
