/**********************************************************\

  Auto-generated KSenseJS.cpp

  This file contains the auto-generated main plugin object
  implementation for the KSense JS project

\**********************************************************/

#include "KSenseJS.h"

#include "KSenseJSAPI.h"
#include "KinectInterface.h"

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

	// We really don't want to try to handle new skeleton data while destroying a
	// plugin object.
	kinect_interface->unregisterSkeletonDataCallback(this);
    releaseRootJSAPI();
    m_host->freeRetainedObjects();
}

/*	Called once the plugin is loaded. */
void KSenseJS::onPluginReady()
{
	kinect_interface = KinectInterface::get();
	if ( kinect_interface->isInitialized() ) {
		m_host->htmlLog("Kinect initialization succeeded.");
	} else {
		m_host->htmlLog("Kinect initialization failed.");
	}

	// Get a reference to the root JSAPI object so that we can fire skeleton events
	jsapi = getRootJSAPI();

	// Register to get skeleton data
	kinect_interface->registerSkeletonDataCallback(this);
}

/*	Called when the plugin is unloaded.  Disconnect from the Kinect, shut down the
	monitoring thread and close all handles here. */
void KSenseJS::shutdown()
{
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

/*	Called by the KinectInterface object when new skeleton data is available. */
void KSenseJS::onNewSkeletonData(SkeletonDataPtr new_skeleton_data)
{
	// Store the new data pointer and let the API know that new data is available.
	skeleton_data = new_skeleton_data;
	FB::VariantList args;
	jsapi->Invoke("newSkeletonDataEvent", args);
}

SkeletonDataPtr KSenseJS::getSkeletonDataPtr()
{
	return skeleton_data;
}