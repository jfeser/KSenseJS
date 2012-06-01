delete ksensejs.handle_new_data;
	ksensejs.skeleton_position_history = [];
	ksensejs.skeleton_velocity_history = [];
	ksensejs.timeframes=30;
ksensejs.gesture = {
	swipe : function(PlayerID, joint,gestureLength,gestureSpeed) //checks to see if player is swiping (sustained velocity in x or y axis for 3 frames)
											//two optional functions, length and speed (default length is 2, default speed is .075)
	{
		if(!gestureLength)
			var gestureLength = 2
		if(!gestureSpeed)
			var gestureSpeed = .075;
		var countx=0;
		var county=0;
		//document.getElementById("xval").innerHTML = "<font size='7'>"+player+"</font>";
		var data = get_past_data(PlayerID,joint,gestureLength,ksensejs.skeleton_velocity_history);
		if(data.length !== gestureLength)
			return "none";
		for(i=0;i<gestureLength;i++)
		{
			if(data[i][1]>gestureSpeed)
				countx++;
			if(data[i][1]<-gestureSpeed)
				countx--;
			if(data[i][2]>gestureSpeed)
				county++;
			if(data[i][2]<-gestureSpeed)
				county--;
		}
		if(countx ===gestureLength && county === 0)
			return "right";
		if(countx ===-gestureLength && county === 0)
			return "left";
		if(county ===gestureLength && countx === 0)
			return "up";
		if(county ===-gestureLength && countx === 0)
			return "down";
		return "none";
	},
	click : function(playerID,jointName,gestureLength,movementDistance,positionTolerance) //checks for a click gesture from the player
							 //the gesture is pushing your hand forward, then back
	{
		if(!gestureLength)
			var gestureLength = 2; //length will be multiplied by 2 to get full gesture, this would jsut be for the outer push
		if(!movementDistance)
			var movementDistance = .04;
		if(!positionTolerance)
			var positionTolerance = .1;
		var data = get_past_data(playerID,jointName,gestureLength*2,ksensejs.skeleton_position_history);
		if(data.length !== gestureLength*2)
			return false;
		var xdist = Math.abs(data[gestureLength*2-1][0]-data[0][0]);
		var ydist = Math.abs(data[gestureLength*2-1][1]-data[0][1]);
		var zdist = Math.abs(data[gestureLength*2-1][2]-data[0][2]);
		var check_click = data[gestureLength][2]-data[2*gestureLength-1][2];
		if (check_click<-movementDistance && xdist<positionTolerance && ydist<positionTolerance && zdist<positionTolerance)
		{
			return true;
		}
		return false;
	},
};
function get_past_data(id,joint,timeframes,array)  //returns an array of all joint data (either position or velocity) from an id
										   //returns a number of timeframes, starting at the present and going back
{
	var repeat = Math.min(timeframes,array.length)
	var ret_arr = [];
	for(i=0;i<repeat;i++)
	{
	
		if(typeof(array[i][id]) === "object")
			ret_arr.push(array[i][id][joint]);
	}
	return ret_arr;
}