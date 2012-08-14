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

  Auto-generated KSenseJSAPI.h

\**********************************************************/

#include <string>
#include <sstream>
#include <boost/weak_ptr.hpp>
#include "JSAPIAuto.h"
#include "BrowserHost.h"
#include "KSenseJS.h"

#ifndef H_KSenseJSAPI
#define H_KSenseJSAPI

class KSenseJSAPI : public FB::JSAPIAuto
{
public:
    ////////////////////////////////////////////////////////////////////////////
    /// @fn KSenseJSAPI::KSenseJSAPI(const KSenseJSPtr& plugin, const FB::BrowserHostPtr host)
    ///
    /// @brief  Constructor for your JSAPI object.
    ///         You should register your methods, properties, and events
    ///         that should be accessible to Javascript from here.
    ///
    /// @see FB::JSAPIAuto::registerMethod
    /// @see FB::JSAPIAuto::registerProperty
    /// @see FB::JSAPIAuto::registerEvent
    ////////////////////////////////////////////////////////////////////////////
    KSenseJSAPI(const KSenseJSPtr& plugin, const FB::BrowserHostPtr& host) :
        m_plugin(plugin)//, m_host(host)
    {
		registerMethod("getSkeletonData", make_method(this, &KSenseJSAPI::getSkeletonData));
		registerMethod("getVelocityData", make_method(this, &KSenseJSAPI::getVelocityData));
		registerMethod("getDeltaTime", make_method(this, &KSenseJSAPI::getDeltaTime));
		// There is never a good reason to call this from javascript.  It should only
		// be called by the plugin object.
		registerMethod("newSkeletonDataEvent", make_method(this, &KSenseJSAPI::new_skeleton_data_event));

		FBLOG_DEBUG("KinectJSAPI()", "Created KinectJSAPI");
    }

    ///////////////////////////////////////////////////////////////////////////////
    /// @fn KSenseJSAPI::~KSenseJSAPI()
    ///
    /// @brief  Destructor.  Remember that this object will not be released until
    ///         the browser is done with it; this will almost definitely be after
    ///         the plugin is released.
    ///////////////////////////////////////////////////////////////////////////////
    virtual ~KSenseJSAPI() {FBLOG_DEBUG("~KinectJSAPI()", "Destroyed KinectJSAPI");};

    KSenseJSPtr getPlugin();

    // Event helpers
	FB_JSAPI_EVENT(newskeletondata, 0, ());

	// API functions
	FB::VariantMap getSkeletonData();
	FB::VariantMap getVelocityData();
	__int64 getDeltaTime();
	void new_skeleton_data_event();

private:
    KSenseJSWeakPtr m_plugin;
    //FB::BrowserHostPtr m_host;
};

#endif // H_KSenseJSAPI
