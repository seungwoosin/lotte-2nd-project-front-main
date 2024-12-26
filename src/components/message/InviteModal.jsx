/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import InviteModal_orgChart from "./InviteModal_orgChart";
import InviteModal_frequent from "./InviteModal_frequent";
import InviteModal_userSearch from "./InviteModal_userSearch";
import { useEffect, useRef, useState } from "react";
import useOnClickOutSide from "./useOnClickOutSide";
import InviteModal_chatRoomName from "./InviteModal_chatRoomName";
import axiosInstance from "../../services/axios";
import CustomAlert from "../Alert";

export default function InviteModal(props) {
  const {
    isOpen,
    closeHandler,
    option,
    optionHandler,
    inviteRef,
    mode,
    setMode,
    uid,
    selectedRoomId,
    roomNameHandler,
    roomNameModal,
    chatRoomNameRef,
  } = props;
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [originMembers, setOriginMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserUids, setSelectedUserUids] = useState([]);
  const [selectedGroup_Id_Name, setSelectedGroup_Id_Name] = useState({
    group_id: null,
    group_name: null,
  });
  const [userList, setUserList] = useState([]);
  const [userUids, setUserUids] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  console.log("mode : ", mode);

  useEffect(() => {
    if (mode === "create") return;
    try {
      axiosInstance
        .get(`/api/message/roomMembers/${selectedRoomId}`)
        .then((resp) => {
          console.log(resp.data);
          setOriginMembers(resp.data);
        });
    } catch (error) {
      console.error(error);
    }
  }, []);

  // 현재 selectedUsers 상태를 참조하기 위해 useRef 사용
  const selectedUsersRef = useRef(selectedUsers);

  useEffect(() => {
    selectedUsersRef.current = selectedUsers;
  }, [selectedUsers]);

  const addUser = () => {
    // 제외할 사용자들을 먼저 필터링
    const excludedUsers = users.filter(
      (user) =>
        selectedUsersRef.current.some(
          (selectedUser) => selectedUser.uid === user.uid
        ) || originMembers.some((member) => member.uid === user.uid)
    );

    // 제외된 사용자가 있을 경우 alert로 알림
    if (excludedUsers.length > 0) {
      const excludedNames = excludedUsers.map((user) => user.name).join(", ");
      alert(`${excludedNames}는(은) 이미 추가된 유저이므로 제외되었습니다.`);
    }

    // 추가할 사용자들만 필터링
    const usersToAdd = users.filter(
      (user) =>
        !selectedUsersRef.current.some(
          (selectedUser) => selectedUser.uid === user.uid
        ) && !originMembers.some((member) => member.uid === user.uid)
    );

    // selectedUsers 업데이트
    setSelectedUsers([...selectedUsersRef.current, ...usersToAdd]);

    // 추가 후 상태 초기화
    setUsers([]);
    setSelectedUserUids([]);
    setSelectedGroup_Id_Name({ group_id: null, group_name: null });
  };

  const removeUser = (userUid) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((user) => user.uid !== userUid)
    );
    setUserUids((prevUids) => prevUids.filter((uid) => uid !== userUid));
    setSelectedUserUids((prevUids) =>
      prevUids.filter((uid) => uid !== userUid)
    );
    setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== userUid));
  };

  const clearAllUsers = () => {
    setSelectedUsers([]);
    setSelectedGroup_Id_Name({ group_id: null });
    setSelectedUserUids([]);
    setUserUids([]);
  };

  const selectHandler = (e, user_uid) => {
    e.preventDefault();
    if (!e.currentTarget.className.trim().includes("selectedUser")) {
      if (userUids.includes(user_uid)) {
        setUserUids((prevUids) => prevUids.filter((uid) => uid !== user_uid));
      } else {
        setUserUids((prevUids) => [...prevUids, user_uid]);
      }
      setSelectedUserUids([...selectedUserUids, user_uid]);
    } else {
      setUserUids((prevUids) => prevUids.filter((uid) => uid !== user_uid));
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.uid !== user_uid)
      );
      setSelectedUserUids((prevSelectedUids) =>
        prevSelectedUids.filter(
          (prevSelectedUid) => prevSelectedUid !== user_uid
        )
      );
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (selectedUsers && selectedUsers.length > 0 && mode === "create") {
      roomNameHandler();
    } else {
      const confirmInvite = confirm(
        `${selectedUsers.map((user) => user.name)}을(를) 초대하시겠습니까?`
      );
      if (confirmInvite) {
        const data = {
          members: selectedUsers.map((user) => user.uid),
          id: selectedRoomId,
        };
        try {
          axiosInstance.patch("/api/message/chatMembers", data);
        } catch (error) {
          console.error(error);
        }
        setIsAlertOpen(true);
        setTimeout(() => {
          setIsAlertOpen(false);
          closeHandler();
        }, 1500);
      }
      return;
    }
  };

  useOnClickOutSide(inviteRef, closeHandler);

  if (!isOpen) return null;

  return (
    <div id="invitation-modal">
      <div className="message-invite-container" ref={inviteRef}>
        <div className="title_closeBtn">
          {mode === "create" ? (
            <span>대화방 생성</span>
          ) : (
            <span>대화상대 초대</span>
          )}
          <img
            className="closeBtn"
            src="../images/closeBtn.png"
            alt=""
            onClick={closeHandler}
          />
        </div>

        <div className="options">
          <div
            className={
              option === 1 ? "userSearch selected-option" : "userSearch"
            }
            onClick={optionHandler}
          >
            사용자 검색
          </div>
          <div
            className={option === 2 ? "orgChart selected-option" : "orgChart"}
            onClick={optionHandler}
          >
            조직도
          </div>
          <div
            className={option === 3 ? "frequent selected-option" : "frequent"}
            onClick={optionHandler}
          >
            즐겨찾기
          </div>
        </div>

        <div className="list_add">
          {(() => {
            switch (option) {
              case 1:
                return (
                  <InviteModal_userSearch
                    users={users}
                    setUsers={setUsers}
                    setSelectedGroup_Id_Name={setSelectedGroup_Id_Name}
                    selectedGroup_Id_Name={selectedGroup_Id_Name}
                    selectedUserUids={selectedUserUids}
                    setSelectedUserUids={setSelectedUserUids}
                    userList={userList}
                    setUserList={setUserList}
                    selectHandler={selectHandler}
                    originMembers={originMembers}
                  />
                );
              case 2:
                return (
                  <InviteModal_orgChart
                    users={users}
                    setUsers={setUsers}
                    setSelectedGroup_Id_Name={setSelectedGroup_Id_Name}
                    selectedGroup_Id_Name={selectedGroup_Id_Name}
                    selectedUserUids={selectedUserUids}
                    setSelectedUserUids={setSelectedUserUids}
                    userList={userList}
                    setUserList={setUserList}
                    selectHandler={selectHandler}
                    originMembers={originMembers}
                  />
                );
              case 3:
                return (
                  <InviteModal_frequent
                    users={users}
                    setUsers={setUsers}
                    setSelectedGroup_Id_Name={setSelectedGroup_Id_Name}
                    selectedGroup_Id_Name={selectedGroup_Id_Name}
                    selectedUserUids={selectedUserUids}
                    setSelectedUserUids={setSelectedUserUids}
                    userList={userList}
                    setUserList={setUserList}
                    selectHandler={selectHandler}
                    originMembers={originMembers}
                  />
                );
              default:
                return null;
            }
          })()}

          <button
            className="addBtn"
            onClick={addUser}
            disabled={users.length === 0}
          >
            <img src="../images/arrowRight.png" alt="" />
          </button>

          <div className="selected-Users-List">
            <div className="selected-title">
              <span>선택한 대상</span>
              <button className="resetBtn" onClick={clearAllUsers}>
                초기화
              </button>
            </div>
            <div className="selected-Users">
              {originMembers &&
                originMembers.length > 0 &&
                originMembers.map((originMember) => (
                  <div
                    className="selected-User_cancelBtn originMember"
                    key={originMember.uid}
                  >
                    <div className="selected-User">
                      <img
                        className="profile"
                        src="../images/sample_item1.jpg"
                        alt=""
                      />
                      <div className="name_dept">
                        <div className="name">{originMember.name}</div>
                        <div className="dept">
                          <span>{originMember.group}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {selectedUsers.map((selectedUser) => (
                <div className="selected-User_cancelBtn" key={selectedUser.uid}>
                  <div className="selected-User">
                    <img
                      className="profile"
                      src="../images/sample_item1.jpg"
                      alt=""
                    />
                    <div className="name_dept">
                      <div className="name">{selectedUser.name}</div>
                      <div className="dept">
                        <span>{selectedUser.group}</span>
                      </div>
                    </div>
                  </div>
                  <img
                    className="cancelBtn"
                    src="../images/closeBtn.png"
                    alt=""
                    onClick={() => removeUser(selectedUser.uid)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {roomNameModal == true && mode.trim() === "create" ? (
          <InviteModal_chatRoomName
            roomNameHandler={roomNameHandler}
            selectedUsers={selectedUsers}
            selectedUserUids={selectedUserUids}
            closeHandler={closeHandler}
            chatRoomNameRef={chatRoomNameRef}
            mode={mode}
          />
        ) : null}

        <div className="confirmBtn_cancelBtn">
          {selectedUsers && selectedUsers.length > 0 ? (
            <button className="confimBtn" onClick={submitHandler}>
              확인
            </button>
          ) : (
            <button
              className="confimBtn"
              onClick={submitHandler}
              disabled
              style={{ backgroundColor: "gray", cursor: "default" }}
            >
              확인
            </button>
          )}
          <button className="cancel-Btn" onClick={closeHandler}>
            취소
          </button>
        </div>
        {isAlertOpen == true ? (
          <CustomAlert
            type={"success"}
            message={"초대가 완료되었습니다."}
            isOpen={isAlertOpen}
          />
        ) : null}
      </div>
    </div>
  );
}
