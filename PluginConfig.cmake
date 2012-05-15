#/**********************************************************\ 
#
# Auto-Generated Plugin Configuration file
# for Kinect JS
#
#\**********************************************************/

set(PLUGIN_NAME "KinectJS")
set(PLUGIN_PREFIX "KJS")
set(COMPANY_NAME "UIUC")

# ActiveX constants:
set(FBTYPELIB_NAME KinectJSLib)
set(FBTYPELIB_DESC "KinectJS 1.0 Type Library")
set(IFBControl_DESC "KinectJS Control Interface")
set(FBControl_DESC "KinectJS Control Class")
set(IFBComJavascriptObject_DESC "KinectJS IComJavascriptObject Interface")
set(FBComJavascriptObject_DESC "KinectJS ComJavascriptObject Class")
set(IFBComEventSource_DESC "KinectJS IFBComEventSource Interface")
set(AXVERSION_NUM "1")

# NOTE: THESE GUIDS *MUST* BE UNIQUE TO YOUR PLUGIN/ACTIVEX CONTROL!  YES, ALL OF THEM!
set(FBTYPELIB_GUID 47f44b67-b863-5079-981d-dd248e513795)
set(IFBControl_GUID d5561d14-c1b4-532b-bf7c-4743507eb0cc)
set(FBControl_GUID 08348fcc-f531-58a5-b3b8-58768a3af389)
set(IFBComJavascriptObject_GUID efbb62ff-ce03-5763-80f5-6551842775b8)
set(FBComJavascriptObject_GUID 5a3fc00d-369b-56b7-80d1-b46dff083ba9)
set(IFBComEventSource_GUID 1fe257a2-a740-5348-b4ee-3d6932060b10)

# these are the pieces that are relevant to using it from Javascript
set(ACTIVEX_PROGID "UIUC.KinectJS")
set(MOZILLA_PLUGINID "uiuc.com/KinectJS")

# strings
set(FBSTRING_CompanyName "UIUC")
set(FBSTRING_PluginDescription "Kinect JavaScript interface")
set(FBSTRING_PLUGIN_VERSION "1.0.0.0")
set(FBSTRING_LegalCopyright "Copyright 2012 UIUC")
set(FBSTRING_PluginFileName "np${PLUGIN_NAME}.dll")
set(FBSTRING_ProductName "Kinect JS")
set(FBSTRING_FileExtents "")
set(FBSTRING_PluginName "Kinect JS")
set(FBSTRING_MIMEType "application/x-kinectjs")

# Uncomment this next line if you're not planning on your plugin doing
# any drawing:

set (FB_GUI_DISABLED 1)

# Mac plugin settings. If your plugin does not draw, set these all to 0
set(FBMAC_USE_QUICKDRAW 0)
set(FBMAC_USE_CARBON 0)
set(FBMAC_USE_COCOA 0)
set(FBMAC_USE_COREGRAPHICS 0)
set(FBMAC_USE_COREANIMATION 0)
set(FBMAC_USE_INVALIDATINGCOREANIMATION 0)

# If you want to register per-machine on Windows, uncomment this line
#set (FB_ATLREG_MACHINEWIDE 1)

# Enable logging to JS console
add_firebreath_library(log4cplus)