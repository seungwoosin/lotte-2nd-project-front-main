import { Link } from "lucide-react";


const baseURL = import.meta.env.VITE_API_BASE_URL;
const socialURL = `${baseURL}/oauth2/authorization/`

const MySocial = () => {

    const socialLinkHandler = async () => {
        const resp = await axiosInstance.post('api/auth/link',null);
        console.log(resp.data);
    }
    
    return (
        <>
            <div className='flex justify-between'>
                <div>
                    <h2 className='sub-title text-lg'>Social Account</h2>
                    <span className='text-sm text-gray-500'>Plantry와 소셜 계정을 연동할 수 있습니다.</span>
                </div>
            </div>
            <ul className='mt-[20px]'>
                {/* <Link to={`${socialURL}kakao`}> */}
                    <li className='flex justify-between items-center border p-2 rounded-lg mt-10'>
                        <div className='flex'>
                            <img src="/images/kakao-icon-box.png" alt="icon" className='icon-size-50 rounded-lg mr-10'/>
                            <div>
                                <p className='flex'>Kakao Talk <img className='ml-10' src="/images/LinkOff-icon.png" alt="link" /></p>
                                <span>연결된 계정의 이메일주소</span>
                            </div>
                        </div>
                        <img src="/images/gray_star.png" alt="star" className='icon-size-25 mr-10'/>
                    </li>
                {/* </Link> */}
                {/* <Link to={`${socialURL}google`}> */}
                    <li 
                    // onClick={socialLinkHandler} 
                    className='flex justify-between items-center border p-2 rounded-lg mt-10'>
                        <div className='flex'>
                            <img src="/images/google-icon-box.png" alt="icon" className='icon-size-50 rounded-lg mr-10'/>
                            <div>
                                <p className='flex'>Google <img className='ml-10' src="/images/LinkOff-icon.png" alt="link" /></p>
                                <span>연결된 계정의 이메일주소</span>
                            </div>
                        </div>
                        <img src="/images/gray_star.png" alt="star" className='icon-size-25 mr-10'/>
                    </li>
                {/* </Link>
                <Link to={`${socialURL}naver`}> */}
                    <li className='flex justify-between items-center border p-2 rounded-lg mt-10'>
                        <div className='flex'>
                            <img src="/images/naver-icon-box.png" alt="icon" className='icon-size-50 rounded-lg mr-10'/>
                            <div>
                                <p className='flex'>Naver <img className='ml-10' src="/images/LinkOff-icon.png" alt="link" /></p>
                                <span>연결된 계정의 이메일주소</span>
                            </div>
                        </div>
                        <img src="/images/gray_star.png" alt="star" className='icon-size-25 mr-10'/>
                    </li>
                {/* </Link>
                <Link to={`${socialURL}facebook`}> */}
                    <li className='flex justify-between items-center border p-2 rounded-lg mt-10'>
                        <div className='flex'>
                            <img src="/images/Facebook_icon-box.png" alt="icon" className='icon-size-50 rounded-lg mr-10'/>
                            <div>
                                <p className='flex'>Facebook <img className='ml-10' src="/images/LinkOff-icon.png" alt="link" /></p>
                                <span>연결된 계정의 이메일주소</span>
                            </div>
                        </div>
                        <img src="/images/gray_star.png" alt="star" className='icon-size-25 mr-10'/>
                    </li>
                {/* </Link> */}
            </ul>
            {/* <button className='px-6 bg-indigo-500 text-white rounded-lg h-[40px] float-right mt-10'>소셜 연동</button> */}
        </>
    )
}

export default MySocial;