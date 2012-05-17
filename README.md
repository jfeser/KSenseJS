

KinectJS
========

Installation
------------

1.  Follow the instructions to install FireBreath on their
[documentation page][1].

2.  Install Visual Studio 2010.  (Visual Studio 2010 Express is free,
and available [here][2].

3.  Clone the KinectJS repository to a convenient location.

4.  To compile with Visual Studio 2010, run `prep2010.cmd
[path to KinectJS]`.  `prep2010.cmd` is in the FireBreath folder.
This will create a Visual Studio project in
`[FireBreath directory]/build/projects/KinectJS/`.  To compile with
other versions of Visual Studio (not tested) follow the instructions
[here][3].

5.  After compiling, binaries will be located in
`[FireBreath directory]/build/bin/KinectJS/Debug/`.  Run
`regsvr32.exe` on `npKinectJS.dll` to register the DLL as a plugin.

6.  A test page will be generated in
`[FireBreath directory]/build/projects/KinectJS/gen/FBControl.html`.

[1]: http://www.firebreath.org/display/documentation/Download 
[2]: http://www.microsoft.com/visualstudio/en-us/products/2010-editions/visual-cpp-express
[3]: http://www.firebreath.org/display/documentation/Building+on+Windows
