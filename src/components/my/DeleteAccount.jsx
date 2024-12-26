import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";
import CustomAlert from "./CustomAlert";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
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
    showCancel: true
}

const DeleteAccount = () => {

    const navigate = useNavigate();
    const logout = useAuthStore(state => state.logout);
    const [deactive , setDeactive] = useState(0);
    const handleCheckboxChange = (event) => {
        setDeactive(event.target.checked ? 1 : 0); // 체크 상태에 따라 값 설정
    };
    const [pass, setPass] = useState('')
    const [successPass, setSuccessPass] = useState(true)
    const [message, setMessage] = useState({message:'', type: ''});

    const [isCustomAlert, setIsCustomAlert] = useState({ customAlertInitData});
    const customAlertCancelHandler = ()=>{
        setIsCustomAlert(customAlertInitData);
    }

    const changePass = (e) => {
        setPass(e.target.value)
        if(pass !== null){
            setMessage({message: '', type: ''})
        }
    }
    const confirmPass = async (e) => {
        e.preventDefault();
        console.log(JSON.stringify(pass));
        if(pass === null || pass === '' ){
            setMessage({message: '비밀번호를 입력해 주세요.',type: 'warning'} )
            return;
        }
        try{
            const resp = await axiosInstance.post('/api/my/confirmPass', {pwd: pass});
            console.log(resp.data+resp.status+" 비밀번호 결과");
            if(resp.status == 200){
                setMessage({
                    message: `비밀번호 확인이 완료되었습니다.\n계속 진행하시려면 비활성화 버튼을 눌러주세요.`,
                    type: 'success'
                })
                setSuccessPass(false);
            }
          }catch(err){
            console.log(err)
            setMessage({
                message: `비밀번호가 맞지 않습니다.`,
                type: 'warning'
            })
          }
    }
    const deleteAccountHandler = (e) => {
        e.preventDefault();
        setIsCustomAlert({
            visible:true,
            type: "info",
            title: "계정을 비활성화하시겠습니까?",
            message: `비활성화시 1년간 비활성화 계정으로 남은 후 자동으로 계정이 삭제됩니다.`,
            subMessage: '', 
            onConfirm: deleteHandler, 
            onCancel: customAlertCancelHandler, 
            showCancel: true,
        })
    }

    const deleteHandler = async () => {
        try{
            const resp = await axiosInstance.get('/api/my/deleteAccount');
            console.log('계정 비활성화 결과 '+resp)
            if(resp.status === 200){
                setIsCustomAlert({
                    visible:true,
                    type: "info",
                    title: "비활성화가 완료되었습니다.",
                    message: `지금까지 PLANTRY를 이용해 주셔서 감사합니다.`,
                    subMessage: '', 
                    onConfirm: logoutHandler, 
                    onCancel: customAlertCancelHandler, 
                    showCancel: false,
                })
            }
        }catch(err){
            console.log('비활성화 실패');
        }
    }

    const logoutHandler = () => {
        logout();
        navigate("/")
    }

    return(
        <>
        <h2 className='sub-title text-lg'>Delete Account</h2>
        <div className='flex flex-col justify-start h-full'>
            <label><input type="checkbox" className='mt-[30px] mr-10' onChange={handleCheckboxChange}/> 계정을 비활성화하고 싶습니다.</label>
            {deactive===1&& 
            <div className='mt-10'>
                {message.message && 
                    <div className={`rounded-lg text-sm px-6 py-3 ${message.type==='warning'? 'bg-[#FFF6E5] text-[#E8B041]':'bg-gray-100 text-gray-700'}`}
                    style={{ whiteSpace: "pre-wrap" }}
                    >{message.message}</div>
                }
                <div className='flex items-center input-lg rounded-lg justify-between mt-2'>
                    <input onChange={changePass} value={pass}
                    type="password" className='mr-10 indent-4'/>
                    <button onClick={confirmPass} 
                    className={`btn-delete text-white mr-1
                    ${successPass===false? 'bg-indigo-400':'bg-indigo-500 hover:bg-indigo-600'}
                    `} >확인</button>
                </div>
                <span className='text-xs text-center w-[50px] ml-10'>먼저 비밀번호를 확인하셔야 합니다.</span>
            </div>
            }
        </div>
        <button 
        className={`btn-profile border text-gray-500 w-full ${successPass===false?'hover:bg-gray-100':''}`}
        onClick={deleteAccountHandler}
        disabled={successPass}
        >계정 비활성화
        </button>
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
        </>
    )
}
export default DeleteAccount;