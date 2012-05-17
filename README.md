

KSenseJS
========

Installation
------------

1.  Follow the instructions to install FireBreath on their
[documentation page][1].

2.  Install Visual Studio 2010.  (Visual Studio 2010 Express is free,
and available [here][2]).  Other versions of Visual Studio may work,
but I haven't tested them.

3.  Install the Kinect SDK from [here][4].

4.  Install Python2.7 from [here][5].

5.  Install Cmake from [here][6].

6.  Install Windows Driver Kit from [here][7].

3.  Clone the KSenseJS repository to a convenient location.

4.  To compile with Visual Studio 2010, run `prep2010.cmd
[path to KSenseJS]`.  `prep2010.cmd` is in the FireBreath folder.
This will create a Visual Studio project in
`[FireBreath directory]/build/projects/KSenseJS/`.  To compile with
other versions of Visual Studio follow the instructions [here][3].
Although FireBreath can be used on Linux and OSX, KSenseJS depends on
the Microsoft Kinect SDK, which is Windows only.

5.  After compiling, binaries will be located in
`[FireBreath directory]/build/bin/KSenseJS/Debug/`.  Run
`regsvr32.exe` on `npKSenseJS.dll` to register the DLL as a plugin.

6.  A test page will be generated in
`[FireBreath directory]/build/projects/KSenseJS/gen/FBControl.html`.
The plugin works in Firefox, and should work in Chrome.  IE has not
been tested, and it may or may not work.

[1]: http://www.firebreath.org/display/documentation/Download 
[2]: http://www.microsoft.com/visualstudio/en-us/products/2010-editions/visual-cpp-express
[3]: http://www.firebreath.org/display/documentation/Building+on+Windows
[4]: http://www.microsoft.com/en-us/kinectforwindows/develop/overview.aspx
[5]: http://www.python.org/download/releases/2.7.3/
[6]: http://www.cmake.org/cmake/resources/software.html
[7]: http://msdn.microsoft.com/en-US/windows/hardware/hh852361
