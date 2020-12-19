SI Final Project - 2 types of Implementation

Refer documentation for implementation and working details and this for execution on Postman and through Digital Ocean

Sample Image Url for I/P - https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/contoso-allinone.jpg

This is the only Image Url hosted available to me.

This is a "receipt" url, thus shows results for endpoints- invoice and receipts and shows invalid 
for Business Card and Table

** Please run the endpoint 2-3 times with some duration in between if it fails with typeErrors
** as there are some issues with my Digital Ocean causing it to behave uncertain
** Also if still it fails, please clone the repository and run on local. 
** Try the clone to local option for Postman checking too

Some Challenges-
- As the code is hosted on Digital Ocean, only image url can be given as a I/P to the endpoints as-
  If the local storage image is given as a I/P it should be from local storage of the droplet.
  I tried this by putting some sample images in the droplet, but didn't work. Thus Image url(hosted image) 
  is the only option

- But I also implemented code to read Images from local storage. For this you will have to clone my repo 
  into your local machine. And execute node formReader.js, make host in Swagger options to localhost and comment
  the other

- Through the latter implementation I handled a lot of edgecases as API was accepting a variety of I/ps- jpeg, jpg, pdf,
  png.

- Please have a look at both the codes

- formReaderURL.js (URL only I/P) can be run through Postman and online but for formReader.js(diff I/ps) please clone
  the git repository. You may use the sample Images given in the folder for this



