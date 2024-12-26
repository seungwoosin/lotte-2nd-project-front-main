import { useState } from "react";

export default function Price(){

    const [currentPlan, setCurrentPlan] = useState(0); // 기본값은 첫 번째 플랜

    // 플랜 선택 함수
    const handleUpgrade = (index) => {
        setCurrentPlan(index); // 클릭된 플랜의 인덱스를 설정
    };

    return (<div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-[120px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="priceTop text-center">
                <h2 className="text-3xl font-bold mb-4">Pricing Plans</h2>
                <p>All plans include 40+ advanced tools and features to boost your product.<br />
                    Choose the best plan to fit your needs.</p>
                <div className="discountTap flex flex-col items-center mt-6 mb-4 relative">
                    <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">⭐</span>
                        <div className="save bg-blue-500 text-white px-4 py-2 rounded-full">
                            Save up to 10%
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-8 mt-6">
                        <div className="flex items-center">
                            <span className="text-2xl mr-2">💰</span>
                            <span className="text-gray-600">Money-back Guarantee</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-2xl mr-2">🎧</span>
                            <span className="text-gray-600">24/7 Support</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-2xl mr-2">🔒</span>
                            <span className="text-gray-600">Secure Payment</span>
                        </div>
                    </div>
                </div>
            </article>
            <article className="tabWrapper flex justify-between gap-6 my-12">
                <section className="tab basic w-[320px] p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col items-center">
                        <img 
                            src="/images/Piggy_bank_perspective_matte 2.png" 
                            alt="돼지저금통" 
                            className="w-16 h-16 mb-4"
                        />
                        <h3 className="text-xl font-bold">Basic</h3>
                        <p className="text-gray-600 text-sm mb-4">A simple start for everyone</p>
                        
                        <div className="price-container mb-8">
                            <span className="flex items-center justify-center">
                                <span className="text-lg mr-1">$</span>
                                <span className="text-4xl font-bold">0</span>
                                <span className="text-gray-500 ml-1">/Month</span>
                            </span>
                        </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                        <li className="flex items-center text-sm text-gray-600">
                            <div className="w-3 h-3 rounded-full border border-blue-500 mr-3"></div>
                            <span>100 responses a month</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                            <div className="w-3 h-3 rounded-full border border-blue-500 mr-3"></div>
                            <span>Unlimited forms and surveys</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                            <div className="w-3 h-3 rounded-full border border-blue-500 mr-3"></div>
                            <span>Unlimited fields</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                            <div className="w-3 h-3 rounded-full border border-blue-500 mr-3"></div>
                            <span>Basic form creation tools</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                            <div className="w-3 h-3 rounded-full border border-blue-500 mr-3"></div>
                            <span>Up to 2 subdomains</span>
                        </li>

                    </ul>

                    <button
                        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-300 
                            ${currentPlan === 0 
                                ? "bg-blue-600 text-white" 
                                : "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                            }`}
                        onClick={() => handleUpgrade(0)}>
                        {currentPlan === 0 ? "YOUR CURRENT PLAN" : "UPGRADE"}
                    </button>
                </section>
                <section className="tab standard w-[320px] p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col items-center">
                        <img 
                            src="/images/Money_perspective_matte 2.png" 
                            alt="money" 
                            className="w-16 h-16 mb-4"
                        />
                        <h3 className="text-xl font-bold">Standard</h3>
                        <p className="text-gray-600 text-sm mb-4">A simple start for everyone</p>
                        
                        <div className="price-container mb-8">
                            <span className="flex items-center justify-center">
                                <span className="text-lg mr-1">$</span>
                                <span className="text-4xl font-bold">49</span>
                                <span className="text-gray-500 ml-1">/Month</span>
                            </span>
                        </div>
                    </div>
                    <ul className="space-y-3 mb-6">
                        <li className="flex items-center text-sm text-gray-600">
                            <div className="w-3 h-3 rounded-full border border-blue-500 mr-3"></div>
                            <span>Unlimited responses</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                            <div className="w-3 h-3 rounded-full border border-blue-500 mr-3"></div>
                            <span>Unlimited forms and surveys</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                            <div className="w-3 h-3 rounded-full border border-blue-500 mr-3"></div>
                            <span>Instagram profile page</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                            <div className="w-3 h-3 rounded-full border border-blue-500 mr-3"></div>
                            <span>Google Docs integration</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                            <div className="w-3 h-3 rounded-full border border-blue-500 mr-3"></div>
                            <span>Custom “Thank you” page   </span>
                        </li>

                    </ul>
                    <button
                        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-300 
                            ${currentPlan === 1 
                                ? "bg-blue-600 text-white" 
                                : "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                            }`}
                        onClick={() => handleUpgrade(1)}>
                        {currentPlan === 1 ? "YOUR CURRENT PLAN" : "UPGRADE"}
                    </button>
                </section>
                <section className="tab enterprise w-[320px] p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col items-center">
                        <img 
                            src="/images/Money_bag_perspective_matte 2.png" 
                            alt="moneybag" 
                            className="w-16 h-16 mb-4"
                        />
                        <h3 className="text-xl font-bold">Enterprise</h3>
                        <p className="text-gray-600 text-sm mb-4">A simple start for everyone</p>
                        
                        <div className="price-container mb-8">
                            <span className="flex items-center justify-center">
                                <span className="text-lg mr-1">$</span>
                                <span className="text-4xl font-bold">499</span>
                                <span className="text-gray-500 ml-1">/Month</span>
                            </span>
                        </div>
                    </div>
                    <ul className="space-y-3 mb-6">
                        <li className="flex items-center text-sm text-gray-600">
                            <div className="w-3 h-3 rounded-full border border-blue-500 mr-3"></div>
                            <span>PayPal payments</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                            <div className="w-3 h-3 rounded-full border border-blue-500 mr-3"></div>
                            <span>Logic Jumps</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                            <div className="w-3 h-3 rounded-full border border-blue-500 mr-3"></div>
                            <span>File upload with 5GB storage</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                            <div className="w-3 h-3 rounded-full border border-blue-500 mr-3"></div>
                            <span>Custom domain support</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                            <div className="w-3 h-3 rounded-full border border-blue-500 mr-3"></div>
                            <span>Stripe integration</span>
                        </li>

                    </ul>
                    <button
                        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-300 
                            ${currentPlan === 2 
                                ? "bg-blue-600 text-white" 
                                : "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                            }`}
                        onClick={() => handleUpgrade(2)}>
                        {currentPlan === 2 ? "YOUR CURRENT PLAN" : "UPGRADE"}
                    </button>
                </section>
            </article>

            <article className="ad h-[301px]">
                <div className="adWrapper relative">
                    <div className="flex flex-col items-start ml-[140px]">
                        <span className="still text-[20px] mb-[10px]">Still not convinced? Start with a 14-day FREE trial!</span>
                        <p>You will get full access to with all the features for 14 days.</p>
                        <button className="trial">Start 14-day free trial</button>
                    </div>
                    <img className="absolute" src="/images/users_icon2 1.png" alt="icon2" />

                </div>
            </article>

            <article className="mb-[40px]">
                <div className="container mx-auto my-10">
                    <strong className="text-center items-center text-gray-800 text-[30px] mb-4"></strong>

                    <h2 className="text-center text-gray-800 text-[30px] mb-4">
                        Pick a plan that works best for you<br />
                    </h2>
                    <p className="text-center text-gray-800 text-lg mb-4">Stay cool, we have a 48-hour money back guarantee!</p>

                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-left border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-4 text-gray-700 font-semibold">TYPE</th>
                                    <th className="p-4 text-gray-700 font-semibold text-center">STARTER</th>
                                    <th className="p-4 text-gray-700 font-semibold text-center">PRO</th>
                                    <th className="p-4 text-gray-700 font-semibold text-center">ENTERPRISE</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-4 text-gray-600">14-days free trial</td>
                                    <td className="p-4 text-center">✔️</td>
                                    <td className="p-4 text-center">✔️</td>
                                    <td className="p-4 text-center">✔️</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="p-4 text-gray-600">No user limit</td>
                                    <td className="p-4 text-center">❌</td>
                                    <td className="p-4 text-center">✔️</td>
                                    <td className="p-4 text-center">✔️</td>
                                </tr>
                                <tr>
                                    <td className="p-4 text-gray-600">Product Support</td>
                                    <td className="p-4 text-center">❌</td>
                                    <td className="p-4 text-center">✔️</td>
                                    <td className="p-4 text-center">✔️</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="p-4 text-gray-600">Email Support</td>
                                    <td className="p-4 text-center">❌</td>
                                    <td className="p-4 text-center">Save up to 10%</td>
                                    <td className="p-4 text-center">✔️</td>
                                </tr>
                                <tr>
                                    <td className="p-4 text-gray-600">Integrations</td>
                                    <td className="p-4 text-center">❌</td>
                                    <td className="p-4 text-center">✔️</td>
                                    <td className="p-4 text-center">✔️</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="p-4 text-gray-600">Removal of Front branding</td>
                                    <td className="p-4 text-center">❌</td>
                                    <td className="p-4 text-center">Save up to 10%</td>
                                    <td className="p-4 text-center">✔️</td>
                                </tr>
                                <tr>
                                    <td className="p-4 text-gray-600">Active maintenance & support</td>
                                    <td className="p-4 text-center">❌</td>
                                    <td className="p-4 text-center">❌</td>
                                    <td className="p-4 text-center">✔️</td>
                                </tr>
                                <tr className="bg-gray-50">
                                    <td className="p-4 text-gray-600">Data storage for 365 days</td>
                                    <td className="p-4 text-center">❌</td>
                                    <td className="p-4 text-center">❌</td>
                                    <td className="p-4 text-center">✔️</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="p-4"></td>
                                    <td className="p-4 text-center">
                                        <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition">
                                            CHOOSE PLAN
                                        </button>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                                            CHOOSE PLAN
                                        </button>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition">
                                            CHOOSE PLAN
                                        </button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </article>
        </div>
    </div>);
}