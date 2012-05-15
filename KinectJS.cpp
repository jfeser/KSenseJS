/**********************************************************\

  Auto-generated KinectJS.cpp

  This file contains the auto-generated main plugin object
  implementation for the Kinect JS project

\**********************************************************/

#include "KinectJSAPI.h"

#include "KinectJS.h"

///////////////////////////////////////////////////////////////////////////////
/// @fn KinectJS::StaticInitialize()
///
/// @brief  Called from PluginFactory::globalPluginInitialize()
///
/// @see FB::FactoryBase::globalPluginInitialize
///////////////////////////////////////////////////////////////////////////////
void KinectJS::StaticInitialize()
{
}

///////////////////////////////////////////////////////////////////////////////
/// @fn KinectJS::StaticInitialize()
///
/// @brief  Called from PluginFactory::globalPluginDeinitialize()
///
/// @see FB::FactoryBase::globalPluginDeinitialize
///////////////////////////////////////////////////////////////////////////////
void KinectJS::StaticDeinitialize()
{
}

///////////////////////////////////////////////////////////////////////////////
/// @brief  KinectJS constructor.  Note that your API is not available
///         at this point, nor the window.  For best results wait to use
///         the JSAPI object until the onPluginReady method is called
///////////////////////////////////////////////////////////////////////////////
KinectJS::KinectJS()
{		
}

///////////////////////////////////////////////////////////////////////////////
/// @brief  KinectJS destructor.
///////////////////////////////////////////////////////////////////////////////
KinectJS::~KinectJS()
{
    // This is optional, but if you reset m_api (the shared_ptr to your JSAPI
    // root object) and tell the host to free the retained JSAPI objects then
    // unless you are holding another shared_ptr reference to your JSAPI object
    // they will be released here.
    releaseRootJSAPI();
    m_host->freeRetainedObjects();
}

//void CALLBACK StatusProc(HRESULT status, const OLECHAR* instance_name, const OLECHAR* unique_name)
//{
//}
//
//HRESULT KinectJS::NuiInit()
//{
//	HRESULT hr;
//	int kinect_sensor_count = 0;
//	m_host->htmlLog("Initializing Kinect.");
//	// Check that there is a sensor connected
//	NuiGetSensorCount(&kinect_sensor_count);
//	if ( kinect_sensor_count <= 0 ) {
//		m_host->htmlLog("No Kinect device found.");
//		return E_FAIL;
//	}
//	char ksc_str[10];
//	itoa(kinect_sensor_count, ksc_str, 10);
//	m_host->htmlLog(std::string(ksc_str));
//
//	// If the kinect is not initialized, try to initialize it
//	if( !current_kinect ) {
//		HRESULT hr = NuiCreateSensorByIndex(0, &current_kinect);
//
//		if ( FAILED(hr) ) {
//			m_host->htmlLog("Unable to create Kinect sensor.");
//			return hr;
//		}
//
//		instanceID = current_kinect->NuiDeviceConnectionId();
//	}
//
//	//nextSkeletonEvent = CreateEvent( NULL, TRUE, FALSE, NULL );
//	NuiSetDeviceStatusCallback((NuiStatusProc)StatusProc, NULL);
//	hr = current_kinect->NuiInitialize(NUI_INITIALIZE_FLAG_USES_SKELETON);
//	if ( FAILED(hr) ) {
//		m_host->htmlLog("Unable to initialize Kinect sensor.");
//		return hr;
//	}
//
//	//// If the sensor has a skeletal engine, register an event to catch skeleton data
//	//if ( HasSkeletalEngine(current_kinect) ) {
//	//	hr = current_kinect->NuiSkeletonTrackingEnable(nextSkeletonEvent, 0);
//	//	if ( FAILED(hr) ) {
//	//		m_host->htmlLog("Unable to enable skeleton tracking.");
//	//		return hr;
//	//	}
//	//}
//
//	//m_host->htmlLog("Initializing Kinect succeeded.");
//	//return hr;
//	return 1;
//}
//
//void KinectJS::NuiUnInit()
//{
//	if ( current_kinect ) {
//		current_kinect->NuiShutdown();
//	}
//	if ( nextSkeletonEvent && ( nextSkeletonEvent != INVALID_HANDLE_VALUE ) ) {
//		CloseHandle( nextSkeletonEvent );
//		nextSkeletonEvent = NULL;
//	}
//	if ( current_kinect ) {
//		current_kinect->Release();
//		current_kinect = NULL;
//	}
//}

void KinectJS::onPluginReady()
{
	HRESULT hr;
	hr = NuiInitialize(NUI_INITIALIZE_FLAG_USES_SKELETON);
	if ( FAILED(hr) ) {
		m_host->htmlLog("Kinect initialization failed.");
	}
	else {
		m_host->htmlLog("Plugin ready.");
	}
}

void KinectJS::shutdown()
{
	NuiShutdown();
}

///////////////////////////////////////////////////////////////////////////////
/// @brief  Creates an instance of the JSAPI object that provides your main
///         Javascript interface.
///
/// Note that m_host is your BrowserHost and shared_ptr returns a
/// FB::PluginCorePtr, which can be used to provide a
/// boost::weak_ptr<KinectJS> for your JSAPI class.
///
/// Be very careful where you hold a shared_ptr to your plugin class from,
/// as it could prevent your plugin class from getting destroyed properly.
///////////////////////////////////////////////////////////////////////////////
FB::JSAPIPtr KinectJS::createJSAPI()
{
    // m_host is the BrowserHost
    return boost::make_shared<KinectJSAPI>(FB::ptr_cast<KinectJS>(shared_from_this()), m_host);
}

bool KinectJS::onMouseDown(FB::MouseDownEvent *evt, FB::PluginWindow *)
{
    //printf("Mouse down at: %d, %d\n", evt->m_x, evt->m_y);
    return false;
}

bool KinectJS::onMouseUp(FB::MouseUpEvent *evt, FB::PluginWindow *)
{
    //printf("Mouse up at: %d, %d\n", evt->m_x, evt->m_y);
    return false;
}

bool KinectJS::onMouseMove(FB::MouseMoveEvent *evt, FB::PluginWindow *)
{
    //printf("Mouse move at: %d, %d\n", evt->m_x, evt->m_y);
    return false;
}
bool KinectJS::onWindowAttached(FB::AttachedEvent *evt, FB::PluginWindow *)
{
    // The window is attached; act appropriately
    return false;
}

bool KinectJS::onWindowDetached(FB::DetachedEvent *evt, FB::PluginWindow *)
{
    // The window is about to be detached; act appropriately
    return false;
}

/*	
	Handle a skeleton alert by storing skeleton data in the appropriate place in the 
	plugin object.
*/
void KinectJS::got_skeleton_alert()
{
	bool found_skeleton;

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
}
