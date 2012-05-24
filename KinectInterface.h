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
