'use client';
import { RiCheckLine, RiQuestionLine, RiSendPlaneFill } from '@remixicon/react'
import { v4 as uuid } from "uuid";
import './globals.css';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IconArrowBack } from "@tabler/icons-react";
import { IconUser } from "@tabler/icons-react";
import Markdown from "markdown-to-jsx";
import UpstashLogo from "./upstash-logo";
import PoweredBy from "./powered-by";


import { useState, useEffect, useRef } from 'react';



export default function Home() {
    const [inputText, setInputText] = useState('');
    const [listData, setListData] = useState([]);
    const [cv_upload, setCvUpload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [canfinish, setCanfinish] = useState(false);//make it false later
    const [askfinish, setAskfinish] = useState(false);//make it false later
    const [selectedFile, setSelectedFile] = useState(null);
    const [unique_id, setunique_id] = useState(0);
    const handleFileInputChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };


    useEffect(() => {
        const fetchData = async () => {
            if (unique_id == 0) {
                try {
                    setLoading(true);
                    let id = uuid();
                    console.log(id);
                    setunique_id(id);
                    const response = await fetch('/api/addToRedisList', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ channel_name: id, text: "hello", type: 1, ai_output: "" }),
                    });
                    if (response.ok) {
                        let buff = await response.arrayBuffer();
                        const decoder = new TextDecoder('utf-8');
                        const decodedString = decoder.decode(buff);
                        setLoading(false);
                        let textFromResponse_obj = { text: decodedString, sender: "ai" };
                        setListData([...listData, textFromResponse_obj]);
                        setInputText('');
                        const response2 = await fetch('/api/addToRedisList', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ channel_name: id, text: "hello", type: 2, ai_output: decodedString }),
                        });
                        if (response2.ok) {
                            //ok
                        } else {
                            console.error('Failed to save chat history.');
                        }

                    } else {
                        console.error('Failed to receive answer from backend1.');
                    }
                } catch (error) {
                    console.error('Error submitting form:', error);
                }
            }

        };
        fetchData();
    }, []);



    function cx(...inputs) {
        return twMerge(clsx(inputs));
    }


    const handleTextSubmit = async (event) => {
        event.preventDefault();
        let user_input = { text: inputText, sender: "user" };
        setListData([...listData, user_input]);
        let temp_text = inputText;
        setInputText('');
        setLoading(true);
        try {
            let textFromResponse = "";
            let response = await fetch('/api/addToRedisList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ channel_name: unique_id, text: temp_text, type: 1, ai_output: "" }),
            });

            if (response.ok) {
                let buff = await response.arrayBuffer();
                const decoder = new TextDecoder('utf-8');
                const decodedString = decoder.decode(buff);
                textFromResponse = decodedString;
                let textFromResponse_obj = { text: textFromResponse, sender: "ai" };
                setLoading(false);
                setListData([...listData, user_input, textFromResponse_obj]);
                const response2 = await fetch('/api/addToRedisList', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ channel_name: unique_id, text: temp_text, type: 2, ai_output: decodedString }),
                });
                if (response2.ok) {
                    //ok
                } else {
                    console.error('Failed to save chat history.');
                }
                response = await fetch('/api/addToRedisList', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ channel_name: unique_id, text: textFromResponse, type: 0, ai_output: "" }),
                });

                if (response.ok) {
                    let buff0 = await response.arrayBuffer();
                    const decoder0 = new TextDecoder('utf-8');
                    const decodedString0 = decoder0.decode(buff0);
                    let textFromResponse0 = decodedString0;
                    if (textFromResponse0.toLowerCase() === "yes") {
                        setCvUpload(true);
                    } else {
                        setAskfinish(true);
                        setCvUpload(false);
                    }
                } else {
                    console.error('Failed check cv upload');
                }
            } else {
                console.error('Failed to receive answer from backend2.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    const handleContinue = async (event) => {
        event.preventDefault();
        setAskfinish(false);
    }
    const handleEnd = async (event) => {
        event.preventDefault();
        setLoading(true);
        let response = await fetch('/api/addToRedisList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ channel_name: unique_id, text: "", type: 5, ai_output: "" }),
        });
        let buff5 = await response.arrayBuffer();
        const decoder5 = new TextDecoder('utf-8');
        const decodedString5 = decoder5.decode(buff5);
        let textFromResponse5 = decodedString5;

        response = await fetch('/api/addToRedisList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ channel_name: unique_id, text: "", type: 4, ai_output: textFromResponse5 }),
        });
        let buff4 = await response.arrayBuffer();
        const decoder4 = new TextDecoder('utf-8');
        const decodedString4 = decoder4.decode(buff4);
        let textFromResponse4 = decodedString4;

        response = await fetch('/api/addToRedisList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ channel_name: unique_id, text: "", type: 7, ai_output: textFromResponse5 }),
        });
        let buff7 = await response.arrayBuffer();
        const decoder7 = new TextDecoder('utf-8');
        const decodedString7 = decoder7.decode(buff7);
        let textFromResponse7 = decodedString7;

        response = await fetch('/api/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uuid: unique_id, answers: textFromResponse5, questions: textFromResponse4, type: 1, user_email: textFromResponse7 }),
        });
        response = await fetch('/api/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uuid: unique_id, answers: textFromResponse5, questions: textFromResponse4, type: 2, user_email: textFromResponse7 }),
        });
        response = await fetch('/api/upload_to_sheets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uuid: unique_id, answers: textFromResponse5 }),
        });
        response = await fetch('/api/addToRedisList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ channel_name: unique_id, text: "", type: 3, ai_output: "" }),
        });
        if (response.ok) {
            let buff = await response.arrayBuffer();
            const decoder = new TextDecoder('utf-8');
            const decodedString = decoder.decode(buff);
            setLoading(false);
            let textFromResponse_obj = { text: decodedString, sender: "ai" };
            setListData([...listData, textFromResponse_obj]);
            setInputText('');
        } else {
            console.error('Failed to receive answer from backend1.');
        }
        setAskfinish(false);

    }
    const handleFileSubmit = async (event) => {
        try {
            event.preventDefault();
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("uuid", unique_id);
            setLoading(true);
            fetch("/api/upload", {
                method: "POST",
                body: formData,
            })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch(error => console.error(error));
            setCvUpload(false);
            const response = await fetch('/api/addToRedisList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ channel_name: unique_id, text: "I uploaded the CV.", type: 1, ai_output: "" }),
            });
            if (response.ok) {
                let buff = await response.arrayBuffer();
                const decoder = new TextDecoder('utf-8');
                const decodedString = decoder.decode(buff);
                let textFromResponse = decodedString;
                let textFromResponse_obj = { text: textFromResponse, sender: "ai" };
                setLoading(false);
                setListData([...listData, textFromResponse_obj]);
                const response2 = await fetch('/api/addToRedisList', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ channel_name: unique_id, text: "I uploaded the CV.", type: 2, ai_output: decodedString }),
                });
                if (response2.ok) {
                    //ok
                    setAskfinish(true);
                    setCanfinish(true);
                } else {
                    console.error('Failed to save chat history.');
                }
            } else {
                console.error('Failed to receive answer from backend3.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const listContainerRef = useRef(null);

    useEffect(() => {
        if (listContainerRef.current) {
            listContainerRef.current.scrollTop = listContainerRef.current.scrollHeight;
        }
    }, [listData]);

    function TextBubble(props) {
        const { text, sender } = props.props;

        /*const bubbleStyle = {
            backgroundColor: sender.toLowerCase() === "user" ? "#007bff" : "white",
            color: sender.toLowerCase() === "user" ? "white" : "black",
            borderRadius: "10px",
            padding: "10px",
            marginBottom: "10px",
        };*/

        const isUser = sender.toLowerCase() === "user";
        const Avatar = ({
            isUser = false
        }) => {
            return (
                <div
                    className={cx(
                        "flex items-center justify-center size-12 shrink-0 rounded-full",
                        isUser ? "bg-transparent text-gray-700" : "bg-transparent",
                    )}
                >
                    {isUser ? <IconUser size={20} /> : <UpstashLogo />}
                </div>
            );
        };
        return (
            <article
                className={cx(
                    "mb-4 flex items-start gap-4 p-4 md:p-5 rounded-2xl",
                    isUser ? "" : "bg-emerald-50 dark:bg-emerald-900/50",
                )}
            >
                <Avatar isUser={isUser} />
                <Markdown
                    className={cx(
                        "py-1.5 md:py-1 space-y-4",
                        isUser ? "font-semibold" : "",
                    )}
                    options={{
                        overrides: {
                            ol: ({ children }) => <ol className="list-decimal">{children}</ol>,
                            ul: ({ children }) => <ol className="list-disc">{children}</ol>,
                        },
                    }}
                >
                    {text}
                </Markdown>
            </article>
        );

        /*return (
            <div style={bubbleStyle}>
                <h3>{text}</h3>
            </div>
        );*/
    }

    return (
        <div className="wrapper">
            <div className="quick-apply-container">
                {/*<h1 className="quick-apply-header">Quick Apply</h1>*/}
                <div className="list-container" ref={listContainerRef}>
                    {listData.map((item, index) => (
                        <TextBubble key={index} props={item}></TextBubble>
                    ))}
                    {loading && <article
                        className={cx(
                            "mb-4 flex items-start gap-4 p-4 md:p-5 rounded-2xl",
                            "bg-emerald-50 dark:bg-emerald-900/50",
                        )}
                    >
                        <div className="loader" />
                    </article>}

                </div>
                <div className="form-container">
                    {canfinish && askfinish ? (
                        <div className={cx(
                            "transition h-10 md:h-12 w-full flex rounded-xl gap-2",
                            "text-base",
                            "disabled:bg-gray-100",
                            "self-center",
                            "justify-center relative"
                        )}>
                            <form onSubmit={handleEnd} className='flex-1'>
                                <button type="submit" className='w-full h-full flex justify-center items-center rounded-xl border border-gray-400'>
                                    <RiCheckLine className="w-5 h-5" />
                                </button>
                            </form>
                            <form onSubmit={handleContinue} className='flex-1'>
                                <button type="submit" className='w-full h-full flex justify-center items-center rounded-xl border border-gray-400'>
                                    <RiQuestionLine className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    ) : (
                        cv_upload ? (
                            <form onSubmit={handleFileSubmit} className="cv-upload-form relative w-full flex items-center gap-4 justify-center">
                                <input required
                                    type="file"
                                    onChange={handleFileInputChange}
                                    className={cx(
                                        "transition h-10 md:h-12 pl-4 pr-12 flex-1 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-sm shadow-md",
                                        "border border-gray-300 dark:border-gray-600 text-base placeholder-gray-500 dark:placeholder-gray-400",
                                        "disabled:bg-gray-100",
                                    )} />
                                <button
                                    type="submit"
                                    tabIndex={-1}
                                    className={cx(
                                        "absolute right-3 top-1/2 -translate-y-1/2",
                                        "opacity-50",
                                    )}
                                >
                                    <RiSendPlaneFill className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleTextSubmit} className="text-input-form relative w-full flex items-center gap-4 justify-center">
                                <input
                                    required
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Enter your answer..."
                                    className={cx(
                                        "transition h-10 md:h-12 pl-4 pr-12 flex-1 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-sm shadow-md",
                                        "border border-gray-300 dark:border-gray-600 text-base placeholder-gray-500 dark:placeholder-gray-400",
                                        "disabled:bg-gray-100",
                                    )}
                                />
                                <button
                                    type="submit"
                                    tabIndex={-1}
                                    className={cx(
                                        "absolute right-3 top-1/2 -translate-y-1/2",
                                        "opacity-50",
                                    )}
                                >
                                    <RiSendPlaneFill className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
                                </button>
                            </form>
                        )
                    )}
                </div>
                {/*Dark Mode Button */}
                <button
                    onClick={() => {
                        document.documentElement.classList.toggle('dark');
                    }}
                    className="fixed bottom-4 right-4 z-50 p-2 rounded-full shadow-lg bg-gray-200 dark:bg-gray-800 hover:scale-105 transition-transform"
                >
                    🌓
                </button>
                <PoweredBy />
            </div>
        </div>
    )
};


