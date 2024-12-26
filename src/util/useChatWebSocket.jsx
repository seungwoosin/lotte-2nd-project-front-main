// /* eslint-disable react-hooks/exhaustive-deps */
import { Client } from "@stomp/stompjs";
import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "../services/axios";

const useChatWebSocket = ({
  initialMembers,
  initialUserId,
  selectedRoomId,
  setMessageList,
  setUnreadCount,
  chatContainerRef,
  shouldScrollToBottomRef,
  uid,
  markAsRead,
}) => {
  const [members, setMembers] = useState(initialMembers || []);
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState(initialUserId);
  const subscriptionRef = useRef(null);
  const clientRef = useRef(null); // STOMP 클라이언트를 저장하는 ref

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const wsUrl = "ws://" + apiBaseUrl.replace("http://", "") + "/ws-chat";

  const [stompClient, setStompClient] = useState(null);

  const getWebSocketHeaders = async () => {
    const accessToken = axiosInstance.defaults.headers.Authorization;
    return {
      Authorization: accessToken || "",
    };
  };

  // markAsRead를 useRef로 관리하여 의존성 배열에서 제외
  const markAsReadRef = useRef(markAsRead);

  useEffect(() => {
    markAsReadRef.current = markAsRead;
  }, [markAsRead]);

  const initializeStompClient = useCallback(async () => {
    const headers = await getWebSocketHeaders();
    const client = new Client({
      brokerURL: wsUrl,
      connectHeaders: headers,
      debug: function (str) {
        console.log(`[STOMP DEBUG]: ${str}`);
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        updateSubscriptions(client);
      },
      onStompError: (frame) => {
        console.log("STOMP Error:", frame);
      },
    });
    setStompClient(client);
  }, [wsUrl]);

  const updateSubscriptions = useCallback(
    (client) => {
      if (selectedRoomId) {
        console.log("챗웹소켓 : ", selectedRoomId);

        // 기존 구독이 존재하면 해제
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
          console.log("기존 구독 해제");
        }
        // 새로운 구독 설정
        subscriptionRef.current = client.subscribe(
          `/topic/chat/${selectedRoomId}`,
          (message) => {
            try {
              const response = JSON.parse(message.body);
              setMessageList((prev) => [...prev, response]);
              shouldScrollToBottomRef.current = true;
              // 현재 채팅방에 있을 때만 markAsRead 호출
              if (selectedRoomId === response.roomId) {
                markAsReadRef.current();
                console.log("markAsRead 호출");
              }
            } catch (error) {
              console.error("Failed to parse message:", error);
            }
          }
        );
        console.log("현재 구독 설정:", subscriptionRef.current);
      }
    },
    [selectedRoomId, setMessageList, shouldScrollToBottomRef]
  );

  // STOMP 클라이언트 초기화 및 활성화
  useEffect(() => {
    if (uid) {
      // uid가 존재할 때만 클라이언트 초기화
      if (!stompClient) {
        initializeStompClient();
      } else if (!clientRef.current || !clientRef.current.active) {
        stompClient.activate();
      }
    }

    return () => {
      if (stompClient) {
        stompClient.deactivate();
        setStompClient(null);
        setIsConnected(false);
        console.log("WebSocket 클라이언트 비활성화");
      }
    };
  }, [stompClient, initializeStompClient, uid]);

  // 채팅방이 변경될 때 구독 업데이트
  useEffect(() => {
    if (stompClient && isConnected) {
      updateSubscriptions(stompClient);
    }
  }, [selectedRoomId, isConnected, stompClient, updateSubscriptions]);

  // 로그아웃 시 STOMP 클라이언트 비활성화
  useEffect(() => {
    if (!uid && stompClient) {
      if (subscriptionRef.current) {
        markAsReadRef.current();
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
        console.log("로그아웃 시 구독 해제");
      }
      stompClient.deactivate();
      setStompClient(null);
      setIsConnected(false);
      console.log("로그아웃 시 WebSocket 클라이언트 비활성화");
    }
  }, [uid, stompClient]);

  const sendWebSocketMessage = useCallback(
    (message, path) => {
      if (isConnected && stompClient) {
        stompClient.publish({
          destination: path,
          body: JSON.stringify(message),
        });
      } else {
        console.error("WebSocket is not connected");
      }
    },
    [stompClient, isConnected]
  );

  const updateMembers = (newIds) => {
    setMembers(newIds);
  };

  const updateUserId = (newId) => {
    setUserId(newId);
  };

  return {
    stompClient,
    setMembers,
    members,
    isConnected,
    sendWebSocketMessage,
    updateMembers,
    updateUserId,
    initializeStompClient,
    updateSubscriptions,
  };
};

export default useChatWebSocket;
