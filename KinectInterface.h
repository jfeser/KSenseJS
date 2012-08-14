// Copyright (c) 2012, John Feser
// All rights reserved.

// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:

// Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.

// Redistributions in binary form must reproduce the above copyright
// notice, this list of conditions and the following disclaimer in the
// documentation and/or other materials provided with the
// distribution.

// Neither the name of the University of Illinois nor the names of its
// contributors may be used to endorse or promote products derived
// from this software without specific prior written permission.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
// FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
// HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
// OF THE POSSIBILITY OF SUCH DAMAGE.

#ifndef KINECT_INTERFACE
#define KINECT_INTERFACE

#include <boost/make_shared.hpp>
#include <boost/utility.hpp>
#include <Windows.h>
#include <NuiApi.h>
#include <set>

#include "FBPointers.h"

class KSenseJS;

FB_FORWARD_PTR(KinectInterface)
typedef boost::shared_ptr<const NUI_SKELETON_FRAME> SkeletonDataPtr;

class KinectInterface : boost::noncopyable
{
public:
	~KinectInterface();
	void registerSkeletonDataCallback(KSenseJS* const);
	void unregisterSkeletonDataCallback(KSenseJS* const);
	static KinectInterfacePtr get();
	bool isInitialized() const;

	// Needed to avoid crashing on page reloads.  See http://www.microsoft.com/en-us/kinectforwindows/develop/release-notes.aspx#_6._known_issues
	static void CALLBACK	Nui_StatusProcThunk(HRESULT hrStatus, const OLECHAR* instanceName, const OLECHAR* uniqueDeviceName, void* pUserData);
    void CALLBACK			Nui_StatusProc( HRESULT hrStatus, const OLECHAR* instanceName, const OLECHAR* uniqueDeviceName );

private:
	KinectInterface();
	HRESULT initializeKinect();
	void shutdownKinect();

	static KinectInterfaceWeakPtr	singleton;
	bool							initialized;

	// Threading
	static DWORD WINAPI __stdcall	kinectMonitor(LPVOID);
	HANDLE							kinect_monitor_stop;
	HANDLE							kinect_monitor_thread;

	// Callbacks
	std::set<KSenseJS*>				callback_objects;
	void							onSkeletonEvent();
	HANDLE							skeleton_event;
};

#endif //KINECT_INTERFACE
