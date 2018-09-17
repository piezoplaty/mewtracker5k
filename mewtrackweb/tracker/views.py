# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.template import loader

import json, urllib

import uuid

from Entity import Entity, Tag, EntityTracker, EntityIsNotAContainer
# Create your views here.

mewTracker = EntityTracker()
sprocket = Entity("Sprocket")
maori = Entity("Maori")
mewTracker.addEntity(sprocket)
mewTracker.addEntity(maori)

def jsonSerializeEntity(entity):
    location = ""
    time = ""
    if mewTracker.whereIs(entity) != None:
        location = mewTracker.whereIs(entity).Location.Name
        time = mewTracker.whereIs(entity).CheckinTime


    jsonEntity = {
        "name":entity.Name,
        "uuid":entity.Id,
        "tagCount":len(entity.Tags),
        "isContainer": bool(entity.IsContainer),
        "location": location,
        "lastCheckin": time
    }
    return jsonEntity


def index(request):
    template = loader.get_template('tracker/index.html')
    return HttpResponse(template.render())

def checkin(request):
    template = loader.get_template('tracker/checkin.html')
    return HttpResponse(template.render())

def view_controllers(request):
    template = loader.get_template('tracker/view-controllers.js')
    return HttpResponse(template.render())

def view_jquery(request):
    template = loader.get_template('tracker/jquery.min.js')
    return HttpResponse(template.render())


def listEntities(request):
    entityJson = []
    for entity in mewTracker.Entities:
        entityJson.append(jsonSerializeEntity(entity))
    return JsonResponse(entityJson, safe=False)

def createEntity(request):
    newEntity = Entity(request.GET.get("name"))
    mewTracker.addEntity(newEntity)
    return JsonResponse({"Status":"Ok","message":"Entity '" + newEntity.Name + "' created with Id:" + str(newEntity.Id)})

def addTagToEntity(request):
    newTag = Tag(request.GET.get("tagValue"))
    newUUID = uuid.UUID(request.GET.get("entityUUID"))
    taggedEntity = mewTracker.getEntityByUUID(newUUID)
    taggedEntity.addTag(newTag)
    return JsonResponse({"Status":"Ok","message":"Added tag '" + newTag.Id + "' to Entity Id" + str(taggedEntity.Id)})

def setContainerEntity(request):
    isContainerValue = False
    if str(request.GET.get("isContainerValue")) == "true":
        isContainerValue = True
    
    newUUID = uuid.UUID(request.GET.get("entityUUID"))
    taggedEntity = mewTracker.getEntityByUUID(newUUID)
    taggedEntity.IsContainer = isContainerValue
    return JsonResponse({"Status":"Ok","message":"Set isContainer value to '" + str(taggedEntity.IsContainer) + "' to Entity Id" + str(taggedEntity.Id)})

def setEntityLocation(request):
    #locationTag, locationUUID, entityTag, entityUUID
    #We take different params, but need to find one entity
    #if request.GET.get("locationTag") is 
    storeEntity = None
    locationEntity = None
    locationTag = request.GET.get("locationTag")
    locationUUID = request.GET.get("locationUUID")
    entityTag = request.GET.get("entityTag")
    entityUUID = request.GET.get("entityUUID")

    if locationTag is not None:
        locationEntity = mewTracker.getEntityByTag(locationTag)
    else:
        locationEntity = mewTracker.getEntityByUUID(uuid.UUID(locationUUID))

    if entityTag is not None:
        storeEntity = mewTracker.getEntityByTag(entityTag)
    else:
        storeEntity = mewTracker.getEntityByUUID(uuid.UUID(entityUUID))

    try:
        mewTracker.setLocation(storeEntity, locationEntity)

    except EntityIsNotAContainer:
        return JsonResponse({"Status":"Error - Entity is not a container"})

    return JsonResponse({"Status":"Ok"})

def getEntityByTag(request):
    entity = mewTracker.getEntityByTag(request.GET.get("tagValue"))
    return JsonResponse(jsonSerializeEntity(entity))

