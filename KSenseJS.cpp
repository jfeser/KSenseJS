/**********************************************************\

  Auto-generated KSenseJS.cpp

  This file contains the auto-generated main plugin object
  implementation for the KSense JS project

\**********************************************************/

#include "KSenseJSAPI.h"

#include "KSenseJS.h"

///////////////////////////////////////////////////////////////////////////////
/// @fn KSenseJS::StaticInitialize()
///
/// @brief  Called from PluginFactory::globalPluginInitialize()
///
/// @see FB::FactoryBase::globalPluginInitialize
///////////////////////////////////////////////////////////////////////////////
void KSenseJS::StaticInitialize()
{
}

///////////////////////////////////////////////////////////////////////////////
/// @fn KSenseJS::StaticInitialize()
///
/// @brief  Called from PluginFactory::globalPluginDeinitialize()
///
/// @see FB::FactoryBase::globalPluginDeinitialize
///////////////////////////////////////////////////////////////////////////////
void KSenseJS::StaticDeinitialize()
{
}

///////////////////////////////////////////////////////////////////////////////
/// @brief  KSenseJS constructor.  Note that your API is not available
///         at this point, nor the window.  For best results wait to use
///         the JSAPI object until the onPluginReady method is called
///////////////////////////////////////////////////////////////////////////////
KSenseJS::KSenseJS()
{
}

///////////////////////////////////////////////////////////////////////////////
/// @brief  KSenseJS destructor.
///////////////////////////////////////////////////////////////////////////////
KSenseJS::~KSenseJS()
{
    // This is optional, but if you reset m_api (the shared_ptr to your JSAPI
    // root object) and tell the host to free the retained JSAPI objects then
    // unless you are holding another shared_ptr reference to your JSAPI object
    // they will be released here.
    releaseRootJSAPI();
    m_host->freeRetainedObjects();
}

/*	Get data from the Kinect using a separate thread.  Put that data back into the
	original KSenseJS object. */
DWORD WINAPI KSenseJS::kinectMonitor( LPVOID lpParam )
{
	// pthis is a reference to the object that created the thread.  Use it to access
	// non-static variables.
	KSenseJS *pthis = (KSenseJS *)lpParam;
	const int num_events = 2;
	HANDLE events[num_events] = { pthis->kinect_monitor_stop, pthis->next_skeleton_event };
	DWORD event_id;

	bool continueProcessing = true;
	while ( continueProcessing ) {
		// Wait for events
		event_id = WaitForMultipleObjects( num_events, events, FALSE, 100 );

		// Process events
		switch ( event_id ) {
			case WAIT_TIMEOUT:
				continue;

			case WAIT_OBJECT_0:
				continueProcessing = false;
				continue;

			case WAIT_OBJECT_0 + 1:
				pthis->gotSkeletonAlert();
				break;
		}
	}

	return 0;
}

/*	Called once the plugin is loaded.  Connect to the Kinect and launch a monitoring thread
	here. */
void KSenseJS::onPluginReady()
{
	HRESULT hr;
	hr = NuiInitialize(NUI_INITIALIZE_FLAG_USES_SKELETON);
	if ( FAILED(hr) ) {
		m_host->htmlLog("Kinect initialization failed.");
	}
	else {
		m_host->htmlLog("Plugin ready.");
	}

	next_skeleton_event = CreateEvent( NULL, TRUE, FALSE, NULL );
	NuiSkeletonTrackingEnable(next_skeleton_event, NUI_SKELETON_TRACKING_FLAG_SUPPRESS_NO_FRAME_DATA);

	// Create and launch Kinect monitoring thread
	kinect_monitor_stop = CreateEvent( NULL, FALSE, FALSE, NULL );
	kinect_monitor_thread = CreateThread( NULL, 0, &KSenseJS::kinectMonitor, this, 0, NULL);

	// Get a reference to the root JSAPI object so that we can fire skeleton events
	jsapi = getRootJSAPI();
}

/*	Called when the plugin is unloaded.  Disconnect from the Kinect, shut down the
	monitoring thread and close all handles here. */
void KSenseJS::shutdown()
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
	if ( next_skeleton_event != NULL && ( next_skeleton_event != INVALID_HANDLE_VALUE ) ) {
		CloseHandle( next_skeleton_event );
		next_skeleton_event = NULL;
	}

	// Disconnect from the Kinect
	NuiShutdown();
}

///////////////////////////////////////////////////////////////////////////////
/// @brief  Creates an instance of the JSAPI object that provides your main
///         Javascript interface.
///
/// Note that m_host is your BrowserHost and shared_ptr returns a
/// FB::PluginCorePtr, which can be used to provide a
/// boost::weak_ptr<KSenseJS> for your JSAPI class.
///
/// Be very careful where you hold a shared_ptr to your plugin class from,
/// as it could prevent your plugin class from getting destroyed properly.
///////////////////////////////////////////////////////////////////////////////
FB::JSAPIPtr KSenseJS::createJSAPI()
{
    // m_host is the BrowserHost
    return boost::make_shared<KSenseJSAPI>(FB::ptr_cast<KSenseJS>(shared_from_this()), m_host);
}

bool KSenseJS::onMouseDown(FB::MouseDownEvent *evt, FB::PluginWindow *)
{
    //printf("Mouse down at: %d, %d\n", evt->m_x, evt->m_y);
    return false;
}

bool KSenseJS::onMouseUp(FB::MouseUpEvent *evt, FB::PluginWindow *)
{
    //printf("Mouse up at: %d, %d\n", evt->m_x, evt->m_y);
    return false;
}

bool KSenseJS::onMouseMove(FB::MouseMoveEvent *evt, FB::PluginWindow *)
{
    //printf("Mouse move at: %d, %d\n", evt->m_x, evt->m_y);
    return false;
}
bool KSenseJS::onWindowAttached(FB::AttachedEvent *evt, FB::PluginWindow *)
{
    // The window is attached; act appropriately
    return false;
}

bool KSenseJS::onWindowDetached(FB::DetachedEvent *evt, FB::PluginWindow *)
{
    // The window is about to be detached; act appropriately
    return false;
}

/*	Handle a skeleton alert by storing skeleton data in the appropriate place in the 
	plugin object. */
void KSenseJS::gotSkeletonAlert()
{
	bool found_skeleton = false;

	// Check that there is skeleton data in the skeleton frame.
	if( SUCCEEDED(NuiSkeletonGetNextFrame(0, &last_skeleton_frame)) ) {
		for( int i = 0; i < NUI_SKELETON_COUNT; i++ ) {
			if ( last_skeleton_frame.SkeletonData[i].eTrackingState == NUI_SKELETON_TRACKED ) {
				found_skeleton = true;
			}
		}
	}

	// If we find no skeletons, return.
	if ( !found_skeleton ) {
		return;
	}

	// Smooth out the skeleton data
    HRESULT hr = NuiTransformSmooth(&last_skeleton_frame,NULL);
    if ( FAILED(hr) ) {
        return;
    }

	// If we reach this point, we have new skeleton data, so we need to fire an event
	FB::VariantList args;
	jsapi->Invoke("newSkeletonDataEvent", args);
}
