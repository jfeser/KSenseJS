#include "KinectInterface.h"

#include <boost/make_shared.hpp>
#include <Windows.h>
#include <NuiApi.h>

#include "KSenseJS.h"
#include "PluginCore.h"

KinectInterface::KinectInterface()
{
}

KinectInterface::~KinectInterface()
{
	shutdownKinect();
}

/*	Get data from the Kinect using a separate thread.  Call onSkeletonEvent to handle that
	data.  If the kinect_monitor_stop event is set, then shut down the thread. */
DWORD WINAPI KinectInterface::kinectMonitor( LPVOID lpParam )
{
	// pthis is a reference to the object that created the thread.  Use it to access
	// non-static variables.
	KinectInterface *pthis = (KinectInterface*)lpParam;
	const int num_events = 2;
	HANDLE events[num_events] = { pthis->kinect_monitor_stop, pthis->skeleton_event };
	DWORD event_id;

	bool continueProcessing = true;
	while ( continueProcessing ) {
		// Wait for events
		event_id = WaitForMultipleObjects( num_events, events, FALSE, 100 );

		// Process events
		switch ( event_id ) {
			case WAIT_TIMEOUT:
				continue;

			// Kinect monitor stop
			case WAIT_OBJECT_0:
				continueProcessing = false;
				continue;

			// New skeleton data
			case WAIT_OBJECT_0 + 1:
				pthis->onSkeletonEvent();
				break;
		}
	}

	return 0;
}

/*	Initialize the Kinect.  Set up the new data event and launch a thread to monitor the
	Kinect. */
HRESULT KinectInterface::initializeKinect() 
{
	HRESULT hr = NuiInitialize(NUI_INITIALIZE_FLAG_USES_SKELETON);
	if ( FAILED(hr) ) { return hr; }

	// Create an event to be set when there is new skeleton data
	skeleton_event = CreateEvent( NULL, TRUE, FALSE, NULL );
	if ( skeleton_event == NULL ) { return E_FAIL; }

	hr = NuiSkeletonTrackingEnable(skeleton_event, NUI_SKELETON_TRACKING_FLAG_SUPPRESS_NO_FRAME_DATA);
	if ( FAILED(hr) ) { return hr; }

	// Create and launch Kinect monitoring thread
	kinect_monitor_stop = CreateEvent( NULL, FALSE, FALSE, NULL );
	if ( kinect_monitor_stop == NULL ) { return E_FAIL; }

	kinect_monitor_thread = CreateThread( NULL, 0, &KinectInterface::kinectMonitor, this, 0, NULL);
	if ( kinect_monitor_thread == NULL ) { return E_FAIL; }

	return S_OK;
}

void KinectInterface::shutdownKinect()
{
	// Stop the Kinect monitoring thread and clean up handles
	if ( kinect_monitor_stop != NULL ) {
		SetEvent(kinect_monitor_stop); 

		if ( kinect_monitor_thread != NULL ) {
			WaitForSingleObject( kinect_monitor_thread, INFINITE );
			CloseHandle( kinect_monitor_thread );
		}
		CloseHandle( kinect_monitor_stop );
	}

	// Clean up remaining handles
	if ( skeleton_event != NULL && ( skeleton_event != INVALID_HANDLE_VALUE ) ) {
		CloseHandle( skeleton_event );
		skeleton_event = NULL;
	}

	NuiShutdown();
}

/*	Get a pointer to the KinectInterface.  Only allow one copy to be created.  When the
	first copy is created, initialize the Kinect. */
KinectInterfacePtr KinectInterface::get()
{
	KinectInterfacePtr instance = singleton.lock();
	if (!instance) {
		instance.reset(new KinectInterface());
		singleton = instance;

		HRESULT hr = instance->initializeKinect();
		// If something goes wrong, shut everything down
		if ( FAILED(hr) ) {
			instance->shutdownKinect();
			instance->initialized = false;
		} else {
			instance->initialized = true;
		}
	}
	return instance;
}

/*	Check whether the Kinect has been correctly initialized. */
bool KinectInterface::isInitialized() const
{
	return initialized;
}

/*	Add KinectJS pointer to callback list. */
void KinectInterface::registerSkeletonDataCallback(KSenseJS* const c)
{
	if ( c != NULL ) {
		callback_objects.insert(c);
	}
}

/*	Remove KinectJS pointer from callback list. */
void KinectInterface::unregisterSkeletonDataCallback(KSenseJS* const c)
{
	std::set<KSenseJS*>::iterator callback_location = callback_objects.find(c);
	if ( callback_location != callback_objects.end() ) {
		callback_objects.erase(callback_location);
	}
}

/*	Handle a new skeleton data event.  Check that there is data in the skeleton frame and
	smooth the data.  Then pass shared pointers to the frame to the objects that have
	registered to receive data. */
void KinectInterface::onSkeletonEvent()
{
	bool found_skeleton = false;
	NUI_SKELETON_FRAME* skeleton_data = new NUI_SKELETON_FRAME;

	// Check that there is skeleton data in the skeleton frame.
	if( SUCCEEDED(NuiSkeletonGetNextFrame(0, skeleton_data)) ) {
		for( int i = 0; i < NUI_SKELETON_COUNT; i++ ) {
			if ( skeleton_data->SkeletonData[i].eTrackingState == NUI_SKELETON_TRACKED ) {
				found_skeleton = true;
			}
		}
	}

	// If we find no skeletons, return.
	if ( !found_skeleton ) {
		return;
	}

	// Smooth out the skeleton data
    HRESULT hr = NuiTransformSmooth(skeleton_data, NULL);
    if ( FAILED(hr) ) {
        return;
    }

	boost::shared_ptr<NUI_SKELETON_FRAME> skeleton_data_ptr(skeleton_data);
	// Iterate through the list of callbacks and give each a pointer to the new
	// skeleton data.
	for ( std::set<KSenseJS*>::iterator it = callback_objects.begin(); it != callback_objects.end(); it++ ) {
		(*it)->onNewSkeletonData(skeleton_data_ptr);
	}
}

KinectInterfaceWeakPtr KinectInterface::singleton = KinectInterfaceWeakPtr();