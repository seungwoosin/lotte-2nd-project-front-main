import React, { useEffect, useState } from 'react'
import '@/pages/user/Login.scss'
import axiosInstance from '@/services/axios.jsx'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CustomGubun } from '@/components/Gubun';
import CustomAlert from '@/components/Alert';
import { CustomMessage } from '@/components/Message';
import decodeToken from '../../util/decodeToken';
import useUserStore from '../../store/useUserStore';
import { useAuthStore } from '../../store/useAuthStore';


// 2024.11.28 하진희 유저 정보 store에 저장하기 

export default function Login() {
    const navigate = useNavigate();

    const [uid, setUid] = useState('');
    const [pwd, setPwd] = useState('');
    const [token, setToken] = useState('');
    const [isModal, setIsModal] = useState(true);
    const [alert, setAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');
    const [msg, setMsg] = useState(false);
    const [role, setRole] = useState("");


    const setUser = useUserStore((state) => state.setUser); // Zustand의 setUser 가져오기
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const [alertClass, setAlertClass] = useState("");
    
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get("redirect");

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        submitData(); // Enter 키를 누르면 로그인 실행
      }
    };

    const changeHandler = (e)=>{
      if(e.target.name === 'uid'){
        setUid(e.target.value)
      } else if (e.target.name === 'pwd'){
        setPwd(e.target.value)
      }
    }
  

    const submitData = ()=> {
      const data = {
        "uid" : uid,
        "pwd" : pwd
      }
     

      axiosInstance
        .post("/api/auth/login",data)
        .then((resp)=>{
          console.log("로그인 정보",resp);
          if(resp.status === 200){
            const token = resp.data.token; 

            //store에 저장
            setUser(resp.data.user);
            
            const role = resp.data.role;
            
            setToken(token);
            setRole(role);

            setAccessToken(token); //zustand 상태 업데이트
            console.log("로그인 성공, 토큰 : "+token)


            setAlert(true)
            setMessage("로그인 성공하였습니다.")
            setType("success")
          }
        })
        .catch((err)=>{
          if (err.status === 404){
            setAlert(true)
            setMessage("없는 계정입니다.")
            setType("warning")
          } else if(err.status === 409){
            setAlert(true)
            setMessage("비밀번호를 다시 확인해 주세요.")
            setType("warning")
          }else if(err.status === 401){
            setAlert(true)
            setMessage("해당 계정은 비활성화 상태입니다.")
            setType("warning")  
          }
        })
    }
  
    const signUp = () => {
      navigate("/user/terms")
    }
  
    const closeModal = () => {
      setIsModal(false)
    }
  
    const closeAlert = () =>{
      setAlert(false)
    }
  
    const closeMsg = () => {
      setMsg(false);
    }
  
    const openMsg = () => {
  
    }
  
    useEffect(() => {
      if (!alert&&token) {
        if(role === 'COMPANY'){
          navigate("/admin")
        } else {
          navigate(redirectPath || "/home")
        }
          
      }
    }, [alert]);
  
    useEffect(() => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        setToken(savedToken);
        const decodedUser = decodeToken(savedToken); // JWT 디코딩
        if (decodedUser) {
            setUser(decodedUser); // Zustand 상태 복원
        }
      }
    }, [setUser]);
  
    useEffect(() => {
      let timer;
  
      if (alert) {
        timer = setTimeout(() => {
          setAlertClass("fade-out"); // fade-out 클래스 추가
          setTimeout(() => setAlert(false), 300); // 애니메이션 후 alert 상태 변경
        }, 500); // 3초 뒤에 애니메이션 시작
      }
  
      return () => clearTimeout(timer); // 타이머 정리
    }, [alert]);

    // Alert 표시 함수
    const showAlert = () => {
      setAlert(true);
      setAlertClass(""); // fade-out 클래스 제거
    };
  
    return (
      <div className='login-container'>
        <div className='login-form '>
        <div className="flex justify-between items-start px-[30px]">
            <p className='text-3xl font-light '>LOGIN</p>
            <Link to="/user/login" className="flex items-center">
              <img src='/images/plantry_logo.png' className='w-[40px] h-[40px]'></img>
              <div className='flex items-center font-bold text-[22px] font-purple'>PLANTRY</div>
            </Link>
        </div>
          <div className='inp-box'>

            <div className='rounded-xl px-[6px] py-[10px]'>
              <p className='text-sm'>로그인으로 PLANTRY를 시작해 보세요!</p>
              <span className='text-xs'>PLANTRY로 필요한 업무를 더 수월하게 진행해봐요.</span>
            </div>

            <p className='text-xs inp-font bg-white w-[20px] text-center ml-3 relative top-2'>ID</p>
            <input type="text" name='uid' value={uid} onChange={changeHandler} placeholder='아이디를 입력해주세요.'
             onKeyDown={handleKeyDown}
            className='border rounded h-[50px] indent-4' />
            <p className='text-xs inp-font bg-white w-[70px] text-center ml-3 relative top-2'>PASSWORD</p>
            <input type="password" name='pwd' value={pwd} onChange={changeHandler} placeholder='비밀번호를 입력해주세요.'
             onKeyDown={handleKeyDown}
            className='border rounded h-[50px] indent-4' />
            <div className='find-pwd'>
              <p className='text-sm mt-1' onClick={() => navigate("/user/find")}>Forgot password?</p>
            </div>
            <button onClick={submitData} className='bg-indigo-500 text-white h-[50px] rounded-lg '>Sign In</button>
            <button onClick={signUp} className='border border-indigo-500 text-indigo-700 h-[50px] rounded-lg mt-10'>Sign Up</button>
          </div>
          <CustomGubun 
            gubun="basic"
            text="Or Use"
          />
  
        {alert && (
          <div className={`alert-container ${alertClass}`}>
            <CustomAlert
              type={type}  // 알림의 타입 (success, error, info , basic 등)
              message={message}
              onClose={closeAlert}  // onClose는 closeAlert 함수로 전달
              isOpen={alert}
            />
          </div>
        )}
        {msg &&(
          <CustomMessage 
            message = "읽지않은 메시지 몇개"
            onClose={closeMsg}
            onClick={openMsg}
          />
        )}
        {/* {isModal && (
          <Modal 
            isOpen={isModal}
            onClose={closeModal}
            children="모달테스트"
            text="OOO모달"
          />
        )} */}
          <div className='social-login'>
  
          </div>
        </div>
      </div>
    
    )
}
