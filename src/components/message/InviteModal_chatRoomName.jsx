import { useState } from "react";
import axiosInstance from "../../services/axios";
import CustomAlert from "../Alert";
import { useAuthStore } from "../../store/useAuthStore";
import useOnClickOutSide from "./useOnClickOutSide";

/* eslint-disable react/prop-types */
export default function InviteModal_chatRoomName({
  roomNameHandler,
  selectedUsers,
  selectedUserUids,
  closeHandler,
  mode,
  chatRoomNameRef,
}) {
  const [roomName, setRoomName] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const decodeAccessToken = useAuthStore((state) => state.decodeAccessToken);
  const payload = decodeAccessToken();

  useOnClickOutSide(chatRoomNameRef, roomNameHandler);

  const valueHandler = (e) => {
    e.preventDefault();
    setRoomName(e.target.value);
  };

  console.log("roomName:", roomName);

  const closeAlertHandler = () => {
    setIsAlertOpen(true);
    setTimeout(() => {
      setIsAlertOpen(false);
    }, 1500);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (mode === "create") {
      const formdata = new FormData();
      formdata.append(
        "members",
        selectedUsers.map((user) => user.uid)
      );
      formdata.append("leader", payload.sub);
      if (roomName === "") {
        formdata.append(
          "chatRoomName",
          selectedUsers.map((user) => user.name)
        );
      } else {
        formdata.append("chatRoomName", roomName);
      }
      for (let pair of formdata.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      try {
        await axiosInstance
          .post("/api/message/room", formdata, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((resp) => console.log(resp.data));
        closeAlertHandler();
        setTimeout(() => {
          roomNameHandler();
          closeHandler();
        }, 1500);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="chatRoomName-Modal" ref={chatRoomNameRef}>
      <div className="chatRoom-container">
        <img
          src="/images/closeBtn.png"
          alt=""
          className="closeBtn"
          onClick={roomNameHandler}
        />
        <span>대화방 이름을 설정해주세요</span>
        <div className="chatRoomName">
          <input
            type="text"
            placeholder={selectedUsers.map((user) => user.name)}
            autoFocus
            name="roomName"
            value={roomName}
            onChange={valueHandler}
          />
          {mode === "create" && (
            <span>미입력 시 구성원들의 이름으로 자동 지정됩니다.</span>
          )}
        </div>
        <button className="submitBtn" onClick={submitHandler}>
          설정 완료
        </button>
      </div>
      {isAlertOpen == true ? (
        <CustomAlert
          type={"success"}
          message={"새 대화방이 생성되었습니다."}
          isOpen={isAlertOpen}
          onClose={closeAlertHandler}
        />
      ) : null}
    </div>
  );
}
