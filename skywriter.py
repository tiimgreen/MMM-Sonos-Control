import skywriter
import signal
import autopy
import json

some_value = 0

def to_node(type, message):
    try:
        print(json.dumps({ type: message }))
    except:
        pass

    sys.stdout.flush()

to_node("info", "ready")

@skywriter.flick()
def flick(start, finish):
    if start == "east" and finish == "west":
        to_node("gesture", "left")
    if start == "west" and finish == "east":
        to_node("gesture", "right")
    if start == "north" and finish == "south":
        to_node("gesture", "down")
    if start == "south" and finish == "north":
        to_node("gesture", "up")

@skywriter.airwheel()
def spinny(delta):
    global some_value
    some_value += delta

    if delta > 0:
        to_node("rotate", "clockwise")
    else if delta < 0:
        to_node("rotate", "anticlockwise")

@skywriter.tap()
def tap(position):
  to_node("tap", position)
