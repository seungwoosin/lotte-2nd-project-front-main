/* eslint-disable react/prop-types */
import { useState } from "react";
import axiosInstance from "../../services/axios";
import CustomAlert from "../Alert";
import useOnClickOutSide from "./useOnClickOutSide";

export default function ShowMoreModal({
  moreFnHandler,
  showMoreRef,
  uid,
  selectedRoomId,
  setSelectedRoomId,
  openHandler2,
  changeRoomNameHandler,
  setRoomData,
}) {
  const [isOpen, setIsOpen] = useState();

  useOnClickOutSide(showMoreRef, moreFnHandler);

  const exitHandler = (e) => {
    e.preventDefault();
    const confirmQuit = confirm("정말 나가시겠습니까?");
    if (confirmQuit) {
      try {
        const data = {
          id: selectedRoomId,
          leader: uid,
        };
        axiosInstance.delete("/api/message/quitRoom", { data }).then((resp) => {
          console.log("status : ", resp.data);

          if (resp.data === "success") {
            setSelectedRoomId("");
            localStorage.removeItem("roomId");
            setRoomData((prevRoomData) =>
              prevRoomData.filter((room) => room.id !== selectedRoomId)
            );
            setIsOpen(true);
            setTimeout(() => {
              setIsOpen(false);
            }, 1500);
          } else {
            alert("대화방 나기기 중 오류가 발생했습니다.");
          }
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      return;
    }
  };

  return (
    <div className="viewMore" ref={showMoreRef}>
      <div className="inviteFn" onClick={openHandler2}>
        <img src="/images/message-invite.png" alt="" className="inviteFnImg" />
        <span>대화상대 초대</span>
      </div>
      <div className="nameChangeFn" onClick={changeRoomNameHandler}>
        <img
          src="/images/message-changeName.png"
          alt=""
          className="nameChangeFnImg"
        />
        <span>대화방 이름 변경</span>
      </div>
      <div className="fileListFn">
        <img src="/images/fileIcon.png" alt="" className="fileListFnImg" />
        <span>첨부 파일 목록</span>
      </div>
      <div className="exitFn" onClick={exitHandler}>
        <img src="/images/message-exit.png" alt="" className="exitFnImg" />
        <span>대화방 나가기</span>
      </div>
      <CustomAlert
        type={"success"}
        message={"대화방을 나왔습니다."}
        isOpen={isOpen}
      />
    </div>
  );
}
