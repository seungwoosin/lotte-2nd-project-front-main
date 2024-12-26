import { useState } from "react";
import CustomAlert from "../Alert";
import useOnClickOutSide from "./useOnClickOutSide";
import axiosInstance from "../../services/axios";

/* eslint-disable react/prop-types */
export default function InviteModal_chatRoomName2({
  chatRoomNameRef2,
  changeRoomNameHandler,
  selectedRoomId,
  setRoomName,
  roomName,
  roomInfo,
  setRoomInfo,
  setRoomData,
  setIsRoomNameAlertOpen,
}) {
  const valueHandler = (e) => {
    e.preventDefault();
    setRoomName(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (roomName.trim() === "" || roomName.trim() === roomInfo.chatRoomName) {
      alert("유효한 이름이 아닙니다.");
      return;
    }
    try {
      const data = {
        chatRoomName: roomName,
        id: selectedRoomId,
      };
      await axiosInstance.patch("/api/message/roomName", data).then((resp) => {
        console.log(resp.data);

        setRoomInfo((prevRoomInfo) => ({
          ...prevRoomInfo,
          chatRoomName: resp.data,
        }));

        setRoomData((prevRoomData) =>
          prevRoomData.map((room) =>
            room.id === selectedRoomId
              ? { ...room, chatRoomName: roomName }
              : room
          )
        );
        setRoomName("");
      });
    } catch (error) {
      console.error(error);
    }
    setIsRoomNameAlertOpen(true);
    setTimeout(() => {
      setIsRoomNameAlertOpen(false);
      changeRoomNameHandler();
    }, 1500);
  };

  useOnClickOutSide(chatRoomNameRef2, changeRoomNameHandler);

  return (
    <div className="chatRoomName-Modal2" ref={chatRoomNameRef2}>
      <div className="chatRoom-container">
        <img
          src="/images/closeBtn.png"
          alt=""
          className="closeBtn"
          onClick={changeRoomNameHandler}
        />
        <span>대화방 이름을 설정해주세요</span>
        <div className="chatRoomName">
          <input
            type="text"
            placeholder={"대화방 이름 입력..."}
            autoFocus
            name="roomName"
            value={roomName}
            onChange={valueHandler}
          />
        </div>
        <button className="submitBtn" onClick={submitHandler}>
          변경 완료
        </button>
      </div>
    </div>
  );
}
