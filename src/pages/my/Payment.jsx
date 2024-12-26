import { useEffect, useRef, useState } from "react";
import MyAside from "../../components/my/MyAside";
import { MyPlanModal } from "@/components/my/PlanModal";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../services/axios";
import useUserStore from "../../store/useUserStore";
import PaymentModal from "../../components/my/PaymentModal";

export default function MyPayment(){
    const [progress, setProgress] = useState(77.4)
    const user = useUserStore((state) => state.user);


    const [card, setCard] = useState(false);
    const addCard = (event) => {
        event.preventDefault();
        setCard(true);
    }
    const cardClose = () => {
        setCard(false)
    }

    const showMoreRef = useRef();
    const [plan, setPlan] = useState(false);
    const upgradePlan = (event) => {
        event.preventDefault();
        setPlan(true);
    }
    const planClose = () => {
        setPlan(false)
    }

    const deleteAPI = async (value) => {
        console.log("딜리트 api "+value);
        const resp = await axiosInstance.post('/api/my/deletePayment', {'paymentId': value});
        if(resp.status === 200){
            alert('삭제가 완료되었습니다.')
        }
    }

    const deleteHandler = async (e) => {
        e.preventDefault();
        const value = e.target.value;
        console.log("삭제 카드 아이디 "+value);
        if (confirm('삭제하시겠습니까?')){
            await deleteAPI(value);
        }else{
            return;
        }
    }

    const getPaymentAPI = async () => {
        if (!user?.uid) {
        throw new Error("유저 정보가 없습니다.");
        }
        const resp = await axiosInstance.get('/api/my/cardInfos');
        console.log("카드 데이터 "+JSON.stringify(resp.data));
        return resp.data;
    }
    const { data: cardData, isError: cardError, isLoading: cardLoading } = useQuery({
        queryKey: [`${user.uid}`],
        queryFn: getPaymentAPI,
        enabled: !!user?.uid,
    })

    return  (
        <div id='my-payment-container'>
          <MyAside/>
          <section className='my-payment-main'>
            <article className="payment-arti1 border">
                <div className="flex justify-between ">
                    <h2 className="text-xl">등록된 결제정보</h2>
                    <button onClick={addCard} className="bg-indigo-500 text-white btn-my hover:bg-indigo-600">
                        <img src="/images/plus-icon.png" alt="plus" />
                        <span className="ml-2">카드 추가</span>
                    </button>
                </div>
                <ul className="mt-[40px]">
                {cardLoading  ? (
                        <p>로딩 중...</p>
                    ) : cardError ? (
                        <p>데이터를 불러오는 데 실패했습니다.</p>
                    ) : ((!Array.isArray(cardData) || cardData.length === 0)) ? (
                        <div className="alert-yeollow py-5 px-10 rounded-xl">등록된 결제 정보가 없습니다.</div>
                    ) : (
                        <>
                            {cardData.map((card) => {
                                const cardNum = card.paymentCardNo;
                                const splitCard = cardNum.split("-");
                                const card1 = splitCard[0].replaceAll(/[0-9]/g, "*");
                                const card2 = splitCard[1].replaceAll(/[0-9]/g, "*");
                                const card3 = splitCard[2].replaceAll(/[0-9]/g, "*");
                                const card4 = splitCard[3];

                                let globalPayment = null;
                                if(card.globalPayment === 1 ){
                                    globalPayment = 'marsterCard.svg';
                                }else if(card.globalPayment === 2){
                                    globalPayment = 'Visa_Inc._logo.svg.png';
                                }else if(card.globalPayment === 3){
                                    globalPayment = 'card-icon-american.png';
                                }else{
                                    globalPayment = 'marsterCard.svg';    
                                }

                                return (
                                <li className="border rounded-lg py-3 px-6 flex justify-between mt-10 h-[120px]">
                                    <div className="flex items-center">
                                        <img className="w-[80px] ml-10 mb-10 mt-10" src={`/images/${globalPayment}`} alt="cardtype" />
                                        <div className=" ml-[30px]">
                                            <p>{card?.cardCompany||''}</p>
                                            <span className="text-xl flex items-center">
                                                {card.paymentCardNick}
                                                {
                                                    card.activeStatus===1?
                                                    <div className="popular ml-4">Popular</div>:
                                                    ''
                                                }
                                            </span>
                                            <p className="mt-2">{card1} {card2} {card3} {card4}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center items-end">
                                        <div>
                                            {/* <button className="btn-profile2 border border-indigo-400 rounded-lg text-indigo-500 font-light">즐겨찾기</button> */}
                                            <button value={card.cardId} onClick={deleteHandler} className="btn-profile2 ml-10 border rounded-lg text-gray-500 font-light hover:bg-gray-100">삭제</button>
                                        </div>
                                        <p className="mt-10">{card.paymentCardExpiration} 만료 예정</p>
                                    </div>
                                </li>
                                );
                            })}
                        </>
                    )}
                </ul>
            </article>
            <article className="payment-arti2 border">
                <div className='current-plan relative p-[20px]  h-[450px] '>
                    <h2 className='text-lg text-gray-600 my-sub-title'>나의 구독정보</h2>
                    <div className='flex justify-between items-start  mt-[10px]'>
                        <div className="bg-indigo-100 text-indigo-400 font-light rounded px-3">Enterprise</div>
                        <div className='flex items-end mt-10'>
                            <span className='text-indigo-500'>$</span>
                            <h2 className='text-4xl text-indigo-500'>49</h2>
                            <span className='font-extralight '>/month</span>
                        </div>
                    </div>
                    <ul className='flex flex-col justify-around mt-[30px] ml-10'>
                        <li className='plan-exp'>
                            <p>현재 이용 중인 플랜 <strong className="ml-2">Enterprise</strong></p>
                            <p></p>
                        </li>
                        <li className='plan-exp mt-2'>
                            <p><strong>2024년 12월 1일</strong>부터 구독했습니다.</p>
                            <p>구독 만료시 등록된 이메일로 알림을 보내드립니다.</p>
                        </li>
                        <li className='plan-exp mt-2'>
                            <p>월간 이용료 $499</p>
                            <p>기업용 플랜</p>
                        </li>
                    </ul>
                    <div>
                        <div className='flex justify-between mt-[30px]'>
                        <span className='font-light'>Days</span>
                        <span className='text-gray-500'>{`${progress}%`}</span>
                        </div>
                        <div className="progress-bar">
                        <div className="progress-fill bg-indigo-400" style={{width: `${progress}%`}}></div>
                        </div>
                        <span className='text-sm text-gray-500'>4일 후 만료</span>
                    
                    </div>
                    <div className="alert-yeollow rounded-lg mt-10 w-full h-[50px] flex items-center px-[20px] py-10">
                        현재 구독 중인 플랜의 이용기한이 8일 남았습니다.
                    </div>
                    <div className="flex justify-around mt-[30px]">
                        <button onClick={upgradePlan} className='btn-profile  bg-indigo-500 text-white'>플랜 업그레이드</button>
                        <button className='btn-profile border border-indigo-500 text-indigo-800'>구독 취소</button>
                    </div>
                </div>
            </article>
            <div className='card-modal'>
                <PaymentModal
                    isOpen={card}
                    onClose={cardClose}
                    text="결제정보 등록"
                    showMoreRef={showMoreRef}
                />
            </div>
            <div className='plan-modal'>
                <MyPlanModal
                    isOpen={plan}
                    onClose={planClose}
                    text="요금제 변경"
                    showMoreRef={showMoreRef}
                />
            </div>

          </section>
        </div>
      )
}