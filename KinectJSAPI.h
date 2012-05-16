/**********************************************************\

  Auto-generated KinectJSAPI.h

\**********************************************************/

#include <string>
#include <sstream>
#include <boost/weak_ptr.hpp>
#include "JSAPIAuto.h"
#include "BrowserHost.h"
#include "KinectJS.h"

#ifndef H_KinectJSAPI
#define H_KinectJSAPI

class KinectJSAPI : public FB::JSAPIAuto
{
public:
    ////////////////////////////////////////////////////////////////////////////
    /// @fn KinectJSAPI::KinectJSAPI(const KinectJSPtr& plugin, const FB::BrowserHostPtr host)
    ///
    /// @brief  Constructor for your JSAPI object.
    ///         You should register your methods, properties, and events
    ///         that should be accessible to Javascript from here.
    ///
    /// @see FB::JSAPIAuto::registerMethod
    /// @see FB::JSAPIAuto::registerProperty
    /// @see FB::JSAPIAuto::registerEvent
    ////////////////////////////////////////////////////////////////////////////
    KinectJSAPI(const KinectJSPtr& plugin, const FB::BrowserHostPtr& host) :
        m_plugin(plugin), m_host(host)
    {
		registerMethod("getSkeletonData", make_method(this, &KinectJSAPI::get_skeleton_data));
		// There is never a good reason to call this from javascript.  It should only
		// be called by the plugin object.
		registerMethod("newSkeletonDataEvent", make_method(this, &KinectJSAPI::new_skeleton_data_event));

		registerProperty("trackedSkeletonCount", 
						 make_property(this, &KinectJSAPI::get_tracked_skeletons_count));
		registerProperty("trackedSkeletonIDs",
						 make_property(this, &KinectJSAPI::get_valid_tracking_ids));
    }

    ///////////////////////////////////////////////////////////////////////////////
    /// @fn KinectJSAPI::~KinectJSAPI()
    ///
    /// @brief  Destructor.  Remember that this object will not be released until
    ///         the browser is done with it; this will almost definitely be after
    ///         the plugin is released.
    ///////////////////////////////////////////////////////////////////////////////
    virtual ~KinectJSAPI() {};

    KinectJSPtr getPlugin();
    
    // Event helpers
	FB_JSAPI_EVENT(newskeletondata, 0, ());
	
	int get_tracked_skeletons_count();
	FB::VariantList get_valid_tracking_ids();
	FB::VariantList get_skeleton_data(int);
	void new_skeleton_data_event();

private:
    KinectJSWeakPtr m_plugin;
    FB::BrowserHostPtr m_host;
};

#endif // H_KinectJSAPI

