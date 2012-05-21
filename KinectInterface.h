#ifndef KINECT_INTERFACE
#define KINECT_INTERFACE

#include <boost/make_shared.hpp>
#include <boost/utility.hpp>
#include <Windows.h>
#include <NuiApi.h>

#include "PluginCore.h"

class KSenseJS;

FB_FORWARD_PTR(KinectInterface)
typedef boost::shared_ptr<NUI_SKELETON_FRAME> SkeletonDataPtr;

class KinectInterface : boost::noncopyable
{
public:
	~KinectInterface();
	void registerSkeletonDataCallback(KSenseJS* const);
	void unregisterSkeletonDataCallback(KSenseJS* const);
	static KinectInterfacePtr get();
	bool isInitialized() const;

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
