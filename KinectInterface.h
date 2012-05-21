#ifndef KINECT_INTERFACE
#define KINECT_INTERFACE

#include <boost/make_shared.hpp>
#include <boost/utility.hpp>
#include <Windows.h>
#include <NuiApi.h>

#include "PluginCore.h"

FB_FORWARD_PTR(KinectInterface)
typedef boost::shared_ptr<NUI_SKELETON_FRAME> SkeletonDataPtr;

class KinectInterface
{
public:
	~KinectInterface();
	void registerSkeletonDataCallback(KSenseJS*);
	static KinectInterfacePtr getKinectInterface();
	bool isInitialized();

private:
	KinectInterface();
	HRESULT initializeKinect();
	void shutdownKinect();
	
	static KinectInterfacePtr	instance;
	bool						initialized;

	// Threading
	DWORD WINAPI				kinectMonitor(LPVOID);
	HANDLE						kinect_monitor_stop;
	HANDLE						kinect_monitor_thread;

	// Callbacks
	std::list<KSenseJS*>		callback_objects;
	void						onSkeletonEvent();
	HANDLE						skeleton_event;
};

#endif //KINECT_INTERFACE
