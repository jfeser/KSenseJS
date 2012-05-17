/**********************************************************\

  Auto-generated KSenseJSAPI.cpp

\**********************************************************/

#include "JSObject.h"
#include "variant_list.h"
#include "DOM/Document.h"
#include "global/config.h"

#include "KSenseJSAPI.h"

///////////////////////////////////////////////////////////////////////////////
/// @fn KSenseJSPtr KSenseJSAPI::getPlugin()
///
/// @brief  Gets a reference to the plugin that was passed in when the object
///         was created.  If the plugin has already been released then this
///         will throw a FB::script_error that will be translated into a
///         javascript exception in the page.
///////////////////////////////////////////////////////////////////////////////
KSenseJSPtr KSenseJSAPI::getPlugin()
{
    KSenseJSPtr plugin(m_plugin.lock());
    if (!plugin) {
        throw FB::script_error("The plugin is invalid");
    }
    return plugin;
}


/*	Get the number of skeletons tracked by the Kinect. */
int KSenseJSAPI::get_tracked_skeletons_count()
{
	int tracked_skeleton_count = 0;
	KSenseJSPtr plugin = getPlugin();

	for ( int i = 0; i < NUI_SKELETON_COUNT; i++ ) {
		if ( plugin->last_skeleton_frame.SkeletonData[i].eTrackingState == NUI_SKELETON_TRACKED ) {
			tracked_skeleton_count++;
		}
	}

	return tracked_skeleton_count;
}

/*	Get a list of tracking IDs for the currently tracked skeletons. */
FB::VariantList KSenseJSAPI::get_valid_tracking_ids()
{
	KSenseJSPtr plugin = getPlugin();
	FB::VariantList tracking_ids;

	for ( int i = 0; i < NUI_SKELETON_COUNT; i++ ) {
		if ( plugin->last_skeleton_frame.SkeletonData[i].eTrackingState == NUI_SKELETON_TRACKED ) {
			tracking_ids.push_back(plugin->last_skeleton_frame.SkeletonData[i].dwTrackingID);
		}
	}

	return tracking_ids;
}

/*	Get the skeleton data that corresponds to the given tracking ID.  If the tracking
	ID is invalid, throw an error. */
FB::VariantList KSenseJSAPI::get_skeleton_data(int tracking_id)
{
	KSenseJSPtr plugin = getPlugin();
	FB::VariantList skeleton_data (NUI_SKELETON_POSITION_COUNT, 0);
	bool found_data = false;

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

void KSenseJSAPI::new_skeleton_data_event()
{
	fire_newskeletondata();
}