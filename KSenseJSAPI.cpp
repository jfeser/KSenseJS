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

  Auto-generated KSenseJSAPI.cpp

\**********************************************************/

#include "JSObject.h"
#include "variant_list.h"
#include "DOM/Document.h"
#include "global/config.h"
#include <cmath>
#include <sstream>

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

inline float square(float x)
{
	return x*x;
}

inline std::string intToStr(int x)
{
	std::stringstream stream;
	stream << x;
	return stream.str();
}

const std::string joint_names[] = {"hip_center", "spine", "shoulder_center", "head",
								"shoulder_left", "elbow_left", "wrist_left", "hand_left",
								"shoulder_right", "elbow_right", "wrist_right", "hand_right",
								"hip_left", "knee_left", "ankle_left", "foot_left",
								"hip_right", "knee_right", "ankle_right", "foot_right" };

/*	Format the raw skeleton data and output using the JSAPI. */
FB::VariantMap KSenseJSAPI::getSkeletonData()
{
	KSenseJSPtr plugin = getPlugin();
	SkeletonDataPtr skeleton_data = plugin->getCurrentSkeletonDataPtr();
	FB::VariantMap skeleton_data_output;

	if(!skeleton_data) {
		return skeleton_data_output;
	}

	for ( int i = 0; i < NUI_SKELETON_COUNT; i++ ) {
		if ( skeleton_data->SkeletonData[i].eTrackingState == NUI_SKELETON_TRACKED ) {
			FB::VariantMap joint_positions;
			for ( int j = 0; j < NUI_SKELETON_POSITION_COUNT; j++ ) {
				FB::VariantMap position;
				position["x"] = skeleton_data->SkeletonData[i].SkeletonPositions[j].x;
				position["y"] = skeleton_data->SkeletonData[i].SkeletonPositions[j].y;
				position["z"] = skeleton_data->SkeletonData[i].SkeletonPositions[j].z;
				joint_positions[joint_names[j]] = position;
			}
			skeleton_data_output[intToStr(skeleton_data->SkeletonData[i].dwTrackingID)] = joint_positions;
		}
	}

	return skeleton_data_output;
}

/*	Calculate the velocity since the last frame of skeleton data and send to the
	javascript. */
FB::VariantMap KSenseJSAPI::getVelocityData()
{
	KSenseJSPtr plugin = getPlugin();
	SkeletonDataPtr current = plugin->getCurrentSkeletonDataPtr();
	SkeletonDataPtr previous = plugin->getPreviousSkeletonDataPtr();
	FB::VariantMap velocity_data_output;

	float v_x, v_y, v_z;

	if( !current || !previous ) {
		return velocity_data_output;
	}

	for ( int i = 0; i < NUI_SKELETON_COUNT; i++ ) {
		if ( current->SkeletonData[i].eTrackingState == NUI_SKELETON_TRACKED &&
			previous->SkeletonData[i].eTrackingState == NUI_SKELETON_TRACKED ) {
			FB::VariantMap joint_velocities;
			for ( int j = 0; j < NUI_SKELETON_POSITION_COUNT; j++ ) {
				FB::VariantMap velocity;
				velocity["x"] = v_x = current->SkeletonData[i].SkeletonPositions[j].x - previous->SkeletonData[i].SkeletonPositions[j].x;
				velocity["y"] = v_y = current->SkeletonData[i].SkeletonPositions[j].y - previous->SkeletonData[i].SkeletonPositions[j].y;
				velocity["z"] = v_z = current->SkeletonData[i].SkeletonPositions[j].z - previous->SkeletonData[i].SkeletonPositions[j].z;
				velocity["mag"] = sqrt(square(v_x)+square(v_y)+square(v_z));
				joint_velocities[joint_names[j]] = velocity;
			}
			velocity_data_output[intToStr(current->SkeletonData[i].dwTrackingID)] = joint_velocities;
		}
	}

	return velocity_data_output;
}

__int64 KSenseJSAPI::getDeltaTime()
{
	KSenseJSPtr plugin = getPlugin();
	return plugin->getDeltaTime();
}

void KSenseJSAPI::new_skeleton_data_event()
{
	fire_newskeletondata();
}
