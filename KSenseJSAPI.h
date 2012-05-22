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
        m_plugin(plugin), m_host(host)
    {
		registerMethod("getSkeletonData", make_method(this, &KSenseJSAPI::get_skeleton_data));
		registerMethod("getVelocityData", make_method(this, &KSenseJSAPI::getJointVelocity));
		// There is never a good reason to call this from javascript.  It should only
		// be called by the plugin object.
		registerMethod("newSkeletonDataEvent", make_method(this, &KSenseJSAPI::new_skeleton_data_event));

		registerProperty("trackedSkeletonCount", 
						 make_property(this, &KSenseJSAPI::get_tracked_skeletons_count));
		registerProperty("trackedSkeletonIDs",
						 make_property(this, &KSenseJSAPI::get_valid_tracking_ids));
    }

    ///////////////////////////////////////////////////////////////////////////////
    /// @fn KSenseJSAPI::~KSenseJSAPI()
    ///
    /// @brief  Destructor.  Remember that this object will not be released until
    ///         the browser is done with it; this will almost definitely be after
    ///         the plugin is released.
    ///////////////////////////////////////////////////////////////////////////////
    virtual ~KSenseJSAPI() {};

    KSenseJSPtr getPlugin();
    
    // Event helpers
	FB_JSAPI_EVENT(newskeletondata, 0, ());
	
	// API functions
	int get_tracked_skeletons_count();
	FB::VariantList get_valid_tracking_ids();
	FB::VariantList get_skeleton_data(const int);
	void new_skeleton_data_event();

	FB::VariantList getJointVelocity(const int);

	NUI_SKELETON_DATA const* getDataByTrackingID(const int);
	NUI_SKELETON_DATA const* getDataByTrackingID(const int, SkeletonDataPtr);

private:
    KSenseJSWeakPtr m_plugin;
    FB::BrowserHostPtr m_host;
};

#endif // H_KSenseJSAPI

