/**********************************************************\

  Auto-generated KSenseJSAPI.cpp

\**********************************************************/

#include "JSObject.h"
#include "variant_list.h"
#include "DOM/Document.h"
#include "global/config.h"
#include <cmath>

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
	SkeletonDataPtr skeleton_data = plugin->getCurrentSkeletonDataPtr();

	if ( !skeleton_data ) {
		return 0;
	}

	for ( int i = 0; i < NUI_SKELETON_COUNT; i++ ) {
		if ( skeleton_data->SkeletonData[i].eTrackingState == NUI_SKELETON_TRACKED ) {
			tracked_skeleton_count++;
		}
	}

	return tracked_skeleton_count;
}

/*	Get a list of tracking IDs for the currently tracked skeletons. */
FB::VariantList KSenseJSAPI::get_valid_tracking_ids()
{
	KSenseJSPtr plugin = getPlugin();
	SkeletonDataPtr skeleton_data = plugin->getCurrentSkeletonDataPtr();
	FB::VariantList tracking_ids;

	if ( !skeleton_data ) {
		return tracking_ids;
	}

	for ( int i = 0; i < NUI_SKELETON_COUNT; i++ ) {
		if ( skeleton_data->SkeletonData[i].eTrackingState == NUI_SKELETON_TRACKED ) {
			tracking_ids.push_back(skeleton_data->SkeletonData[i].dwTrackingID);
		}
	}

	return tracking_ids;
}

/*	Get the skeleton data that corresponds to the given tracking ID.  If the tracking
	ID is invalid, throw an error. */
NUI_SKELETON_DATA const* KSenseJSAPI::getDataByTrackingID(const int tracking_id)
{
	KSenseJSPtr plugin = getPlugin();
	SkeletonDataPtr skeleton_data = plugin->getCurrentSkeletonDataPtr();
	FB::VariantList skeleton_data_output (NUI_SKELETON_POSITION_COUNT, 0);
	bool found_data = false;

	if ( !skeleton_data ) {
		throw FB::script_error("No skeleton data.");
	}

	for ( int i = 0; i < NUI_SKELETON_COUNT; i++ ) {
		if ( skeleton_data->SkeletonData[i].eTrackingState == NUI_SKELETON_TRACKED && 
			 skeleton_data->SkeletonData[i].dwTrackingID == tracking_id ) {
			return &skeleton_data->SkeletonData[i];
		}
	}

	throw FB::script_error("Invalid tracking ID");
}

/*	Get the skeleton data that corresponds to the given tracking ID.  If the tracking
	ID is invalid, throw an error.  This version checks the given frame for data. */
NUI_SKELETON_DATA const* KSenseJSAPI::getDataByTrackingID(const int tracking_id, SkeletonDataPtr data)
{
	SkeletonDataPtr skeleton_data = data;
	FB::VariantList skeleton_data_output (NUI_SKELETON_POSITION_COUNT, 0);
	bool found_data = false;

	if ( !skeleton_data ) {
		throw FB::script_error("No skeleton data.");
	}

	for ( int i = 0; i < NUI_SKELETON_COUNT; i++ ) {
		if ( skeleton_data->SkeletonData[i].eTrackingState == NUI_SKELETON_TRACKED && 
			 skeleton_data->SkeletonData[i].dwTrackingID == tracking_id ) {
			return &skeleton_data->SkeletonData[i];
		}
	}

	throw FB::script_error("Invalid tracking ID");
}

/*	Format the raw skeleton data and output using the JSAPI. */
FB::VariantList KSenseJSAPI::get_skeleton_data(const int tracking_id)
{
	FB::VariantList skeleton_data_output (NUI_SKELETON_POSITION_COUNT, 0);
	
	NUI_SKELETON_DATA const* skeleton_data = getDataByTrackingID(tracking_id);

	for ( int j = 0; j < NUI_SKELETON_POSITION_COUNT; j++ ) {
		FB::VariantList position (3,0);
		position[0] = skeleton_data->SkeletonPositions[j].x;
		position[1] = skeleton_data->SkeletonPositions[j].y;
		position[2] = skeleton_data->SkeletonPositions[j].z;
		skeleton_data_output[j] = position;
	}

	return skeleton_data_output;
}

//FB::VariantList KSenseJSAPI::getBoneLengths(const int tracking_id)
//{
//	FB::VariantList bone_lengths_output (NUI_SKELETON_POSITION_COUNT, 0);
//	NUI_SKELETON_DATA const* skeleton_data = getDataByTrackingID(tracking_id);
//
//	for ( int i = 0; i < NUI_SKELETON_POSITION_COUNT; i++ ) {
//
//}

inline float square(float x)
{
	return x*x;
}

/*	Calculate the velocity since the last frame of skeleton data and send to the
	javascript. */
FB::VariantList KSenseJSAPI::getJointVelocity(const int tracking_id)
{
	FB::VariantList joint_velocity (NUI_SKELETON_POSITION_COUNT, 0);
	KSenseJSPtr plugin = getPlugin();
	SkeletonDataPtr current_ptr = plugin->getCurrentSkeletonDataPtr();
	SkeletonDataPtr previous_ptr = plugin->getPreviousSkeletonDataPtr();

	NUI_SKELETON_DATA const* current = getDataByTrackingID(tracking_id, current_ptr);
	NUI_SKELETON_DATA const* previous = getDataByTrackingID(tracking_id, previous_ptr);
	float v_x, v_y, v_z;

	for ( int j = 0; j < NUI_SKELETON_POSITION_COUNT; j++ ) {
		FB::VariantList velocity (4,0.0f);
		if (current && previous) {
			velocity[1] = v_x = current->SkeletonPositions[j].x - previous->SkeletonPositions[j].x;
			velocity[2] = v_y = current->SkeletonPositions[j].y - previous->SkeletonPositions[j].y;
			velocity[3] = v_z = current->SkeletonPositions[j].z - previous->SkeletonPositions[j].z;
			velocity[0] = sqrt(square(v_x)+square(v_y)+square(v_z));
		}
		joint_velocity[j] = velocity;
	}

	return joint_velocity;
}

void KSenseJSAPI::new_skeleton_data_event()
{
	fire_newskeletondata();
}