**ZipFile** is a javascript library to get extract informations from zip files.

A ZipFile object can be constructed with a _String_ object representing the zip file content.
This object will then have following properties:

 - __filelist__: an _Array_ of ZipInfo: one for each file in archive
 - __NameToInfo__: a hashset of ZipInfo, accessible with file names
 - __data__: a copy of the string content
 - __comment__: optional archive comment

Each ZipInfo will contain many metadatas about the file, such as ''filename'', ''date_time'', ''comment'', etc
Content of a ZipInfo can be retrieved by calling ZipFile.extract(ZipInfo.filename)

You can find example of use in demo.js file

ZipFile needs [deflate library] [1] to work. It's included in the archive.
Jquery.js and collapser.js libraries are also included in the archive. They are
not needed for ZipFile but are used for the demo.

[1]: http://www.codeproject.com/KB/scripting/Javascript_binaryenc.aspx
