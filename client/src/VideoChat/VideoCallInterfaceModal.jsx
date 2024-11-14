import React, { useContext, useEffect, useState } from 'react';
import VideoWrapper from './common/VideoWrapper';
import { VideoCallContext } from '../Contexts/VideCallContext';
import Loader from '../common/Loader';
import {
    MdCallEnd, MdMicOff, MdOutlineScreenShare,
    MdVideocam, MdVideocamOff
} from "react-icons/md";
import { IoMdMic } from 'react-icons/io';
import useUserMedia from '../hooks/useMediaStream';
import UseMediaControls from '../hooks/useMediaControls';

const VideoCallInterfaceModal = () => {
    const { remoteStream,remoteVideoRef,
        handleOnClickCallEnd,
        myStream, localStreamRef, isMuted, camOn, partnerMicStatus, partnerCamStatus } = useContext(VideoCallContext);
    const { handleToggleAudio, handleToggleVideo } = UseMediaControls()
const [partnerStream,setPartnerStream]=useState(remoteStream)

    useEffect(() => {
        setPartnerStream(remoteStream||remoteVideoRef.current)
    },[remoteStream, remoteVideoRef] 
    )
console.log(partnerStream)
    return (
        <div className='bg-slate-100 dark:bg-stone-800 p-4 h-full w-full text-gray-900 dark:text-gray-200 flex flex-col-reverse md:grid md:grid-cols-4 gap-4'>
            {/* Local Video Section */}
            <div className='relative col-span-4 md:col-span-3 h-[60vh] md:h-full  rounded-lg overflow-hidden'>
                <div className='fixed top-3 left-2 z-30'>
                    {
                        !partnerMicStatus ? <IoMdMic className='text-3xl text-white bg-green-500 hover:bg-blue-600 rounded-full p-2 cursor-pointer' />
                            : <MdMicOff className='text-3xl text-white bg-red-500 hover:bg-blue-600 rounded-full p-2 cursor-pointer' />}
                </div>
                {partnerStream ? (
                    <>
                        <VideoWrapper stream={partnerStream} isMuted={false} />
                        
                    </>
                )
                    : (
                        <div className='flex items-center justify-center h-full'>
                            <Loader />
                        </div>
                    )
                }

                {/* Controls */}
                <div className='absolute inset-x-0 bottom-4 md:bottom-8 flex justify-around md:justify-center gap-4 px-2 md:px-8'>
                    <MdCallEnd onClick={handleOnClickCallEnd} className='text-4xl text-white bg-red-500 hover:bg-red-600 rounded-full p-2 cursor-pointer' />
                    {!isMuted ? <IoMdMic onClick={handleToggleAudio} className='text-4xl text-white bg-green-500 hover:bg-blue-600 rounded-full p-2 cursor-pointer' />
                        : <MdMicOff onClick={handleToggleAudio} className='text-4xl text-white bg-red-500 hover:bg-blue-600 rounded-full p-2 cursor-pointer' />}
                    {
                        camOn ? <MdVideocam onClick={handleToggleVideo} className='text-4xl text-white bg-green-500 hover:bg-red-600 rounded-full p-2 cursor-pointer' />
                            : <MdVideocamOff onClick={handleToggleVideo} className='text-4xl text-white bg-red-500 hover:bg-red-600 rounded-full p-2 cursor-pointer' />
                    }

                </div>
            </div>

            {/* Remote Video Section */}
            <div className='relative col-span-4 md:col-span-1 h-40 md:h-auto  rounded-lg overflow-hidden'>
                <div className='bg-slate-800 h-full md:h-fit absolute bottom-2 rounded-lg overflow-clip w-full'>
                    <div className='fixed top-3 left-2 z-30'>
                        {
                            !isMuted ? <IoMdMic className='text-4xl text-white bg-green-500 hover:bg-blue-600 rounded-full p-2 cursor-pointer' />
                                : <MdMicOff className='text-4xl text-white bg-red-500 hover:bg-blue-600 rounded-full p-2 cursor-pointer' />}
                    </div>

                    {myStream ? (
                        <VideoWrapper stream={localStreamRef.current || myStream} isMuted={true} />
                    ) : (
                        <div className='flex items-center justify-center h-full'>
                            <Loader />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default VideoCallInterfaceModal;
