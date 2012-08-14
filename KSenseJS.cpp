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

/**********************************************************	\

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
	delta_time = -1;
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
	previous_skeleton_data = current_skeleton_data;
	current_skeleton_data = new_skeleton_data;

	if ( current_skeleton_data && previous_skeleton_data ) {
		delta_time = current_skeleton_data->liTimeStamp.QuadPart - previous_skeleton_data->liTimeStamp.QuadPart;
	}

	FB::VariantList args;
	jsapi->Invoke("newSkeletonDataEvent", args);
}

SkeletonDataPtr KSenseJS::getCurrentSkeletonDataPtr() const
{
	return current_skeleton_data;
}

SkeletonDataPtr KSenseJS::getPreviousSkeletonDataPtr() const
{
	return previous_skeleton_data;
}

__int64 KSenseJS::getDeltaTime() const
{
	return delta_time;
}
