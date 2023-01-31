### Scripts
- Install: ```npm install```
- Run unit tests: ```npm run test```
- Start server: ```npm run buildStart```

#### Instructions
Use http://localhost:5500/ to see the main path-pg.
Also see the list of available images. 

#### Resize images
Please use one of the name img from the list:
encenadaport
fjord
icelandwaterfall
palmtunnel
santamonica

This is an example request you can use:  http://localhost:5500/api/img-processor?name=fjord&width=200&height=200

#### More Examples
http://localhost:5500/api/img-processor?name=fjord&width=200&height=200
http://localhost:5500/api/img-processor?name=icelandwaterfall&width=200&height=400