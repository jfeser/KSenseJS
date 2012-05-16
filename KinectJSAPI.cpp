/**********************************************************\

  Auto-generated KinectJSAPI.cpp

\**********************************************************/

#include "JSObject.h"
#include "variant_list.h"
#include "DOM/Document.h"
#include "global/config.h"

#include "KinectJSAPI.h"

///////////////////////////////////////////////////////////////////////////////
/// @fn FB::variant KinectJSAPI::echo(const FB::variant& msg)
///
/// @brief  Echos whatever is passed from Javascript.
///         Go ahead and change it. See what happens!
///////////////////////////////////////////////////////////////////////////////
FB::variant KinectJSAPI::echo(const FB::variant& msg)
{
    static int n(0);
    fire_echo("So far, you clicked this many times: ", n++);

    // return "foobar";
    return msg;
}

///////////////////////////////////////////////////////////////////////////////
/// @fn KinectJSPtr KinectJSAPI::getPlugin()
///
/// @brief  Gets a reference to the plugin that was passed in when the object
///         was created.  If the plugin has already been released then this
///         will throw a FB::script_error that will be translated into a
///         javascript exception in the page.
///////////////////////////////////////////////////////////////////////////////
KinectJSPtr KinectJSAPI::getPlugin()
{
    KinectJSPtr plugin(m_plugin.lock());
    if (!plugin) {
        throw FB::script_error("The plugin is invalid");
    }
    return plugin;
}

// Read/Write property testString
std::string KinectJSAPI::get_testString()
{
    return m_testString;
}

void KinectJSAPI::set_testString(const std::string& val)
{
    m_testString = val;
}

// Read-only property version
std::string KinectJSAPI::get_version()
{
    return FBSTRING_PLUGIN_VERSION;
}

void KinectJSAPI::testEvent()
{
    fire_test();
}

int KinectJSAPI::get_tracked_skeletons_count()
{
	int tracked_skeleton_count = 0;
	KinectJSPtr plugin = getPlugin();

	for ( int i = 0; i < NUI_SKELETON_COUNT; i++ ) {
		if ( plugin->last_skeleton_frame.SkeletonData[i].eTrackingState == NUI_SKELETON_TRACKED ) {
			tracked_skeleton_count++;
		}
	}

	return tracked_skeleton_count;
}

FB::VariantList KinectJSAPI::get_valid_tracking_ids()
{
	KinectJSPtr plugin = getPlugin();
	FB::VariantList tracking_ids;

	for ( int i = 0; i < NUI_SKELETON_COUNT; i++ ) {
		if ( plugin->last_skeleton_frame.SkeletonData[i].eTrackingState == NUI_SKELETON_TRACKED ) {
			tracking_ids.push_back(plugin->last_skeleton_frame.SkeletonData[i].dwTrackingID);
		}
	}

	return tracking_ids;
}

FB::VariantList KinectJSAPI::get_skeleton_data(int tracking_id)
{
	KinectJSPtr plugin = getPlugin();
	FB::VariantList skeleton_data (NUI_SKELETON_POSITION_COUNT, 0);
	bool found_data;

	for ( int i = 0; i < NUI_SKELETON_COUNT; i++ ) {
		if ( plugin->last_skeleton_frame.SkeletonData[i].eTrackingState == NUI_SKELETON_TRACKED && 
			 plugin->last_skeleton_frame.SkeletonData[i].dwTrackingID ) {
			found_data = true;
			for ( int j = 0; j < NUI_SKELETON_POSITION_COUNT; j++ ) {
				FB::VariantList position (3,0);
				position[0] = plugin->last_skeleton_frame.SkeletonData[i].SkeletonPositions[j].x;
				position[1] = plugin->last_skeleton_frame.SkeletonData[i].SkeletonPositions[j].y;
				position[2] = plugin->last_skeleton_frame.SkeletonData[i].SkeletonPositions[j].z;
				skeleton_data[j] = position;
			}
		}
	}

	if ( found_data ) {
		return skeleton_data;
	} else {
		throw FB::script_error("Invalid tracking ID");
	}
}

void KinectJSAPI::new_skeleton_data_event()
{
	fire_newskeletondata();
}