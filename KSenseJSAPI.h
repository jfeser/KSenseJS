/**********************************************************\

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

