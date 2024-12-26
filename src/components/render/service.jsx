import { FaLeaf, FaUsers, FaUserCircle, FaHeadset } from 'react-icons/fa';

const categoryItems = [
    {
        icon: <FaLeaf />,
        title: "Plant Care",
        gradient: "from-green-400 to-green-600"
    },
    {
        icon: <FaUsers />,
        title: "Community",
        gradient: "from-blue-400 to-blue-600"
    },
    {
        icon: <FaUserCircle />,
        title: "Account",
        gradient: "from-purple-400 to-purple-600"
    },
    {
        icon: <FaHeadset />,
        title: "Support",
        gradient: "from-pink-400 to-pink-600"
    }
];

const knowledgeBaseItems = [
    {
        icon: "📗",
        title: "Getting Started",
        gradient: "from-green-400 to-green-600",
        items: ["Account", "Authentication", "Billing"],
        articles: 14
    },
    {
        icon: "📦",
        title: "Orders",
        gradient: "from-orange-400 to-orange-600",
        items: ["Processing orders", "Payments", "Returns, Refunds and Replacements"],
        articles: 13
    },
    {
        icon: "🔒",
        title: "Safety and security",
        gradient: "from-yellow-400 to-yellow-600",
        items: ["Security and hacked accounts", "Privacy", "Spam and fake accounts"],
        articles: 9
    },
    {
        icon: "📜",
        title: "Rules and policies",
        gradient: "from-pink-400 to-pink-600",
        items: ["General", "Intellectual property", "Guidelines for law enforcement"],
        articles: 14
    },
    {
        icon: "💬",
        title: "Chats",
        gradient: "from-blue-400 to-blue-600",
        items: ["General", "Features", "Encryption"],
        articles: 14
    },
    {
        icon: "🔗",
        title: "Connections",
        gradient: "from-purple-400 to-purple-600",
        items: ["Conversations", "Jobs", "People"],
        articles: 14
    }
];

const popularArticles = [
    {
        id: 1,
        title: "Key Features",
        description: "Plantry 이용해보기",
        icon: "🔑"
    },
    {
        id: 2,
        title: "Mobile Guide",
        description: "Plantry 이용해보기",
        icon: "📱"
    },
    {
        id: 3,
        title: "AI Features",
        description: "Plantry 이용해보기",
        icon: "🤖"
    }
];

export default function Service() {
    return (
        <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pt-[120px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <section className="serviceInfo py-24">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Hello, how can we help?
                        </h1>
                        <p className="text-xl text-gray-600 mb-20">
                            or choose a category to quickly find the help you need
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {categoryItems.map((item, index) => (
                                <div key={index} className="group">
                                    <div className="relative p-6 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-lg flex items-center justify-center shadow-lg`}>
                                                <div className="w-6 h-6 text-white">{item.icon}</div>
                                            </div>
                                        </div>
                                        <div className="mt-8">
                                            <p className="font-semibold text-gray-800">{item.title}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Popular Articles Section */}
                <section className="py-20">
                    <h2 className="text-4xl font-bold text-center mb-16 relative">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Popular Articles
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {popularArticles.map((article) => (
                            <div key={article.id} className="group relative">
                                <div className="bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-2xl">
                                    <div className="mb-8 transform group-hover:scale-105 transition-transform duration-300">
                                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 flex items-center justify-center">
                                            <span className="text-4xl animate-bounce-slow">
                                                {article.icon}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{article.title}</h3>
                                    <p className="text-gray-600 mb-6">{article.description}</p>
                                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium 
                                                   transition-all duration-300 hover:opacity-90 hover:shadow-lg">
                                        READ MORE
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Knowledge Base Section */}
                <section className="py-20">
                    <h2 className="text-4xl font-bold text-center mb-16">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Knowledge Base
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {knowledgeBaseItems.map((item, index) => (
                            <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center mb-6">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-lg flex items-center justify-center shadow-md`}>
                                        <span className="text-xl text-white">{item.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-bold ml-4">{item.title}</h3>
                                </div>
                                <ul className="space-y-4">
                                    {item.items.map((subItem, idx) => (
                                        <li key={idx}>
                                            <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></span>
                                                {subItem}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                                            📄
                                        </span>
                                        {item.articles} Articles
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}