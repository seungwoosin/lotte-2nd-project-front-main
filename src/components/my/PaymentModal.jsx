import { useState } from "react";
import useOnClickOutSide from "../message/useOnClickOutSide";
import axiosInstance from "../../services/axios";
    const validateRules = {
        card: (value) => value !== undefined && /^\d{4}$/.test(value),
        paymentCardCvc : (paymentCardCvc) => /^\d{3}$/.test(paymentCardCvc),
    };
  
    validateRules.paymentCardExpiration = (paymentCardExpiration) => {
        // MM/YY 형식 검증
        const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!regex.test(paymentCardExpiration)) return false;
        
        const [month, year] = paymentCardExpiration.split('/').map(Number);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
    
        return (year > currentYear) || (year === currentYear && month >= currentMonth);
    };
    const cardinit = {
        paymentCardNo:"",
        paymentCardNick:"",
        paymentCardExpiration:"",
        paymentCardCvc:"",
        activeStatus:0,
    }

const PaymentModal = ({ isOpen, onClose , text,  showMoreRef }) => {

    if (!isOpen) return null;
    const date = new Date();

    useOnClickOutSide(showMoreRef, onClose);
    const [payment, setPayment] = useState({...cardinit});
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' }); // 메시지와 유형 상태 통합
    const [card, setCard] = useState({cardNum1: '', cardNum2: '', cardNum3: '', cardNum4: '',})
 
    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked; // 체크 여부 확인
        setPayment((prev) => ({
          ...prev,
          activeStatus: isChecked ? 1 : 0, 
        }));
    };

    const CardHandler = (e) => {
        const { name, value } = e.target;
      
        // 새로 입력된 값을 card 상태에 반영
        const updatedCard = { ...card, [name]: value };
        setCard(updatedCard);
      
        // 모든 카드 번호를 추출
        const { cardNum1, cardNum2, cardNum3, cardNum4 } = updatedCard;
      
        // 개별 필드가 4자리일 때 유효성 검사
        if (value.length === 4) {
            if (!validateRules.card(value)) {
                setStatusMessage({ message: `유효하지 않은 형식입니다.`, type: 'error' });
                return;
            }
        }
      
        // 모든 카드 번호가 입력되었는지 확인
        if (cardNum1.length === 4 && cardNum2.length === 4 && cardNum3.length === 4 && cardNum4.length === 4) {
          // 모든 카드 번호의 유효성을 검사
            if (
                validateRules.card(cardNum1) &&
                validateRules.card(cardNum2) &&
                validateRules.card(cardNum3) &&
                validateRules.card(cardNum4)
            ) {
            // 카드 번호를 하나의 문자열로 결합
            const fullpaymentCardNo = `${cardNum1}-${cardNum2}-${cardNum3}-${cardNum4}`;
                setPayment((prev) => ({ ...prev, paymentCardNo: fullpaymentCardNo })); // 카드 번호 업데이트
                setStatusMessage({ message: ``, type: '' }); // 메시지 초기화
            } else {
                setStatusMessage({ message: `유효하지 않은 카드 번호입니다.`, type: 'error' });
            }
        } else {
          setStatusMessage({ message: ``, type: '' }); // 카드 번호가 모두 입력되지 않은 상태
        }
      };


    const PaymentChangeHandler = (e) =>{
        const {name, value} = e.target;
        setPayment({...payment, [e.target.name]: e.target.value});
    
        
        // 만료일 필드일 경우 MM/YY 형식으로 자동 변환
        if (name === 'paymentCardExpiration') {
          let formattedValue = value.replace(/[^0-9]/g, ''); // 숫자만 남김
          if (formattedValue.length > 2) {
            formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
          }
        
          // 유효성 검사
          if (validateRules.paymentCardExpiration(formattedValue)) {
            setStatusMessage({ message: ``, type: '' });
          } else {
            setStatusMessage({ message: `만료일이 유효하지 않습니다.`, type: 'error' });
          }
          setPayment((prev) => ({ ...prev, paymentCardExpiration: formattedValue }));
          setPayment({...payment, paymentCardExpiration: formattedValue});
          return;
        }
    
        if(name ==='paymentCardNick' || name === 'paymentCardCvc'){
          setPayment({...payment, [name]: value});
        }
        
        
        if(name==='paymentCardCvc'&&value.length >= 3){
          if( !validateRules[name]?.(value)){
            setStatusMessage({ message: `유효하지 않은 형식입니다.`, type: 'error' });
          }else{
            setStatusMessage({ message: ``, type: '' });
          }
          return;
        }
    }

    const submitPaymentAPI = async (payment) => {
        console.log(JSON.stringify(payment))
        try{
            const resp = await axiosInstance.post('/api/my/addPayment', payment)
            if(resp.status === 200){
                alert('결제정보 등록이 완료되었습니다.')
            }
        }catch(err){
            alert('등록 과정에서 오류가 발생했습니다. 다시 시도해 주세요.')
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log("전송할 페이먼트 데이터 "+JSON.stringify(payment));
        submitPaymentAPI(payment);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-custom-fixed">
          <div ref={showMoreRef}  
          className="bg-white rounded-t-xl rounded-b-md shadow-lg max-w-2xl w-full modal-custom-width">
            <div className="flex justify-between items-center py-5 px-12 bg-white rounded-t-xl">
                <span className="text-lg text-gray-700 font-bold">{text}</span>
                <button 
                onClick={onClose}
                className="text-md float-right display-block font-bold text-gray-600 hover:text-gray-900"
                >
                <img className="h-[15px]" src="/images/close-icon.png" alt="close" />
                </button>
            </div>
            <div className="mx-12">
                {text === '결제정보 등록' &&
                <>
                    <p className='text-sm ml-10'>결제 정보를 입력해주세요.</p>
                    {statusMessage.message && (
                        <p
                        className={`text-sm flex items-center indent-8 rounded-lg mt-2 mb-2 h-[60px] alert-yeollow`}
                        >
                        {statusMessage.message}
                        </p>
                    )}
                    <input type='text' placeholder='카드 별명'
                    name='paymentCardNick' value={payment.paymentCardNick} onChange={PaymentChangeHandler}
                    className="input-lg mr-1 text-gray-600 mt-10" ></input>
                    <div className='grid grid-cols-2 gap-2 mt-10'>
                        <select name='cardCompany' 
                        onChange={(event) => setPayment({ ...payment, cardCompany: event.target.value })} 
                        className="w-full input-lg h-[50px]">
                            <option name='cardCompany' value="신한">신한</option>
                            <option name='cardCompany' value="국민">국민</option>
                            <option name='cardCompany' value="현대">현대</option>
                            <option name='cardCompany' value="카카오뱅크">카카오뱅크</option>
                            <option name='cardCompany' value="우리">우리</option>
                            <option name='cardCompany' value="NH농협">NH농협</option>
                            <option name='cardCompany' value="하나">하나</option>
                            <option name='cardCompany' value="롯데">롯데</option>
                            <option name='cardCompany' value="삼성">삼성</option>
                            <option name='cardCompany' value="IBK기업은행">IBK기업은행</option>
                            <option name='cardCompany' value="BC">BC</option>
                        </select> 
                        <select className="input-lg" name="globalPayment" 
                        onChange={(event) => setPayment({ ...payment, globalPayment: event.target.value })} 
                        >
                            <option defaultChecked value="0">해외겸용</option>
                            <option name="globalPayment" value="1">MarsterCard</option>
                            <option name="globalPayment" value="2">VISA</option>
                            <option name="globalPayment" value="3">AmericanExpress</option>
                        </select>
                    </div>
                    <div className='input-lg mt-10 flex items-center text-gray-500'>
                        <input type='text' placeholder='카드번호 입력' className="w-1/4 text-center ml-2" maxLength={4}
                        name='cardNum1' value={card.cardNum1} onChange={CardHandler}
                            />-
                        <input type='password' className=" w-1/4 text-center ml-2" maxLength={4}
                        name='cardNum2' value={card.cardNum2} onChange={CardHandler}
                            />-
                        <input type='password' className=" w-1/4 text-center ml-2" maxLength={4} 
                        name='cardNum3' value={card.cardNum3} onChange={CardHandler}
                        />-
                        <input type='text'  className=" w-1/4 text-center ml-2" maxLength={4}  
                        name='cardNum4' value={card.cardNum4} onChange={CardHandler}
                        />
                    </div>
                    <div className='flex justify-between mt-10'>
                        <input type='text' placeholder='MM/YY'
                        name='paymentCardExpiration' value={payment.paymentCardExpiration} onChange={PaymentChangeHandler}
                        className="input-lg mr-1 text-gray-600" maxLength={5} ></input>
                        <input type='text' placeholder='cvc'
                        name='paymentCardCvc' value={payment.paymentCardCvc} onChange={PaymentChangeHandler}
                        className="input-sm mr-1 text-gray-600" maxLength={3}  ></input>
                    </div>
                    <label className='flex items-center mt-10'>
                    <input type="checkbox" name="activeStatus" onChange={handleCheckboxChange}/>
                    <span className='text-sm ml-2'>자주 사용하는 카드로 등록하시겠습니까?</span>
                    </label>
                    <button className="hover:bg-indigo-600 bg-indigo-500 btn-profile text-white mt-[20px] mb-[30px] float-right"
                    onClick={submitHandler}
                    >등록</button>
                </>
                }
            </div>
            
          </div>
        </div>
    );
}
export default PaymentModal;