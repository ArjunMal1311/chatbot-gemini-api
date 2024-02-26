"use client"
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Kdam_Thmor_Pro } from "next/font/google";

const Roboto_Font = Kdam_Thmor_Pro({
    subsets: [],
    weight: '400'
})

const Chatbot = () => {
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversationHistory, setConversationHistory] = useState([
        {
            role: "user",
            parts: "Hello, there, how are you doing?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
            role: "model",
            parts: "Great to meet you. What would you like to know?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
    ]);

    const sendMessage = async () => {
        try {
            setLoading(true);

            const response = await axios.post("/api/ai", {
                message: inputMessage,
                history: conversationHistory,
            });

            const data = response.data;

            setInputMessage("");

            setConversationHistory(prevHistory => [
                ...prevHistory,
                { role: "user", parts: inputMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                { role: "model", parts: data, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            ]);

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen px-16 pt-4 pb-8">
            <div className="flex justify-between items-center">
                <div className={`font-bold text-3xl py-4 ${Roboto_Font.className}`}>HOPE AI</div>

                <div>
                    <div className="flex items-center">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Help
                        </button>
                    </div>
                </div>
            </div>

            <div className="h-[90%] overflow-y-scroll border-t-2 py-3" id="style-4">
                {conversationHistory.map((item, index) => (
                    <div key={index} className={`flex ${item.role === "user" ? "justify-end" : ""}`}>
                        <div className="flex items-center px-8">
                            <div>
                                <div className={`h-[50px] w-[50px] rounded-full ${item.role === "model" ? "flex" : "hidden"}`}>
                                    <Image
                                        src={"/model.svg"}
                                        height={50}
                                        width={50}
                                        alt="img"
                                    />
                                </div>
                            </div>

                            <div className={`${item.role === "user" ? "bg-[#007AFF] text-white" : "bg-[#e9e9e9] text-black w-[50%]"} px-4 m-4  py-2 rounded-lg`}>
                                <div className="">
                                    {item.role === "model" && <div className="font-semibold">
                                        HOPE AI
                                    </div>}
                                </div>
                                <div className={`${item.role === "user" ? "text-white" : "text-[#2c2c2e]"} `}>
                                    {item.parts}
                                    <div className={`flex justify-end py-1 text-sm  ${item.role === "model" && "text-gray-500"} `}>{item.timestamp}</div>
                                </div>
                            </div>

                            <div>
                                <div className={`h-[50px] w-[50px] bg-black rounded-full ${item.role === "user" ? "flex" : "hidden"}`}>
                                    <Image
                                        src={"/user.png"}
                                        height={50}
                                        width={50}
                                        alt="img"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {loading && <div className="flex items-center">
                    <div className={`h-[50px] w-[50px] px-2 rounded-full`}>
                        <Image
                            src={"/model.svg"}
                            height={50}
                            width={50}
                            alt="img"
                        />
                    </div>
                    <div className={`bg-[#e9e9e9] text-white px-4 w-fit m-2 py-2 rounded-lg`}>
                        Generating...
                    </div>
                </div>}
            </div>

            <div className="pt-8">
                <div className="flex justify-center">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Enter your message here"
                        disabled={loading}
                        className="flex-1 border border-gray-300 rounded-l-lg p-2"
                    />
                    <button onClick={sendMessage} className="bg-blue-500 text-white rounded-r-lg px-4">Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
