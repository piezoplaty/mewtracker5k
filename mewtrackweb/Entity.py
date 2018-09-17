import uuid
from datetime import datetime

class EntityIsNotAContainer(Exception):
    pass

class Entity:
    def __init__(self, name, isContainer=False):
        self.Name = name
        self.Tags = []
        self.Id = uuid.uuid4()
        self.IsContainer = isContainer

    def addTag(self, tag):
        self.Tags.append(tag)

class LocationCheckin:
    def __init__(self, location, checkinTime):
        self.Location = location
        self.CheckinTime = checkinTime

class Tag:
    def __init__(self, id):
        self.Id = id

class EntityTracker:
    def __init__(self):
        self.Entities = []
        self.Locations = {}

    def addEntity(self, entity):
        self.Entities.append(entity)

    def getEntityByTag(self, tagId):
        for entity in self.Entities:
            for tag in entity.Tags:
                if tag.Id == tagId:
                    return entity
        return None

    def getEntityByUUID(self, tagUUID):
        for entity in self.Entities:
            if entity.Id == tagUUID:
                return entity
        return None

    def setLocation(self, entity, locationEntity):
        if not locationEntity.IsContainer:
            raise EntityIsNotAContainer("The entity '" + locationEntity.Name + "' is not a container.")
        self.Locations[entity.Id] = LocationCheckin(locationEntity, datetime.now())

    def whereIs(self, entity):
        if entity.Id in self.Locations.keys():
            return self.Locations[entity.Id]
        else:
            return None

    def getEntitiesAtLocation(self, location):
        entities = []
        for locationEntry in self.Locations.items():
            if locationEntry[1].Location == location:
                entities.append(self.getEntityByUUID(locationEntry[0]))
        return entities