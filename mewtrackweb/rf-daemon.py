import mercury
import requests
import time

RF_LOCATION_TAG = 'E2004005730701901900507E'

def trimEpcString(epc):
    return epc[2:25]

def submitLocationInfo(tags):
    for tag in tags:
        requests.get("http://127.0.0.1:8001/set_entity_location?locationTag=" + RF_LOCATION_TAG + "&entityTag=" + trimEpcString(tag))

reader = mercury.Reader("tmr:///dev/ttyUSB0", baudrate=115200)
reader.set_read_plan([1], "GEN2",2700)

reader.set_region("NA2")
#reader.start_reading(lambda tag: submitLocationInfo(tag.epc))

while(true):
    submitLocationInfo(reader.read())
    time.sleep(250)


#reader.stop_reading()

#Tags
# b'E20040057307018519005077'
# b'E2004005730701901900507E'
# b'E20040057307019419005080'
# b'E2004005730701981900508E'
# b'E20040057307020219005090'
# b'E200400573070224192050BB'
# b'E200400573070228192050C9'
# b'E200400573070232192050CB'
# b'E200400573070236192050D9'
# b'E200400573070240192050DB'