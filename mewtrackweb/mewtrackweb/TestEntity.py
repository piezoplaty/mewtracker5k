import unittest
from Entity import Entity, EntityTracker, Tag

class TestEntity(unittest.TestCase):
    def test_setName(self):
        testEntity = Entity("Sprocket")
        self.assertEqual("Sprocket", testEntity.Name)

    def test_addTagToEntity(self):
        testEntity = Entity("Sprocket")
        testTag = Tag("12345")
        testEntity.addTag(testTag)
        self.assertEqual(1, len(testEntity.Tags))


class TestEntityTracker(unittest.TestCase):
    def test_initEntityTracker(self):
        entityTracker = EntityTracker()
        self.assertEqual(0, len(entityTracker.Entities))

    def test_addEntities(self):
        entityTracker = EntityTracker()
        sprocket = Entity("Sprocket")
        maori = Entity("Maori")
        entityTracker.addEntity(sprocket)
        entityTracker.addEntity(maori)
        self.assertEqual(2, len(entityTracker.Entities))

    def test_getEntityByTag(self):
        entityTracker = EntityTracker()
        sprocket = Entity("Sprocket")
        sprocket.addTag(Tag("12345"))
        maori = Entity("Maori")
        maori.addTag(Tag("09876"))
        entityTracker.addEntity(sprocket)
        entityTracker.addEntity(maori)
        self.assertEqual(2, len(entityTracker.Entities))
        self.assertEqual(sprocket, entityTracker.getEntityByTag("12345"))
        self.assertEqual(maori, entityTracker.getEntityByTag("09876"))

    def test_setEntityLocation(self):
        entityTracker = EntityTracker()
        sprocket = Entity("Sprocket")
        sprocket.addTag(Tag("12345"))
        maori = Entity("Maori")
        maori.addTag(Tag("09876"))
        largeBin = Entity("LargeBin")
        largeBin.addTag("abcde")
        smallBin = Entity("SmallBin")
        smallBin.addTag("xyz")
        wipShelf = Entity("WIPShelf")
        wipShelf.addTag("000111")
        kentInventory = Entity("KentInventory")
        kentInventory.addTag("000222")
        entityTracker.addEntity(sprocket)
        entityTracker.addEntity(maori)
        entityTracker.addEntity(largeBin)
        entityTracker.addEntity(smallBin)
        entityTracker.addEntity(wipShelf)
        entityTracker.addEntity(kentInventory)
        entityTracker.setLocation(sprocket, largeBin)
        entityTracker.setLocation(maori, smallBin)
        entityTracker.setLocation(smallBin, wipShelf)
        entityTracker.setLocation(largeBin, kentInventory)
        self.assertEqual(entityTracker.whereIs(sprocket), largeBin)
        self.assertEqual(entityTracker.whereIs(maori), smallBin)
        self.assertEqual(entityTracker.whereIs(largeBin), kentInventory)

    def test_whereIsWhenNoLocationIsSet(self):
        entityTracker = EntityTracker()
        sprocket = Entity("Sprocket")
        sprocket.addTag(Tag("12345"))
        entityTracker.addEntity(sprocket)
        self.assertEqual(None, entityTracker.whereIs(sprocket))


    def test_getInventory(self):
        entityTracker = EntityTracker()
        sprocket = Entity("Sprocket")
        maori = Entity("Maori")
        slater = Entity("Slater")
        jungleKitty = Entity("JungleKitty")
        kentInventory = Entity("KentInventory")
        entityTracker.setLocation(sprocket, kentInventory)
        entityTracker.setLocation(maori, kentInventory)
        entityTracker.setLocation(slater, kentInventory)
        entityTracker.setLocation(jungleKitty, kentInventory)
        entitiesAtKent = entityTracker.getEntitiesAtLocation(kentInventory)
        self.assertEqual(4, len(entitiesAtKent))






if __name__ == '__main__':
    unittest.main()