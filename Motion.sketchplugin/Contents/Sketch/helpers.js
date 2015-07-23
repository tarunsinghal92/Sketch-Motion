// useful functions

// finding elements

var findLayerGroupsWithName = function(name, container){
    var children = container.children();
    var layers = [];
    for(var c=0; c < [children count]; c++){
        var child = children[c];
        if(child.name() == name && child.isMemberOfClass(MSLayerGroup)){
            layers.push(child);
        }
    }
    return layers;
}

var filterLayersByName = function(name, layerSet){
	var layers = [];
	for(var l=0; l < [layerSet count]; l++){
		var layer = layerSet.objectAtIndex(l);
		var children = layer.children();
	    for(var c=0; c < [children count]; c++){
	        var child = children[c];
	        if(child.name() == name){
	            layers.push(layer);
	            continue;
	        }
	    }
	}
    return layers;
}

var findTextWithName = function(name, container){
    var children = container.children();
    var layers = [];
    for(var c=0; c < [children count]; c++){
        var child = children[c];
        if(child.name() == name && child.isMemberOfClass(MSTextLayer)){
            layers.push(child);
        }
    }
    return layers;
}

var findImageWithName = function(name, container){
    var children = container.children();
    var layers = [];
    for(var c=0; c < [children count]; c++){
        var child = children[c];
        if(child.name() == name && child.isMemberOfClass(MSBitmapLayer)){
            layers.push(child);
        }
    }
    return layers;
}

var findShapeWithName = function(name, container){
    var children = container.children();
    var layers = [];
    for(var c=0; c < [children count]; c++){
        var child = children[c];
        if(child.name() == name && child.isMemberOfClass(MSShapeGroup)){
            layers.push(child);
        }
    }
    return layers;
}

var findArtboardsWithName = function(name, container, artboardArray){
    var children = container.children();
    var layers = artboardArray || [];
    for(var c=0; c < [children count]; c++){
        var child = children[c];
        if(child.name() == name && child.isMemberOfClass(MSArtboardGroup)){
            layers.push(child);
        }
    }
    return layers;
}

var getArtboardsWithNameInDocument = function(layerName){
	var layers = [];
    var pages = doc.pages();
    for(var p=0; p < [pages count]; p++){
        var page = pages.objectAtIndex(p);
       	layers = findArtboardsWithName(layerName, page, layers);
    }
    return layers;
}

var artboardWithNameExistsInDocument = function(layerName){
	var layerExists = null;
    var artboards = getArtboardsWithNameInDocument(layerName)
    if(artboards.length > 0){
        layerExists = true;
    }
    return layerExists;
}

// naming functions

var getLegendName = function(animationName){
	return stripTagSymbols(animationName) + " detected transitions";
}

var getTransitionName = function(animationName, startKeyframeIndex, endKeyframeIndex){
	return stripTagSymbols(animations[animationName].keyframes[startKeyframeIndex].layer.name()) + " > " + stripTagSymbols(animations[animationName].keyframes[endKeyframeIndex].layer.name());
}

var getCurveSelectorName = function(transitionName){
	return transitionName + " curveSelector";
}

var checkForAnimationReference = function(layerName) {
    return layerName.match(/\{(\S+)\}/g);
}

var stripTagSymbols = function(string) {
	return string.replace(/{|}/g, '');	
}

var animationTimelineName = function(animationName) {
    return stripTagSymbols(animationName) + " timeline";
}

// working with styles
// TODO: Add style get helpers

var updateFrame = function(frame, layer) {
	if(frame.width){
		layer.frame().setWidth(frame.width);
	}
	if(frame.height){
		layer.frame().setHeight(frame.height);
	}
	if(frame.x){
		layer.frame().setX(frame.x);
	}
	if(frame.y){
		layer.frame().setY(frame.y);
	}
}

var updateShapeStyle = function(style, shape) {
	if(style.color){
		var shapeFills = shape.style().fills().array();
		// shape has a fill
		if(shapeFills[0]){
			shapeFills[0].setColor(MSColor.colorWithSVGString(style.color));
		}
	}
	// TODO: Add all other style properities
	
}

var updateTextStyle = function(style, text) {
	if(text &&  text.isMemberOfClass(MSTextLayer)){
		if(style.color){
			text.textColor = MSColor.colorWithSVGString(style.color);
		}
		if(style.size){
			text.fontSize = style.size;
		}
		if(style.font){
			text.fontPostscriptName = style.font;
		}
	}
	// TODO: Add all other style properities
}

function addImage (imagePath, container, name) {
	var image = [[NSImage alloc] initWithContentsOfFile:imagePath]; 
	var layerName = name || "image";
	var imageLayer = [MSBitmapLayer new];
	container.addLayers([imageLayer]);

	imageLayer.setConstrainProportions(false);
	imageLayer.setRawImage_convertColourspace_collection(image, false, doc.documentData().images());
	imageLayer.setName(name);
	imageLayer.frame().setWidth(image.size().width);
	imageLayer.frame().setHeight(image.size().height);
	imageLayer.setConstrainProportions(true);
}

// number padding

function numberPad(number, padding) {
    var output = number + '';
    while (output.length < padding) {
        output = '0' + output;
    }
    return output;
}


// Only used for debugging. Very helpful for object introspection
// https://github.com/tylergaw/day-player/blob/master/lib/utils.js
function dump (obj) {
	log("#####################################################################################")
	log("## Dumping object " + obj )
	log("## obj class is: " + [obj className])
	log("#####################################################################################")
	log("obj.properties:")
	log([obj class].mocha().properties())
	log("obj.propertiesWithAncestors:")
	log([obj class].mocha().propertiesWithAncestors())
	log("obj.classMethods:")
	log([obj class].mocha().classMethods())
	log("obj.classMethodsWithAncestors:")
	log([obj class].mocha().classMethodsWithAncestors())
	log("obj.instanceMethods:")
	log([obj class].mocha().instanceMethods())
	log("obj.instanceMethodsWithAncestors:")
	log([obj class].mocha().instanceMethodsWithAncestors())
	log("obj.protocols:")
	log([obj class].mocha().protocols())
	log("obj.protocolsWithAncestors:")
	log([obj class].mocha().protocolsWithAncestors())
	log("obj.treeAsDictionary():")
	log(obj.treeAsDictionary())
}